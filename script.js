const ctx = document.getElementById('dynamicGraph').getContext('2d');
const maxPoints = 30;
let bought = 20;

var data = {
    labels: [],
    datasets: [
        {
            label: 'Bought',
            data: [],
            backgroundColor: 'rgb(251, 255, 43)',
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
            backgroundColor: 'rgb(109, 255, 255)',
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
            value += Math.random() * 5 + 1;
            textdisp = 'Reported possible value hike';
            break;
        case 'depression':
            value -= Math.random() * 5 + 1;
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
    if (modeDuration === 0) getNextMode();
    updateValue();

    const boughtPercentage = (bought / 100) * value;

    if (data.labels.length >= maxPoints) {
        data.labels.shift();
        data.datasets[1].data.shift();
        data.datasets[0].data.shift();
    }

    data.labels.push(currentTime);
    data.datasets[1].data.push(value);
    data.datasets[0].data.push(boughtPercentage);

    if (value >= config.options.scales.y.max) {
        config.options.scales.y.max += 10;
    }

    chart.update();
    currentTime++;
    modeDuration--;
}

setInterval(updateGraph, 1000);