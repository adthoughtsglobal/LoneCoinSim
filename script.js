const ctx = document.getElementById('dynamicGraph').getContext('2d');
const maxPoints = 30;
var bought = 0;
var balance = 100;

var data = {
    labels: [],
    datasets: [
        {
            label: 'Bought',
            data: [],
            backgroundColor: 'rgba(251, 255, 43, 0.5)',
            borderColor: 'rgba(75, 192, 192, 0.3)',
            borderWidth: 2,
            fill: 'origin',
            tension: 0.1
        },
        {
            label: 'Value',
            data: [],
            borderColor: 'rgba(75, 192, 192, 0.3)',
            borderWidth: 2,
            backgroundColor: 'rgba(109, 255, 255, 0.5)',
            fill: 'origin',
        }
    ]
};

var config = {
    type: 'line',
    data: data,
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
                title: { display: true, text: 'Time' }
            },
            y: {
                min: 0,
                title: { display: true, text: 'Value / Percentage' }
            }
        },
        animation: {
            duration: 200,
            easing: 'easeInSine'
        }
    }
};

const chart = new Chart(ctx, config);

let value = 50;
let currentTime = 0;
let modeDuration = 0;
let mode = '';
const baseModes = ['value hike', 'depression', 'stable', 'unstable'];

function getNextMode() {
    const extraDepressions = Math.max(0, Math.floor((value - 100) / 10));
    var fewerHikes = Math.max(0, Math.floor((value - 100) / 20));
    const modes = baseModes
        .filter(m => m !== 'value hike' || fewerHikes-- <= 0)
        .concat(Array(extraDepressions).fill('depression'));
    mode = modes[Math.floor(Math.random() * modes.length)];
    modeDuration = Math.floor(Math.random() * 5) + 5;
}

function updateValue() {
    let textdisp = 'Good Luck.';
    switch (mode) {
        case 'value hike':
            value += Math.random() * 7 + 1;
            textdisp = 'Reported possible value hike';
            break;
        case 'depression':
            value -= Math.random() * 7 + 1;
            textdisp = 'Widespread economic depression reported.';
            break;
        case 'stable':
            value += Math.random() * 2 - 1;
            textdisp = 'LoneCoinSim';
            break;
        case 'unstable':
            value += Math.random() * 10 - 1;
            textdisp = 'Widespread economic instability reported.';
            break;
    }
    document.getElementById('achivements').innerText = textdisp;
    value = Math.max(value, 0);
}

function updateGraph() {

    var stockPrice = 50;
    var sharesOwned = bought > 0 ? bought / stockPrice : 0;
    var totalDividends = 0;

    const dividendYield = 0.02;
    function calculateDividends() {
        if (bought > 0) {
            const dividends = sharesOwned * stockPrice * dividendYield;
            totalDividends += dividends;
        }
    }

    if (modeDuration === 0) getNextMode();
    updateValue();

    stockPrice = Math.max(1, value);

    const portfolioValue = bought > 0 ? sharesOwned * stockPrice : 0;
    calculateDividends();
    balance = bought > 0 ? portfolioValue + totalDividends : balance;

    document.getElementById("profbal").innerText = `$${balance.toFixed(2)}`;

    if (data.labels.length >= maxPoints) {
        data.labels.shift();
        data.datasets[1].data.shift();
        data.datasets[0].data.shift();
    }

    data.labels.push(currentTime);
    data.datasets[1].data.push(stockPrice);
    data.datasets[0].data.push(portfolioValue);

    if (stockPrice >= config.options.scales.y.max) {
        config.options.scales.y.max += 10;
    }

    chart.update();
    currentTime++;
    modeDuration--;
}

setInterval(updateGraph, 1000);

const shareManager = {
    shares: 0,
    sellAll() {
        if (this.shares > 0) {
            balance += this.shares * value;
            this.shares = 0;
            document.getElementById("profbal").innerText = `$${balance.toFixed(2)}`;
            document.getElementById("sharesOwned").innerText = `${this.shares} shares`;
        }
    },
    buy(percentage) {
        const maxAffordableShares = Math.floor(balance / value);
        const sharesToBuy = Math.floor(maxAffordableShares * (percentage / 100));
        if (sharesToBuy > 0) {
            balance -= sharesToBuy * value;
            this.shares += sharesToBuy;
            document.getElementById("profbal").innerText = `$${balance.toFixed(2)}`;
            document.getElementById("sharesOwned").innerText = `${this.shares} shares`;
        }
    },
    sell(percentage) {
        const sharesToSell = Math.floor(this.shares * (percentage / 100));
        if (sharesToSell > 0) {
            balance += sharesToSell * value;
            this.shares -= sharesToSell;
            document.getElementById("profbal").innerText = `$${balance.toFixed(2)}`;
            document.getElementById("sharesOwned").innerText = `${this.shares} shares`;
        }
    }
};