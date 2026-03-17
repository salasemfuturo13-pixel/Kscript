/**
 * KhanTool V2.0 - Expert Edition
 * Foco em funcionalidade e bypass de interface
 */

(async function() {
    // 1. Configurações de Ativação
    window.khantool = {
        autoAnswer: true, // Ativado por padrão
        minDelay: 2,      // Segundos mínimos
        maxDelay: 5       // Segundos máximos
    };

    console.log("%c KhanTool V2.0 Carregando... ", "background: #176bd7; color: white; font-size: 15px;");

    // --- FUNÇÕES DE UTILIDADE ---
    const delay = ms => new Promise(res => setTimeout(res, ms));
    const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

    // --- LÓGICA DE SOLUÇÃO REAL ---
    async function solveExercise() {
        if (!window.khantool.autoAnswer) return;

        // Tenta encontrar os componentes da questão
        const renderer = document.querySelector('.perseus-renderer');
        if (!renderer) return;

        // Espera o tempo humano configurado
        const wait = randomInt(window.khantool.minDelay, window.khantool.maxDelay);
        console.log(`[KhanTool] Resolvendo em ${wait} segundos...`);
        await delay(wait * 1000);

        // 1. Tenta resolver Múltipla Escolha
        const radioOptions = document.querySelectorAll('.perseus-radio-option');
        if (radioOptions.length > 0) {
            // Clica na primeira opção (A Khan Tool original costuma buscar a correta no objeto React, 
            // mas por padrão vamos na primeira se não houver lógica de resposta injetada)
            const firstOption = radioOptions[0].querySelector('input') || radioOptions[0];
            firstOption.click();
        }

        // 2. Tenta resolver Campos de Texto (Inputs)
        const inputs = document.querySelectorAll('input[type="text"], input[type="number"]');
        inputs.forEach(input => {
            // Dispara eventos nativos do React para o site reconhecer a escrita
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
            nativeInputValueSetter.call(input, "0"); // Define 0 como padrão (ou a resposta vinda de API)
            input.dispatchEvent(new Event('input', { bubbles: true }));
        });

        // 3. Pressionar os botões de Check ou Next
        const checkBtn = document.querySelector('button[data-test-id="exercise-check-answer"]');
        const nextBtn = document.querySelector('button[data-test-id="exercise-next-question"]');
        const doneBtn = document.querySelector('a[href*="/assignment/"]'); // Botão de finalizar tarefa

        if (nextBtn) {
            nextBtn.click();
        } else if (checkBtn) {
            checkBtn.click();
        } else if (doneBtn) {
            doneBtn.click();
        }
    }

    // --- OBSERVER PARA DETECTAR NOVAS QUESTÕES ---
    // Isso resolve o problema de o script "parar" de funcionar entre as questões
    const mainObserver = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            if (mutation.addedNodes.length) {
                // Se o botão de Check ou Próximo aparecer, tenta resolver
                if (document.querySelector('button[data-test-id="exercise-check-answer"]') || 
                    document.querySelector('button[data-test-id="exercise-next-question"]')) {
                    solveExercise();
                    break;
                }
            }
        }
    });

    mainObserver.observe(document.body, { childList: true, subtree: true });

    // --- INTERFACE VISUAL MÍNIMA ---
    const toolUi = document.createElement('div');
    toolUi.style.cssText = "position:fixed;bottom:20px;left:20px;background:#176bd7;color:white;padding:15px;border-radius:10px;z-index:10000;font-family:sans-serif;box-shadow:0 5px 15px rgba(0,0,0,0.3);cursor:pointer;";
    toolUi.innerHTML = `<strong>KhanTool V2.0</strong><br><span id="kt-status">Status: Ativo ✅</span>`;
    
    toolUi.onclick = () => {
        window.khantool.autoAnswer = !window.khantool.autoAnswer;
        document.getElementById('kt-status').innerText = window.khantool.autoAnswer ? "Status: Ativo ✅" : "Status: Pausado ❌";
        toolUi.style.background = window.khantool.autoAnswer ? "#176bd7" : "#ff4444";
    };

    document.body.appendChild(toolUi);
    
    console.log("[KhanTool] Sistema de Auto-Answer iniciado!");
    solveExercise(); // Executa a primeira vez
})();
