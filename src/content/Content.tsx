import browser from "webextension-polyfill";

import "@mantine/notifications/styles.css";
import "@mantine/core/styles.css";
import { notifications } from "@mantine/notifications";

import { getEnabledSetting } from "../lib/settings.js";

export default async function () {
    const now_version = browser.runtime.getManifest().version;
    const storedVersion = (await browser.storage.local.get("version")).version;

    if (storedVersion !== now_version) {
        console.log("新しいバージョンが見つかりました");
        console.log(`現在のバージョン: ${now_version}`);
        console.log(`保存されているバージョン: ${storedVersion}`);
        browser.storage.local.set({ version: now_version });
        // 左下に通知を表示
        notifications.show({
            title: "更新完了",
            message: `atcoder-oneがver.${now_version}にアップデートされました`,
        });
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
