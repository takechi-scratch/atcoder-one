export default function () {
    "use strict";

    const fixtime = document.querySelector(".fixtime-full");
    const navTabs = document.querySelector(".nav.nav-tabs");
    const pullRightListItem = document.querySelector("li.pull-right");

    if (fixtime && Date.parse(fixtime.innerText) > Date.now()) {
        const contestID = window.location.pathname.split("/")[2];
        const tab = document.createElement("li");
        tab.innerHTML = `<a href="/contests/${contestID}/tasks/${contestID}_a"><span class="glyphicon glyphicon-paperclip" style="margin-right:4px;" aria-hidden="true"></span>A問題</a>`;
        navTabs.insertBefore(tab, pullRightListItem);
    }
}
