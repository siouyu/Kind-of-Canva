import * as mobx from "mobx";
import { createContext, useContext } from "react";
import * as api from "./api";

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

	async loadById(id) {
		this.id = id;
		this.updateUrlWithProjectId();
		try {
			const { store, name } = await api.getDesignById({
				id,
				authToken: this.authToken,
			});
			if (store) {
				this.store.loadJSON(store);
			}
			this.name = name;
		} catch (e) {
			alert("Project can't be loaded");
		}
	}

	updateUrlWithProjectId() {
		if (!this.id || this.id === "local") {
			window.history.replaceState({}, null, `/`);
			return;
		}
		let url = new URL(window.location.href);
		let params = new URLSearchParams(url.search);
		params.set("id", this.id);
		window.history.replaceState({}, null, `/design/${this.id}`);
	}

	async save() {
		const json = this.store.toJSON();
		const maxWidth = 400;
		const res = await api.saveDesign({
			store: json,
			id: this.id,
			isPrivate: this.private,
			name: this.name,
			authToken: this.authToken,
		});
		if (res.status === "saved") {
			this.id = res.id;
			this.updateUrlWithProjectId();
		}
	}

	async duplicate() {
		this.id = "";
		this.save();
	}

	async clear() {
		await api.deleteDesign();
	}
}

export const createProject = (...args) => new Project(...args);
export default createProject;
