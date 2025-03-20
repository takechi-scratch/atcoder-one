import browser from "webextension-polyfill";

import { getEnabledSetting } from "../lib/settings.js";

export default async function () {
    const now_version = browser.runtime.getManifest().version;
    const storedVersion = (await browser.storage.local.get("version")).version;

    if (storedVersion !== now_version) {
        browser.storage.local.set({ version: now_version });
        // 左下に通知を表示
        const notification = document.createElement("div");
        notification.style.position = "fixed";
        notification.style.left = "10px";
        notification.style.bottom = "10px";
        notification.style.padding = "10px";
        notification.style.backgroundColor = "#2298f2da";
        notification.style.color = "white";
        notification.style.zIndex = "1000";
        notification.textContent = `atcoder-oneがver.${now_version}にアップデートされました`;
        document.body.appendChild(notification);
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }

    const enabled_userscripts = await getEnabledSetting();
    console.log(enabled_userscripts);

    for (const id of enabled_userscripts) {
        try {
            const module = await import(`../userscripts/${id}/userscript.js`);
            if (module.default) {
                module.default();
            }
        } catch (error) {
            console.error(`Failed to import ${id}:`, error);
        }
    }
}
