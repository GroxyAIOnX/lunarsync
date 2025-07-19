// Update search functionality to include Gblux rewards
document.getElementById('search-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const input = document.getElementById('search-input').value;
    
    if (!input) return;

    // Add Gblux reward for search
    if (window.gbluxSystem) {
        gbluxSystem.addSearchReward();
        // Show reward notification
        const notification = document.createElement('div');
        notification.className = 'gblux-reward-notification';
        notification.textContent = '+100 Gblux for searching!';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    // Continue with normal search
    const searchEngine = localStorage.getItem("searchEngine") || "google";
    const searchUrl = searchEngineUrls[searchEngine].replace("%s", encodeURIComponent(input));
    
    if (searchUrl.startsWith('http')) {
        window.location.href = '/service/' + __uv$config.encodeUrl(searchUrl);
    } else {
        window.location.href = searchUrl;
    }
});
