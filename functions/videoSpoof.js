// Video Spoof - Kscript by Sala Sem Futuro
(function() {
    if (!window.features.videoSpoof) return;
    
    console.log('Video Spoof: Active');
    
    // Encontra e manipula vídeos
    function spoofVideos() {
        const videos = document.querySelectorAll('video, [data-test-id*="video"]');
        
        videos.forEach(video => {
            if (video.tagName === 'VIDEO') {
                // Avança para o final automaticamente
                if (video.duration > 0) {
                    video.currentTime = video.duration - 1;
                }
            }
        });
        
        // Clica em botões "continuar" ou "próximo"
        const keywords = ['continuar', 'próximo', 'proximo', 'avançar', 'avancar'];
        document.querySelectorAll('button').forEach(btn => {
            const text = (btn.textContent || '').toLowerCase();
            if (keywords.some(k => text.includes(k)) && !btn.disabled && btn.offsetParent !== null) {
                btn.click();
            }
        });
    }
    
    setInterval(spoofVideos, 3000);
    window.plppdo?.on('domChanged', spoofVideos);
})();
