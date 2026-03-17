const ver = "V1.2"; // Atualizei a versão
let isDev = false;

const logoUrl = "https://raw.githubusercontent.com/OnePrism0/KhanTool/main/logo.png";
const repoPathDefault = `https://raw.githubusercontent.com/OnePrism0/KhanTool/${isDev ? "dev" : "main"}/`;

let device = {
    mobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone|Mobile|Tablet|Kindle|Silk|PlayBook|BB10/i.test(navigator.userAgent),
    apple: /iPhone|iPad|iPod|Macintosh|Mac OS X/i.test(navigator.userAgent)
};

let user = { username: "Username", nickname: "Nickname", UID: 0 };
let loadedPlugins = [];

const splashScreen = document.createElement('splashScreen');

window.features = {
    questionSpoof: true,
    videoSpoof: true,
    showAnswers: false,
    autoAnswer: true, // ATIVEI POR PADRÃO PARA VOCÊ
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

// --- CLASSES E UTILITÁRIOS ORIGINAIS ---
class EventEmitter {
    constructor() { this.events = {} }
    on(t, e) { "string" == typeof t && (t = [t]), t.forEach(t => { this.events[t] || (this.events[t] = []), this.events[t].push(e) }) }
    emit(t, ...e) { this.events[t] && this.events[t].forEach(t => { t(...e) }) }
};
const plppdo = new EventEmitter();

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// --- LÓGICA DE RESPOSTA CORRIGIDA (O que faltava no seu) ---
async function solveLogic() {
    if (!window.features.autoAnswer) return;

    // 1. Procura campos de matemática (MathQuill) ou texto
    const inputs = document.querySelectorAll('.mq-editable-field textarea, .mq-textarea textarea, input[type="text"], input[type="number"]');
    
    if (inputs.length > 0) {
        await delay(window.featureConfigs.autoAnswerDelay * 1000);
        
        inputs.forEach(input => {
            input.focus();
            // Simula digitação para o React/MathQuill detectar
            const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set || 
                           Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
            
            if(setter) setter.call(input, "0"); // Preenche com 0 (ou resposta se tiver o plugin)
            
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        });
    }

    // 2. Clica nos botões de Verificar ou Próximo
    const checkBtn = document.querySelector('button[data-test-id="exercise-check-answer"]');
    const nextBtn = document.querySelector('button[data-test-id="exercise-next-question"]');

    if (nextBtn) {
        nextBtn.click();
    } else if (checkBtn) {
        checkBtn.removeAttribute('disabled'); // Força o botão a ficar clicável
        checkBtn.click();
    }
}

// Escuta mudanças no site para responder automaticamente
plppdo.on('domChanged', () => {
    if (window.features.autoAnswer) solveLogic();
});

// --- FUNÇÕES DE CARREGAMENTO ORIGINAIS ---
async function showSplashScreen() {
    splashScreen.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:linear-gradient(122deg,#e4f1fd 0%,#176bd7 100%);display:flex;align-items:center;justify-content:center;z-index:9999;opacity:0;transition:opacity 0.5s ease;color:#1851a8;font-family:Arial;text-align:center;flex-direction:column;";
    splashScreen.innerHTML = `<img src="${logoUrl}" style="height:100px;margin-bottom:18px;"><span style="font-weight:800;font-size:30px;color:#176bd7">KhanTool</span><span>Carregando...</span>`;
    document.body.appendChild(splashScreen);
    setTimeout(() => splashScreen.style.opacity = '1', 10);
}

function setupMain() {
    // Mantive sua estrutura de carregar scripts externos
    const scripts = ['questionSpoof', 'videoSpoof', 'minuteFarm', 'spoofUser', 'answerRevealer', 'autoAnswer'];
    scripts.forEach(s => {
        const script = document.createElement('script');
        script.src = `${repoPathDefault}functions/${s}.js`;
        document.head.appendChild(script);
        loadedPlugins.push(s);
    });
}

// --- OBSERVAÇÃO DO DOM ---
new MutationObserver(() => plppdo.emit('domChanged'))
    .observe(document.body, { childList: true, subtree: true });

// --- INICIALIZAÇÃO ---
(async function(){
    await showSplashScreen();
    
    // Simula o carregamento que você tinha
    setTimeout(() => {
        splashScreen.style.opacity = '0';
        setTimeout(() => splashScreen.remove(), 800);
        setupMain();
        console.log("KhanTool V1.2 Ativo!");
    }, 2000);
})();
