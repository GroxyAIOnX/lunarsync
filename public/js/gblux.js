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
const gbluxSystem = new GbluxSystem();

// Add to window for global access
window.gbluxSystem = gbluxSystem;

// Update balance display
function updateBalanceDisplay() {
    const balanceElement = document.getElementById('gblux-balance');
    if (balanceElement) {
        balanceElement.textContent = gbluxSystem.getBalance();
    }
}

// Reward search function
function rewardSearch() {
    gbluxSystem.addSearchReward();
    updateBalanceDisplay();
}
