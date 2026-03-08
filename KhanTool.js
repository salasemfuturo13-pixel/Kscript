/* 
    🔴 KhanScript Elite v2.1 
    Desenvolvido estrategicamente por JK 
    Fusão: Visual Original + Motor de Resposta Real
*/

const ver = "V1.0";
let isDev = false;

// Configurações de Identidade
const logoUrl = "https://raw.githubusercontent.com/salasemfuturo13-pixel/logo-do-khanscript/refs/heads/main/logo.png";
const scriptName = "KhanScript";
const devName = "JK";

// Estado Global de Automação
window.features = {
    autoAnswer: true,
    questionSpoof: true,
    videoSpoof: true,
    darkMode: true
};

window.currentAnswer = null;
window.isSolving = false;

// 1. Elementos de UI
const splashScreen = document.createElement('div');
let user = { nickname: "Usuário", username: "Username", UID: 0 };

// 2. Sistema de Eventos e Estilo
document.head.appendChild(Object.assign(document.createElement('style'),{innerHTML:`
    ::-webkit-scrollbar { width: 8px; } 
    ::-webkit-scrollbar-track { background: #1a1a1a; } 
    ::-webkit-scrollbar-thumb { background: #ff0000; border-radius: 10px; }
`}));

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const playAudio = url => { const audio = new Audio(url); audio.play().catch(()=>{}); };

function sendToast(text, duration = 3000) {
    if (window.Toastify)
        Toastify({
            text: text,
            duration: duration,
            gravity: "bottom",
            position: "center",
            style: { background: "#ff0000", color: "#fff", borderRadius: "8px", boxShadow: "0 6px 20px rgba(0,0,0,0.5)" }
        }).showToast();
}

// 3. Motor de Interceptação de Respostas (O Coração do Script)
const originalFetch = window.fetch;
window.fetch = async function () {
    const response = await originalFetch.apply(this, arguments);
    if (arguments[0] && arguments[0].includes("getAssessmentItem")) {
        const clone = response.clone();
        clone.json().then(obj => {
            try {
                const itemData = JSON.parse(obj.data.assessmentItem.item.itemData);
                window.currentAnswer = null;
                window.isSolving = false;
                for (let key in itemData.question.widgets) {
                    const widget = itemData.question.widgets[key];
                    if (widget.options?.choices) {
                        window.currentAnswer = { type: 'radio', value: widget.options.choices.findIndex(c => c.correct) };
                    }
                    if (widget.options?.answers) {
                        window.currentAnswer = { type: 'input', value: widget.options.answers[0].value };
                    } else if (widget.options?.answer) {
                        window.currentAnswer = { type: 'input', value: widget.options.answer };
                    }
                }
                sendToast("Resposta capturada! 🔴", 1000);
            } catch(e) {}
        }).catch(()=>{});
    }
    return response;
};

// 4. Execução das Respostas (Simulação Humana)
async function solveMachine() {
    if (!window.features.autoAnswer || !window.currentAnswer || window.isSolving) return;
    
    // Verifica se os botões de exercício estão na tela
    const hasControl = document.querySelector('[data-testid="exercise-check-answer"], .exercise-check-answer, button[data-test-id]');
    if (!hasControl) return;

    window.isSolving = true;
    await delay(2000); // Atraso humano anti-detecção

    // Ação para questões de clicar
    if (window.currentAnswer.type === 'radio') {
        const choices = document.querySelectorAll('[data-testid^="choice-icon"], [role="radio"]');
        if (choices[window.currentAnswer.value]) choices[window.currentAnswer.value].click();
    }

    // Ação para questões de escrever (Bypass React)
    if (window.currentAnswer.type === 'input') {
        const input = document.querySelector('input[type="text"], input[type="number"], .perseus-input-number, textarea');
        if (input) {
            input.focus();
            const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
            setter.call(input, window.currentAnswer.value);
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
            input.blur();
        }
    }

    await delay(1000);

    // Clica para confirmar
    document.querySelectorAll('button').forEach(btn => {
        const txt = btn.innerText.toLowerCase();
        const keywords = ["verificar", "próximo", "check", "next", "continuar"];
        if (keywords.some(k => txt.includes(k)) && !btn.disabled) btn.click();
    });

    setTimeout(() => { window.isSolving = false; }, 3500);
}

// 5. Interface Original (Splash Screen)
async function showSplashScreen() {
    splashScreen.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:linear-gradient(122deg,#000 0%,#4a0000 100%);display:flex;align-items:center;justify-content:center;z-index:99999;opacity:0;transition:opacity 0.6s ease;user-select:none;color:#fff;font-family:Arial;flex-direction:column;";
    splashScreen.innerHTML = `<img src="${logoUrl}" style="height:100px;margin-bottom:18px;filter:drop-shadow(0 0 10px #f00);"><span style="font-weight:800;font-size:30px;color:#f00">${scriptName}</span><span style="font-size:14px;color:#ccc;">By ${devName}</span>`;
    document.body.appendChild(splashScreen);
    setTimeout(() => splashScreen.style.opacity = '1', 10);
}

// 6. Loop de Inicialização
(async function init(){
    if (!/khanacademy.org/.test(window.location.href)) {
        alert("Use na Khan Academy!");
        return;
    }

    await showSplashScreen();

    // Carregar Plugins
    const loadJS = u => new Promise(r => { const s=document.createElement('script'); s.src=u; s.onload=r; document.head.appendChild(s); });
    await loadJS('https://cdn.jsdelivr.net/npm/toastify-js');
    await loadJS('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js');

    if (window.DarkReader) {
        DarkReader.setFetchMethod(window.fetch);
        DarkReader.enable({ brightness: 100, contrast: 90 });
    }

    // Pega dados do Usuário (Original)
    fetch("/api/internal/graphql/getFullUserProfile", {
        body: '{"operationName":"getFullUserProfile","query":"query getFullUserProfile($kaid: String, $username: String) { user(kaid: $kaid, username: $username) { nickname username id } }"}',
        method: "POST"
    }).then(async r => {
        let d = await r.json();
        if(d.data?.user) user = d.data.user;
    });

    setTimeout(() => {
        splashScreen.style.opacity = '0';
        setTimeout(() => splashScreen.remove(), 600);
        
        sendToast(`${scriptName} Injetado!`);
        playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/gcelzszy.wav');
        
        // Inicia o Motor de Resposta
        setInterval(solveMachine, 2000);
    }, 3000);
})();
