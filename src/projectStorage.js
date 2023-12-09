import localforage from "localforage";

export async function getDesignById({ id, authToken }) {
	if (true) {
		const json = await localforage.getItem("polotno-state");
		return {
			store: json,
			name: "",
		};
	}
}

export async function saveDesign({ store }) {
	localforage.setItem("polotno-state", store);
	return {
		id: "local",
		status: "saved",
	};
}

export async function deleteDesign({ id, authToken } = {}) {
	await localforage.clear();
}
