document.getElementById("btn").addEventListener("click", simpson38);
document.getElementById("clear").addEventListener("click", clearFields);

let chart; // Global Chart instance

function simpson38() {
    const funcStr = document.getElementById("equation").value;
    const a = parseFloat(document.getElementById("a").value);
    const b = parseFloat(document.getElementById("b").value);
    const n = parseInt(document.getElementById("n").value);
    const output = document.querySelector(".the-root");
    const tbody = document.getElementById("results-table");

    tbody.innerHTML = "";

    if (isNaN(a) || isNaN(b) || isNaN(n) || !funcStr) {
        alert("Please enter valid inputs for all fields.");
        return;
    }

    if (n % 3 !== 0) {
        alert("Number of intervals (n) must be a multiple of 3.");
        return;
    }

    let f;
    try {
        f = new Function("x", "return " + funcStr + ";");
        f((a + b) / 2);
    } catch (err) {
        alert("Invalid function expression. Use 'x' and JavaScript syntax (e.g., Math.sin(x), x*x).");
        return;
    }

    const h = (b - a) / n;
    let result = f(a) + f(b);

    const iVals = [0];
    const fxVals = [f(a)];

    for (let i = 1; i < n; i++) {
        const x = a + i * h;
        const fx = f(x);
        const coeff = (i % 3 === 0) ? 2 : 3;

        result += coeff * fx;
        iVals.push(i);
        fxVals.push(fx);

        const row = `<tr>
                        <td>${i}</td>
                        <td>${x.toFixed(4)}</td>
                        <td>${fx.toFixed(6)}</td>
                     </tr>`;
        tbody.innerHTML += row;
    }

    iVals.push(n);
    fxVals.push(f(b));
    const row0 = `<tr><td>0</td><td>${a.toFixed(4)}</td><td>${f(a).toFixed(6)}</td></tr>`;
    const rowN = `<tr><td>${n}</td><td>${b.toFixed(4)}</td><td>${f(b).toFixed(6)}</td></tr>`;
    tbody.innerHTML = row0 + tbody.innerHTML + rowN;

    result *= (3 * h) / 8;
    output.innerHTML = `Approximate Value of Integral = <span style="color: lightgreen;">${result.toFixed(6)}</span>`;

    drawChart(iVals, fxVals);
}

function drawChart(iVals, fxVals) {
    const ctx = document.getElementById("simpsonChart").getContext("2d");

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: iVals,
            datasets: [{
                label: 'Simpson\'s 3/8 Rule Approximation',
                data: fxVals,
                borderColor: 'blue',
                backgroundColor: 'rgba(0, 0, 255, 0.1)',
                fill: true,
                tension: 0.3,
                pointBackgroundColor: 'red',
                pointBorderColor: 'black',
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#000'
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Interval Index (i)",
                        color: "#000",
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        color: "#000"
                    },
                    grid: {
                        color: "#ccc"
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: "f(xᵢ) - Function Value",
                        color: "#000",
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        color: "#000"
                    },
                    grid: {
                        color: "#ccc"
                    }
                }
            }
        },
        plugins: [{
            id: 'whiteBackground',
            beforeDraw: chart => {
                const ctx = chart.canvas.getContext('2d');
                ctx.save();
                ctx.globalCompositeOperation = 'destination-over';
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, chart.width, chart.height);
                ctx.restore();
            }
        }]
    });
}

function clearFields() {
    document.getElementById("equation").value = "";
    document.getElementById("a").value = "";
    document.getElementById("b").value = "";
    document.getElementById("n").value = "";
    document.getElementById("results-table").innerHTML = "";
    document.querySelector(".the-root").innerHTML = "Approximate Value of Integral =";

    if (chart) {
        chart.destroy();
        chart = null;
    }
}
