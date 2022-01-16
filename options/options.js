const OPTION_NODE_ID = "color-preferences"
const FORM_NODE_ID = "form"

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
    const colorInput = createColorPreferenceInput('input', option.color, {
        "type": 'color'
    })

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
    const colorPreferencesNode = document.getElementById(OPTION_NODE_ID);
    options.colorPreferences.forEach((p) => {
        colorPreferencesNode.appendChild(createColorPreferenceRow(p))
    })
}

function parseOptions() {
    const options = {
        colorPreferences: []
    }
    const colorPreferencesNode = document.getElementById(OPTION_NODE_ID);
    colorPreferencesNode.childNodes.forEach(node => {
        [urlInput, colorInput, isRegexCheckbox] = node.childNodes
        const colorPreference = {
            "url": urlInput.value,
            "color": colorInput.value,
            "isRegex": isRegexCheckbox.hasAttribute('checked')
        }
        options.colorPreferences.push(colorPreference);
    })
    return options;
}

async function saveOptions() {
    const { storage: storageAPI } = browser;
    const options = parseOptions();
    await storageAPI.local.set(options);
}

document.addEventListener('DOMContentLoaded', async () => {
    const options = await getOptions();
    displayOptions(options);
});
document.getElementById(FORM_NODE_ID).addEventListener('submit', saveOptions)