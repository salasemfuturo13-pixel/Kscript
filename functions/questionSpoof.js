// Question Resolver & Spoof - KScript JK Edition
(function() {
    // Verifica se a função está ligada no menu
    if (!window.features?.questionSpoof && !document.getElementById('toggle-question-spoof')?.checked) return;

    console.log('%c [KScript] Question Spoof: Otimizado por JK ', 'background: #ff0000; color: #000; font-weight: bold;');

    function solveQuestions() {
        // 1. Localiza os containers de perguntas e opções
        const radioOptions = document.querySelectorAll('[role="radio"], input[type="radio"], .perseus-radio-option');
        const checkButton = document.querySelector('button[data-test-id="exercise-check-button"], button:contains("Verificar")');

        if (radioOptions.length > 0) {
            // Verifica se algo já foi marcado para não ficar clicando infinito
            const alreadySelected = document.querySelector('[aria-checked="true"], input:checked');
            
            if (!alreadySelected) {
                console.log("%c [JK] Marcando opção...", "color: #ff0000");
                
                // Tenta clicar na opção
                const target = radioOptions[0]; // Aqui você pode mudar a lógica para buscar a correta no futuro
                target.click();

                // DISPARA EVENTOS REAIS (Fundamental para o site aceitar)
                const events = ['mousedown', 'mouseup', 'click', 'change'];
                events.forEach(evt => {
                    target.dispatchEvent(new Event(evt, { bubbles: true }));
                });
            }
        }

        // 2. Se o "Auto Responder" estiver ligado no menu, ele clica no botão de verificar
        if (document.getElementById('toggle-auto-answer')?.checked || window.features?.autoAnswer) {
            if (checkButton && !checkButton.disabled) {
                checkButton.click();
                console.log("%c [JK] Resposta enviada!", "color: #00ff00");
            }
        }
    }

    // Loop de verificação (mais rápido para não perder tempo)
    const spoofInterval = setInterval(() => {
        // Se o menu sumir da memória ou a feature for desligada, para o loop
        if (document.getElementById('toggle-question-spoof') && !document.getElementById('toggle-question-spoof').checked) return;
        
        solveQuestions();
    }, 1500);

    // Escuta mudanças na página (quando pula de uma questão para outra)
    if (window.plppdo) {
        window.plppdo.on('domChanged', solveQuestions);
    } else {
        // Fallback caso o plppdo não exista
        const observer = new MutationObserver(solveQuestions);
        observer.observe(document.body, { childList: true, subtree: true });
    }

})();
