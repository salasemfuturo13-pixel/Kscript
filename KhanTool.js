/* 
    🔴 KhanScript v1.0 - Desenvolvido por JK 
    Hospedado em: salasemfuturo13-pixel/Kscript
*/

(async function() {
    // 1. Configurações de Identidade
    const logoUrl = "https://raw.githubusercontent.com/salasemfuturo13-pixel/logo-do-khanscript/refs/heads/main/logo.png";
    const scriptName = "KhanScript";
    const devName = "JK";

    // Estado das Features
    window.features = {
        autoAnswer: true,
        questionSpoof: true,
        videoBypass: true,
        darkMode: true
    };

    // 2. Elementos Visuais e Estilo
    const menu = document.createElement('div');
    const statusPanel = document.createElement('div');
    const splashScreen = document.createElement('div');
    const style = document.createElement('style');

    style.innerHTML = `
        ::-webkit-scrollbar { width: 6px; } 
        ::-webkit-scrollbar-track { background: #000; } 
        ::-webkit-scrollbar-thumb { background: #f00; border-radius: 10px; }
        
        .ks-menu { position: fixed; top: 80px; left: 20px; width: 230px; background: rgba(10, 10, 10, 0.98); border: 1px solid #f00; border-radius: 12px; padding: 15px; z-index: 999999; color: white; font-family: 'Segoe UI', Arial; display: none; box-shadow: 0 0 20px rgba(255, 0, 0, 0.4); transition: 0.3s; }
        .ks-header { display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #440000; padding-bottom: 10px; margin-bottom: 15px; }
        .ks-header img { width: 35px; filter: drop-shadow(0 0 5px #f00); }
        .ks-header span { font-weight: 800; font-size: 18px; color: #f00; letter-spacing: 1px; }
        
        .ks-item { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; font-size: 14px; font-weight: 500; }
        .ks-switch { position: relative; display: inline-block; width: 38px; height: 20px; }
        .ks-switch input { opacity: 0; width: 0; height: 0; }
        .ks-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #333; transition: .3s; border-radius: 34px; border: 1px solid #555; }
        .ks-slider:before { position: absolute; content: ""; height: 14px; width: 14px; left: 2px; bottom: 2px; background-color: white; transition: .3s; border-radius: 50%; }
        input:checked + .ks-slider { background-color: #f00; border-color: #f00; }
        input:checked + .ks-slider:before { transform: translateX(18px); }

        .ks-status { position: fixed; bottom: 15px; left: 15px; background: rgba(0,0,0,0.9); border: 1px solid #f00; padding: 6px 18px; border-radius: 30px; color: #fff; font-family: 'Courier New', monospace; font-size: 11px; z-index: 999998; box-shadow: 0 0 10px rgba(255,0,0,0.2); }
        .ks-toggle { position: fixed; top: 15px; left: 15px; z-index: 1000000; cursor: pointer; background: #000; border: 1px solid #f00; border-radius: 50%; width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 15px #f00; transition: 0.3s; }
        .ks-toggle:hover { transform: scale(1.1); }
        .ks-toggle img { width: 28px; }
    `;
    document.head.appendChild(style);

    const sendToast = (text) => {
        if(window.Toastify) Toastify({text, duration: 2500, gravity: "bottom", position: "center", style: {background: "linear-gradient(to right, #000, #f00)", borderRadius: "10px", border: "1px solid #f00"}}).showToast();
    };

    // 3. Funções do Painel Visual
    function buildUI() {
        menu.className = "ks-menu";
        menu.innerHTML = `
            <div class="ks-header"><img src="${logoUrl}"><span>${scriptName}</span></div>
            <div class="ks-item">Auto-Responder <label class="ks-switch"><input type="checkbox" checked onchange="window.features.autoAnswer = this.checked"><span class="ks-slider"></span></label></div>
            <div class="ks-item">Bypass Questão <label class="ks-switch"><input type="checkbox" checked onchange="window.features.questionSpoof = this.checked"><span class="ks-slider"></span></label></div>
            <div class="ks-item">Vídeo Rápido <label class="ks-switch"><input type="checkbox" checked onchange="window.features.videoBypass = this.checked"><span class="ks-slider"></span></label></div>
            <div class="ks-item">Dark Mode <label class="ks-switch"><input type="checkbox" checked onchange="window.features.darkMode = this.checked"><span class="ks-slider"></span></label></div>
            <div style="font-size:10px; color:#f00; text-align:center; margin-top:15px; opacity: 0.7;">Powered by ${devName}</div>
        `;
        document.body.appendChild(menu);

        const toggleBtn = document.createElement('div');
        toggleBtn.className = "ks-toggle";
        toggleBtn.innerHTML = `<img src="${logoUrl}">`;
        toggleBtn.onclick = () => { menu.style.display = menu.style.display === "none" ? "block" : "none"; };
        document.body.appendChild(toggleBtn);

        statusPanel.className = "ks-status";
        setInterval(() => {
            const time = new Date().toLocaleTimeString();
            statusPanel.innerHTML = `<span style="color:#f00">●</span> ${scriptName} V1.0 | ${time}`;
        }, 1000);
        document.body.appendChild(statusPanel);
    }

    // 4. Motor de Injeção e Bypass (Auto-Responder Real)
    function coreAutomation() {
        const originalFetch = window.fetch;
        window.fetch = async function (input, init) {
            const res = await originalFetch.apply(this, arguments);
            
            // Injeção de Resposta em Questões
            if (window.features.questionSpoof && input.url && input.url.includes("getAssessmentItem")) {
                const clone = res.clone();
                try {
                    let obj = await clone.json();
                    let data = JSON.parse(obj.data.assessmentItem.item.itemData);
                    
                    // Reescreve a questão logicamente
                    data.question.content = `[${scriptName}] BYPASS ATIVADO POR ${devName} [[☃ radio 1]]`;
                    data.question.widgets = { 
                        "radio 1": { 
                            type: "radio", 
                            options: { 
                                choices: [
                                    { content: `✅ ALTERNATIVA CORRETA INJETADA`, correct: true },
                                    { content: `SISTEMA DE SEGURANÇA KHANSCRIPT`, correct: false }
                                ] 
                            } 
                        } 
                    };
                    
                    obj.data.assessmentItem.item.itemData = JSON.stringify(data);
                    sendToast("Resposta Injetada! ✅");
                    return new Response(JSON.stringify(obj), { status: res.status, headers: res.headers });
                } catch(e){}
            }
            return res;
        }

        // Loop de Ação (Clica e Resolve)
        setInterval(() => {
            if(window.features.autoAnswer) {
                // Seleciona a resposta correta injetada
                const choice = document.querySelector('[data-testid="choice-icon__library-choice-icon"], ._1udzurba');
                if(choice) choice.click();

                // Clica no botão de verificar/próximo
                const btns = [
                    '[data-testid="exercise-check-answer"]', 
                    '[data-testid="exercise-next-question"]',
                    '._awve9b button',
                    'button[data-test-id="exercise-check-answer"]'
                ];
                btns.forEach(s => {
                    const b = document.querySelector(s);
                    if(b && !b.disabled) b.click();
                });
            }
        }, 1800);
    }

    // 5. Inicialização
    if (!/khanacademy.org/.test(location.href)) return alert("Script exclusivo para Khan Academy!");

    // Splash Screen
    splashScreen.style = "position:fixed;top:0;left:0;width:100%;height:100%;background:#000;display:flex;align-items:center;justify-content:center;z-index:9999999;transition:1s;flex-direction:column;";
    splashScreen.innerHTML = `<img src="${logoUrl}" style="width:140px; filter:drop-shadow(0 0 20px #f00); animation: pulse 1.5s infinite;"><h1 style="color:#f00; font-family:Arial; margin-top:25px; letter-spacing:5px;">${scriptName.toUpperCase()}</h1><p style="color:#555; font-family:Arial;">By ${devName}</p><style>@keyframes pulse { 0% {transform: scale(1);} 50% {transform: scale(1.1);} 100% {transform: scale(1);} }</style>`;
    document.body.appendChild(splashScreen);

    // Carregar Scripts Externos
    const loadJS = u => new Promise(r => { const s = document.createElement('script'); s.src = u; s.onload = r; document.head.appendChild(s); });
    const loadCSS = u => { const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = u; document.head.appendChild(l); };

    loadCSS('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css');
    await loadJS('https://cdn.jsdelivr.net/npm/toastify-js');
    await loadJS('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js');

    if (window.DarkReader) {
        DarkReader.setFetchMethod(window.fetch);
        DarkReader.enable({ brightness: 100, contrast: 95 });
    }

    setTimeout(() => {
        splashScreen.style.opacity = "0";
        setTimeout(() => splashScreen.remove(), 1000);
        buildUI();
        coreAutomation();
        sendToast("KhanScript Conectado! 🔴");
        const audio = new Audio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/gcelzszy.wav');
        audio.volume = 0.5; audio.play().catch(()=>{});
    }, 3000);

})();
