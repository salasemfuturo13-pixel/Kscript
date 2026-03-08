/* 
    🔴 KhanScript v1.6 - REACT EMULATOR (AUTO-RESPONSE REAL)
    Capta a resposta do servidor e simula interação humana no React.
    Desenvolvido estrategicamente por JK 
*/

(async function() {
    const logoUrl = "https://raw.githubusercontent.com/salasemfuturo13-pixel/logo-do-khanscript/refs/heads/main/logo.png";
    const scriptName = "KhanScript";
    const devName = "JK";

    window.features = { autoAnswer: true };
    window.currentAnswer = null;

    // 1. INTERCEPTADOR DE DADOS (Pega a resposta real no tráfego)
    const originalFetch = window.fetch;
    window.fetch = async function () {
        const response = await originalFetch.apply(this, arguments);
        if (arguments[0] && arguments[0].includes("getAssessmentItem")) {
            const clone = response.clone();
            clone.json().then(obj => {
                try {
                    const itemData = JSON.parse(obj.data.assessmentItem.item.itemData);
                    window.currentAnswer = null;
                    for (let key in itemData.question.widgets) {
                        const widget = itemData.question.widgets[key];
                        // Resposta de Múltipla Escolha
                        if (widget.options?.choices) {
                            window.currentAnswer = { type: 'radio', value: widget.options.choices.findIndex(c => c.correct) };
                        }
                        // Resposta de Escrever (Texto ou Número)
                        if (widget.options?.answers) {
                            window.currentAnswer = { type: 'input', value: widget.options.answers[0].value };
                        } else if (widget.options?.answer) {
                            window.currentAnswer = { type: 'input', value: widget.options.answer };
                        }
                    }
                    console.log(`[${scriptName}] Resposta capturada: `, window.currentAnswer);
                } catch(e) {}
            });
        }
        return response;
    };

    // 2. EMULADOR DE INTERAÇÃO (Faz o site aceitar a resposta)
    function simulateInteraction() {
        if (!window.features.autoAnswer || !window.currentAnswer) return;

        // Caso seja de clicar (Radio)
        if (window.currentAnswer.type === 'radio') {
            const choices = document.querySelectorAll('[data-testid^="choice-icon"], font-size: 0');
            if (choices[window.currentAnswer.value]) {
                choices[window.currentAnswer.value].click();
            }
        }

        // Caso seja de escrever (Input)
        if (window.currentAnswer.type === 'input') {
            const inputs = document.querySelectorAll('input[type="text"], input[type="number"], .perseus-input-number, textarea');
            inputs.forEach(input => {
                if (input.value !== String(window.currentAnswer.value)) {
                    // O SEGREDO: Simular a alteração interna do React
                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                    nativeInputValueSetter.call(input, window.currentAnswer.value);
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });
        }

        // Clica no botão de Verificar/Próximo
        const btns = document.querySelectorAll('button');
        btns.forEach(btn => {
            const txt = btn.innerText.toLowerCase();
            const keywords = ["verificar", "próximo", "check", "next", "continuar", "pular", "resumo"];
            if (keywords.some(k => txt.includes(k)) && !btn.disabled) {
                btn.click();
            }
        });
    }

    // 3. UI E INICIALIZADOR
    const splash = document.createElement('div');
    splash.style = "position:fixed;top:0;left:0;width:100%;height:100%;background:#000;display:flex;align-items:center;justify-content:center;z-index:999999;flex-direction:column;font-family:Arial;";
    splash.innerHTML = `<img src="${logoUrl}" style="width:120px; filter:drop-shadow(0 0 15px #f00); animation: pulse 1s infinite;"><h1 style="color:#f00; margin-top:20px;">${scriptName.toUpperCase()}</h1><p style="color:#666">By ${devName}</p><style>@keyframes pulse{0%{scale:1}50%{scale:1.1}100%{scale:1}}</style>`;
    document.body.appendChild(splash);

    setTimeout(() => {
        splash.remove();
        // Menu de toggle (Pequeno)
        const btn = document.createElement('div');
        btn.style = "position:fixed; top:15px; left:15px; width:45px; height:45px; background:#000; border:2px solid #f00; border-radius:50%; z-index:100000; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 0 10px #f00;";
        btn.innerHTML = `<img src="${logoUrl}" width="25">`;
        btn.onclick = () => { window.features.autoAnswer = !window.features.autoAnswer; btn.style.borderColor = window.features.autoAnswer ? "#f00" : "#555"; };
        document.body.appendChild(btn);

        // Loop de execução agressiva
        setInterval(simulateInteraction, 1500);
        console.log(`[${scriptName}] Ativado por ${devName}`);
    }, 3000);

})();
