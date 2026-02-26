// Question Spoof - Kscript by Sala Sem Futuro
(function() {
    if (!window.features.questionSpoof) return;
    
    console.log('Question Spoof: Active');
    
    // Seleciona todas as perguntas não respondidas
    function spoofQuestions() {
        const questions = document.querySelectorAll('[data-test-id*="question"], .question-item, .pergunta, [role="radiogroup"]');
        
        questions.forEach(q => {
            const options = q.querySelectorAll('input[type="radio"], [role="radio"]');
            if (options.length > 0) {
                const isAnswered = q.querySelector('input:checked, [aria-checked="true"]');
                if (!isAnswered) {
                    // Marca primeira opção como respondida
                    options[0].click();
                }
            }
        });
    }
    
    // Executa a cada 2 segundos
    setInterval(spoofQuestions, 2000);
    
    window.plppdo?.on('domChanged', spoofQuestions);
})();
