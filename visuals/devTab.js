// Dev Tab - Kscript by Sala Sem Futuro
(function() {
    if (!window.isDev) return;
    
    const devTab = document.createElement('div');
    devTab.id = 'kscript-dev-tab';
    devTab.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        width: 300px;
        background: #1a1a1a;
        border: 2px solid #ffaa00;
        border-radius: 10px;
        color: #fff;
        padding: 15px;
        font-family: monospace;
        z-index: 8998;
        font-size: 11px;
        max-height: 300px;
        overflow-y: auto;
    `;
    
    devTab.innerHTML = `
        <div style="text-align: center; border-bottom: 1px solid #ffaa00; padding-bottom: 8px; margin-bottom: 8px;">
            <strong>DEV MODE</strong>
        </div>
        <div id="dev-content">
            <div>Version: ${window.ver || 'V1.0'}</div>
            <div>Dev Mode: ON</div>
            <div>Loaded Plugins: ${window.loadedPlugins?.length || 0}</div>
        </div>
    `;
    
    document.body.appendChild(devTab);
})();
