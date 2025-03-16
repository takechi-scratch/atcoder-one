chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install") {
        const now_version = chrome.runtime.getManifest().version;
        chrome.storage.local.set({version: now_version});
        const default_userscripts = ["test_colorful", "crouch_start"];
        chrome.storage.local.set({enabled: default_userscripts});
    }
    console.log("AtCoder extension installed.");
});
