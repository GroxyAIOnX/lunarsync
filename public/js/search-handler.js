// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('uv-form');
    const searchInput = document.getElementById('uv-address');

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

            // Continue with UV search
            const searchEngine = document.getElementById('uv-search-engine').value;
            const url = searchEngine.replace('%s', encodeURIComponent(input));
            
            try {
                const encodedUrl = __uv$config.encodeUrl(url);
                window.location.href = __uv$config.prefix + encodedUrl;
            } catch (err) {
                console.error('Search error:', err);
                document.getElementById('uv-error').textContent = 'Error: ' + err.toString();
            }
        });
    }
});
