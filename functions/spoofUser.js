// Spoof User - Kscript by Sala Sem Futuro
(function() {
    console.log('User Spoof: Loaded');
    
    // Permite customizar informações do usuário
    const customizarUsuario = () => {
        if (window.featureConfigs.customUsername) {
            window.user.username = window.featureConfigs.customUsername;
        }
        
        if (window.featureConfigs.customPfp) {
            const profileImg = document.querySelector('[data-test-id="user-profile-pic"]');
            if (profileImg) {
                profileImg.src = window.featureConfigs.customPfp;
            }
        }
    };
    
    // Executa na mudança do DOM
    window.plppdo?.on('domChanged', customizarUsuario);
    
    // Também executa imediatamente
    setTimeout(() => {
        customizarUsuario();
        console.log('User customization applied');
    }, 1000);
})();
