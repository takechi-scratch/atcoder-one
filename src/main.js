(async () => {
    const scripts = [
        "/userscripts/test_colorful/userscript.js",
        // 他のスクリプトをここに追加できます
    ];

    for (const script of scripts) {
        try {
            const module = await import(script);
            if (module.default) {
                module.default();
            }
        } catch (error) {
            console.error(`Failed to import ${script}:`, error);
        }
    }
})();


// import main from "/userscripts/test_colorful/userscript.js";
// main();
