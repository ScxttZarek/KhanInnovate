let loadedPlugins = [];

const splashScreen = document.createElement('div');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const playAudio = url => { const audio = new Audio(url); audio.play(); };
const findAndClickBySelector = selector => { const element = document.querySelector(selector); if (element) { element.click(); } };

function sendToast(text, duration=5000, gravity='bottom') { 
  if (typeof Toastify !== 'undefined') {
    Toastify({ text: text, duration: duration, gravity: gravity, position: "center", stopOnFocus: true, style: { background: "#7c3aed" } }).show();
  }
}

async function showSplashScreen() { 
  splashScreen.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:linear-gradient(135deg, #7c3aed 0%, #ffffff 100%);display:flex;align-items:center;justify-content:center;z-index:9999;opacity:1;transition:opacity 1s ease;";
  document.body.appendChild(splashScreen);
}

async function hideSplashScreen() { 
  splashScreen.style.opacity = '0';
  setTimeout(() => splashScreen.remove(), 1000);
}

async function loadScript(url, label) { 
  return fetch(url).then(response => response.text()).then(script => { 
    loadedPlugins.push(label);
    eval(script);
  });
}

async function loadCss(url) { 
  return new Promise((resolve) => { 
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = url;
    link.onload = () => resolve();
    document.head.appendChild(link);
  });
}

function setupMain(){
  sendToast('InnovationKhan iniciado com sucesso!');
}

if (!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)) {
  alert('InnovationKhan deve ser executado no Khan Academy!');
}

showSplashScreen();

loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css', 'toastifyCss')
  .then(() => loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'toastifyPlugin'))
  .then(async () => {
    sendToast('InnovationKhan carregado!');
    await delay(500);
    hideSplashScreen();
    setupMain();
    console.clear();
  })
  .catch(err => console.error('Erro ao carregar:', err));
