import * as mobx from "mobx";
import { createContext, useContext } from "react";
import * as storage from "./projectStorage";

export const ProjectContext = createContext({});

export const useProject = () => useContext(ProjectContext);

class Project {
	id = "";
	name = "";
	authToken = "";
	private = false;
	user = {};
	skipSaving = false;
	puterModalVisible = false;

	constructor({ store }) {
		mobx.makeAutoObservable(this);
		this.store = store;

		store.on("change", () => {
			this.requestSave();
		});
	}

	requestSave() {
		if (this.saveTimeout) {
			return;
		}
		this.saveTimeout = setTimeout(() => {
			this.saveTimeout = null;
			this.save();
		}, 5000);
	}

	async save() {
		const json = this.store.toJSON();
		const res = await storage.saveDesign({
			store: json,
			id: this.id,
			isPrivate: this.private,
			name: this.name,
			authToken: this.authToken,
		});
		if (res.status === "saved") {
			this.id = res.id;
		}
	}

	async duplicate() {
		this.id = "";
		this.save();
	}

	async clear() {
		await storage.deleteDesign();
	}
}

export const createProject = (...args) => new Project(...args);
export default createProject;
