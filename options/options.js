const OPTION_NODE_ID = "color-preferences"
const FORM_NODE_ID = "form"
const ADD_ROW_ID = "add-row"
const SUBMIT_BUTTON_ID = "submit"

async function getOptions() {
    const { storage: storageAPI } = browser;
    return storageAPI.local.get({
        colorPreferences: [{
            "url": "en.wikipedia.org/*",
            "color": "#ED760E",
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

function removeRow(index) {
    getOptions().then(options => {
        options.colorPreferences.splice(index, 1)
        displayOptions(options);
        // saveOptions();
    })
}

function createColorPreferenceRow(option, index) {
    const nodeContainer = document.createElement('div');

    const urlInput = createColorPreferenceInput('input', option.url, {
        "class": "url"
    })
    const colorInput = createColorPreferenceInput('input', option.color, {
        "type": 'color',
        "class": 'color'
    })

    const isRegexAttributes = {
        'type': 'checkbox',
        "class": "regex"
    }
    if (option.isRegex) {
        isRegexAttributes['checked'] = true
    }
    const isRegexCheckbox = createColorPreferenceInput('input', null, isRegexAttributes)

    const removeRowButton = createColorPreferenceInput('button');
    removeRowButton.innerHTML = "Remove";
    removeRowButton.addEventListener('click', () => removeRow(index))

    nodeContainer.append(urlInput, colorInput, isRegexCheckbox, removeRowButton);

    return nodeContainer
}

function displayOptions(options) {
    const colorPreferencesNode = document.getElementById(OPTION_NODE_ID);
    colorPreferencesNode.textContent = null;
    options.colorPreferences.forEach((p, index) => {
        colorPreferencesNode.appendChild(createColorPreferenceRow(p, index))
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
            "isRegex": isRegexCheckbox.checked
        }
        options.colorPreferences.push(colorPreference);
    })
    return options;
}

function saveOptions() {
    const { storage: storageAPI } = browser;
    const options = parseOptions();
    storageAPI.local.set(options);
}

document.addEventListener('DOMContentLoaded', () => {
    getOptions().then(options => {
        displayOptions(options);
    });
});
document.getElementById(SUBMIT_BUTTON_ID).addEventListener('click', saveOptions)

document.getElementById(ADD_ROW_ID).addEventListener('click', () => {
    getOptions().then(options => {
        options.colorPreferences.push({})
        displayOptions(options);
        // saveOptions();
    })
})