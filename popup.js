const u = (p) => `https://saymaker.ai/${p}?utm_source=firefox&utm_medium=popup`;
for (const id of ['video', 'image']) {
  document.getElementById(id).addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: u(id) });
    window.close();
  });
}
