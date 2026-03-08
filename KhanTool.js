const ver = "V1.0";
let isDev = false;

const logoUrl = "https://raw.githubusercontent.com/salasemfuturo13-pixel/logo-do-khanscript/refs/heads/main/logo.png";
const devName = "JK"; 
const scriptName = "KhanScript";

let loadedPlugins = [];
const splashScreen = document.createElement('div');

// Funções Utilitárias
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const playAudio = url => { const audio = new Audio(url); audio.play().catch(()=>{}); };

// Toast Personalizado
function sendToast(text, duration = 3000) {
    if (window.Toastify) {
        Toastify({
            text: text,
            duration: duration,
            gravity: "bottom",
            position: "center",
            style: { background: "#ff0000", color: "#fff", borderRadius: "8px" }
        }).showToast();
    }
}

// SplashScreen Corrigida
async function showSplashScreen() {
    splashScreen.id = "khanscript-splash";
    splashScreen.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:linear-gradient(122deg,#000000 0%,#4a0000 100%);display:flex;align-items:center;justify-content:center;z-index:999999;opacity:0;transition:opacity 0.5s ease;user-select:none;color:#ffffff;font-family:Arial,sans-serif;flex-direction:column;";
    splashScreen.innerHTML = `
        <img src="${logoUrl}" style="height:120px;margin-bottom:18px;filter: drop-shadow(0 0 10px #ff0000);">
        <span style="font-weight:800;font-size:30px;color:#ff0000">${scriptName}</span>
        <span style="margin-top:7px;font-size:14px;color:#cccccc;">Desenvolvido por ${devName}</span>
        <span style="margin-top:15px;font-size:12px;color:#ff0000;text-transform:uppercase;letter-spacing:2px;">Injetando Scripts...</span>
    `;
    document.body.appendChild(splashScreen);
    setTimeout(() => splashScreen.style.opacity = '1', 50);
}

async function hideSplashScreen() { 
    splashScreen.style.opacity = '0'; 
    setTimeout(() => splashScreen.remove(), 600); 
}

// Carregador de Scripts Melhorado
async function loadScript(url, label) {
    try {
        const r = await fetch(url);
        const script = await r.text();
        eval(script);
        loadedPlugins.push(label);
    } catch (e) {
        console.error("Erro ao carregar " + label, e);
    }
}

// Execução Principal
(async function(){
    if (!/khanacademy.org/.test(window.location.href)) {
        alert("Use na Khan Academy!");
        return;
    }
    
    await showSplashScreen();

    // Estilos Visuais
    const style = document.createElement('style');
    style.innerHTML = `
        ::-webkit-scrollbar { width: 8px; } 
        ::-webkit-scrollbar-track { background: #1a1a1a; } 
        ::-webkit-scrollbar-thumb { background: #ff0000; border-radius: 10px; }
        #khanscript-splash img { animation: pulse 2s infinite; }
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
    `;
    document.head.appendChild(style);

    // Carregar Toastify primeiro para poder usar as mensagens
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css';
    document.head.appendChild(link);
    
    await loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'toastify');

    // Carregar DarkReader
    await loadScript('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js', 'darkReader');
    if (window.DarkReader) { 
        DarkReader.enable({ brightness: 100, contrast: 90, sepia: 10 }); 
    }

    sendToast(`${scriptName} Ativado!`);
    playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/gcelzszy.wav');
    
    await delay(1500);
    await hideSplashScreen();
    
    console.log(`%c ${scriptName} %c by ${devName} `, "background:#ff0000;color:#fff;font-weight:bold;font-size:20px;", "background:#000;color:#ff0000;font-size:20px;");
})();
