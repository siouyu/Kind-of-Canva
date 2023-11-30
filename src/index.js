import React from "react";
import ReactDOM from "react-dom/client";

import { createStore } from "polotno/model/store";
import { unstable_setAnimationsEnabled } from "polotno/config";
import { Auth0Provider } from "@auth0/auth0-react";
import { createProject, ProjectContext } from "./project";

import "./index.css";
import App from "./App";
import "./logger";
import { ErrorBoundary } from "react-error-boundary";

unstable_setAnimationsEnabled(true);

const store = createStore({ key: "nFA5H9elEytDyPyvKL7T" });
window.store = store;
store.addPage();

const project = createProject({ store });
window.project = project;

const root = ReactDOM.createRoot(document.getElementById("root"));

const AUTH_DOMAIN = "polotno-studio.eu.auth0.com";
const PRODUCTION_ID = process.env.REACT_APP_AUTH0_ID;
const LOCAL_ID = process.env.REACT_APP_AUTH0_ID;

const isLocalhost =
	typeof window !== undefined &&
	window.location.href.indexOf("localhost") >= 0;
const ID = isLocalhost ? LOCAL_ID : PRODUCTION_ID;
const REDIRECT = isLocalhost;

function Fallback({ error, resetErrorBoundary }) {
	return (
		<div style={{ width: "100vw", height: "100vh" }}>
			<div style={{ textAlign: "center", paddingTop: "40px" }}>
				<p>Something went wrong in the app.</p>
				<p>Try to reload the page.</p>
				<p>If it does not work, clear cache and reload.</p>
				<button
					onClick={async () => {
						await project.clear();
						window.location.reload();
					}}>
					Clear cache and reload
				</button>
			</div>
		</div>
	);
}

root.render(
	<ErrorBoundary
		FallbackComponent={Fallback}
		onReset={(details) => {}}
		onError={(e) => {
			if (window.Sentry) {
				window.Sentry.captureException(e);
			}
		}}>
		<ProjectContext.Provider value={project}>
			<Auth0Provider
				domain={AUTH_DOMAIN}
				clientId={ID}
				redirectUri={REDIRECT}>
				<App store={store} />
			</Auth0Provider>
		</ProjectContext.Provider>
	</ErrorBoundary>
);
