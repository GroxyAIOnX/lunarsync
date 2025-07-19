// Gblux Currency System
class GbluxSystem {
    constructor() {
        this.balance = this.getStoredBalance();
        this.searchCount = 0;
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
    }

    // Purchase theme
    purchaseTheme(themeCost) {
        if (this.balance >= themeCost) {
            this.balance -= themeCost;
            this.saveBalance();
            return true;
        }
        return false;
    }
}

// Initialize Gblux system
let gbluxSystem;

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', function() {
    gbluxSystem = new GbluxSystem();
    window.gbluxSystem = gbluxSystem;
    
    // Ensure initial balance display
    updateBalanceDisplay();
    
    console.log('Gblux system initialized with balance:', gbluxSystem.getBalance());
});

// Update balance display
function updateBalanceDisplay() {
    if (!window.gbluxSystem) {
        console.warn('Gblux system not initialized yet');
        return;
    }
    
    const balance = gbluxSystem.getBalance();
    console.log('Updating balance display:', balance);
    
    const balanceElements = document.querySelectorAll('#gblux-balance, #gblux-balance-large');
    balanceElements.forEach(element => {
        if (element) {
            element.textContent = balance;
        }
    });

    // Force widget visibility
    const widget = document.querySelector('.gblux-widget');
    if (widget) {
        widget.style.display = 'block';
        widget.style.visibility = 'visible';
        widget.style.opacity = '1';
    }
}

// Setup Gblux menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const gbluxButton = document.getElementById('gbluxButton');
    const gbluxMenu = document.getElementById('gbluxMenu');

    if (gbluxButton && gbluxMenu) {
        gbluxButton.addEventListener('click', function(e) {
            e.stopPropagation();
            gbluxMenu.classList.toggle('show');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!gbluxMenu.contains(e.target) && !gbluxButton.contains(e.target)) {
                gbluxMenu.classList.remove('show');
            }
        });
    }

    // Initial balance update
    updateBalanceDisplay();
});

// Reward search function
function rewardSearch() {
    gbluxSystem.addSearchReward();
    updateBalanceDisplay();
}
