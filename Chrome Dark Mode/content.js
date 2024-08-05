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
    let style = document.createElement('style');
    style.id = 'dark-mode-style';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  } else {
    let style = document.getElementById('dark-mode-style');
    if (style) {
      style.remove();
    }
  }
});