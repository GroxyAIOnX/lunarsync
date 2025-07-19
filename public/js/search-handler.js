// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');

    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const input = searchInput.value;
            
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

                // Update the Gblux display
                updateBalanceDisplay();
            }

            // Continue with normal search
            const searchEngine = localStorage.getItem("searchEngine") || "google";
            const searchUrl = searchEngineUrls[searchEngine].replace("%s", encodeURIComponent(input));
            
            try {
                if (searchUrl.startsWith('http')) {
                    window.location.href = '/service/' + __uv$config.encodeUrl(searchUrl);
                } else {
                    window.location.href = searchUrl;
                }
            } catch (error) {
                console.error('Search error:', error);
                // Fallback to direct search
                window.location.href = searchUrl;
            }
        });
    }
});
