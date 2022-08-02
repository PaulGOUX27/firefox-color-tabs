const OPTION_NODE_ID = "color-preferences"
const FORM_NODE_ID = "form"
const ADD_ROW_ID = "add-row"
const SUBMIT_BUTTON_ID = "submit"

let _options = null;

async function fetchOptions() {
    const { storage: storageAPI } = browser;
    _options = await storageAPI.local.get({
        colorPreferences: []
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

async function removeRow(index) {
    _options.colorPreferences.splice(index, 1)
    await saveOptions();
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
    urlInput.addEventListener('change', event => { option.url = event.target.value })
    colorInput.addEventListener('change', event => { option.color = event.target.value })
    isRegexCheckbox.addEventListener('change', () => { console.log(isRegexCheckbox.checked); option.isRegex = isRegexCheckbox.checked })
    removeRowButton.addEventListener('click', async () => { await removeRow(index) })

    nodeContainer.append(urlInput, colorInput, isRegexCheckbox, removeRowButton);

    return nodeContainer
}

function displayOptions() {
    const colorPreferencesNode = document.getElementById(OPTION_NODE_ID);
    colorPreferencesNode.textContent = null;
    _options.colorPreferences.forEach((p, index) => {
        colorPreferencesNode.appendChild(createColorPreferenceRow(p, index))
    })
}

async function saveOptions() {
    const { storage: storageAPI } = browser;
    await storageAPI.local.set(_options);
}

async function addRow() {
    _options.colorPreferences.push({});
    await saveOptions();
    displayOptions();
}

document.getElementById(SUBMIT_BUTTON_ID).addEventListener('click', saveOptions)

document.getElementById(ADD_ROW_ID).addEventListener('click', addRow)

async function init() {
    await fetchOptions();
    displayOptions();
}

init();