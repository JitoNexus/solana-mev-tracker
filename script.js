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
            const stats = JSON.parse(storedStats);
            const lastUpdated = new Date(stats.lastUpdated);
            const now = new Date();
            
            // Check if 24 hours have passed
            if (now - lastUpdated > 24 * 60 * 60 * 1000) {
                return generateNewStats();
            }
            return stats;
        }
        return generateNewStats();
    }

    function generateNewStats() {
        const newStats = {
            value: 500.01,
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
        return newStats;
    }

    let stats = getStoredStats();
    let todayStats = stats.value;
    const maxStats = 16000.99;
    const increment = (maxStats - 500.01) / (24 * 60 * 60); // Increment per second

    function updateTodayStats() {
        const now = new Date();
        const timePassed = (now - new Date(stats.lastUpdated)) / 1000; // Time passed in seconds
        todayStats = Math.min(maxStats, 500.01 + increment * timePassed);

        if (todayStats >= maxStats) {
            stats = generateNewStats();
            todayStats = stats.value;
        }
        todayStatsElement.textContent = `${todayStats.toFixed(2)} SOL`;
        
        // Update stored stats
        stats.value = todayStats;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
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