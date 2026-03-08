/* 
    🔴 KhanScript v1.7 - GHOST MODE (ANTI-DETECTION)
    Simula atraso humano e foco real para burlar o bloqueio do servidor.
    Desenvolvido estrategicamente por JK 
*/

(async function() {
    const logoUrl = "https://raw.githubusercontent.com/salasemfuturo13-pixel/logo-do-khanscript/refs/heads/main/logo.png";
    const scriptName = "KhanScript";
    const devName = "JK";

    window.features = { autoAnswer: true };
    window.currentAnswer = null;
    window.isProcessing = false;

    // 1. INTERCEPTADOR SILENCIOSO
    const originalFetch = window.fetch;
    window.fetch = async function () {
        const response = await originalFetch.apply(this, arguments);
        if (arguments[0] && arguments[0].includes("getAssessmentItem")) {
            const clone = response.clone();
            clone.json().then(obj => {
                try {
                    const itemData = JSON.parse(obj.data.assessmentItem.item.itemData);
                    window.currentAnswer = null;
                    window.isProcessing = false; // Reseta para nova questão
                    for (let key in itemData.question.widgets) {
                        const widget = itemData.question.widgets[key];
                        if (widget.options?.choices) {
                            window.currentAnswer = { type: 'radio', value: widget.options.choices.findIndex(c => c.correct) };
                        }
                        if (widget.options?.answers) {
                            window.currentAnswer = { type: 'input', value: widget.options.answers[0].value };
                        } else if (widget.options?.answer) {
                            window.currentAnswer = { type: 'input', value: widget.options.answer };
                        }
                    }
                } catch(e) {}
            });
        }
        return response;
    };

    // 2. SIMULADOR HUMANO (O SEGREDO ANTI-BLOQUEIO)
    async function ghostInteraction() {
        if (!window.features.autoAnswer || !window.currentAnswer || window.isProcessing) return;

        window.isProcessing = true;
        
        // Atraso Aleatório (1 a 3 segundos) para parecer humano
        const humanDelay = Math.floor(Math.random() * 2000) + 1500;
        await new Promise(r => setTimeout(r, humanDelay));

        // Caso RADIO (Múltipla Escolha)
        if (window.currentAnswer.type === 'radio') {
            const choices = document.querySelectorAll('[data-testid^="choice-icon"], [role="radio"]');
            if (choices[window.currentAnswer.value]) {
                choices[window.currentAnswer.value].click();
            }
        }

        // Caso INPUT (Escrita)
        if (window.currentAnswer.type === 'input') {
            const input = document.querySelector('input[type="text"], input[type="number"], .perseus-input-number, textarea');
            if (input) {
                input.focus(); // Simula o clique do usuário na caixa
                await new Promise(r => setTimeout(r, 500));
                
                const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                setter.call(input, window.currentAnswer.value);
                
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
                input.blur(); // Remove o foco
            }
        }

        // Espera mais um pouco antes de verificar
        await new Promise(r => setTimeout(r, 800));

        const btns = document.querySelectorAll('button');
        for (const btn of btns) {
            const txt = btn.innerText.toLowerCase();
            const keywords = ["verificar", "próximo", "check", "next", "continuar", "pular", "resumo"];
            if (keywords.some(k => txt.includes(k)) && !btn.disabled) {
                btn.click();
                break; // Clica em apenas um botão por vez
            }
        }
        
        // Libera para a próxima questão após um tempo de segurança
        setTimeout(() => { window.isProcessing = false; }, 3000);
    }

    // 3. UI E INICIALIZADOR
    const splash = document.createElement('div');
    splash.style = "position:fixed;top:0;left:0;width:100%;height:100%;background:#000;display:flex;align-items:center;justify-content:center;z-index:999999;flex-direction:column;font-family:Arial;";
    splash.innerHTML = `<img src="${logoUrl}" style="width:100px; filter:drop-shadow(0 0 10px #f00);"><h2 style="color:#f00; margin-top:15px;">KHANSCRIPT GHOST V1.7</h2>`;
    document.body.appendChild(splash);

    setTimeout(() => {
        splash.remove();
        const btn = document.createElement('div');
        btn.style = "position:fixed; top:15px; left:15px; width:40px; height:40px; background:#000; border:2px solid #f00; border-radius:50%; z-index:100000; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow: 0 0 10px #f00;";
        btn.innerHTML = `<img src="${logoUrl}" width="20">`;
        btn.onclick = () => { window.features.autoAnswer = !window.features.autoAnswer; btn.style.borderColor = window.features.autoAnswer ? "#f00" : "#444"; };
        document.body.appendChild(btn);

        setInterval(ghostInteraction, 2000);
        console.log("KhanScript Ghost by JK Rodando silenciosamente... 🔴");
    }, 2500);

})();
