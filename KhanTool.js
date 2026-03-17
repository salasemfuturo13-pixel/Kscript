/**
 * KhanTool V2.1 - Fix para Campos de Matemática (fatoração/álgebra)
 */

(async function() {
    window.khantool = { autoAnswer: true, minDelay: 2, maxDelay: 4 };

    const delay = ms => new Promise(res => setTimeout(res, ms));
    const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

    async function solveExercise() {
        if (!window.khantool.autoAnswer) return;

        // 1. Localiza a área da questão
        const renderer = document.querySelector('.perseus-renderer');
        if (!renderer) return;

        await delay(randomInt(window.khantool.minDelay, window.khantool.maxDelay) * 1000);

        // --- MELHORIA: FOCO EM CAMPOS DE MATEMÁTICA (MathQuill) ---
        const mathFields = document.querySelectorAll('.mq-editable-field, .mq-textarea textarea, input[type="text"]');
        
        if (mathFields.length > 0) {
            console.log("[KhanTool] Campo de matemática detectado.");
            mathFields.forEach(field => {
                field.focus();
                
                // Se for um textarea de MathQuill ou input normal
                const target = field.tagName === 'TEXTAREA' ? field : field.querySelector('textarea') || field;
                
                // Simula a digitação de um valor (Ex: 0 ou 1 para ativar o botão)
                // Nota: A lógica de resposta real exigiria ler o objeto Perseus
                target.value = "0"; 
                
                // Dispara múltiplos eventos para o React e o MathQuill detectarem a mudança
                ['input', 'change', 'keydown', 'keyup', 'keypress'].forEach(evt => {
                    target.dispatchEvent(new Event(evt, { bubbles: true }));
                });
            });
        }

        // --- CLIQUE NO BOTÃO DE VERIFICAR ---
        // O seletor abaixo busca o botão mesmo que ele mude de classe
        const checkBtn = document.querySelector('button[data-test-id="exercise-check-answer"], button.perseus-button-selected, button[type="button"] > span:contains("Verificar")')?.parentElement || document.querySelector('button[data-test-id="exercise-check-answer"]');
        
        const nextBtn = document.querySelector('button[data-test-id="exercise-next-question"]');

        if (nextBtn) {
            console.log("[KhanTool] Indo para próxima...");
            nextBtn.click();
        } else if (checkBtn) {
            // Remove o atributo 'disabled' se ele existir para forçar o clique
            checkBtn.removeAttribute('disabled');
            console.log("[KhanTool] Tentando clicar em Verificar...");
            checkBtn.click();
        }
    }

    // Observer persistente
    const observer = new MutationObserver(() => {
        const btn = document.querySelector('button[data-test-id="exercise-check-answer"], button[data-test-id="exercise-next-question"]');
        if (btn && !btn.hasAttribute('data-hooked')) {
            btn.setAttribute('data-hooked', 'true');
            solveExercise();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Menu Flutuante
    const ui = document.createElement('div');
    ui.style.cssText = "position:fixed;top:20px;right:20px;background:#176bd7;color:white;padding:10px;border-radius:8px;z-index:99999;font-family:Arial;box-shadow:0 4px 15px rgba(0,0,0,0.5);";
    ui.innerHTML = `<b>KhanTool V2.1</b><br>Botão Cinza? <button id="forceCheck" style="background:#fff;color:#176bd7;border:none;border-radius:4px;cursor:pointer;padding:2px 5px;">Forçar Clique</button>`;
    document.body.appendChild(ui);

    document.getElementById('forceCheck').onclick = () => {
        const btn = document.querySelector('button[data-test-id="exercise-check-answer"]');
        if(btn) { 
            btn.removeAttribute('disabled');
            btn.click();
        }
    };

    console.log("KhanTool V2.1 Injetado. Se o botão continuar cinza, use o 'Forçar Clique' no menu.");
    solveExercise();
})();
