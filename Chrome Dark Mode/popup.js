document.addEventListener('DOMContentLoaded', () => {
  const darkModeToggle = document.getElementById('darkModeToggle');
  const bgColorInput = document.getElementById('bgColor');
  const textColorInput = document.getElementById('textColor');
  const applyColorsButton = document.getElementById('applyColors');
  const resetSettingsButton = document.getElementById('resetSettings');

  // Load current settings
  chrome.storage.sync.get(['darkMode', 'bgColor', 'textColor'], (data) => {
    darkModeToggle.checked = data.darkMode || false;
    bgColorInput.value = data.bgColor || '#000000';
    textColorInput.value = data.textColor || '#ff0000'; // Default text color set to red
  });

  // Toggle dark mode
  darkModeToggle.addEventListener('change', () => {
    chrome.storage.sync.set({ darkMode: darkModeToggle.checked }, () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        if (!tab.url.startsWith('chrome://')) {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: applyDarkMode
          });
        }
      });
    });
  });

  // Apply custom colors
  applyColorsButton.addEventListener('click', () => {
    const bgColor = bgColorInput.value;
    const textColor = textColorInput.value;

    chrome.storage.sync.set({ bgColor, textColor }, () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        if (!tab.url.startsWith('chrome://')) {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: applyDarkMode
          });
        }
      });
    });
  });

  // Reset settings to default
  resetSettingsButton.addEventListener('click', () => {
    const defaultSettings = {
      darkMode: false,
      bgColor: '#000000',
      textColor: '#ff0000' // Default text color set to red
    };

    chrome.storage.sync.set(defaultSettings, () => {
      darkModeToggle.checked = defaultSettings.darkMode;
      bgColorInput.value = defaultSettings.bgColor;
      textColorInput.value = defaultSettings.textColor;

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        if (!tab.url.startsWith('chrome://')) {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: resetToDefault
          });
        }
      });
    });
  });

  function applyDarkMode() {
    chrome.storage.sync.get(['darkMode', 'bgColor', 'textColor'], (data) => {
      if (data.darkMode) {
        const css = `
          html, body {
            background-color: ${data.bgColor || '#000000'} !important;
            color: ${data.textColor || '#ff0000'} !important;
          }
          a {
            color: ${data.textColor || '#ff0000'} !important;
          }
        `;
        let style = document.getElementById('dark-mode-style');
        if (!style) {
          style = document.createElement('style');
          style.id = 'dark-mode-style';
          document.head.appendChild(style);
        }
        style.innerHTML = css;
      } else {
        let style = document.getElementById('dark-mode-style');
        if (style) {
          style.remove();
        }
      }
    });
  }

  function resetToDefault() {
    let style = document.getElementById('dark-mode-style');
    if (style) {
      style.remove();
    }
  }
});