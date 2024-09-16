document.addEventListener("DOMContentLoaded", function() {
    initializeWallet();
    updateTodayStats();
    fetchTransactions();
});

const STORAGE_KEY = 'solana_mev_stats';

function initializeWallet() {
    const urlParams = new URLSearchParams(window.location.search);
    const walletAddress = urlParams.get('wallet');

    if (walletAddress) {
        document.getElementById("wallet-address").textContent = `Address: ${walletAddress}`;
        fetchWalletBalance(walletAddress);
    } else {
        document.getElementById("wallet-address").textContent = "No wallet address provided";
    }
}

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

async function fetchTransactions() {
    const urlParams = new URLSearchParams(window.location.search);
    const walletAddress = urlParams.get('wallet');

    if (!walletAddress) {
        document.getElementById("transactions-list").innerHTML = "No wallet address provided";
        return;
    }

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

function showTab(tabId) {
    const tabs = document.getElementsByClassName("tab-content");
    for (let tab of tabs) {
        tab.style.display = "none";
    }
    document.getElementById(tabId).style.display = "block";
}

// Update today's stats and fetch new transactions every 30 seconds
setInterval(() => {
    updateTodayStats();
    fetchTransactions();
}, 30000);