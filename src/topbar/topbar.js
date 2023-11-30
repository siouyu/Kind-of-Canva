import React from "react";
import { observer } from "mobx-react-lite";
import { Navbar, Alignment, NavbarDivider } from "@blueprintjs/core";
import styled from "polotno/utils/styled";

import { useProject } from "../project";

import { DownloadButton } from "./download-button";

const boldText = {
	fontWeight: "bold",
	fontSize: 16.5,
};

const NavbarContainer = styled("div")`
	@media screen and (max-width: 500px) {
		overflow-x: auto;
		overflow-y: hidden;
		max-width: 100vw;
	}
`;

const NavInner = styled("div")`
	@media screen and (max-width: 500px) {
		display: flex;
	}
`;

export default observer(({ store }) => {
	const project = useProject();

	return (
		<NavbarContainer className="bp5-navbar">
			<NavInner>
				<Navbar.Group align={Alignment.LEFT}>
					<div style={boldText}>Design your ideas here!</div>
				</Navbar.Group>
				<Navbar.Group align={Alignment.RIGHT}>
					<NavbarDivider />
					<DownloadButton store={store} />
				</Navbar.Group>
			</NavInner>
		</NavbarContainer>
	);
});
