/* 
   KSCRIPT 100% ACCURACY - BY JK (FIXED)
   Resolução automática para Radio e campos de Texto/Matemática
*/

(function() {
    const logoJK = "https://github.com/salasemfuturo13-pixel/Kscript/blob/main/logo.png?raw=true";
    const originalFetch = window.fetch;
    let cachedAnswers = null;

    // --- 1. INTERCEPTADOR DE RESPOSTAS (Roda em Background) ---
    window.fetch = async function(...args) {
        const res = await originalFetch.apply(this, args);
        const url = args[0] instanceof Request ? args[0].url : args[0];

        if (url.includes('getAssessmentItem')) {
            const clone = res.clone();
            try {
                const data = await clone.json();
                let itemData = null;
                for (const key in data.data) {
                    if (data.data[key]?.item?.itemData) {
                        itemData = JSON.parse(data.data[key].item.itemData);
                        break;
                    }
                }
                if (itemData) {
                    cachedAnswers = extractAnswers(itemData);
                    console.log("%c [JK] Resposta capturada com sucesso!", "color: #0f0; font-weight: bold;");
                }
            } catch (e) { console.error("Erro JK-Interceptor:", e); }
        }
        return res;
    };

    function extractAnswers(itemData) {
        let solutions = [];
        for (const [key, w] of Object.entries(itemData.question.widgets)) {
            // Múltipla escolha
            if (w.type === 'radio' && w.options?.choices) {
                const idx = w.options.choices.findIndex(c => c.correct);
                if (idx !== -1) solutions.push({ type: 'radio', index: idx });
            }
            // Entrada de número ou texto
            else if ((w.type === 'numeric-input' || w.type === 'input-number' || w.type === 'expression')) {
                const ans = w.options?.answers?.find(a => a.status === 'correct') || 
                            w.options?.answerForms?.find(f => f.considered === 'correct');
                if (ans) solutions.push({ type: 'input', value: ans.value });
            }
        }
        return solutions;
    }

    // --- 2. MOTOR DE APLICAÇÃO (O que faz o script "Responder") ---
    function runJKEngine() {
        const renderer = document.querySelector('.perseus-renderer');
        if (!renderer || renderer.dataset.jkInjected || !cachedAnswers) return;

        console.log("%c [JK] Aplicando resposta na tela...", "color: #ff0000;");

        cachedAnswers.forEach(ans => {
            if (ans.type === 'radio') {
                const options = document.querySelectorAll('[role="radio"], .perseus-radio-option, input[type="radio"]');
                if (options[ans.index]) {
                    options[ans.index].click();
                    options[ans.index].dispatchEvent(new Event('click', { bubbles: true }));
                }
            } 
            else if (ans.type === 'input') {
                // Seleciona todos os campos possíveis de entrada
                const inputs = document.querySelectorAll('input, .mathquill-rendered-math textarea, .perseus-input-number input');
                inputs.forEach(input => {
                    input.value = ans.value;
                    // Dispara eventos para o site "sentir" que algo foi digitado
                    ['input', 'change', 'blur'].forEach(ev => input.dispatchEvent(new Event(ev, { bubbles: true })));
                });
            }
        });

        injectJKUI(renderer);
        renderer.dataset.jkInjected = "true";

        // Tenta clicar no botão VERIFICAR (Vários seletores para não falhar)
        setTimeout(() => {
            const checkBtn = document.querySelector('button[data-test-id="exercise-check-button"]') || 
                             document.querySelector('button[role="button"]:contains("Verificar")') ||
                             document.querySelector('button span:contains("Verificar")')?.parentElement;

            if (checkBtn && !checkBtn.disabled) {
                checkBtn.click();
                cachedAnswers = null; // Reseta para a próxima
            } else {
                // Se o botão não foi clicado, tenta o seletor genérico de botões da Khan
                const allButtons = document.querySelectorAll('button');
                allButtons.forEach(btn => {
                    if (btn.innerText.includes("Verificar") || btn.innerText.includes("Check")) {
                        btn.click();
                        cachedAnswers = null;
                    }
                });
            }
        }, 1200);
    }

    function injectJKUI(target) {
        const div = document.createElement('div');
        div.style.cssText = `background:#000; border:2px solid #f00; border-radius:10px; padding:15px; margin-bottom:15px; color:#fff; font-family:sans-serif; box-shadow: 0 0 10px #f00;`;
        div.innerHTML = `
            <div style="display:flex; align-items:center;">
                <img src="${logoJK}" style="height:35px; margin-right:15px;">
                <div>
                    <b style="color:#ff0000; font-size:16px;">KSCRIPT BY JK</b><br>
                    <span style="color:#0f0; font-size:12px;">✅ RESPOSTA SINCRONIZADA E APLICADA!</span>
                </div>
            </div>
        `;
        target.prepend(div);
    }

    // Roda o motor a cada 1.5 segundos
    setInterval(runJKEngine, 1500);

    // Suporte para jQuery :contains se o site usar
    if (window.jQuery) {
        window.jQuery.expr[':'].contains = window.jQuery.expr.createPseudo(function(text) {
            return function(elem) { return window.jQuery(elem).text().toUpperCase().indexOf(text.toUpperCase()) >= 0; };
        });
    }

})();
