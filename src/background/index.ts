import browser from "webextension-polyfill";
import store, { initializeWrappedStore } from "../app/store";

initializeWrappedStore();

store.subscribe(() => {
    // access store state
    // const state = store.getState();
    // console.log('state', state);
});

// show welcome page on new install
browser.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === "install") {
        //show the welcome page
        const url = browser.runtime.getURL("welcome/welcome.html");
        await browser.tabs.create({ url });
    }
});

browser.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install") {
        const now_version = browser.runtime.getManifest().version;
        browser.storage.local.set({ version: now_version });
        const default_userscripts = ["test_colorful", "crouch_start"];
        browser.storage.local.set({ enabled: default_userscripts });
    }
    console.log("atcoder-one installed.");
});
