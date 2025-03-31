const ver = "V3.0.5";

// Configurações de atraso para as funcionalidades
const featureConfigs = {
    initialDelay: 3000,
    subsequentDelays: [300, 1500, 500, 2000]
};

// Configurações das funcionalidades
window.features = {
    autoAnswer: false,
    questionSpoof: true
};

// Função para criar um delay
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Função para exibir um toast (notificação)
function sendToast(text, duration = 5000, gravity = 'bottom') {
    console.log(`Toast: ${text}`);
}

// Função para encontrar e clicar em um elemento por classe
function findAndClickByClass(className) {
    const element = document.getElementsByClassName(className)[0];
    if (element) {
        element.click();
        if (element.textContent === 'Mostrar resumo') {
            sendToast("Exercício concluído!", 3000);
        }
    }
    return !!element;
}

// Função para modificar as questões (spoof)
function spoofQuestion() {
    const phrases = [
        "Made by [@Pdzinn013]",
        "Instagram.com/Pdzinn013"
    ];

    const originalFetch = window.fetch;
    window.fetch = async function (input, init) {
        let body;
        if (input instanceof Request) body = await input.clone().text();
        else if (init && init.body) body = init.body;

        const originalResponse = await originalFetch.apply(this, arguments);
        const clonedResponse = originalResponse.clone();

        try {
            const responseBody = await clonedResponse.text();
            let responseObj = JSON.parse(responseBody);

            if (responseObj?.data?.assessmentItem?.item?.itemData) {
                let itemData = JSON.parse(responseObj.data.assessmentItem.item.itemData);

                if (itemData.question.content[0] === itemData.question.content[0].toUpperCase()) {
                    itemData.answerArea = {
                        "calculator": false,
                        "chi2Table": false,
                        "periodicTable": false,
                        "tTable": false,
                        "zTable": false
                    };

                    itemData.question.content = phrases[Math.floor(Math.random() * phrases.length)] + `[[☃ radio 1]]`;
                    itemData.question.widgets = {
                        "radio 1": {
                            options: {
                                choices: [
                                    { content: "Resposta correta.", correct: true },
                                    { content: "Resposta Errada.", correct: false }
                                ]
                            }
                        }
                    };

                    responseObj.data.assessmentItem.item.itemData = JSON.stringify(itemData);
                    sendToast("Questão Bypassed.", 1000);

                    return new Response(JSON.stringify(responseObj), {
                        status: originalResponse.status,
                        statusText: originalResponse.statusText,
                        headers: originalResponse.headers
                    });
                }
            }
        } catch (e) {
            console.error(e);
        }

        return originalResponse;
    };
}

// Função para responder automaticamente às questões
function autoAnswer() {
    (async () => {
        const baseClasses = ["_s6zfc1u", "_ssxvf9l", "_4i5p5ae", "_1r8cd7xe", "_1yok8f4"];

        while (true) {
            if (window.features.autoAnswer && window.features.questionSpoof) {
                await delay(featureConfigs.initialDelay);

                for (let i = 0; i < baseClasses.length; i++) {
                    const clicked = findAndClickByClass(baseClasses[i]);
                    if (clicked && i < baseClasses.length - 1) {
                        const nextDelay = featureConfigs.subsequentDelays[i % featureConfigs.subsequentDelays.length];
                        await delay(nextDelay);
                    }
                }
            } else {
                await delay(1000);
            }
        }
    })();
}

// Verifica se o script está sendo executado no site correto
if (!/^https?:\/\/pt\.khanacademy\.org/.test(window.location.href)) {
    alert("KhanInnovate Failed to Injected!\n\nVocê precisa executar o KhanInnovate no site do Khan Academy! (https://pt.khanacademy.org/)");
    window.location.href = "https://pt.khanacademy.org/";
}

// Inicializa as funcionalidades principais
(async () => {
    sendToast("Desenvolvido por ScxttZarek", 5000, 'bottom');
    window.features.autoAnswer = true;
    spoofQuestion();
    autoAnswer();
    console.clear();
})();
