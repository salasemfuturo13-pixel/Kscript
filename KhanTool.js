// KhanScript - Desenvolvido por JK
let loadedPlugins = [];
const splashScreen = document.createElement('div');
const logoUrl = "https://raw.githubusercontent.com/salasemfuturo13-pixel/logo-do-khanscript/refs/heads/main/logo.png";
const scriptName = "KhanScript";
const devName = "JK";

// Injeção de CSS para Scrollbar e Splash
const style = document.createElement('style');
style.innerHTML = `
    ::-webkit-scrollbar { width: 8px; } 
    ::-webkit-scrollbar-track { background: #1a1a1a; } 
    ::-webkit-scrollbar-thumb { background: #ff0000; border-radius: 10px; } 
    #khanscript-splash img { animation: pulse 2s infinite; }
    @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
`;
document.head.appendChild(style);

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const playAudio = url => { const audio = new Audio(url); audio.play().catch(()=>{}); };

// Toast Personalizado
function sendToast(text, duration=3000) {
    if(window.Toastify) {
        Toastify({
            text: text,
            duration: duration,
            gravity: "bottom",
            position: "center",
            style: { background: "#ff0000", color: "#fff", borderRadius:"8px" }
        }).showToast();
    }
}

// SplashScreen
async function showSplashScreen() {
    splashScreen.id = "khanscript-splash";
    splashScreen.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:linear-gradient(122deg,#000000 0%,#4a0000 100%);display:flex;align-items:center;justify-content:center;z-index:999999;opacity:0;transition:opacity 0.5s ease;user-select:none;color:#ffffff;font-family:Arial,sans-serif;flex-direction:column;";
    splashScreen.innerHTML = `
        <img src="${logoUrl}" style="height:120px;margin-bottom:18px;filter: drop-shadow(0 0 10px #ff0000);">
        <span style="font-weight:800;font-size:30px;color:#ff0000">${scriptName}</span>
        <span style="margin-top:7px;font-size:14px;color:#cccccc;">Desenvolvido por ${devName}</span>
    `;
    document.body.appendChild(splashScreen);
    setTimeout(() => splashScreen.style.opacity = '1', 50);
}

async function hideSplashScreen() { 
    splashScreen.style.opacity = '0'; 
    setTimeout(() => splashScreen.remove(), 600); 
}

async function loadScript(url) {
    const r = await fetch(url);
    const code = await r.text();
    eval(code);
}

// Automação Principal
function setupMain(){
    const originalFetch = window.fetch;
    window.fetch = async function (input, init) {
        const res = await originalFetch.apply(this, arguments);
        if (input.url && input.url.includes("graphql/getAssessmentItem")) {
            const clone = res.clone();
            try {
                let obj = await clone.json();
                if (obj?.data?.assessmentItem?.item?.itemData) {
                    let data = JSON.parse(obj.data.assessmentItem.item.itemData);
                    data.question.content = `[${scriptName}] Questão Modificada [[☃ radio 1]]`;
                    data.question.widgets = { "radio 1": { type: "radio", options: { choices: [{ content: "Confirmar Resposta ✅", correct: true }] } } };
                    obj.data.assessmentItem.item.itemData = JSON.stringify(data);
                    sendToast("Bypass Ativado!", 1000);
                    return new Response(JSON.stringify(obj), { status: res.status, headers: res.headers });
                }
            } catch(e){}
        }
        return res;
    };
    
    // Auto-clicker para avançar questões
    setInterval(() => {
        const nextBtn = document.querySelector('[data-testid="exercise-check-answer"], [data-testid="exercise-next-question"], ._1udzurba');
        if(nextBtn) nextBtn.click();
    }, 1500);
}

// Inicialização corrigida
(async function() {
    if (!/khanacademy.org/.test(window.location.href)) return;
    
    await showSplashScreen();

    // DarkReader com Fix para CORS
    await loadScript('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js');
    if (window.DarkReader) {
        DarkReader.setFetchMethod(window.fetch); // O segredo está aqui!
        DarkReader.enable({ brightness: 100, contrast: 95 });
    }

    // Toastify
    const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = 'https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css'; document.head.appendChild(link);
    await loadScript('https://cdn.jsdelivr.net/npm/toastify-js');

    sendToast(scriptName + " Injetado com Sucesso!");
    playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/gcelzszy.wav');
    
    await delay(2000);
    hideSplashScreen();
    setupMain();
})();
