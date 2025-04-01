(function() {
    // Função para mostrar a mensagem "Desenvolvido por ScxttZarek"
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

        // Remover a mensagem após 3 segundos
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    // Função para pegar as respostas das perguntas
    function getAnswers() {
        const answers = [];
        document.querySelectorAll('.question-container').forEach((question, index) => {
            const questionText = question.querySelector('.question-text') ? question.querySelector('.question-text').innerText : 'Questão não encontrada';
            const answer = question.querySelector('.correct-answer') ? question.querySelector('.correct-answer').innerText : 'Resposta não encontrada';
            answers.push({
                question: questionText,
                answer: answer
            });
        });
        return answers;
    }

    // Função para exibir as respostas
    function revealAnswers(answers) {
        let answersText = 'Respostas:\n\n';
        answers.forEach((item, index) => {
            answersText += `Questão ${index + 1}:\n${item.question}\nResposta: ${item.answer}\n\n`;
        });

        alert(answersText);
    }

    // Exibir mensagem de desenvolvimento
    showDeveloperMessage();

    // Adicionar delay antes de pegar e revelar as respostas
    setTimeout(() => {
        const answers = getAnswers();
        revealAnswers(answers);
        console.log('Respostas reveladas com sucesso!');
    }, 3000);
})();
