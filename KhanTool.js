/* 
    🔴 KhanScript v1.4 - MODO INVENCÍVEL (DICA-SCRAPER)
    Desenvolvido estrategicamente por JK 
*/

(async function() {
    const logoUrl = "https://raw.githubusercontent.com/salasemfuturo13-pixel/logo-do-khanscript/refs/heads/main/logo.png";
    const scriptName = "KhanScript";
    const devName = "JK";

    window.features = { autoAnswer: true, muteAudio: false };

    const menu = document.createElement('div');
    const style = document.createElement('style');
    style.innerHTML = `
        .ks-menu { position: fixed; top: 80px; left: 20px; width: 230px; background: rgba(10,10,10,0.98); border: 2px solid #f00; border-radius: 12px; padding: 15px; z-index: 1000000; color: white; display: none; font-family: Arial; box-shadow: 0 0 20px #f00; }
        .ks-header { display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #400; padding-bottom: 10px; margin-bottom: 15px; font-weight: 800; color: #f00; }
        .ks-toggle-btn { position: fixed; top: 15px; left: 15px; z-index: 1000001; cursor: pointer; background: #000; border: 2px solid #f00; border-radius: 50%; width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px #f00; }
        .ks-item { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 13px; }
    `;
    document.head.appendChild(style);

    function buildUI() {
        menu.className = "ks-menu";
        menu.innerHTML = `<div class="ks-header"><img src="${logoUrl}" width="30">${scriptName}</div>
            <div class="ks-item">Auto-Responder Real <input type="checkbox" checked onchange="window.features.autoAnswer = this.checked"></div>
            <p style="font-size:10px; color:#666; text-align:center;">Power by ${devName}</p>`;
        document.body.appendChild(menu);
        const btn = document.createElement('div');
        btn.className = "ks-toggle-btn"; btn.innerHTML = `<img src="${logoUrl}" width="25">`;
        btn.onclick = () => menu.style.display = menu.style.display === "none" ? "block" : "none";
        document.body.appendChild(btn);
    }

    // 🤖 O MOTOR DE BUSCA DE RESPOSTAS REAIS (Via GraphQL)
    async function getCorrectAnswer() {
        const originalFetch = window.fetch;
        window.fetch = async function (input, init) {
            const res = await originalFetch.apply(this, arguments);
            if (input.url && input.url.includes("getAssessmentItem")) {
                const clone = res.clone();
                try {
                    let obj = await clone.json();
                    let itemData = JSON.parse(obj.data.assessmentItem.item.itemData);
                    
                    // Extrai a resposta real oculta no JSON do servidor
                    window.currentAnswer = null;
                    for (let key in itemData.question.widgets) {
                        let widget = itemData.question.widgets[key];
                        // Para Radio (Múltipla Escolha)
                        if (widget.options.choices) {
                            window.currentAnswer = widget.options.choices.findIndex(c => c.correct);
                        }
                        // Para Escrita (Numerico)
                        if (widget.options.answers) {
                            window.currentAnswer = widget.options.answers[0].value;
                        }
                    }
                    console.log("[KhanScript] Resposta capturada: ", window.currentAnswer);
                } catch(e) {}
            }
            return res;
        };
    }

    // 🚀 MOTOR DE EXECUÇÃO (Clicks e Digitação)
    function runAutoMode() {
        setInterval(() => {
            if (!window.features.autoAnswer) return;

            // 1. Se for Múltipla Escolha
            if (typeof window.currentAnswer === 'number') {
                const choices = document.querySelectorAll('[data-testid^="choice-icon"], [role="radio"]');
                if (choices[window.currentAnswer]) {
                    choices[window.currentAnswer].click();
                }
            }

            // 2. Se for de Escrever
            if (typeof window.currentAnswer === 'string' || (typeof window.currentAnswer === 'number' && !document.querySelector('[role="radio"]'))) {
                const inputs = document.querySelectorAll('input[type="text"], input[type="number"], .perseus-input-number');
                inputs.forEach(input => {
                    input.value = window.currentAnswer;
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                });
            }

            // 3. Clica no botão de Verificar/Próximo
            const btns = document.querySelectorAll('button');
            btns.forEach(btn => {
                const txt = btn.innerText.toLowerCase();
                const ready = ["verificar", "próximo", "check", "next", "continuar", "pular"];
                if (ready.some(k => txt.includes(k)) && !btn.disabled) {
                    btn.click();
                }
            });
        }, 2000);
    }

    // Splash Screen e Start
    const splash = document.createElement('div');
    splash.style = "position:fixed;top:0;left:0;width:100%;height:100%;background:#000;display:flex;align-items:center;justify-content:center;z-index:9999999;flex-direction:column;font-family:Arial;";
    splash.innerHTML = `<img src="${logoUrl}" style="width:120px; filter:drop-shadow(0 0 15px #f00); animation: pulse 1s infinite;"><h1 style="color:#f00; margin-top:20px;">KHANSCRIPT V1.4</h1><style>@keyframes pulse{0%{scale:1}50%{scale:1.1}100%{scale:1}}</style>`;
    document.body.appendChild(splash);

    setTimeout(() => {
        splash.remove();
        buildUI();
        getCorrectAnswer();
        runAutoMode();
    }, 3000);
})();
