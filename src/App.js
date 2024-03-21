import React from "react";
import { observer } from "mobx-react-lite";
import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from "polotno";
import { Toolbar } from "polotno/toolbar/toolbar";
import { ZoomButtons } from "polotno/toolbar/zoom-buttons";
import { DEFAULT_SECTIONS, SidePanel } from "polotno/side-panel";
import { Workspace } from "polotno/canvas/workspace";
import { Tooltip } from "polotno/canvas/tooltip";

import { loadFile } from "./file";

import { IconsSection } from "./sections/icons-section";
import { ShapesSection } from "./sections/shapes-section";

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
	const height = useHeight();

	// const checkPageNumbers = () => {
	// 	store.pages.forEach((page, index) => {
	// 		let pageNumber = page.children.find(
	// 			(el) => el.custom?.name === "page-number"
	// 		);
	// 		const text = `Page ${index + 1}`;
	// 		if (pageNumber) {
	// 			pageNumber.set({ text });
	// 		} else {
	// 			page.addElement({
	// 				type: "text",
	// 				custom: { name: "page-number" },
	// 				text,
	// 				width: store.width,
	// 				align: "center",
	// 				fontSize: 30,
	// 				x: 0,
	// 				y: store.height - 50,
	// 				selectable: false,
	// 				alwaysOnTop: true,
	// 			});
	// 		}
	// 	});
	// };

	// checkPageNumbers();
	// store.on("change", checkPageNumbers);

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
						<Toolbar store={store} />
						<Workspace store={store} components={{ Tooltip }} />
						<ZoomButtons store={store} />
					</WorkspaceWrap>
				</PolotnoContainer>
			</div>
		</div>
	);
});

export default App;
