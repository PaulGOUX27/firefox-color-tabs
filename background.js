function isURLMatching(colorPreference, url) {
    if (colorPreference.isRegex) {
        return new RegExp(colorPreference.url).test(url)
    }
    return colorPreference.url === url;
}

async function main() {
    const { tabs: tabsAPI, theme: themeAPI, storage: storageAPI } = browser;
    let defaultTheme = await themeAPI.getCurrent(1);
    let options = await storageAPI.local.get({
        colorPreferences: []
    });

    async function onTabChanged({ tabId, windowId }) {
        const activeTab = await tabsAPI.get(tabId)
        colorPreference = options.colorPreferences.find(cp => isURLMatching(cp, activeTab.url))

        if (colorPreference) {
            // catch WARN	Unrecognized theme property found: colors.tab_loading_inactive
            let newTheme = structuredClone(defaultTheme)
            newTheme.colors.tab_selected = colorPreference.color
            themeAPI.update(windowId, newTheme)
        } else {
            // TODO update only if previous had a specific theme
            themeAPI.update(windowId, defaultTheme)
        }
    }

    storageAPI.onChanged.addListener((changes) => {
        options = Object.fromEntries(Object.entries(changes).map(([key, values]) => [key, values.newValue]))
    })

    tabsAPI.onActivated.addListener(onTabChanged)
    tabsAPI.onUpdated.addListener((tabId, _, { windowId }) => onTabChanged({ tabId, windowId }))
}

main()