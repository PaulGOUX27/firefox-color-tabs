async function main() {
    const { tabs: tabsAPI, theme: themeAPI } = browser;
    const url = "https://github.com/cfinke/True-Colors/blob/master/true-colors/chrome/content/overlay.js"

    const defaultTheme = await themeAPI.getCurrent(1);

    tabsAPI.onActivated.addListener(async ({ tabId, windowId }) => {
        const activeTab = await tabsAPI.get(tabId)
        if (activeTab.url === url) {
            let newTheme = structuredClone(defaultTheme)
            newTheme.colors.tab_selected = "rgb(151, 34, 34)"
            themeAPI.update(windowId, newTheme)
        } else {
            // TODO update only if previous had a specific theme+
            themeAPI.update(windowId, defaultTheme)
        }

    })
    await browser.runtime.openOptionsPage()
}

// TODO rerun addListener smartly (remove provious one ...)
browser.storage.onChanged.addListener((changes) => console.log('changes', changes))

main()