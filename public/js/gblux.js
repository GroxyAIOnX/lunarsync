// Gblux Currency System
class GbluxSystem {
    constructor() {
        this.initializeSystem();
    }

    async initializeSystem() {
        console.log('Initializing GbluxSystem...');
        
        // Wait for DOM to be ready
        await this.waitForElement('#gblux-container');
        await this.waitForElement('#uv-form');
        
        this.balance = this.getStoredBalance();
        this.searchCount = 0;
        
        // Get DOM elements
        this.container = document.getElementById('gblux-container');
        this.menu = document.getElementById('gblux-menu');
        this.balanceDisplay = document.getElementById('gblux-balance');
        this.balanceDisplayLarge = document.getElementById('gblux-balance-large');
        this.searchForm = document.getElementById('uv-form');
        
        console.log('Found Gblux elements, initializing...');
        this.initializeEventListeners();
        this.updateDisplay();
    }

    // Helper function to wait for an element
    waitForElement(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    // Initialize or get stored balance
    getStoredBalance() {
        const stored = localStorage.getItem('gbluxBalance');
        return stored ? parseInt(stored) : 50; // Start with 50 Gblux
    }

    // Save balance
    saveBalance() {
        localStorage.setItem('gbluxBalance', this.balance.toString());
    }

    // Get current balance
    getBalance() {
        return this.balance;
    }

    // Add Gblux for search
    addSearchReward() {
        this.balance += 100; // 100 Gblux per search
        this.searchCount++;
        this.saveBalance();
        this.updateDisplay();
    }

    // Initialize event listeners
    initializeEventListeners() {
        if (this.container) {
            this.container.addEventListener('click', (event) => {
                if (!this.menu.contains(event.target)) {
                    this.toggleMenu();
                }
            });
        }
        document.addEventListener('click', (event) => {
            if (!this.container.contains(event.target)) {
                this.closeMenu();
            }
        });

        // Add search form listener
        if (this.searchForm) {
            this.searchForm.addEventListener('submit', (event) => {
                // Add reward for searching
                this.addSearchReward();
                console.log('Search reward added! New balance:', this.balance);
            });
    }

    // Toggle menu visibility
    toggleMenu() {
        console.log('Toggling menu visibility');
        if (this.menu.style.display === 'none' || !this.menu.style.display) {
            this.menu.style.display = 'block';
        } else {
            this.menu.style.display = 'none';
        }
    }

    // Close menu
    closeMenu() {
        if (this.menu) {
            this.menu.style.display = 'none';
        }
    }

    // Update balance display
    updateDisplay() {
        if (this.balanceDisplay) {
            this.balanceDisplay.textContent = this.balance;
        }
        if (this.balanceDisplayLarge) {
            this.balanceDisplayLarge.textContent = this.balance;
        }
    }

    // Purchase theme
    purchaseTheme(themeCost) {
        if (this.balance >= themeCost) {
            this.balance -= themeCost;
            this.saveBalance();
            this.updateDisplay();
            return true;
        }
        return false;
    }
}

// Initialize the Gblux system
(async () => {
    console.log('Starting Gblux system initialization...');
    try {
        window.gbluxSystem = new GbluxSystem();
    } catch (error) {
        console.error('Error initializing Gblux system:', error);
    }
})();

// Function to reward searches
function rewardSearch() {
    if (window.gbluxSystem) {
        window.gbluxSystem.addSearchReward();
    } else {
        console.error('GbluxSystem not initialized');
    }
}
