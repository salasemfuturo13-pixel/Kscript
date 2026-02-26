// RGB Logo - Kscript by Sala Sem Futuro
(function() {
    if (!window.features.rgbLogo) return;
    
    console.log('RGB Logo: Active');
    
    function animateRgb() {
        const logos = document.querySelectorAll('img[src*="logo"], [data-test-id*="logo"]');
        
        logos.forEach((logo, index) => {
            const hue = (Date.now() / 20 + index * 30) % 360;
            logo.style.filter = `hue-rotate(${hue}deg) brightness(1.1)`;
        });
    }
    
    setInterval(animateRgb, 50);
})();
