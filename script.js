document.addEventListener("DOMContentLoaded", function() {
    // Simulate fetching wallet data
    const walletAddressElement = document.getElementById("wallet-address");
    const walletBalanceElement = document.getElementById("wallet-balance");

    // Simulated wallet data
    const walletAddress = "YourSolanaWalletAddress";
    const walletBalance = 1234.56;

    // Update wallet data
    walletAddressElement.textContent = `Address: ${walletAddress}`;
    walletBalanceElement.textContent = `Balance: ${walletBalance.toFixed(2)} SOL`;

    // Today Stats functionality
    const todayStatsElement = document.getElementById("today-stats");
    const STORAGE_KEY = 'solana_mev_stats';

    function getStoredStats() {
        const storedStats = localStorage.getItem(STORAGE_KEY);
        if (storedStats) {
            return JSON.parse(storedStats);
        }
        return initializeStats();
    }

    function initializeStats() {
        const stats = {
            startTime: new Date().toISOString(),
            startValue: 500.01
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
        return stats;
    }

    function calculateCurrentValue(stats) {
        const now = new Date();
        const startTime = new Date(stats.startTime);
        const elapsedSeconds = (now - startTime) / 1000;
        const maxStats = 16000.99;
        const totalSeconds = 24 * 60 * 60; // 24 hours in seconds
        const increment = (maxStats - stats.startValue) / totalSeconds;
        
        let currentValue = stats.startValue + (increment * elapsedSeconds);
        
        if (currentValue >= maxStats || elapsedSeconds >= totalSeconds) {
            // Reset if max value reached or 24 hours passed
            return initializeStats().startValue;
        }
        
        return currentValue;
    }

    let stats = getStoredStats();

    function updateTodayStats() {
        const currentValue = calculateCurrentValue(stats);
        todayStatsElement.textContent = `${currentValue.toFixed(2)} SOL`;
    }

    // Initial update
    updateTodayStats();

    // Update every second
    setInterval(updateTodayStats, 1000);
});

function showTab(tabId) {
    const tabs = document.getElementsByClassName("tab-content");
    for (let tab of tabs) {
        tab.style.display = "none";
    }
    document.getElementById(tabId).style.display = "block";
}