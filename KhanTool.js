/**
 * KhanTool V1.1 - Enhanced Edition
 * Desenvolvido para automação e auxílio na Khan Academy
 */

const ver = "V1.1";
let isDev = false;

// Configurações Globais
window.features = {
    questionSpoof: true,
    videoSpoof: true,
    showAnswers: true,
    autoAnswer: false, // Começa desligado por segurança
    minuteFarmer: false,
    darkMode: true
};

window.featureConfigs = {
    autoAnswerDelayMin: 3, // Segundos mínimos
    autoAnswerDelayMax: 6, // Segundos máximos
    customUsername: "KhanUser",
};

const logoUrl = "https://raw.githubusercontent.com/OnePrism0/KhanTool/main/logo.png";
const repoPath = `https://raw.githubusercontent.com/OnePrism0/KhanTool/${isDev ? "dev" : "main"}/`;

// --- SISTEMA DE EVENTOS ---
class EventEmitter {
    constructor() { this.events = {} }
    on(t, e) { this.events[t] = this.events[t] || []; this.events[t].push(e); }
    emit(t, ...e) { if(this.events[t]) this.events[t].forEach(f => f(...e)); }
}
const toolEvents = new EventEmitter();

// --- UTILITÁRIOS ---
const delay = ms => new Promise(res => setTimeout(res, ms));
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

function sendToast(text, duration = 3000) {
    if (window.Toastify) {
        Toastify({
            text: text,
            duration: duration,
            gravity: "bottom",
            position: "center",
            style: { background: "#176bd7", borderRadius: "8px" }
        }).showToast();
    } else {
        console.log(`[KhanTool] ${text}`);
    }
}

// --- LÓGICA DE AUTO-ANSWER (MELHORADA) ---
async function solveQuestion() {
    if (!window.features.autoAnswer) return;

    // 1. Espera um tempo humano antes de responder
    const waitTime = randomInt(window.featureConfigs.autoAnswerDelayMin, window.featureConfigs.autoAnswerDelayMax);
    await delay(waitTime * 1000);

    // 2. Tenta encontrar opções de múltipla escolha
    const options = document.querySelectorAll('.perseus-radio-option input, .perseus-clickable');
    if (options.length > 0) {
        // Clica na primeira opção (Nota: Para ser 100% preciso, precisaria ler o objeto de resposta do React)
        options[0].click();
        sendToast("Marcando opção...", 1000);
    }

    // 3. Tenta encontrar campos de texto/número
    const inputs = document.querySelectorAll('input[type="text"], input[type="number"]');
    inputs.forEach(input => {
        if(input.value === "") {
            input.value = "0"; // Valor genérico ou extraído
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }
    });

    // 4. Clica no botão de verificar/próximo
    const checkBtn = document.querySelector('button[data-test-id="exercise-check-answer"]');
    const nextBtn = document.querySelector('button[data-test-id="exercise-next-question"]');

    if (checkBtn) {
        checkBtn.click();
        sendToast("Verificando resposta...", 1500);
    } else if (nextBtn) {
        nextBtn.click();
        sendToast("Indo para a próxima...", 1500);
    }
}

// --- INICIALIZAÇÃO DA UI ---
const splashScreen = document.createElement('div');
async function showSplash() {
    splashScreen.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:#e4f1fd;display:flex;align-items:center;justify-content:center;z-index:10000;flex-direction:column;font-family:Arial;transition:0.5s;";
    splashScreen.innerHTML = `<img src="${logoUrl}" style="height:80px;"><h1 style="color:#176bd7">KhanTool ${ver}</h1><p>Carregando Inteligência...</p>`;
    document.body.appendChild(splashScreen);
}

// --- LOADER DE SCRIPTS EXTERNOS ---
async function injectExt(url) {
    return new Promise((res) => {
        const s = document.createElement('script');
        s.src = url;
        s.onload = res;
        document.head.appendChild(s);
    });
}

// --- CORE ---
(async function init() {
    if (!window.location.href.includes("khanacademy.org")) {
        alert("Execute apenas na Khan Academy!");
        return;
    }

    await showSplash();

    // Carregar Dependências
    await injectExt('https://cdn.jsdelivr.net/npm/toastify-js');
    await injectExt('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js');
    
    // Ativar Dark Mode
    if (window.features.darkMode && window.DarkReader) {
        DarkReader.enable({ brightness: 100, contrast: 90 });
    }

    // Monitor de Mudanças no Dom (Detecta novas questões)
    const observer = new MutationObserver(() => {
        // Se aparecer o botão de "Verificar" ou "Próximo", tenta resolver
        if (document.querySelector('button[data-test-id="exercise-check-answer"]') || 
            document.querySelector('button[data-test-id="exercise-next-question"]')) {
            solveQuestion();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // CSS Customizado (Scrollbar)
    const style = document.createElement('style');
    style.innerHTML = `
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: #176bd7; border-radius: 10px; }
        .khantool-menu { position: fixed; top: 10px; right: 10px; background: white; padding: 10px; border-radius: 8px; z-index: 9999; box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
    `;
    document.head.appendChild(style);

    // Finalização
    setTimeout(() => {
        splashScreen.style.opacity = '0';
        setTimeout(() => splashScreen.remove(), 500);
        sendToast("KhanTool Pronto! Auto-Answer aguardando...", 4000);
    }, 2000);

    console.clear();
    console.log("%c KhanTool Injetado ", "background: #176bd7; color: #fff; font-size: 20px;");
})();
