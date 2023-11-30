import localforage from "localforage";

const API = "https://polotno-studio-api.vercel.app/api";

export async function getDesignById({ id, authToken }) {
	if (true) {
		const json = await localforage.getItem("polotno-state");
		return {
			store: json,
			name: "",
		};
	}
}

export async function listDesigns({ accessToken }) {
	const req = await fetch(API + "/designs/list", {
		method: "GET",
		headers: {
			Authorization: accessToken,
		},
	});
	return req.json();
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
