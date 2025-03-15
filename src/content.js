(async() => {
    const src = chrome.runtime.getURL("src/main.js");
    const contentMain = await import(src);
})()
