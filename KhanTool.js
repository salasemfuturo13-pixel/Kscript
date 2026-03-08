/* 
    🔴 KhanScript v2.1 - FIX CARREGAMENTO INFINITO
    Processamento assíncrono para não travar o site.
    Desenvolvido estrategicamente por JK 
*/

(async function() {
    const logoUrl = "https://raw.githubusercontent.com/salasemfuturo13-pixel/logo-do-khanscript/refs/heads/main/logo.png";
    const scriptName = "KhanScript";
    const devName = "JK";

    window.features = { autoAnswer: true };
    window.currentAnswer = null;
    window.isSolving = false;

    // 1. INTERCEPTADOR "GHOST" (Não trava o Fetch original)
    const originalFetch = window.fetch;
    window.fetch = async function () {
        const response = await originalFetch.apply(this, arguments);
        
        // Verifica se é o pacote de dados da questão
        if (arguments[0] && arguments[0].includes("getAssessmentItem")) {
            const clone = response.clone(); // Clona para processar sem travar a original
            clone.json().then(obj => {
                try {
                    const itemData = JSON.parse(obj.data.assessmentItem.item.itemData);
                    window.currentAnswer = null;
                    window.isSolving = false;

                    for (let key in itemData.question.widgets) {
                        const widget = itemData.question.widgets[key];
                        // Múltipla Escolha
                        if (widget.options?.choices) {
                            window.currentAnswer = { type: 'radio', value: widget.options.choices.findIndex(c => c.correct) };
                        }
                        // Escrita
                        if (widget.options?.answers) {
                            window.currentAnswer = { type: 'input', value: widget.options.answers[0].value };
                        } else if (widget.options?.answer) {
                            window.currentAnswer = { type: 'input', value: widget.options.answer };
                        }
                    }
                    console.log(`[${scriptName}] Resposta capturada! 🔴`);
                } catch(e) {}
            }).catch(()=>{}); 
        }
        return response; // Retorna a resposta original na hora para evitar o load infinito
    };

    // 2. EXECUTOR HUMANO (Atraso de Segurança)
    async function solve() {
        if (!window.features.autoAnswer || !window.currentAnswer || window.isSolving) return;
        
        const nextBtn = document.querySelector('[data-testid="exercise-check-answer"], [data-testid="exercise-next-question"], button.exercise-check-answer');
        if (!nextBtn) return; // Só age se estiver na tela de exercício

        window.isSolving = true;
        await new Promise(r => setTimeout(r, 2500)); // Espera 2.5s (Humano)

        // Clique para Radio
        if (window.currentAnswer.type === 'radio') {
            const choices = document.querySelectorAll('[data-testid^="choice-icon"], [role="radio"]');
            if (choices[window.currentAnswer.value]) choices[window.currentAnswer.value].click();
        }

        // Escrita para Input
        if (window.currentAnswer.type === 'input') {
            const input = document.querySelector('input[type="text"], input[type="number"], .perseus-input-number, textarea');
            if (input) {
                input.focus();
                const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                setter.call(input, window.currentAnswer.value);
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
                input.blur();
            }
        }

        await new Promise(r => setTimeout(r, 1000));

        // Clica nos botões (Check/Next)
        document.querySelectorAll('button').forEach(btn => {
            const txt = btn.innerText.toLowerCase();
            const keys = ["verificar", "próximo", "check", "next", "continuar"];
            if (keys.some(k => txt.includes(k)) && !btn.disabled) btn.click();
        });

        setTimeout(() => { window.isSolving = false; }, 3000);
    }

    // 3. UI E START
    const splash = document.createElement('div');
    splash.style = "position:fixed;top:0;left:0;width:100%;height:100%;background:#000;display:flex;align-items:center;justify-content:center;z-index:9999999;flex-direction:column;";
    splash.innerHTML = `<img src="${logoUrl}" style="width:100px; filter:drop-shadow(0 0 10px #f00);"><h2 style="color:#f00; font-family:Arial; margin-top:20px;">KHANSCRIPT V2.1</h2>`;
    document.body.appendChild(splash);

    setTimeout(() => {
        splash.remove();
        const toggle = document.createElement('div');
        toggle.style = "position:fixed; top:15px; left:15px; width:45px; height:45px; background:#000; border:2px solid #f00; border-radius:50%; z-index:100000; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 0 10px #f00;";
        toggle.innerHTML = `<img src="${logoUrl}" width="25">`;
        toggle.onclick = () => { window.features.autoAnswer = !window.features.autoAnswer; toggle.style.borderColor = window.features.autoAnswer ? "#f00" : "#444"; };
        document.body.appendChild(toggle);

        setInterval(solve, 2000);
        console.log(`[${scriptName}] ONLINE - Fix Load`);
    }, 2500);

})();
