const ver = "V1.0";
let isDev = false;

// Logo atualizada e Nome do Projeto
const logoUrl = "https://raw.githubusercontent.com/salasemfuturo13-pixel/logo-do-khanscript/refs/heads/main/logo.png";
const devName = "JK"; 
const scriptName = "KhanScript";

const repoPathDefault = `https://raw.githubusercontent.com/OnePrism0/KhanTool/${isDev ? "dev" : "main"}/`;

let device = {
    mobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone|Mobile|Tablet|Kindle|Silk|PlayBook|BB10/i.test(navigator.userAgent),
    apple: /iPhone|iPad|iPod|Macintosh|Mac OS X/i.test(navigator.userAgent)
};

let user = {
    username: "Username",
    nickname: "Nickname",
    UID: 0
};

let loadedPlugins = [];

const splashScreen = document.createElement('splashScreen');

window.features = {
    questionSpoof: true,
    videoSpoof: true,
    showAnswers: false,
    autoAnswer: false,
    customBanner: false,
    nextRecomendation: false,
    repeatQuestion: false,
    minuteFarmer: false,
    rgbLogo: false,
    darkMode: true
};

// Segurança e Console
document.addEventListener('contextmenu', (e) => !window.disableSecurity && e.preventDefault());
document.addEventListener('keydown', (e) => {
    if (!window.disableSecurity && (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I', 'C', 'J'].includes(e.key)))) {
        e.preventDefault();
    }
});

// Favicon Dinâmico
(function(){
    let favicon = document.querySelector("link[rel~='icon']");
    if(!favicon){
        favicon = document.createElement("link");
        favicon.rel = "icon";
        document.head.appendChild(favicon);
    }
    favicon.href = logoUrl;
})();

// Scrollbar Personalizada (Preto e Vermelho)
document.head.appendChild(Object.assign(document.createElement('style'),{innerHTML:"::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-track { background: #1a1a1a; } ::-webkit-scrollbar-thumb { background: #ff0000; border-radius: 10px; } ::-webkit-scrollbar-thumb:hover { background: #b30000; }"}));

class EventEmitter {
    constructor() { this.events = {} }
    on(t, e) { "string" == typeof t && (t = [t]), t.forEach(t => { this.events[t] || (this.events[t] = []), this.events[t].push(e) }) }
    off(t, e) { "string" == typeof t && (t = [t]), t.forEach(t => { this.events[t] && (this.events[t] = this.events[t].filter(t => t !== e)) }) }
    emit(t, ...e) { this.events[t] && this.events[t].forEach(t => { t(...e) }) }
    once(t, e) { "string" == typeof t && (t = [t]); let s = (...i) => { e(...i), this.off(t, s) }; this.on(t, s) }
};
const plppdo = new EventEmitter();

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const playAudio = url => { const audio = new Audio(url); audio.play(); };

// Toast Personalizado (Vermelho)
function sendToast(text, duration = 3000, gravity = 'bottom') {
    if (window.Toastify)
        Toastify({
            text: text,
            duration: duration,
            gravity: gravity,
            position: "center",
            stopOnFocus: true,
            style: {
                background: "#ff0000",
                color: "#fff",
                borderRadius: "8px",
                fontFamily: "Arial, sans-serif",
                fontSize: "15px",
                boxShadow: "0 6px 20px 0 rgba(0,0,0,0.5)"
            }
        }).showToast();
}

// Tela de Carregamento (Preto e Vermelho)
async function showSplashScreen() {
    splashScreen.style.cssText =
        "position:fixed;top:0;left:0;width:100%;height:100%;background:linear-gradient(122deg,#000000 0%,#4a0000 100%);display:flex;" +
        "align-items:center;justify-content:center;z-index:9999;opacity:0;transition:opacity 0.5s ease;user-select:none;" +
        "color:#ffffff;font-family:Arial,sans-serif;font-size:34px;text-align:center;letter-spacing:.05em;flex-direction:column;";
    splashScreen.innerHTML =
        `<img src="${logoUrl}" style="height:120px;margin-bottom:18px;filter: drop-shadow(0 0 10px #ff0000);"><span style="font-weight:800;line-height:32px;letter-spacing:2.5px;font-size:30px;color:#ff0000">${scriptName}</span>` +
        `<span style="margin-top:7px;font-size:14px;color:#cccccc;font-weight:500;">Desenvolvido por ${devName}</span>` +
        '<span style="margin-top:15px;font-size:12px;color:#ff0000;text-transform:uppercase;letter-spacing:2px;">Carregando...</span>';
    document.body.appendChild(splashScreen);
    setTimeout(() => splashScreen.style.opacity = '1', 10);
}

async function hideSplashScreen() { splashScreen.style.opacity = '0'; setTimeout(() => splashScreen.remove(), 800); }

async function loadScript(url, label) {
    return fetch(url).then(r => r.text()).then(script => { loadedPlugins.push(label); eval(script); }).catch(e => console.error("Erro ao carregar:", label));
}

(async function(){
    if (!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)) {
        alert(`${scriptName} só pode ser executado na Khan Academy!`);
        window.location.href = "https://pt.khanacademy.org/";
        return;
    }
    
    await showSplashScreen();
    
    // Plugins Essenciais
    await loadScript('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js', 'darkReader');
    if (window.DarkReader) { DarkReader.enable({brightness: 100, contrast: 90, sepia: 10}); }
    
    await loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'toastify');
    const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = 'https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css'; document.head.appendChild(link);

    sendToast(`${scriptName} Injetado!`);
    playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/gcelzszy.wav');
    
    await delay(1500);
    hideSplashScreen();
    
    console.log(`%c ${scriptName} %c by ${devName} `, "background:#ff0000;color:#fff;font-weight:bold;font-size:20px;", "background:#000;color:#ff0000;font-size:20px;");
})();