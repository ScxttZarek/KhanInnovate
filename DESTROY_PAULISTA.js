(function() {
    'use strict';

    // Função para exibir a mensagem de desenvolvimento
    function showDevelopmentMessage() {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = "Desenvolvido Por ScxttZarek";
        messageDiv.style.position = 'fixed';
        messageDiv.style.top = '10px';
        messageDiv.style.left = '50%';
        messageDiv.style.transform = 'translateX(-50%)';
        messageDiv.style.backgroundColor = 'black';
        messageDiv.style.color = 'white';
        messageDiv.style.padding = '10px';
        messageDiv.style.zIndex = '9999';
        messageDiv.style.fontSize = '20px';
        document.body.appendChild(messageDiv);

        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 4800); // 4,8 segundos
    }

    // Exibe a mensagem de desenvolvimento
    showDevelopmentMessage();

    let lesson_regex = /https:\/\/saladofuturo\.educacao\.sp\.gov\.br\/provas/;
    console.log("-- STARTING DESTROY PAULISTA By scxttzarek --");

    function revealAnswers(jsonOriginal) {
        let answers = {};
        
        for (let questionId in jsonOriginal.answers) {
            let question = jsonOriginal.answers[questionId];
            let taskQuestion = jsonOriginal.task.questions.find(q => q.id === parseInt(questionId));

            if (taskQuestion.type === "order-sentences") {
                answers[questionId] = taskQuestion.options.sentences.map(sentence => sentence.value);
            } else if (taskQuestion.type === "fill-words") {
                let pre_answer = taskQuestion.options;
                answers[questionId] = pre_answer.phrase
                    .map(item => item.value)
                    .filter((_, index) => index % 2 !== 0); // Pegue apenas os índices ímpares
            } else if (taskQuestion.type === "text_ai") {
                answers[questionId] = taskQuestion.comment.replace(/<\/?p>/g, '');
            } else if (taskQuestion.type === "fill-letters") {
                answers[questionId] = taskQuestion.options.answer;
            } else if (taskQuestion.type === "cloud") {
                answers[questionId] = taskQuestion.options.ids;
            } else {
                answers[questionId] = Object.fromEntries(
                    Object.keys(taskQuestion.options).map(optionId => [optionId, taskQuestion.options[optionId].answer])
                );
            }
        }
        return answers;
    }

    function setupObserver() {
        let oldHref = document.location.href;
        const observer = new MutationObserver(() => {
            if (oldHref !== document.location.href) {
                oldHref = document.location.href;
                if (lesson_regex.test(oldHref)) {
                    console.log("[DEBUG] LESSON DETECTED");

                    let x_auth_key = JSON.parse(sessionStorage.getItem("saladofuturo.educacao.sp.gov.br:iptvdashboard:state")).auth.auth_token;
                    let room_name = JSON.parse(sessionStorage.getItem("saladofuturo.educacao.sp.gov.br:iptvdashboard:state")).room.room.name;
                    let id = oldHref.split("/")[6];
                    console.log(`[DEBUG] LESSON_ID: ${id} ROOM_NAME: ${room_name}`);

                    let draft_body = {
                        status: "draft",
                        accessed_on: "room",
                        executed_on: room_name,
                        answers: {}
                    };

                    const sendRequest = (method, url, data, callback) => {
                        const xhr = new XMLHttpRequest();
                        xhr.open(method, url);
                        xhr.setRequestHeader("X-Api-Key", x_auth_key);
                        xhr.setRequestHeader("Content-Type", "application/json");
                        xhr.onload = () => callback(xhr);
                        xhr.onerror = () => console.error('Request failed');
                        xhr.send(data ? JSON.stringify(data) : null);
                    };

                    sendRequest("POST", `https://edusp-api.ip.tv/tms/task/${id}/answer`, draft_body, (response) => {
                        console.log("[DEBUG] DRAFT_DONE, RESPONSE: ", response.responseText);
                        let response_json = JSON.parse(response.responseText);
                        let task_id = response_json.id;
                        let get_anwsers_url = `https://edusp-api.ip.tv/tms/task/${id}/answer/${task_id}?with_task=true&with_genre=true&with_questions=true&with_assessed_skills=true`;

                        console.log("[DEBUG] Getting Answers...");

                        sendRequest("GET", get_anwsers_url, null, (response) => {
                            console.log(`[DEBUG] Get Answers request received response`);
                            console.log(`[DEBUG] GET ANSWERS RESPONSE: ${response.responseText}`);
                            let get_anwsers_response = JSON.parse(response.responseText);
                            let answers = revealAnswers(get_anwsers_response);

                            console.log(`[DEBUG] Revealed Answers: ${JSON.stringify(answers)}`);

                            // Display the answers on the page
                            for (let questionId in answers) {
                                let answer = answers[questionId];
                                let questionElement = document.querySelector(`[data-question-id='${questionId}']`);
                                if (questionElement) {
                                    let answerElement = document.createElement('div');
                                    answerElement.textContent = `Answer: ${JSON.stringify(answer)}`;
                                    answerElement.style.color = 'red';
                                    questionElement.appendChild(answerElement);
                                }
                            }
                        });
                    });
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Executa o observador de mudanças na URL
    setupObserver();
})();
