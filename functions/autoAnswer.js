// Auto Answer - Kscript by Sala Sem Futuro
(function() {
    if (!window.features.autoAnswer) return;
    
    console.log('Auto Answer: Active');
    
    async function autoAnswerQuestions() {
        const questions = document.querySelectorAll('[data-test-id*="question"], .question-item, [role="radiogroup"]');
        
        for (let q of questions) {
            const options = q.querySelectorAll('input[type="radio"], [role="radio"], label');
            const isAnswered = q.querySelector('input:checked, [aria-checked="true"]');
            
            if (!isAnswered && options.length > 0) {
                // Simula inteligência escolhendo opções diferentes
                const randomIndex = Math.floor(Math.random() * options.length);
                options[randomIndex].click();
                
                // Aguarda antes de responder próxima
                await new Promise(r => setTimeout(r, window.featureConfigs.autoAnswerDelay * 1000));
            }
        }
        
        // Clica em botões de confirmação/envio
        const keywords = ['enviar', 'confirmar', 'próximo', 'proximo', 'responder', 'verificar'];
        document.querySelectorAll('button').forEach(btn => {
            const text = (btn.textContent || btn.value || '').toLowerCase();
            if (keywords.some(k => text.includes(k)) && !btn.disabled && btn.offsetParent !== null) {
                setTimeout(() => btn.click(), 500);
            }
        });
    }
    
    // Executa a cada X segundos
    setInterval(autoAnswerQuestions, window.featureConfigs.autoAnswerDelay * 2000);
    window.plppdo?.on('domChanged', autoAnswerQuestions);
})();
