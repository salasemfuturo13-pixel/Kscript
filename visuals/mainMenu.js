// KScript Main Menu - Modificado por JK
(function() {
    // Remove o menu antigo se ele já existir para não duplicar
    const oldMenu = document.getElementById('kscript-main-menu');
    if (oldMenu) oldMenu.remove();

    const menu = document.createElement('div');
    menu.id = 'kscript-main-menu';
    
    // Configurações de estilo: Preto e Vermelho
    menu.style.cssText = `
        position: fixed;
        top: 50px;
        left: 20px;
        width: 320px;
        background: #000000; /* Preto Absoluto */
        border: 2px solid #ff0000; /* Vermelho Puro */
        border-radius: 12px;
        color: #fff;
        padding: 20px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        z-index: 10001;
        box-shadow: 0 0 20px rgba(255, 0, 0, 0.5); /* Brilho Vermelho */
        user-select: none;
    `;
    
    // Conteúdo do Menu com sua Logo e Créditos JK
    menu.innerHTML = `
        <div style="text-align: center; margin-bottom: 15px; border-bottom: 2px solid #ff0000; padding-bottom: 15px;">
            <img src="https://github.com/salasemfuturo13-pixel/Kscript/blob/main/logo.png?raw=true" style="height: 60px; filter: drop-shadow(0 0 5px #ff0000); margin-bottom: 10px;">
            <h2 style="margin: 0; color: #ff0000; letter-spacing: 3px; text-transform: uppercase; font-size: 24px;">KScript</h2>
            <small style="color: #ffffff; font-weight: bold; letter-spacing: 1px;">BY JK</small>
        </div>
        <div id="menu-content" style="max-height: 400px; overflow-y: auto; padding-right: 5px;">
            <div style="margin-bottom: 15px;">
                <p style="color: #ff0000; font-size: 12px; font-weight: bold; margin-bottom: 10px; text-align: center;">CONFIGURAÇÕES</p>
                
                <label style="display: flex; align-items: center; justify-content: space-between; margin: 12px 0; cursor: pointer; background: #111; padding: 8px; border-radius: 5px; border-left: 3px solid #ff0000;">
                    <span style="font-size: 14px;">Spoofar Perguntas</span>
                    <input type="checkbox" id="toggle-question-spoof" checked style="accent-color: #ff0000; width: 18px; height: 18px;">
                </label>
                
                <label style="display: flex; align-items: center; justify-content: space-between; margin: 12px 0; cursor: pointer; background: #111; padding: 8px; border-radius: 5px; border-left: 3px solid #ff0000;">
                    <span style="font-size: 14px;">Spoofar Vídeos</span>
                    <input type="checkbox" id="toggle-video-spoof" checked style="accent-color: #ff0000; width: 18px; height: 18px;">
                </label>
                
                <label style="display: flex; align-items: center; justify-content: space-between; margin: 12px 0; cursor: pointer; background: #111; padding: 8px; border-radius: 5px; border-left: 3px solid #ff0000;">
                    <span style="font-size: 14px;">Auto Responder</span>
                    <input type="checkbox" id="toggle-auto-answer" style="accent-color: #ff0000; width: 18px; height: 18px;">
                </label>
                
                <label style="display: flex; align-items: center; justify-content: space-between; margin: 12px 0; cursor: pointer; background: #111; padding: 8px; border-radius: 5px; border-left: 3px solid #ff0000;">
                    <span style="font-size: 14px;">Minute Farmer</span>
                    <input type="checkbox" id="toggle-minute-farm" style="accent-color: #ff0000; width: 18px; height: 18px;">
                </label>
            </div>
        </div>
        <div style="margin-top: 15px; display: flex; justify-content: space-between;">
            <button id="discord-btn" style="background: #ff0000; color: #000; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: 900; flex: 1; margin-right: 5px; transition: 0.3s; text-transform: uppercase;">Discord</button>
            <button id="menu-close-btn" style="background: #222; color: #fff; border: 1px solid #444; padding: 10px 15px; border-radius: 5px; cursor: pointer; flex: 1; margin-left: 5px;">Fechar</button>
        </div>
        <div style="text-align: center; margin-top: 15px; font-size: 10px; color: #555;">KScript v1.0 | JK Edition</div>
    `;
    
    document.body.appendChild(menu);
    
    // Eventos
    document.getElementById('discord-btn').addEventListener('click', () => {
        window.open('https://discord.gg/qw6tmAqfHH', '_blank');
    });
    
    document.getElementById('menu-close-btn').addEventListener('click', () => {
        menu.style.display = 'none';
        // Criar um atalho para abrir de novo caso fechado
        createOpenButton();
    });

    function createOpenButton() {
        if(document.getElementById('open-kscript-btn')) return;
        const btn = document.createElement('button');
        btn.id = 'open-kscript-btn';
        btn.innerHTML = 'K';
        btn.style.cssText = 'position:fixed; bottom:20px; left:20px; background:#ff0000; color:#000; border:none; border-radius:50%; width:40px; height:40px; font-weight:bold; cursor:pointer; z-index:9001; box-shadow: 0 0 10px #f00;';
        btn.onclick = () => { menu.style.display = 'block'; btn.remove(); };
        document.body.appendChild(btn);
    }
    
    // Sistema para Arrastar o Menu (Drag)
    let isDragging = false;
    let offset = { x: 0, y: 0 };
    
    menu.addEventListener('mousedown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;
        isDragging = true;
        offset.x = e.clientX - menu.getBoundingClientRect().left;
        offset.y = e.clientY - menu.getBoundingClientRect().top;
    });
    
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            menu.style.left = (e.clientX - offset.x) + 'px';
            menu.style.top = (e.clientY - offset.y) + 'px';
        }
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Notificação console
    console.log("%c [KScript] Menú JK Carregado ", "background: #ff0000; color: #000; font-weight: bold;");
})();
