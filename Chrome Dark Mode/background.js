chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ darkMode: false, bgColor: '#000000', textColor: '#ff0000' });
});