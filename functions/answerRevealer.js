// Answer Revealer - Kscript by Sala Sem Futuro
(function() {
    if (!window.features.showAnswers) return;
    
    console.log('Answer Revealer: Active');
    
    function revealAnswers() {
        // Encontra questões
        const questions = document.querySelectorAll('[data-test-id*="question"], .question-item, [role="radiogroup"]');
        
        questions.forEach(q => {
            // Procura pela resposta correta (geralmente tem data-correct ou classe com "correct")
            const correctOption = q.querySelector('[data-correct="true"], .correct, [aria-label*="correct"]');
            
            if (correctOption) {
                // Highlighting da resposta correta
                correctOption.style.outline = '3px solid #4ade80';
                correctOption.style.backgroundColor = 'rgba(74, 222, 128, 0.1)';
            }
        });
    }
    
    setInterval(revealAnswers, 1000);
    window.plppdo?.on('domChanged', revealAnswers);
})();
