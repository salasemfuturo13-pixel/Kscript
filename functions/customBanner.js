// Custom Banner - Kscript by Sala Sem Futuro
(function() {
    if (!window.features.customBanner) return;
    
    console.log('Custom Banner: Active');
    
    function applyCustomBanner() {
        const banners = document.querySelectorAll('[data-test-id*="banner"], .banner, .hero');
        
        banners.forEach(banner => {
            // Aplica estilo customizado
            banner.style.background = 'linear-gradient(122deg, #ffe4e4 0%, #d71717 100%)';
            banner.style.borderBottom = '3px solid #d71717';
            
            // Adiciona texto da Sala Sem Futuro
            const textElement = banner.querySelector('h1, h2, p');
            if (textElement && !textElement.textContent.includes('Sala Sem Futuro')) {
                const customText = document.createElement('span');
                customText.textContent = ' - by Sala Sem Futuro';
                customText.style.color = '#d71717';
                customText.style.fontWeight = 'bold';
                customText.style.marginLeft = '10px';
                textElement.appendChild(customText);
            }
        });
    }
    
    setTimeout(applyCustomBanner, 500);
    window.plppdo?.on('domChanged', applyCustomBanner);
})();
