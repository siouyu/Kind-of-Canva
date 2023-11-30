import React from "react";
import { observer } from "mobx-react-lite";
import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from "polotno";
import { Toolbar } from "polotno/toolbar/toolbar";
import { ZoomButtons } from "polotno/toolbar/zoom-buttons";
import { SidePanel, DEFAULT_SECTIONS } from "polotno/side-panel";
import { Workspace } from "polotno/canvas/workspace";
import { Tooltip } from "polotno/canvas/tooltip";

import { loadFile } from "./file";

import { IconsSection } from "./sections/icons-section";
import { ShapesSection } from "./sections/shapes-section";
import { useProject } from "./project";

import { ImageRemoveBackground } from "./background-remover";

import Topbar from "./topbar/topbar";

DEFAULT_SECTIONS.splice(3, 1, ShapesSection);
DEFAULT_SECTIONS.splice(3, 0, IconsSection);

const useHeight = () => {
	const [height, setHeight] = React.useState(window.innerHeight);
	React.useEffect(() => {
		window.addEventListener("resize", () => {
			setHeight(window.innerHeight);
		});
	}, []);
	return height;
};

const App = observer(({ store }) => {
	const project = useProject();
	const height = useHeight();

	const load = () => {
		let url = new URL(window.location.href);
		const reg = new RegExp("design/([a-zA-Z0-9_-]+)").exec(url.pathname);
		const designId = (reg && reg[1]) || "local";
		project.loadById(designId);
	};

	const handleDrop = (ev) => {
		ev.preventDefault();
		if (ev.dataTransfer.files.length !== ev.dataTransfer.items.length) {
			return;
		}
		for (let i = 0; i < ev.dataTransfer.files.length; i++) {
			loadFile(ev.dataTransfer.files[i], store);
		}
	};

	return (
		<div
			style={{
				width: "100vw",
				height: height + "px",
				display: "flex",
				flexDirection: "column",
			}}
			onDrop={handleDrop}>
			<Topbar store={store} />
			<div style={{ height: "calc(100% - 50px)" }}>
				<PolotnoContainer className="polotno-app-container">
					<SidePanelWrap>
						<SidePanel store={store} sections={DEFAULT_SECTIONS} />
					</SidePanelWrap>
					<WorkspaceWrap>
						<Toolbar
							store={store}
							components={{
								ImageRemoveBackground,
							}}
						/>
						<Workspace store={store} components={{ Tooltip }} />
						<ZoomButtons store={store} />
					</WorkspaceWrap>
				</PolotnoContainer>
			</div>
		</div>
	);
});

export default App;
