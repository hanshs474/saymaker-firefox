// Right-click an image on any page -> open SayMaker's video generator with the
// image as the first frame (the generator reads ?refImage= and ?model= on /video).
// Attribution rides on utm params, never `ref`, which the site reads as a referral code.

const BASE = 'https://saymaker.ai';
const PARENT = 'saymaker-animate';
const MODELS = [
  { id: 'kling-3-0', label: 'Kling 3.0' },
  { id: 'veo-3-1', label: 'Veo 3.1' },
  { id: 'seedance-2', label: 'Seedance 2.0' },
  { id: 'minimax-h3-fast', label: 'MiniMax H3 Fast (runs on a free account)' },
];

function buildMenus() {
  chrome.contextMenus.create({ id: PARENT, title: 'Animate with SayMaker', contexts: ['image'] });
  for (const m of MODELS) {
    chrome.contextMenus.create({ id: `model:${m.id}`, parentId: PARENT, title: m.label, contexts: ['image'] });
  }
}

chrome.runtime.onInstalled.addListener(() => chrome.contextMenus.removeAll(buildMenus));

// Only http(s) images can be fetched by the site; data: and blob: URLs open the
// generator without a preloaded frame, so the user can upload it instead.
function targetUrl(model, srcUrl) {
  const params = new URLSearchParams({ scene: 'image-to-video', model, utm_source: 'firefox', utm_medium: 'context-menu', utm_campaign: model });
  if (/^https?:\/\//i.test(srcUrl || '')) params.set('refImage', srcUrl);
  return `${BASE}/video?${params}`;
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!String(info.menuItemId).startsWith('model:')) return;
  const model = String(info.menuItemId).slice('model:'.length);
  chrome.tabs.create({ url: targetUrl(model, info.srcUrl), index: tab ? tab.index + 1 : undefined });
});
