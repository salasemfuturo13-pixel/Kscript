/* 
    🔴 KhanScript v1.3 - AUTO-SOLVER (RADIO + INPUT)
    Desenvolvido estrategicamente por JK 
*/

(async function() {
    const logoUrl = "https://raw.githubusercontent.com/salasemfuturo13-pixel/logo-do-khanscript/refs/heads/main/logo.png";
    const scriptName = "KhanScript";
    const devName = "JK";

    window.features = { autoAnswer: true, questionSpoof: true };

    const menu = document.createElement('div');
    const splashScreen = document.createElement('div');

    // 🎨 CSS Dark Red
    const style = document.createElement('style');
    style.innerHTML = `
        .ks-menu { position: fixed; top: 80px; left: 20px; width: 230px; background: rgba(10,10,10,0.95); border: 2px solid #f00; border-radius: 12px; padding: 15px; z-index: 1000000; color: white; display: none; font-family: Arial; box-shadow: 0 0 20px #f00; }
        .ks-header { display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #400; padding-bottom: 10px; margin-bottom: 15px; font-weight: 800; color: #f00; }
        .ks-item { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; }
        .ks-toggle-btn { position: fixed; top: 15px; left: 15px; z-index: 1000001; cursor: pointer; background: #000; border: 2px solid #f00; border-radius: 50%; width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px #f00; }
    `;
    document.head.appendChild(style);

    // 1. Interface
    function buildUI() {
        menu.className = "ks-menu";
        menu.innerHTML = `<div class="ks-header"><img src="${logoUrl}" width="30">${scriptName}</div>
            <div class="ks-item">Auto-Responder <input type="checkbox" checked onchange="window.features.autoAnswer = this.checked"></div>
            <div class="ks-item">Bypass Total <input type="checkbox" checked onchange="window.features.questionSpoof = this.checked"></div>
            <p style="font-size:10px; color:#666; text-align:center;">Dev by ${devName}</p>`;
        document.body.appendChild(menu);

        const btn = document.createElement('div');
        btn.className = "ks-toggle-btn";
        btn.innerHTML = `<img src="${logoUrl}" width="25">`;
        btn.onclick = () => menu.style.display = menu.style.display === "none" ? "block" : "none";
        document.body.appendChild(btn);
    }

    // 2. O MOTOR: INTERCEPTOR DE QUESTÕES (Múltipla Escolha + Escrita)
    function startSolving() {
        const originalFetch = window.fetch;
        window.fetch = async function (input, init) {
            const res = await originalFetch.apply(this, arguments);
            if (window.features.questionSpoof && input.url && input.url.includes("getAssessmentItem")) {
                const clone = res.clone();
                try {
                    let obj = await clone.json();
                    let itemData = JSON.parse(obj.data.assessmentItem.item.itemData);
                    
                    // LÓGICA DE SIMPLIFICAÇÃO DE RESPOSTA
                    // Percorre todos os 'widgets' (pergunta, campos de texto, opções)
                    for (let key in itemData.question.widgets) {
                        let widget = itemData.question.widgets[key];
                        
                        // Se for Múltipla Escolha (Radio)
                        if (widget.type === "radio") {
                            widget.options.choices = [
                                { content: `[${scriptName}] Resposta Injetada ✅`, correct: true },
                                { content: "Alternativa Incorreta", correct: false }
                            ];
                        }
                        
                        // Se for campo de escrever (Numeric Input ou Text Input)
                        if (widget.type === "numeric-input" || widget.type === "input-number" || widget.type === "expression") {
                            // Definimos que a resposta correta para o sistema será sempre "0"
                            if (widget.options.answers) {
                                widget.options.answers = [{ value: "0", status: "correct" }];
                            } else {
                                widget.options.answer = "0";
                            }
                        }
                    }

                    itemData.question.content = `[${scriptName}] BYPASS ATIVADO. Apenas confirme ou digite 0. [[☃ ${Object.keys(itemData.question.widgets)[0]}]]`;
                    obj.data.assessmentItem.item.itemData = JSON.stringify(itemData);
                    return new Response(JSON.stringify(obj), { status: res.status, headers: res.headers });
                } catch(e) {}
            }
            return res;
        };

        // LOOP DE AÇÃO (Clonar Cliques e Digitação)
        setInterval(() => {
            if (!window.features.autoAnswer) return;

            // 1. Lida com Radio Buttons (Múltipla Escolha)
            const firstChoice = document.querySelector('[data-testid^="choice-icon"], [role="radio"]');
            if (firstChoice) firstChoice.click();

            // 2. Lida com Inputs (Campos de Escrever)
            const inputs = document.querySelectorAll('input[type="text"], input[type="number"], .perseus-input-number');
            inputs.forEach(input => {
                if (input.value !== "0") {
                    input.value = "0"; // Injeta o valor que definimos como correto
                    input.dispatchEvent(new Event('input', { bubbles: true })); // Avisa o site que algo foi digitado
                }
            });

            // 3. Clica nos botões (Verificar / Próximo)
            const buttons = document.querySelectorAll('button');
            buttons.forEach(btn => {
                const text = btn.innerText.toLowerCase();
                const keywords = ["verificar", "próximo", "check", "next", "continuar", "pular"];
                if (keywords.some(k => text.includes(k)) && !btn.disabled) {
                    btn.click();
                }
            });
        }, 1800);
    }

    // 3. Inicialização
    splashScreen.style = "position:fixed;top:0;left:0;width:100%;height:100%;background:#000;display:flex;align-items:center;justify-content:center;z-index:9999999;transition:1s;flex-direction:column;font-family:Arial;";
    splashScreen.innerHTML = `<img src="${logoUrl}" style="width:120px; filter:drop-shadow(0 0 15px #f00); animation: pulse 1s infinite;"><h1 style="color:#f00; margin-top:20px;">${scriptName.toUpperCase()}</h1><style>@keyframes pulse{0%{scale:1}50%{scale:1.1}100%{scale:1}}</style>`;
    document.body.appendChild(splashScreen);

    setTimeout(() => {
        splashScreen.style.opacity = "0";
        setTimeout(() => splashScreen.remove(), 1000);
        buildUI();
        startSolving();
    }, 3000);
})();
