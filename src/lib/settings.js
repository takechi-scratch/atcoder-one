export function getAvailableUserscripts(dirEntry) {
    return new Promise(async (resolve, reject) => {
        const enabledUserscripts = await getEnabledSetting();
        let userscripts = [];

        dirEntry.getDirectory("userscripts", {}, (userscriptsDir) => {
            const dirReader = userscriptsDir.createReader();
            dirReader.readEntries((entries) => {
                const promises = entries.map((entry) => {
                    if (entry.isFile) {
                        return Promise.resolve(undefined);
                    }
                    return new Promise((resolve, reject) => {
                        dirEntry.getFile(`userscripts/${entry.name}/userscript.json`, {}, (fileEntry) => {
                            if (!fileEntry) {
                                resolve(undefined);
                                return;
                            }
                            // ファイルをJSONとして読み込む
                            fileEntry.file((file) => {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                    try {
                                        const manifest = JSON.parse(event.target.result);
                                        const enabled = enabledUserscripts.includes(entry.name);
                                        resolve({id: entry.name, manifest: manifest, enabled: enabled});
                                    } catch (e) {
                                        console.error(e);
                                        resolve(undefined);
                                    }
                                };
                                reader.readAsText(file);
                            });
                        });
                    });
                });

                Promise.all(promises).then((results) => {
                    userscripts = results.filter((userscript) => userscript !== undefined);
                    console.log(userscripts);
                    resolve(userscripts);
                }).catch(reject);
            });
        });
    });
}

// オンになっている設定を取得する
export async function getEnabledSetting() {
    const enabled = (await chrome.storage.local.get("enabled")).enabled;
    if (!enabled) {
        console.error("設定値が見つかりません");
    }
    return enabled;
}

export async function setEnabledSetting(id, isEnabled = undefined) {
    const enabled_userscripts = await getEnabledSetting();
    const now_includes = enabled_userscripts.includes(id);
    if (isEnabled === undefined) {
        isEnabled = !now_includes;
    }
    if (isEnabled && !now_includes) {
        enabled_userscripts.push(id);
    } else if (!isEnabled && now_includes) {
        enabled_userscripts.splice(enabled_userscripts.indexOf(id), 1);
    }
    chrome.storage.local.set({enabled: enabled_userscripts});
}
