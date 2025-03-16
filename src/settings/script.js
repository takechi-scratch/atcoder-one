import {getAvailableUserscripts, setEnabledSetting} from '../lib/settings.js';

document.addEventListener('DOMContentLoaded', async () => {
    const userscriptsList = document.getElementById('userscripts-list');

    chrome.runtime.getPackageDirectoryEntry(async (dirEntry) => {
        let userscripts;
        userscripts = await getAvailableUserscripts(dirEntry);
        console.log(userscripts);
        userscripts.forEach((userscript) => {
            const userscriptElement = document.createElement('div');
            userscriptElement.style.border = '1px solid #ccc';
            userscriptElement.style.padding = '10px';
            userscriptElement.style.margin = '10px 0';
            userscriptElement.style.borderRadius = '5px';
            userscriptElement.style.backgroundColor = '#f9f9f9';

            const title = document.createElement('h3');
            title.textContent = userscript.manifest.name;
            title.style.margin = '0 0 10px 0';

            const description = document.createElement('p');
            description.textContent = userscript.manifest.description;
            description.style.margin = '0 0 10px 0';

            const toggleLabel = document.createElement('label');
            toggleLabel.style.display = 'flex';
            toggleLabel.style.alignItems = 'center';

            const toggle = document.createElement('input');
            toggle.type = 'checkbox';
            toggle.checked = userscript.enabled;
            toggle.style.marginRight = '10px';
            toggle.addEventListener('change', () => {
                setEnabledSetting(userscript.id, toggle.checked);
            });

            toggleLabel.appendChild(toggle);
            toggleLabel.appendChild(document.createTextNode('有効'));

            userscriptElement.appendChild(title);
            userscriptElement.appendChild(description);
            userscriptElement.appendChild(toggleLabel);

            userscriptsList.appendChild(userscriptElement);
        });
    });
});
