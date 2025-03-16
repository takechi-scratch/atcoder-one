import { getEnabledSetting } from '/src/lib/settings.js';

(async () => {
    const now_version = chrome.runtime.getManifest().version;
    const storedVersion = (await chrome.storage.local.get("version")).version;

    if (storedVersion !== now_version) {
        chrome.storage.local.set({version: now_version});
        // 左下に通知を表示
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.left = '10px';
        notification.style.bottom = '10px';
        notification.style.padding = '10px';
        notification.style.backgroundColor = '#2298f2da';
        notification.style.color = 'white';
        notification.style.zIndex = '1000';
        notification.textContent = `atcoder-oneがver.${now_version}にアップデートされました`;
        document.body.appendChild(notification);
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }

    const scripts = [
        "/userscripts/test_colorful/userscript.js",
        "/userscripts/crouch_start/userscript.js",
        // 他のスクリプトをここに追加できます
    ];

    const enabled_userscripts = await getEnabledSetting("");

    for (const id of enabled_userscripts) {
        try {
            const module = await import(`/userscripts/${id}/userscript.js`);
            if (module.default) {
                module.default();
            }
        } catch (error) {
            console.error(`Failed to import ${id}:`, error);
        }
    }
})();


// import main from "/userscripts/test_colorful/userscript.js";
// main();
