import React from "react";
import { observer } from "mobx-react-lite";
import { Button, Dialog, Classes } from "@blueprintjs/core";

import { t } from "polotno/utils/l10n";
import { getKey } from "polotno/utils/validate-key";
import { useProject } from "./project";

let removeBackgroundFunc = async (url) => {
	const req = await fetch(
		"https://api.polotno.com/api/remove-image-background-hotpot?KEY=" +
			getKey(),
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ url }),
		}
	);
	if (req.status !== 200) {
		alert(t("error.removeBackground"));
		return url;
	}
	const res = await req.json();
	return res.url;
};

export const RemoveBackgroundDialog = observer(
	({ isOpen, onClose, element }) => {
		const project = useProject();
		const [src, setSrc] = React.useState(element.src);

		React.useEffect(() => {
			setSrc(element.src);
		}, [element.src]);

		const [removing, setRemoving] = React.useState(false);

		const [progress, setProgress] = React.useState(0);

		React.useEffect(() => {
			if (!isOpen || !removing) {
				setProgress(0);
				return;
			}
			const averageTime = 30000;
			const steps = 95;
			const stepTime = averageTime / steps;
			const interval = setInterval(() => {
				setProgress((progress) => progress + 1);
			}, stepTime);
			return () => clearInterval(interval);
		}, [isOpen, removing]);

		const handleRemove = async () => {
			setRemoving(true);
			window.__failedImage = element.src;
			try {
				setSrc(await removeBackgroundFunc(element.src));
				window.__failedImage = null;
			} catch (e) {
				if (window.Sentry) {
					window.Sentry.captureException(
						new Error("Background remove error")
					);
					setTimeout(() => {
						window.__failedImage = null;
					}, 1000);
				}
				console.error(e);
			}

			setRemoving(false);
		};

		const finished = src !== element.src;

		const moreButton = (
			<a
				onClick={() => {
					project.puterModalVisible = true;
				}}
				href="#">
				Need more?
			</a>
		);

		return (
			<Dialog
				onClose={onClose}
				title="Remove background from image"
				isOpen={isOpen}
				style={{
					width: "80%",
					maxWidth: "700px",
				}}>
				<div className={Classes.DIALOG_BODY}>
					<img
						src={src}
						style={{
							width: "100%",
							maxHeight: "400px",
							objectFit: "contain",
						}}
					/>
				</div>
				<div
					className={Classes.DIALOG_FOOTER}
					style={{ position: "relative" }}>
					<div className={Classes.DIALOG_FOOTER_ACTIONS}>
						{!finished && (
							<Button onClick={handleRemove} loading={removing}>
								{t("toolbar.removeBackground")}
							</Button>
						)}
						{finished && (
							<>
								<Button
									onClick={() => {
										setSrc(element.src);
										onClose();
									}}
									loading={removing}>
									{t("toolbar.cancelRemoveBackground")}
								</Button>
								<Button
									onClick={() => {
										element.set({ src });
										onClose();
									}}
									loading={removing}
									intent="primary">
									{t("toolbar.confirmRemoveBackground")}
								</Button>
							</>
						)}
					</div>
				</div>
			</Dialog>
		);
	}
);

export const ImageRemoveBackground = ({ element }) => {
	const [removeDialogOpen, toggleDialog] = React.useState(false);
	return (
		<>
			<Button
				text={t("toolbar.removeBackground")}
				minimal
				onClick={(e) => {
					toggleDialog(true);
				}}
			/>
			<RemoveBackgroundDialog
				isOpen={removeDialogOpen}
				onClose={() => {
					toggleDialog(false);
				}}
				element={element}
			/>
		</>
	);
};
