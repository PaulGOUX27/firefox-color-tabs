const OPTION_NODE_ID = "color-preferences"

async function getOptions() {
    const { storage: storageAPI } = browser;
    return storageAPI.local.get({
        colorPreferences: [{
            "url": "https://github.com/cfinke/True-Colors/blob/master/true-colors/chrome/content/overlay.js",
            "color": "#972222",
            "isRegex": false
        },
        {
            "url": "www.wikipedia.fr",
            "color": "#ffffff",
            "isRegex": true
        }]
    })
}

function createTextNode(text) {
    return document.createTextNode(text);
}

function createColorPreferenceInput(inputType, value, attributes) {
    const input = document.createElement(inputType);
    if (value) {
        input.value = value
    }
    if (attributes) {
        for (const attribute in attributes) {
            input.setAttribute(attribute, attributes[attribute])
        }
    }
    return input;
}

function createColorPreferenceRow(option) {
    const nodeContainer = document.createElement('div');

    const urlInput = createColorPreferenceInput('input', option.url)
    const colorInput = createColorPreferenceInput('input', option.color)

    const isRegexAttributes = {
        'type': 'checkbox',
    }
    if (option.isRegex) {
        isRegexAttributes['checked'] = true
    }
    const isRegexCheckbox = createColorPreferenceInput('input', null, isRegexAttributes)

    nodeContainer.append(urlInput, colorInput, isRegexCheckbox);

    return nodeContainer
}

function displayOptions(options) {
    console.log('displayOptions', options)
    const colorPreferencesNode = document.getElementById(OPTION_NODE_ID);
    options.colorPreferences.forEach((p, index) => {
        colorPreferencesNode.appendChild(createColorPreferenceRow(p))
    })
}

document.addEventListener('DOMContentLoaded', async () => {
    const options = await getOptions();
    displayOptions(options);
});