/* 
    🔴 KhanScript v1.5 - INVISÍVEL & INFALÍVEL
    Capta a resposta real do tráfego de dados sem usar dicas.
    Desenvolvido estrategicamente por JK 
*/

(async function() {
    const logoUrl = "https://raw.githubusercontent.com/salasemfuturo13-pixel/logo-do-khanscript/refs/heads/main/logo.png";
    const scriptName = "KhanScript";
    const devName = "JK";

    window.features = { autoAnswer: true };
    window.lastCapturedAnswer = null;

    // 1. O Cérebro: Interceptação de Dados em Tempo Real
    const originalFetch = window.fetch;
    window.fetch = async function (input, init) {
        const response = await originalFetch.apply(this, arguments);
        
        // Verifica se é o pacote de dados da questão
        if (input.url && input.url.includes("getAssessmentItem")) {
            const clone = response.clone();
            clone.json().then(obj => {
                try {
                    const itemData = JSON.parse(obj.data.assessmentItem.item.itemData);
                    window.lastCapturedAnswer = null;

                    // Procura a resposta dentro de qualquer tipo de widget (Radio ou Input)
                    for (let key in itemData.question.widgets) {
                        const widget = itemData.question.widgets[key];
                        
                        // Caso 1: Múltipla Escolha (Radio)
                        if (widget.options && widget.options.choices) {
                            window.lastCapturedAnswer = {
                                type: 'radio',
                                index: widget.options.choices.findIndex(c => c.correct)
                            };
                        }
                        
                        // Caso 2: Digitar (Numeric Input / Expression)
                        if (widget.options && widget.options.answers) {
                            window.lastCapturedAnswer = {
                                type: 'input',
                                value: widget.options.answers[0].value
                            };
                        } else if (widget.options && widget.options.answer) {
                            window.lastCapturedAnswer = {
                                type: 'input',
                                value: widget.options.answer
                            };
                        }
                    }
                    console.log(`[${scriptName}] Resposta capturada do servidor! 🔴`);
                } catch(e) {}
            });
        }
        return response;
    };

    // 2. O Mão na Massa: Execução Automática
    function runAutoBot() {
        setInterval(() => {
            if (!window.features.autoAnswer || !window.lastCapturedAnswer) return;

            // Se for Múltipla Escolha: Procura o ícone e clica no índice certo
            if (window.lastCapturedAnswer.type === 'radio') {
                const choices = document.querySelectorAll('[data-testid^="choice-icon"], [role="radio"], ._1udzurba');
                if (choices[window.lastCapturedAnswer.index]) {
                    choices[window.lastCapturedAnswer.index].click();
                }
            }

            // Se for de Escrever: Localiza o input e injeta o valor real
            if (window.lastCapturedAnswer.type === 'input') {
                const inputs = document.querySelectorAll('input[type="text"], input[type="number"], .perseus-input-number, textarea');
                inputs.forEach(input => {
                    if (input.value !== window.lastCapturedAnswer.value) {
                        input.value = window.lastCapturedAnswer.value;
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                });
            }

            // Clica no botão de Verificar/Próximo (Leitura Dinâmica de Texto)
            const buttons = document.querySelectorAll('button');
            buttons.forEach(btn => {
                const text = btn.innerText.toLowerCase();
                const keywords = ["verificar", "próximo", "check", "next", "continuar", "pular", "resumo"];
                if (keywords.some(k => text.includes(k)) && !btn.disabled) {
                    btn.click();
                }
            });
        }, 1800);
    }

    // 3. UI Vermelha e Splash
    const style = document.createElement('style');
    style.innerHTML = `
        .ks-menu { position: fixed; top: 15px; left: 15px; width: 230px; background: rgba(0,0,0,0.9); border: 2px solid #f00; border-radius: 10px; padding: 12px; z-index: 9999999; color: #fff; font-family: sans-serif; box-shadow: 0 0 15px #f00; display: none; }
        .ks-toggle { position: fixed; top: 15px; left: 15px; width: 45px; height: 45px; background: #000; border: 2px solid #f00; border-radius: 50%; display: flex; align-items: center; justify-content: center; z-index: 10000000; cursor: pointer; box-shadow: 0 0 10px #f00; }
    `;
    document.head.appendChild(style);

    const splash = document.createElement('div');
    splash.style = "position:fixed;top:0;left:0;width:100%;height:100%;background:#000;display:flex;align-items:center;justify-content:center;z-index:99999999;flex-direction:column;";
    splash.innerHTML = `<img src="${logoUrl}" style="width:120px; filter:drop-shadow(0 0 15px #f00);"><h1 style="color:#f00; font-family:Arial; margin-top:20px;">KHANSCRIPT BY JK</h1>`;
    document.body.appendChild(splash);

    setTimeout(() => {
        splash.remove();
        const menu = document.createElement('div');
        menu.className = "ks-menu";
        menu.innerHTML = `<h3 style="color:#f00; margin:0 0 10px 0; text-align:center;">${scriptName}</h3>
                          <label style="font-size:12px;"><input type="checkbox" checked onchange="window.features.autoAnswer = this.checked"> Auto-Responder Real</label>
                          <hr style="border:0.5px solid #300;"><p style="font-size:10px; text-align:center;">Desenvolvido por JK</p>`;
        document.body.appendChild(menu);

        const btn = document.createElement('div');
        btn.className = "ks-toggle"; btn.innerHTML = `<img src="${logoUrl}" width="25">`;
        btn.onclick = () => menu.style.display = menu.style.display === "none" ? "block" : "none";
        document.body.appendChild(btn);

        runAutoBot();
    }, 2500);

})();
