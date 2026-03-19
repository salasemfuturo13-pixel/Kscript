const ver = "V1.1"; // Versão atualizada
let isDev = false;

// URLs (sem espaços, usando raw)
const logoUrl = "https://raw.githubusercontent.com/nickzplayerzx/KhanScript/main/logo.png";
const repoPathDefault = `https://raw.githubusercontent.com/nickzplayerzx/KhanScript/${isDev ? "dev" : "main"}/`;

let device = {
    mobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone|Mobile|Tablet|Kindle|Silk|PlayBook|BB10/i.test(navigator.userAgent),
    apple: /iPhone|iPad|iPod|Macintosh|Mac OS X/i.test(navigator.userAgent)
};

let user = { username: "Username", nickname: "Nickname", UID: 0 };
let loadedPlugins = [];

const splashScreen = document.createElement('div');

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
window.featureConfigs = {
    autoAnswerDelay: 3,
    customUsername: "",
    customPfp: ""
};

// Segurança básica
document.addEventListener('contextmenu', (e) => !window.disableSecurity && e.preventDefault());
document.addEventListener('keydown', (e) => {
    if (!window.disableSecurity && (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I', 'C', 'J'].includes(e.key)))) {
        e.preventDefault();
    }
});

// Favicon
(function(){
    let favicon = document.querySelector("link[rel~='icon']") || document.createElement("link");
    favicon.rel = "icon";
    favicon.href = logoUrl;
    document.head.appendChild(favicon);
})();

// Scrollbar e Style
const style = document.createElement('style');
style.innerHTML = `
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: #140c28; }
    ::-webkit-scrollbar-thumb { background: #9a7ed9; border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: #b288e6; }
`;
document.head.appendChild(style);

// EventEmitter para o DOM
class EventEmitter {
    constructor() { this.events = {} }
    on(t, e) { this.events[t] || (this.events[t] = []); this.events[t].push(e); }
    emit(t, ...e) { if(this.events[t]) this.events[t].forEach(f => f(...e)); }
}
const plppdo = new EventEmitter();

new MutationObserver(() => plppdo.emit('domChanged')).observe(document.body, { childList: true, subtree: true });

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const playAudio = url => { const audio = new Audio(url.trim()); audio.play().catch(()=>{}); };

// FUNÇÃO CORRIGIDA: Evita spam de Toast e verifica se o botão pode ser clicado
const findAndClickBySelector = selector => {
    const element = document.querySelector(selector);
    // Verifica se o elemento existe, está visível e não está desabilitado
    if (element && element.offsetParent !== null && !element.disabled) {
        element.click();
        // Toast removido para evitar poluição visual durante o auto-answer
    }
};

function sendToast(text, duration = 3000, gravity = 'bottom') {
    if (window.Toastify)
        Toastify({
            text: text,
            duration: duration,
            gravity: gravity,
            position: "center",
            style: {
                background: "linear-gradient(100deg, #6a35d9, #8a5bd9)",
                color: "#f8f2ff",
                borderRadius: "10px",
                fontFamily: "Arial, sans-serif",
                boxShadow: "0 6px 22px rgba(106, 53, 217, 0.45)"
            }
        }).showToast();
}

// Carregador de Script otimizado (Inject)
async function loadScript(url, label) {
    try {
        const response = await fetch(url.trim());
        if (!response.ok) throw new Error();
        const scriptBody = await response.text();
        const scriptTag = document.createElement('script');
        scriptTag.textContent = scriptBody;
        document.head.appendChild(scriptTag);
        loadedPlugins.push(label);
    } catch (e) {
        console.error(`Erro ao carregar plugin: ${label}`);
        sendToast(`Erro: ${label}`, 4000, 'top');
    }
}

async function loadCss(url) {
    const link = document.createElement('link');
    link.rel = 'stylesheet'; link.href = url.trim();
    document.head.appendChild(link);
}

async function showSplashScreen() {
    splashScreen.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;background:#140c28;display:flex;align-items:center;justify-content:center;z-index:9999;transition:opacity 0.5s;color:#e6ccff;font-family:Arial;flex-direction:column;`;
    splashScreen.innerHTML = `<img src="${logoUrl}" style="height:100px;margin-bottom:15px;"><b style="font-size:25px;">KhanScript</b><span>Carregando...</span>`;
    document.body.appendChild(splashScreen);
}

const hideSplashScreen = () => { splashScreen.style.opacity = '0'; setTimeout(() => splashScreen.remove(), 600); };

function setupMenu() {
    loadScript(repoPathDefault + 'visuals/mainMenu.js', 'mainMenu');
    loadScript(repoPathDefault + 'visuals/statusPanel.js', 'statusPanel');
    loadScript(repoPathDefault + 'visuals/widgetBot.js', 'widgetBot');
}

function setupMain() {
    const plugins = ['questionSpoof', 'videoSpoof', 'minuteFarm', 'spoofUser', 'answerRevealer', 'rgbLogo', 'customBanner', 'autoAnswer'];
    plugins.forEach(p => loadScript(`${repoPathDefault}functions/${p}.js`, p));
}

(async function init() {
    if (!location.host.includes("khanacademy.org")) return alert("Use na Khan Academy!");

    await showSplashScreen();

    // Dependências externas
    await loadScript('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js', 'DarkReader');
    if (window.DarkReader) DarkReader.enable({ brightness: 100, contrast: 100, darkSchemeBackgroundColor: '#140c28' });
    
    await loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css');
    await loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'Toastify');

    // Identificação de usuário via API da Khan
    fetch("/api/internal/graphql/getFullUserProfile", {
        method: "POST",
        body: JSON.stringify({ operationName: "getFullUserProfile", query: "query getFullUserProfile { user { id nickname username } }" })
    }).then(r => r.json()).then(d => {
        if(d.data?.user) user = { nickname: d.data.user.nickname, username: d.data.user.username, UID: d.data.user.id.slice(-5) };
    }).catch(()=>{});

    sendToast("KhanScript injetado!");
    playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/gcelzszy.wav');
    
    await delay(1000);
    hideSplashScreen();
    setupMenu();
    setupMain();

    console.clear();
    console.log("%cKhanScript %cCarregado", "color:purple;font-size:20px;font-weight:bold;", "color:white;");
})();
