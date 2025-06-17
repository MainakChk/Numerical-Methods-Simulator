document.getElementById('btn').addEventListener('click', function () {
    const expr = document.getElementById('equation').value;
    const a = parseFloat(document.getElementById('a').value);
    const b = parseFloat(document.getElementById('b').value);
    const n = parseInt(document.getElementById('n').value);
    const tableBody = document.getElementById('result-table');
    const resultDisplay = document.querySelector('.the-root');

    tableBody.innerHTML = '';
    resultDisplay.textContent = 'Approximated Integral = ';

    if (isNaN(a) || isNaN(b) || isNaN(n) || !expr) {
        alert("Please enter valid inputs.");
        return;
    }

    const h = (b - a) / n;
    let sum = 0;

    const iValues = [];
    const fxValues = [];

    try {
        const f = new Function("x", "return " + expr);

        for (let i = 0; i <= n; i++) {
            const x = a + i * h;
            const fx = f(x);

            iValues.push(i);
            fxValues.push(fx);

            const row = document.createElement("tr");
            row.innerHTML = `<td>${i}</td><td>${x.toFixed(4)}</td><td>${fx.toFixed(4)}</td>`;
            tableBody.appendChild(row);

            sum += (i === 0 || i === n) ? fx : 2 * fx;
        }

        const integral = (h / 2) * sum;
        resultDisplay.textContent = `Approximated Integral = ${integral.toFixed(6)}`;

        drawChart(iValues, fxValues);
    } catch (error) {
        alert("Invalid function. Use 'x' as the variable (e.g., Math.sin(x), x*x, etc.)");
    }
});

document.getElementById('clear').addEventListener('click', function () {
    document.getElementById('equation').value = '';
    document.getElementById('a').value = '';
    document.getElementById('b').value = '';
    document.getElementById('n').value = '';
    document.getElementById('result-table').innerHTML = '';
    document.querySelector('.the-root').textContent = 'Approximated Integral = ';

    if (chart) chart.destroy();
});

let chart;

function drawChart(iValues, fxValues) {
    const ctx = document.getElementById('trapezoidalChart').getContext('2d');

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: iValues,
            datasets: [{
                label: 'f(xᵢ) vs i',
                data: fxValues,
                backgroundColor: 'rgba(0, 123, 255, 0.3)',
                borderColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 2,
                pointRadius: 4,
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: { color: '#000' }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'i (interval index)',
                        color: '#000'
                    },
                    ticks: {
                        color: '#000'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'f(xᵢ)',
                        color: '#000'
                    },
                    ticks: {
                        color: '#000'
                    }
                }
            }
        }
    });
}
