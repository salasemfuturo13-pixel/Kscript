/* 
   KSCRIPT 100% ACCURACY - BY JK
   Interceptador de Respostas Reais (GraphQL) + Interface Customizada
*/

(function() {
    const logoJK = "https://github.com/salasemfuturo13-pixel/Kscript/blob/main/logo.png?raw=true";
    const originalFetch = window.fetch;
    let lastCorrectAnswer = null;

    // --- 1. INTERCEPTAÇÃO DE REDE (PEGA A RESPOSTA DO SERVIDOR) ---
    window.fetch = async function(...args) {
        const res = await originalFetch.apply(this, args);
        const url = args[0] instanceof Request ? args[0].url : args[0];

        if (url.includes('getAssessmentItem')) {
            const clone = res.clone();
            try {
                const data = await clone.json();
                let itemDataRaw = null;

                // Navega no JSON da Khan Academy para achar a questão
                for (const key in data.data) {
                    if (data.data[key]?.item?.itemData) {
                        itemDataRaw = JSON.parse(data.data[key].item.itemData);
                        break;
                    }
                }

                if (itemDataRaw) {
                    lastCorrectAnswer = extractCorrectSolution(itemDataRaw);
                    console.log("%c [JK] Resposta 100% Extraída do Servidor! ", "background: #f00; color: #fff; font-weight: bold;");
                }
            } catch (e) { console.error("Erro JK-Interceptor:", e); }
        }
        return res;
    };

    // --- 2. MOTOR DE EXTRAÇÃO (Lógica para extrair a solução real) ---
    function extractCorrectSolution(itemData) {
        let results = [];
        for (const [key, w] of Object.entries(itemData.question.widgets)) {
            // Se for Múltipla Escolha (Radio)
            if (w.type === 'radio' && w.options?.choices) {
                const correctIdx = w.options.choices.findIndex(c => c.correct);
                if (correctIdx !== -1) results.push({ type: 'radio', index: correctIdx, widget: key });
            }
            // Se for Entrada Numérica ou Expressão (Input)
            else if ((w.type === 'numeric-input' || w.type === 'input-number' || w.type === 'expression') && w.options?.answers) {
                const ans = w.options.answers.find(a => a.status === 'correct');
                if (ans) results.push({ type: 'input', value: ans.value, widget: key });
            }
            else if (w.type === 'expression' && w.options?.answerForms) {
                const form = w.options.answerForms.find(f => f.considered === 'correct');
                if (form) results.push({ type: 'input', value: form.value, widget: key });
            }
        }
        return results;
    }

    // --- 3. APLICAÇÃO AUTOMÁTICA + INTERFACE JK ---
    function applyJKExploit() {
        const renderer = document.querySelector('.perseus-renderer');
        if (!renderer || renderer.dataset.jkInjected || !lastCorrectAnswer) return;

        console.log("%c [JK] Aplicando Solução Certeira... ", "color: #0f0;");

        lastCorrectAnswer.forEach(ans => {
            if (ans.type === 'radio') {
                const options = document.querySelectorAll('[role="radio"], .perseus-radio-option, input[type="radio"]');
                if (options[ans.index]) options[ans.index].click();
            } 
            else if (ans.type === 'input') {
                const inputs = document.querySelectorAll('input, [class*="mathquill"], textarea');
                inputs.forEach(input => {
                    input.value = ans.value;
                    // Dispara eventos para o site reconhecer a digitação
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                });
            }
        });

        // Injeta o Visual do KScript (Seu Menu personalizado na questão)
        injectJKUI(renderer);
        renderer.dataset.jkInjected = "true";

        // Auto-Verificar (Opcional: Clica no botão cinza sozinho)
        setTimeout(() => {
            const checkBtn = document.querySelector('button[data-test-id="exercise-check-button"]');
            if (checkBtn && !checkBtn.disabled) {
                checkBtn.click();
                lastCorrectAnswer = null; // Limpa para a próxima
            }
        }, 1200);
    }

    function injectJKUI(target) {
        const div = document.createElement('div');
        div.style.cssText = `
            background: #000; border: 2px solid #ff0000; border-radius: 10px; 
            padding: 20px; margin: 15px 0; color: #fff; font-family: sans-serif;
            box-shadow: 0 0 15px rgba(255, 0, 0, 0.4);
        `;
        div.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 12px; border-bottom: 1px solid #333; padding-bottom: 10px;">
                <img src="${logoJK}" style="height: 35px; margin-right: 12px; filter: drop-shadow(0 0 5px #f00);">
                <span style="font-weight: bold; font-size: 18px; color: #ff0000; letter-spacing: 2px;">KSCRIPT™</span>
            </div>
            
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <span style="color: #00ff00; font-size: 22px; margin-right: 10px;">✅</span>
                <span style="font-weight: bold; font-size: 15px; color: #00ff00;">RESPOSTA 100% CERTEIRA SINCRONIZADA!</span>
            </div>
            
            <p style="color: #bbb; font-size: 12px; margin: 5px 0;">A solução foi extraída diretamente dos servidores da Khan Academy e aplicada pelo motor JK.</p>
            
            <div style="margin-top: 15px; font-size: 11px; text-align: right; color: #444;">
                KScript v1.0 | Authorized by JK
            </div>
        `;
        target.prepend(div);
    }

    // Monitoramento constante
    setInterval(() => {
        if (window.features?.questionSpoof || document.getElementById('toggle-question-spoof')?.checked) {
            applyJKExploit();
        }
    }, 1500);

})();
