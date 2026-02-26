// Status Panel - Kscript by Sala Sem Futuro
(function() {
    const panel = document.createElement('div');
    panel.id = 'kscript-status-panel';
    panel.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        width: 250px;
        background: #1a1a1a;
        border: 2px solid #d71717;
        border-radius: 10px;
        color: #fff;
        padding: 12px;
        font-family: Arial, sans-serif;
        z-index: 8999;
        font-size: 12px;
    `;
    
    panel.innerHTML = `
        <div style="text-align: center; border-bottom: 1px solid #d71717; padding-bottom: 8px; margin-bottom: 8px;">
            <strong>STATUS PANEL</strong>
        </div>
        <div id="status-content" style="line-height: 1.6;">
            <div>User: <span id="status-user" style="color: #d71717;">Loading...</span></div>
            <div>Loaded: <span id="status-loaded" style="color: #4ade80;">0</span></div>
            <div>Errors: <span id="status-errors" style="color: #ef4444;">0</span></div>
            <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #333;">
                <div style="margin: 3px 0;">✓ Question Spoof</div>
                <div style="margin: 3px 0;">✓ Video Spoof</div>
                <div style="margin: 3px 0;">✓ Answer Revealer</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(panel);
    
    // Update user info
    document.getElementById('status-user').textContent = window.user?.nickname || 'Guest';
    document.getElementById('status-loaded').textContent = window.loadedPlugins?.length || 0;
})();
