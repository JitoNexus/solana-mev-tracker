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

    // Simulate increasing SOL number for Today Stats
    const todayStatsElement = document.getElementById("today-stats");
    let todayStats = 500.01;
    const maxStats = 16000.99;
    const increment = (maxStats - todayStats) / (24 * 60 * 60); // Increment per second

    setInterval(() => {
        todayStats += increment;
        if (todayStats >= maxStats) {
            todayStats = 500.01; // Reset after reaching max
        }
        todayStatsElement.textContent = `${todayStats.toFixed(2)} SOL`;
    }, 1000); // Update every second
});

function showTab(tabId) {
    const tabs = document.getElementsByClassName("tab-content");
    for (let tab of tabs) {
        tab.style.display = "none";
    }
    document.getElementById(tabId).style.display = "block";
}