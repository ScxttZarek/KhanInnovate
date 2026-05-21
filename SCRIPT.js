let loadedPlugins = [];

console.clear();
const noop = () => {};
console.warn = console.error = window.debug = noop;

const splashScreen = document.createElement('splashScreen');

class EventEmitter {
  constructor() { this.events = {}; }
  on(t, e) {
    (Array.isArray(t) ? t : [t]).forEach(t => {
      (this.events[t] = this.events[t] || []).push(e);
    });
  }
  off(t, e) {
    (Array.isArray(t) ? t : [t]).forEach(t => {
      this.events[t] && (this.events[t] = this.events[t].filter(h => h !== e));
    });
  }
  emit(t, ...e) {
    this.events[t]?.forEach(h => h(...e));
  }
  once(t, e) {
    const s = (...i) => {
      e(...i);
      this.off(t, s);
    };
    this.on(t, s);
  }
}

const plppdo = new EventEmitter();

// Observer otimizado
new MutationObserver(mutationsList =>
  mutationsList.some(m => m.type === 'childList') && plppdo.emit('domChanged')
).observe(document.body, { childList: true, subtree: true });

// Funções helpers
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const findAndClickBySelector = selector => document.querySelector(selector)?.click();

function sendToast(text, duration = 5000, gravity = 'bottom') {
  Toastify({
    text,
    duration,
    gravity,
    position: "center",
    stopOnFocus: true,
    style: { background: "linear-gradient(90deg, #ffffff 0%, #a259ff 100%)" }
  }).showToast();
}

async function showSplashScreen() {
  splashScreen.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:linear-gradient(90deg,#fff 0%,#a259ff 100%);display:flex;align-items:center;justify-content:center;z-index:10000;opacity:0;transition:opacity 1s;";
  splashScreen.innerHTML = '<span style="color:#fff;font-weight:bold;">INNOVATION</span><span style="color:#a259ff;font-weight:bold;">KHAN</span>';
  document.body.appendChild(splashScreen);
  setTimeout(() => splashScreen.style.opacity = '1', 10);
}

async function hideSplashScreen() {
  splashScreen.style.opacity = '0';
  setTimeout(() => splashScreen.remove(), 1000);
}

async function loadScript(url, label) {
  const response = await fetch(url);
  const script = await response.text();
  loadedPlugins.push(label);
  eval(script);
}

async function loadCss(url) {
  return new Promise(resolve => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = url;
    link.onload = resolve;
    document.head.appendChild(link);
  });
}

function setupMain() {

  const originalFetch = window.fetch;
 
  window.fetch = async function(input, init) {

    let body;
    let bodyModified = false;
    
    if (input instanceof Request) {
      body = await input.clone().text();
    } else if (init?.body) {
      body = init.body;
    }

    if (body?.includes('"operationName":"updateUserVideoProgress"')) {
      try {
        let bodyObj = JSON.parse(body);
        if (bodyObj.variables?.input) {
          const durationSeconds = bodyObj.variables.input.durationSeconds;
          bodyObj.variables.input.secondsWatched = durationSeconds;
          bodyObj.variables.input.lastSecondWatched = durationSeconds;
          body = JSON.stringify(bodyObj);
          bodyModified = true;
         
          sendToast("🔄｜Vídeo exploitado.", 1000);
        }
      } catch (e) {}
    }

    // Aplicar body modificado se necessário
    let fetchArgs = Array.from(arguments);
    if (bodyModified && init) {
      init.body = body;
      fetchArgs[1] = init;
    }

    const originalResponse = await originalFetch.apply(this, fetchArgs);

    try {
      const clonedResponse = originalResponse.clone();
      const responseBody = await clonedResponse.text();
      let responseObj = JSON.parse(responseBody);
     
      if (responseObj?.data?.assessmentItem?.item?.itemData) {
        let itemData = JSON.parse(responseObj.data.assessmentItem.item.itemData);
       
        // Verifica se é uma questão de múltipla escolha (tem widgets)
        if (itemData.question?.widgets) {
          itemData.answerArea = {
            calculator: false,
            chi2Table: false,
            periodicTable: false,
            tTable: false,
            zTable: false
          };
          
          // Cria duas opções: Correto e Incorreto
          const devs = [
            { name: "Myoko", emoji: "🦊" },
            { name: "rdzin69", emoji: "🐉" }
          ];
          const chosen = devs[Math.floor(Math.random() * devs.length)];
          
          itemData.question.content = `Desenvolvido por: ${chosen.emoji} ${chosen.name} [[☃ radio 1]]`;
          itemData.question.widgets = {
            "radio 1": {
              type: "radio",
              options: {
                choices: [
                  { content: "✅ Correto", correct: true },
                  { content: "❌ Incorreto", correct: false }
                ]
              }
            }
          };
         
          responseObj.data.assessmentItem.item.itemData = JSON.stringify(itemData);
         
          return new Response(JSON.stringify(responseObj), {
            status: originalResponse.status,
            statusText: originalResponse.statusText,
            headers: originalResponse.headers
          });
        }
      }
    } catch (e) {}
   
    return originalResponse;
  };

  (async () => {
    const selectors = [
      `[data-testid="choice-icon__library-choice-icon"]`,
      `[data-testid="exercise-check-answer"]`,
      `[data-testid="exercise-next-question"]`,
      `._1udzurba`,
      `._awve9b`
    ];
   
    window.innovationKhanDominates = true;
   
    while (window.innovationKhanDominates) {
      // Procura pela opção correta (primeira opção com "Correto")
      const correctOption = document.querySelector('[aria-label*="Correto"]');
      if (correctOption) {
        correctOption.click();
        sendToast("✅ Resposta selecionada!", 800);
        await delay(800);
      }
      
      // Clica nos botões de progresso
      for (const selector of selectors) {
        const button = document.querySelector(selector);
        if (button) {
          button.click();
          await delay(300);
        }
       
        const element = document.querySelector(`${selector}> div`);
        if (element?.innerText === "Mostrar resumo") {
          sendToast("🎉｜Exercício concluído!", 3000);
          await delay(3000);
        }
      }
      await delay(1500);
    }
  })();
}

if (!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)) { 
  window.location.href = "https://pt.khanacademy.org/";
} else {
  (async function init() {
    await showSplashScreen();
   
    await Promise.all([
      loadScript('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js', 'darkReaderPlugin').then(()=>{ DarkReader.setFetchMethod(window.fetch); DarkReader.enable(); }),
      loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css'),
      loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'toastifyPlugin')
    ]);
   
    await delay(2000);
    await hideSplashScreen();
   
    setupMain();
    sendToast("InnovationKhan iniciado!");
    console.clear();
  })();
}
