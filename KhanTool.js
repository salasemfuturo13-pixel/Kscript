// KhanScript - Desenvolvido por JK
const logoUrl = "https://raw.githubusercontent.com/salasemfuturo13-pixel/logo-do-khanscript/refs/heads/main/logo.png";
const scriptName = "KhanScript";
const devName = "JK";

// Configurações das Features
window.features = {
    autoAnswer: true,
    questionSpoof: true,
    videoBypass: true,
    darkMode: true
};

// Criar Elementos do Painel
const menu = document.createElement('div');
const statusPanel = document.createElement('div');
const splashScreen = document.createElement('div');

// 🎨 Estilização Geral (Scrollbar e Menu)
const style = document.createElement('style');
style.innerHTML = `
    ::-webkit-scrollbar { width: 6px; } 
    ::-webkit-scrollbar-track { background: #000; } 
    ::-webkit-scrollbar-thumb { background: #ff0000; border-radius: 10px; }
    
    .ks-menu { position: fixed; top: 80px; left: 20px; width: 220px; background: rgba(15, 15, 15, 0.95); border: 1px solid #ff0000; border-radius: 10px; padding: 15px; z-index: 10000; color: white; font-family: Arial; display: none; box-shadow: 0 0 15px rgba(255, 0, 0, 0.3); }
    .ks-header { display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 15px; }
    .ks-header img { width: 30px; }
    .ks-header span { font-weight: bold; font-size: 16px; color: #ff0000; }
    
    .ks-item { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-size: 13px; }
    .ks-switch { position: relative; display: inline-block; width: 34px; height: 18px; }
    .ks-switch input { opacity: 0; width: 0; height: 0; }
    .ks-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #333; transition: .4s; border-radius: 34px; }
    .ks-slider:before { position: absolute; content: ""; height: 12px; width: 12px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
    input:checked + .ks-slider { background-color: #ff0000; }
    input:checked + .ks-slider:before { transform: translateX(16px); }

    .ks-status { position: fixed; bottom: 10px; left: 10px; background: rgba(0,0,0,0.8); border: 1px solid #ff0000; padding: 5px 15px; border-radius: 20px; color: #fff; font-family: monospace; font-size: 12px; z-index: 10000; display: flex; gap: 10px; }
`;
document.head.appendChild(style);

// Funções Auxiliares
const sendToast = (t) => { if(window.Toastify) Toastify({text: t, duration: 2000, position: "center", style: {background: "#ff0000"}}).showToast(); };

// 1. Criar o Menu Visual
function createMenu() {
    menu.className = "ks-menu";
    menu.innerHTML = `
        <div class="ks-header">
            <img src="${logoUrl}">
            <span>${scriptName}</span>
        </div>
        <div class="ks-item">Respostas Auto <label class="ks-switch"><input type="checkbox" checked onchange="window.features.autoAnswer = this.checked"><span class="ks-slider"></span></label></div>
        <div class="ks-item">Spoof Questão <label class="ks-switch"><input type="checkbox" checked onchange="window.features.questionSpoof = this.checked"><span class="ks-slider"></span></label></div>
        <div class="ks-item">Vídeo Automático <label class="ks-switch"><input type="checkbox" checked onchange="window.features.videoBypass = this.checked"><span class="ks-slider"></span></label></div>
        <div class="ks-item">Modo Noturno <label class="ks-switch"><input type="checkbox" checked onchange="window.features.darkMode = this.checked"><span class="ks-slider"></span></label></div>
        <p style="font-size:10px; color:#555; text-align:center; margin-top:10px;">Desenvolvido por ${devName}</p>
    `;
    document.body.appendChild(menu);

    // Botão para abrir/fechar (Favicon no canto superior esquerdo)
    const toggleBtn = document.createElement('div');
    toggleBtn.style = "position:fixed; top:10px; left:10px; z-index:10001; cursor:pointer; background:#000; border:1px solid #ff0000; border-radius:50%; width:40px; height:40px; display:flex; align-items:center; justify-content:center; box-shadow: 0 0 10px #ff0000;";
    toggleBtn.innerHTML = `<img src="${logoUrl}" style="width:25px;">`;
    toggleBtn.onclick = () => { menu.style.display = menu.style.display === "none" ? "block" : "none"; };
    document.body.appendChild(toggleBtn);
}

// 2. Criar Status Bar
function createStatus() {
    statusPanel.className = "ks-status";
    setInterval(() => {
        const time = new Date().toLocaleTimeString();
        statusPanel.innerHTML = `<span>${scriptName}</span> | <span>ONLINE</span> | <span>${time}</span>`;
    }, 1000);
    document.body.appendChild(statusPanel);
}

// 3. Funções de Automação
function setupBypass() {
    const originalFetch = window.fetch;
    window.fetch = async function (input, init) {
        const res = await originalFetch.apply(this, arguments);
        if (window.features.questionSpoof && input.url && input.url.includes("getAssessmentItem")) {
            const clone = res.clone();
            try {
                let obj = await clone.json();
                let data = JSON.parse(obj.data.assessmentItem.item.itemData);
                data.question.content = `[${scriptName}] Resolvido por ${devName} [[☃ radio 1]]`;
                data.question.widgets = { "radio 1": { type: "radio", options: { choices: [{ content: "Confirmar Resposta ✅", correct: true }] } } };
                obj.data.assessmentItem.item.itemData = JSON.stringify(data);
                return new Response(JSON.stringify(obj), { status: res.status, headers: res.headers });
            } catch(e){}
        }
        return res;
    }
    
    // Auto Clicker
    setInterval(() => {
        if(window.features.autoAnswer) {
            const btn = document.querySelector('[data-testid="exercise-check-answer"], [data-testid="exercise-next-question"], ._1udzurba');
            if(btn) btn.click();
        }
    }, 2000);
}

// 4. Inicialização Principal
(async function() {
    // Splash Screen Épica
    splashScreen.style = "position:fixed;top:0;left:0;width:100%;height:100%;background:#000;display:flex;align-items:center;justify-content:center;z-index:99999;transition:0.8s;flex-direction:column;font-family:Arial;";
    splashScreen.innerHTML = `<img src="${logoUrl}" style="width:120px; filter:drop-shadow(0 0 15px #f00);"><h1 style="color:#ff0000; margin-top:20px;">${scriptName}</h1>`;
    document.body.appendChild(splashScreen);

    // Carregar dependências
    const loadJS = u => new Promise(r => { const s = document.createElement('script'); s.src = u; s.onload = r; document.head.appendChild(s); });
    const loadCSS = u => { const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = u; document.head.appendChild(l); };
    
    loadCSS('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css');
    await loadJS('https://cdn.jsdelivr.net/npm/toastify-js');
    await loadJS('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js');

    if (window.DarkReader) {
        DarkReader.setFetchMethod(window.fetch);
        DarkReader.enable({ brightness: 100, contrast: 90 });
    }

    setTimeout(() => {
        splashScreen.style.opacity = "0";
        setTimeout(() => splashScreen.remove(), 800);
        createMenu();
        createStatus();
        setupBypass();
        sendToast(`${scriptName} pronto!`);
    }, 2500);
})();
