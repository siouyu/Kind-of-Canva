import React from "react";

import { SectionTab } from "polotno/side-panel";
import { Shapes } from "polotno/side-panel/elements-panel";
import FaShapes from "@meronex/icons/fa/FaShapes";

export const ShapesPanel = ({ store }) => {
	return <Shapes store={store} />;
};

export const ShapesSection = {
	name: "shapes",
	Tab: (props) => (
		<SectionTab name="Shapes" {...props}>
			<FaShapes />
		</SectionTab>
	),
	Panel: ShapesPanel,
};
