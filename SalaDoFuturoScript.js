(function() {
    // Função para mostrar a tela preta com a mensagem
    function showDeveloperMessage() {
        const messageDiv = document.createElement('div');
        messageDiv.style.position = 'fixed';
        messageDiv.style.top = '0';
        messageDiv.style.left = '0';
        messageDiv.style.width = '100%';
        messageDiv.style.height = '100%';
        messageDiv.style.backgroundColor = 'black';
        messageDiv.style.color = 'white';
        messageDiv.style.display = 'flex';
        messageDiv.style.justifyContent = 'center';
        messageDiv.style.alignItems = 'center';
        messageDiv.style.fontSize = '24px';
        messageDiv.style.zIndex = '9999';
        messageDiv.innerText = 'Desenvolvido por ScxttZarek';

        document.body.appendChild(messageDiv);

        // Remover a mensagem após alguns segundos
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    // Função para pegar as respostas das provas
    function getAnswers() {
        const answers = {};
        document.querySelectorAll('.question').forEach((question, index) => {
            const answer = question.querySelector('.answer').textContent;
            answers[`question_${index + 1}`] = answer;
        });
        return answers;
    }

    // Função para preencher as respostas automaticamente
    function fillAnswers(answers) {
        Object.keys(answers).forEach((key, index) => {
            const answerInput = document.querySelector(`#answer_input_${index + 1}`);
            if (answerInput) {
                answerInput.value = answers[key];
            }
        });
    }

    // Função para salvar as respostas em rascunho
    function saveDraft() {
        const saveButton = document.querySelector('#save_draft_button');
        if (saveButton) {
            saveButton.click();
        }
    }

    // Exibir mensagem de desenvolvimento
    showDeveloperMessage();

    // Adicionar delay antes de pegar as respostas
    setTimeout(() => {
        const answers = getAnswers();
        fillAnswers(answers);
        saveDraft();
        console.log('Respostas preenchidas e salvas em rascunho com sucesso!');
    }, 3000);
})();
