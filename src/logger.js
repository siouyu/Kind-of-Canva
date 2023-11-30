import * as Sentry from "@sentry/browser";

Sentry.init({
	dsn: process.env.REACT_APP_SENTRY_DNS,

	replaysSessionSampleRate: 0.1,
	replaysOnErrorSampleRate: 1.0,

	integrations: [
		new Sentry.Replay({
			maskAllText: false,
			blockAllMedia: false,
		}),
	],
	shouldSendCallback: function (data) {
		var sampleRate = 10;
		return Math.random() * 100 <= sampleRate;
	},
	ignoreErrors: [
		"top.GLOBALS",
		"originalCreateNotification",
		"canvas.contentDocument",
		"MyApp_RemoveAllHighlights",
		"http://tt.epicplay.com",
		"Can't find variable: ZiteReader",
		"jigsaw is not defined",
		"ComboSearch is not defined",
		"http://loading.retry.widdit.com/",
		"atomicFindClose",
		"fb_xd_fragment",
		"bmi_SafeAddOnload",
		"EBCallBackMessageReceived",
		"conduitPage",
		"Script error.",
		"_avast_submit",
	],
	denyUrls: [
		// Google Adsense
		/pagead\/js/i,
		// Facebook flakiness
		/graph\.facebook\.com/i,
		// Facebook blocked
		/connect\.facebook\.net\/en_US\/all\.js/i,
		// Woopra flakiness
		/eatdifferent\.com\.woopra-ns\.com/i,
		/static\.woopra\.com\/js\/woopra\.js/i,
		// Chrome extensions
		/extensions\//i,
		/^chrome:\/\//i,
		// Other plugins
		/127\.0\.0\.1:4001\/isrunning/i, // Cacaoweb
		/webappstoolbarba\.texthelp\.com\//i,
		/metrics\.itunes\.apple\.com\.edgesuite\.net\//i,
	],
});

function base64ToUint8Array(base64DataUrl) {
	const base64String = base64DataUrl.split(",")[1];
	const binaryString = atob(base64String);
	const buffer = new Uint8Array(binaryString.length);

	for (let i = 0; i < binaryString.length; i++) {
		buffer[i] = binaryString.charCodeAt(i);
	}

	return buffer;
}

Sentry.addGlobalEventProcessor(function (event, hint) {
	if (window.store) {
		const data = JSON.stringify(window.store.toJSON());
		if (data.length < 30000) {
			hint.attachments = [
				{
					filename: "store.json",
					data: JSON.stringify(window.store.toJSON()),
				},
			];
		}
		if (window.__failedImage) {
			hint.attachments = [
				{
					filename: "failedImage.png",
					data: base64ToUint8Array(window.__failedImage),
					contentType: "image/png",
				},
			];
		}
	}
	return event;
});

window.Sentry = Sentry;
