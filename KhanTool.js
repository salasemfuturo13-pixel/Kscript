/* 
    🔴 KhanScript v2.0 - ELITE EDITION (PERFEITO)
    Fusão de: Interceptação Real + Emulação React + Ghost Mode Anti-Ban.
    Desenvolvido estrategicamente por JK 
*/

(async function() {
    // 1. Identidade e Configurações
    const logoUrl = "https://raw.githubusercontent.com/salasemfuturo13-pixel/logo-do-khanscript/refs/heads/main/logo.png";
    const scriptName = "KhanScript";
    const devName = "JK";

    window.features = { autoAnswer: true, darkMode: true };
    window.currentAnswer = null;
    window.isSolving = false;

    // 2. O CÉREBRO: Interceptação Silenciosa de Dados (Sem Dicas)
    const originalFetch = window.fetch;
    window.fetch = async function () {
        const response = await originalFetch.apply(this, arguments);
        if (arguments[0] && arguments[0].includes("getAssessmentItem")) {
            const clone = response.clone();
            clone.json().then(obj => {
                try {
                    const itemData = JSON.parse(obj.data.assessmentItem.item.itemData);
                    window.currentAnswer = null;
                    window.isSolving = false; // Reseta para nova questão

                    for (let key in itemData.question.widgets) {
                        const widget = itemData.question.widgets[key];
                        // Captura Múltipla Escolha
                        if (widget.options?.choices) {
                            window.currentAnswer = { type: 'radio', value: widget.options.choices.findIndex(c => c.correct) };
                        }
                        // Captura Escrita (Texto, Número ou Expressão)
                        if (widget.options?.answers) {
                            window.currentAnswer = { type: 'input', value: widget.options.answers[0].value };
                        } else if (widget.options?.answer) {
                            window.currentAnswer = { type: 'input', value: widget.options.answer };
                        }
                    }
                    console.log(`[${scriptName}] Dados capturados com sucesso! ✅`);
                } catch(e) {}
            });
        }
        return response;
    };

    // 3. O CORPO: Emulação de Interação Humana e React
    async function solveQuestion() {
        if (!window.features.autoAnswer || !window.currentAnswer || window.isSolving) return;

        window.isSolving = true;
        
        // ATRASO HUMANO (Atraso aleatório entre 2 e 4 segundos para evitar o erro "Algo deu errado")
        const delay = Math.floor(Math.random() * 2000) + 2000;
        await new Promise(r => setTimeout(r, delay));

        // EXECUÇÃO: RÁDIO (CLIQUE)
        if (window.currentAnswer.type === 'radio') {
            const choices = document.querySelectorAll('[data-testid^="choice-icon"], font-size: 0, [role="radio"]');
            if (choices[window.currentAnswer.value]) {
                choices[window.currentAnswer.value].click();
            }
        }

        // EXECUÇÃO: INPUT (ESCRITA COM EMULAÇÃO REACT)
        if (window.currentAnswer.type === 'input') {
            const input = document.querySelector('input[type="text"], input[type="number"], .perseus-input-number, textarea');
            if (input) {
                input.focus();
                // Força a entrada no estado interno do React
                const nativeValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                nativeValueSetter.call(input, window.currentAnswer.value);
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
                await new Promise(r => setTimeout(r, 500));
                input.blur();
            }
        }

        // ESPERA ANTES DE ENVIAR (Simula o tempo de clicar no botão Verificar)
        await new Promise(r => setTimeout(r, 1000));

        const btns = document.querySelectorAll('button');
        for (const btn of btns) {
            const txt = btn.innerText.toLowerCase();
            const keywords = ["verificar", "próximo", "check", "next", "continuar", "pular", "resumo"];
            if (keywords.some(k => txt.includes(k)) && !btn.disabled) {
                btn.click();
                break; // Clica em um por vez para não bugar o servidor
            }
        }

        // TRAVA DE SEGURANÇA (Evita loop infinito na mesma questão)
        setTimeout(() => { window.isSolving = false; }, 4000);
    }

    // 4. A ALMA: UI Vermelha e Inicialização
    const style = document.createElement('style');
    style.innerHTML = `
        .ks-toggle { position: fixed; top: 15px; left: 15px; width: 45px; height: 45px; background: #000; border: 2px solid #f00; border-radius: 50%; display: flex; align-items: center; justify-content: center; z-index: 1000000; cursor: pointer; box-shadow: 0 0 15px #f00; }
        .ks-status { position: fixed; bottom: 15px; left: 15px; background: rgba(0,0,0,0.9); border: 1px solid #f00; padding: 6px 15px; border-radius: 20px; color: #fff; font-size: 11px; font-family: Arial; z-index: 1000000; box-shadow: 0 0 10px #f00; }
    `;
    document.head.appendChild(style);

    const splash = document.createElement('div');
    splash.style = "position:fixed;top:0;left:0;width:100%;height:100%;background:#000;display:flex;align-items:center;justify-content:center;z-index:9999999;flex-direction:column;font-family:Arial;";
    splash.innerHTML = `<img src="${logoUrl}" style="width:120px; filter:drop-shadow(0 0 15px #f00); animation: pulse 1s infinite;"><h1 style="color:#f00; margin-top:20px; letter-spacing:5px;">${scriptName.toUpperCase()}</h1><p style="color:#666;">Ultimate v2.0 by ${devName}</p><style>@keyframes pulse{0%{scale:1}50%{scale:1.1}100%{scale:1}}</style>`;
    document.body.appendChild(splash);

    setTimeout(() => {
        splash.remove();
        
        // Botão de Controle Dinâmico
        const toggle = document.createElement('div');
        toggle.className = "ks-toggle";
        toggle.innerHTML = `<img src="${logoUrl}" width="25">`;
        toggle.onclick = () => { window.features.autoAnswer = !window.features.autoAnswer; toggle.style.borderColor = window.features.autoAnswer ? "#f00" : "#444"; };
        document.body.appendChild(toggle);

        const status = document.createElement('div');
        status.className = "ks-status";
        setInterval(() => { status.innerHTML = `<span style="color:#f00">●</span> ${scriptName.toUpperCase()} | ${window.features.autoAnswer ? 'LISTO' : 'PAUSADO'}`; }, 1000);
        document.body.appendChild(status);

        // Inicia Loop de Resolução
        setInterval(solveQuestion, 2000);

        // Ativa Dark Reader com Fix para CORS
        (async () => {
            const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js';
            s.onload = () => { DarkReader.setFetchMethod(window.fetch); DarkReader.enable({brightness: 100, contrast: 95}); };
            document.head.appendChild(s);
        })();

        console.log(`[${scriptName}] Master Script Conectado. 🔴`);
    }, 3000);

})();
