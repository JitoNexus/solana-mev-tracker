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
            lastKnownValue: 500.01
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
        const increment = (maxStats - 500.01) / totalSeconds;
        
        let currentValue = 500.01 + (increment * elapsedSeconds);
        
        if (currentValue >= maxStats || elapsedSeconds >= totalSeconds) {
            // Reset if max value reached or 24 hours passed
            return initializeStats().lastKnownValue;
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

    // Fetch and display transactions
    fetchTransactions();
});

function showTab(tabId) {
    const tabs = document.getElementsByClassName("tab-content");
    for (let tab of tabs) {
        tab.style.display = "none";
    }
    document.getElementById(tabId).style.display = "block";
}

async function fetchTransactions() {
    const apiUrl = "https://public-api.solscan.io/transaction/last?limit=50";

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        displayTransactions(data);
    } catch (error) {
        console.error("Error fetching transactions:", error);
    }
}

function displayTransactions(transactions) {
    const transactionsList = document.getElementById("transactions-list");
    transactionsList.innerHTML = ""; // Clear existing transactions

    transactions.forEach(tx => {
        const amount = tx.lamport / 1000000000; // Convert lamports to SOL
        if (amount > 1) {
            const txElement = document.createElement("div");
            txElement.className = "transaction";
            
            const date = new Date(tx.blockTime * 1000).toLocaleString();
            const isTokenSwap = tx.tokenTransfers && tx.tokenTransfers.length > 0;
            const title = isTokenSwap ? "Nexus MEV Attack" : "Solana Transaction";

            txElement.innerHTML = `
                <div class="transaction-title">${title}</div>
                <div class="transaction-amount">${amount.toFixed(2)} SOL</div>
                <div class="transaction-date">${date}</div>
            `;

            transactionsList.appendChild(txElement);
        }
    });
}

// Fetch new transactions every 30 seconds
setInterval(fetchTransactions, 30000);