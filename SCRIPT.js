let loadedPlugins = [];

/* Element(s?) */
const splashScreen = document.createElement('splashScreen');

/* Misc Styles */
document.head.appendChild(Object.assign(document.createElement("style"), {
    innerHTML: "@font-face{font-family:'MuseoSans';src:url('https://corsproxy.io/?url=https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/ynddewua.ttf')format('truetype')}"
}));

document.head.appendChild(Object.assign(document.createElement('style'), {
    innerHTML: "::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-track { background: #f1f1f1; } ::-webkit-scrollbar-thumb { background: #888; border-radius: 10px; } ::-webkit-scrollbar-thumb:hover { background: #555; }"
}));

document.querySelector("link[rel~='icon']").href =
    'https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/ukh0rq22.png';

/* Emmiter */
class EventEmitter {
    constructor() {
        this.events = {}
    }

    on(t, e) {
        "string" == typeof t && (t = [t]),
            t.forEach(t => {
                this.events[t] || (this.events[t] = []),
                    this.events[t].push(e)
            })
    }

    off(t, e) {
        "string" == typeof t && (t = [t]),
            t.forEach(t => {
                this.events[t] && (this.events[t] = this.events[t].filter(t => t !== e))
            })
    }

    emit(t, ...e) {
        this.events[t] && this.events[t].forEach(t => {
            t(...e)
        })
    }

    once(t, e) {
        "string" == typeof t && (t = [t]);
        let s = (...i) => {
            e(...i),
                this.off(t, s)
        };
        this.on(t, s)
    }
};

const plppdo = new EventEmitter();

new MutationObserver((mutationsList) => {
    for (let mutation of mutationsList)
        if (mutation.type === 'childList')
            plppdo.emit('domChanged');
}).observe(document.body, {
    childList: true,
    subtree: true
});

/* Misc Functions */
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const playAudio = url => {
    const audio = new Audio(url);
    audio.play();
};

const findAndClickBySelector = selector => {
    const element = document.querySelector(selector);
    if (element) {
        element.click();
    }
};

function sendToast(text, duration = 5000, gravity = 'bottom') {
    Toastify({
        text: text,
        duration: duration,
        gravity: gravity,
        position: "center",
        stopOnFocus: true,
        style: {
            background: "#000000"
        }
    }).showToast();
};

async function showSplashScreen() {
    splashScreen.style.cssText =
        "position:fixed;top:0;left:0;width:100%;height:100%;background-color:#000;display:flex;align-items:center;justify-content:center;z-index:9999;opacity:0;transition:opacity 0.5s ease;user-select:none;color:white;font-family:MuseoSans,sans-serif;font-size:30px;text-align:center;";

    splashScreen.innerHTML =
        '<span style="color:white;">KhanInnovate</span><span style="color:#72ff72;">.SPACE</span>';

    document.body.appendChild(splashScreen);

    setTimeout(() => splashScreen.style.opacity = '1', 10);
};

async function hideSplashScreen() {
    splashScreen.style.opacity = '0';
    setTimeout(() => splashScreen.remove(), 1000);
};

async function loadScript(url, label) {
    return fetch(url)
        .then(response => response.text())
        .then(script => {
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

/* Main Functions */
function setupMain() {

    /* QuestionSpoof */
    (function () {

        const phrases = [
            "Get good, get [**KhanInnovate**](https://github.com/ScxttZarek/KhanInnovate/)!",
            "Made by [**ScxttZarek**](https://e-z.bio/sounix).",
            "By [**ScxttZarek/KhanInnovate**](https://github.com/ScxttZarek/KhanInnovate/).",
            "Star the project on [GitHub](https://github.com/ScxttZarek/KhanInnovate/)!"
        ];

        const originalFetch = window.fetch;
        const correctAnswers = new Map();

        const toFraction = (d) => {
            if (d === 0 || d === 1) return String(d);

            const decimals = (String(d).split('.')[1] || '').length;

            let num = Math.round(d * Math.pow(10, decimals)),
                den = Math.pow(10, decimals);

            const gcd = (a, b) => {
                while (b)
                    [a, b] = [b, a % b];
                return a;
            };

            const div = gcd(Math.abs(num), Math.abs(den));

            return den / div === 1
                ? String(num / div)
                : `${num / div}/${den / div}`;
        };

        const createEmptyResponse = (bodyObj) => {
            const emptyBody = JSON.parse(JSON.stringify(bodyObj));

            emptyBody.variables.input.attemptContent = "[[]]";
            emptyBody.variables.input.userInput = "{}";

            return emptyBody;
        };

        const isWidgetUsed = (widgetKey, questionContent, hints) => {
            const widgetPattern = `☃ ${widgetKey.replace(/\s+/g, ' ')}`;

            if (questionContent.includes(widgetPattern))
                return true;

            if (hints && Array.isArray(hints)) {
                for (const hint of hints) {

                    if (hint.content && hint.content.includes(widgetPattern))
                        return true;

                    if (hint.widgets) {
                        for (const hintWidget of Object.values(hint.widgets)) {
                            if (hintWidget.options?.content?.includes(widgetPattern))
                                return true;
                        }
                    }
                }
            }

            return false;
        };

        const modifyItemData = (itemData) => {

            if (itemData.question.content?.[0] === itemData.question.content[0].toUpperCase()) {

                itemData.answerArea = {
                    calculator: false,
                    chi2Table: false,
                    periodicTable: false,
                    tTable: false,
                    zTable: false
                };

                itemData.question.content =
                    phrases[Math.floor(Math.random() * phrases.length)] +
                    "\n\n**Is KhanInnovate's stealth mode active?**" +
                    `[[☃ radio 1]]`;

                itemData.question.widgets = {
                    "radio 1": {
                        type: "radio",
                        alignment: "default",
                        static: false,
                        graded: true,

                        options: {
                            choices: [{
                                    content: "**2**.",
                                    correct: true,
                                    id: "correct-choice"
                                },
                                {
                                    content: "**Martin Luther King Jr.**.",
                                    correct: false,
                                    id: "incorrect-choice"
                                }
                            ],

                            randomize: false,
                            multipleSelect: false,
                            displayCount: null,
                            deselectEnabled: false
                        },

                        version: {
                            major: 1,
                            minor: 0
                        }
                    }
                };

                return true;
            }

            return false;
        };

    })();
}

/* Inject */
if (!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)) {

    alert(
        "❌ InnovationKhan Failed to Injected!\n\nVocê precisa executar o KhanInnovate no site do Khan Academy! (https://pt.khanacademy.org/)"
    );

    window.location.href = "https://pt.khanacademy.org/";
}

showSplashScreen();

loadScript(
    'https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js',
    'darkReaderPlugin'
).then(() => {
    DarkReader.setFetchMethod(window.fetch);
    DarkReader.enable();
})

loadCss(
    'https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css',
    'toastifyCss'
);

loadScript(
    'https://cdn.jsdelivr.net/npm/toastify-js',
    'toastifyPlugin'
)

.then(async () => {

    sendToast("🪶 InnovationKhan Minimal injetado com sucesso!");

    playAudio(
        'https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/gcelzszy.wav'
    );

    await delay(500);

    hideSplashScreen();
    setupMain();

    console.clear();
});
