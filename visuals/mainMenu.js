// Main Menu - Kscript by Sala Sem Futuro
(function() {
    const menu = document.createElement('div');
    menu.id = 'kscript-main-menu';
    menu.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        width: 300px;
        background: #1a1a1a;
        border: 2px solid #d71717;
        border-radius: 10px;
        color: #fff;
        padding: 15px;
        font-family: Arial, sans-serif;
        z-index: 9000;
        box-shadow: 0 4px 15px rgba(215, 23, 23, 0.3);
    `;
    
    menu.innerHTML = `
        <div style="text-align: center; margin-bottom: 15px; border-bottom: 2px solid #d71717; padding-bottom: 10px;">
            <h3 style="margin: 0; color: #d71717;">Kscript</h3>
            <small style="color: #999;">by Sala Sem Futuro</small>
        </div>
        <div id="menu-content" style="max-height: 400px; overflow-y: auto;">
            <div style="margin-bottom: 10px;">
                <label style="display: flex; align-items: center; margin: 8px 0; cursor: pointer;">
                    <input type="checkbox" id="toggle-question-spoof" checked style="margin-right: 10px;">
                    <span>Spoofar Perguntas</span>
                </label>
                <label style="display: flex; align-items: center; margin: 8px 0; cursor: pointer;">
                    <input type="checkbox" id="toggle-video-spoof" checked style="margin-right: 10px;">
                    <span>Spoofar Vídeos</span>
                </label>
                <label style="display: flex; align-items: center; margin: 8px 0; cursor: pointer;">
                    <input type="checkbox" id="toggle-auto-answer" style="margin-right: 10px;">
                    <span>Auto Responder</span>
                </label>
                <label style="display: flex; align-items: center; margin: 8px 0; cursor: pointer;">
                    <input type="checkbox" id="toggle-minute-farm" style="margin-right: 10px;">
                    <span>Minute Farmer</span>
                </label>
            </div>
        </div>
        <div style="margin-top: 10px; text-align: center;">
            <button id="discord-btn" style="background: #d71717; color: #fff; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; margin: 5px; font-weight: bold;">Discord</button>
            <button id="menu-close-btn" style="background: #333; color: #fff; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; margin: 5px;">Fechar</button>
        </div>
    `;
    
    document.body.appendChild(menu);
    
    document.getElementById('discord-btn').addEventListener('click', () => {
        window.open('https://discord.gg/qw6tmAqfHH', '_blank');
    });
    
    document.getElementById('menu-close-btn').addEventListener('click', () => {
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    });
    
    // Drag functionality
    let isDragging = false;
    let offset = { x: 0, y: 0 };
    
    menu.addEventListener('mousedown', (e) => {
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
})();
