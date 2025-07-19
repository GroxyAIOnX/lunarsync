const themesCatalog = {
    themes: [
        {
            id: 'neon-dark',
            name: 'Neon Dark',
            price: 500,
            preview: '/assets/themes/neon-dark.png'
        },
        {
            id: 'platinum-light',
            name: 'Platinum Light',
            price: 500,
            preview: '/assets/themes/platinum-light.png'
        },
        {
            id: 'cyber-punk',
            name: 'Cyber Punk',
            price: 500,
            preview: '/assets/themes/cyber-punk.png'
        }
    ],

    // Get all available themes
    getAllThemes() {
        return this.themes;
    },

    // Get theme by ID
    getThemeById(id) {
        return this.themes.find(theme => theme.id === id);
    },

    // Purchase theme
    purchaseTheme(themeId) {
        const theme = this.getThemeById(themeId);
        if (!theme) return false;

        // Check if user has enough Gblux
        if (window.gbluxSystem && window.gbluxSystem.purchaseTheme(theme.price)) {
            // Save purchased theme to user's collection
            let purchasedThemes = JSON.parse(localStorage.getItem('purchasedThemes') || '[]');
            if (!purchasedThemes.includes(themeId)) {
                purchasedThemes.push(themeId);
                localStorage.setItem('purchasedThemes', JSON.stringify(purchasedThemes));
            }
            return true;
        }
        return false;
    },

    // Check if user owns theme
    doesUserOwnTheme(themeId) {
        const purchasedThemes = JSON.parse(localStorage.getItem('purchasedThemes') || '[]');
        return purchasedThemes.includes(themeId);
    }
};
