document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('btn');
    const clearBtn = document.getElementById('clear');
    const graphCanvas = document.getElementById('integralGraph');
    const chartContext = graphCanvas.getContext('2d');
    let chartInstance = null;

    btn.addEventListener('click', simpson13);
    clearBtn.addEventListener('click', clearInputs);

    function simpson13() {
        const equationInput = document.getElementById('equation').value;
        const a = parseFloat(document.getElementById('a').value);
        const b = parseFloat(document.getElementById('b').value);
        const n = parseInt(document.getElementById('n').value);

        if (!equationInput || isNaN(a) || isNaN(b) || isNaN(n) || n % 2 !== 0) {
            alert("Please enter valid inputs. 'n' must be even.");
            return;
        }

        let equation = equationInput
            .replace(/sin/gi, 'Math.sin')
            .replace(/cos/gi, 'Math.cos')
            .replace(/tan/gi, 'Math.tan')
            .replace(/log/gi, 'Math.log')
            .replace(/sqrt/gi, 'Math.sqrt')
            .replace(/abs/gi, 'Math.abs')
            .replace(/\^/g, '**');

        let func;
        try {
            func = new Function('x', 'return ' + equation);
            func(1); // test run
        } catch (e) {
            alert("Invalid equation syntax.");
            return;
        }

        const h = (b - a) / n;
        let sum = func(a) + func(b);

        for (let i = 1; i < n; i++) {
            const x = a + i * h;
            sum += (i % 2 === 0 ? 2 : 4) * func(x);
        }

        const result = (h / 3) * sum;
        document.getElementById('integralResult').innerHTML = `The Integral ≈ ${result.toFixed(6)}`;

        fillTable(a, b, n, h, func);
        plotGraph(a, b, n, func);
    }

    function fillTable(a, b, n, h, func) {
        const table = document.querySelector('.table');
        const tbody = table.getElementsByTagName('tbody')[0] || table.createTBody();
        tbody.innerHTML = '';

        let sumX = a;
        for (let i = 0; i <= n; i++) {
            const fX = func(sumX);
            const row = tbody.insertRow();
            row.insertCell(0).textContent = i;
            row.insertCell(1).textContent = sumX.toFixed(6);
            row.insertCell(2).textContent = fX.toFixed(6);
            sumX += h;
        }
    }

    function plotGraph(a, b, n, func) {
        if (chartInstance) {
            chartInstance.destroy();
        }

        const xValues = [];
        const yValues = [];
        const h = (b - a) / n;

        let x = a;
        for (let i = 0; i <= n; i++) {
            xValues.push(x);
            yValues.push(func(x));
            x += h;
        }

        chartInstance = new Chart(chartContext, {
            type: 'line',
            data: {
                labels: xValues,
                datasets: [{
                    label: 'f(x)',
                    data: yValues,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'white',
                    fill: false,
                    tension: 0.2,
                    pointRadius: 4,
                    pointBackgroundColor: 'blue'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'x',
                            color: 'black'
                        },
                        ticks: {
                            color: 'black'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'f(x)',
                            color: 'black'
                        },
                        ticks: {
                            color: 'black'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: 'black'
                        }
                    }
                }
            }
        });
    }

    function clearInputs() {
        document.getElementById('equation').value = '';
        document.getElementById('a').value = '';
        document.getElementById('b').value = '';
        document.getElementById('n').value = '';
        document.getElementById('integralResult').innerHTML = 'The Integral ≈';
        clearTable();
        clearGraph();
    }

    function clearTable() {
        const table = document.querySelector('.table');
        const tbody = table.getElementsByTagName('tbody')[0];
        if (tbody) {
            tbody.innerHTML = '';
        }
    }

    function clearGraph() {
        if (chartInstance) {
            chartInstance.destroy();
            chartInstance = null;
        }
        chartContext.clearRect(0, 0, graphCanvas.width, graphCanvas.height);

        // Optionally reset canvas size to fix space shrinking issue
        graphCanvas.width = 400;
        graphCanvas.height = 200;
    }
});
