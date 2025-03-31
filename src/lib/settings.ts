/* eslint-disable no-async-promise-executor */
import browser from "webextension-polyfill";

interface Manifest {
    name: string;
    version: string;
    description: string;
    credits: {
        author?: string;
        link?: string;
        license?: string;
    };
    userscripts: {
        js: string;
        matches: string[];
    };
    [key: string]: unknown;
}

/**
 * @typedef {Object} Userscript
 * @property {string} id
 * @property {Object} manifest
 * @property {boolean} enabled
 */

export interface Userscript {
    id: string;
    manifest: Manifest;
    enabled: boolean;
}

/**
 * @param {DirectoryEntry} dirEntry
 * @returns {Promise<Userscript[]>}
 */
export function getAvailableUserscripts(dirEntry: DirectoryEntry): Promise<Userscript[]> {
    return new Promise(async (resolve, reject) => {
        const enabledUserscripts = await getEnabledSetting();
        let userscripts = [];

        dirEntry.getDirectory(
            "userscripts",
            {},
            (userscriptsDir) => {
                const dirReader = userscriptsDir.createReader();
                dirReader.readEntries(
                    (entries) => {
                        if (entries.length === 0) {
                            console.warn("No entries found in userscripts directory");
                        }
                        const promises = entries.map((entry) => {
                            if (entry.isFile) {
                                return Promise.resolve(undefined);
                            }
                            return new Promise((resolve) => {
                                const fileUrl = browser.runtime.getURL(
                                    `userscripts/${entry.name}/userscript.json`
                                );
                                fetch(fileUrl)
                                    .then((response) => {
                                        if (!response.ok) {
                                            console.warn(`File entry not found for ${entry.name}`);
                                            resolve(undefined);
                                            return;
                                        }
                                        return response.json();
                                    })
                                    .then((manifest) => {
                                        console.log(`Processing entry: ${entry.name}`);
                                        const enabled = enabledUserscripts.includes(entry.name);
                                        resolve({
                                            id: entry.name,
                                            manifest: manifest,
                                            enabled: enabled,
                                        });
                                    })
                                    .catch((e) => {
                                        console.error(`Error fetching file for ${entry.name}:`, e);
                                        resolve(undefined);
                                    });
                            });
                        });

                        Promise.all(promises)
                            .then((results) => {
                                userscripts = results.filter(
                                    (userscript): userscript is Userscript =>
                                        userscript !== undefined
                                );
                                console.log("Userscripts:", userscripts);
                                resolve(userscripts);
                            })
                            .catch((e) => {
                                console.error("Error processing entries:", e);
                                reject(e);
                            });
                    },
                    (e) => {
                        console.error("Error reading entries:", e);
                        reject(e);
                    }
                );
            },
            (e) => {
                console.error("Error getting userscripts directory:", e);
                reject(e);
            }
        );
    });
}

/**
 * @returns {Promise<string[]>}
 */
export async function getEnabledSetting() {
    const enabled = (await browser.storage.local.get("enabled")).enabled;
    if (!enabled) {
        console.error("設定値が見つかりません");
    }
    return enabled;
}

/**
 * @param {string} id
 * @param {boolean} [isEnabled]
 * @returns {Promise<void>}
 */
export async function setEnabledSetting(id: string, isEnabled: boolean | undefined = undefined) {
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
    browser.storage.local.set({ enabled: enabled_userscripts });
}
