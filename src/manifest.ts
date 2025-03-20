import { defineManifest } from "@crxjs/vite-plugin";
import { version } from "../package.json";

// NOTE: do not include src/ in paths,
// vite root folder: src, public folder: public (based on the project root)
// @see ../vite.config.ts#L16

const manifest = defineManifest(async (env) => ({
    manifest_version: 3,
    name: `${env.mode === "development" ? "[Dev] " : ""}atcoder-one`,
    description: "AtCoderを快適にするスクリプトを1つに",
    version,
    background: {
        service_worker: "background/index.ts",
    },
    content_scripts: [
        {
            matches: ["*://*.atcoder.jp/*"],
            js: ["content/index.tsx"],
        },
    ],
    options_ui: {
        page: "options/options.html",
        open_in_tab: true,
    },
    web_accessible_resources: [
        {
            resources: ["*"],
            matches: ["*://*.atcoder.jp/*"],
            use_dynamic_url: false,
        },
    ],
    action: {
        default_popup: "popup/popup.html",
        default_icon: {
            "16": "icons/16x16.png",
            "48": "icons/48x48.png",
            "128": "icons/128x128.png",
        },
    },
    icons: {
        "16": "icons/16x16.png",
        "48": "icons/48x48.png",
        "128": "icons/128x128.png",
    },
    permissions: ["storage", "activeTab"],
}));

export default manifest;
