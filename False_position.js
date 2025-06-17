document.getElementById("btn").addEventListener("click", function () {
    const equationInput = document.getElementById("equation").value;
    const xlInput = parseFloat(document.getElementById("xl").value);
    const xuInput = parseFloat(document.getElementById("xu").value);
    const epsInput = parseFloat(document.getElementById("eps").value);

    if (isNaN(xlInput) || isNaN(xuInput) || isNaN(epsInput) || equationInput.trim() === "") {
        alert("Please fill all fields with valid values.");
        return;
    }

    // Convert input like x^2 into Math.pow(x, 2)
    const preparedEquation = equationInput.replace(/([xX])\s*\^\s*(\d+)/g, "Math.pow($1, $2)");

    const f = (x) => {
        try {
            return eval(preparedEquation.replace(/x/g, `(${x})`));
        } catch (e) {
            alert("Invalid equation syntax. Use valid JavaScript math syntax (e.g., Math.pow(x,2))");
            throw e;
        }
    };

    let xl = xlInput;
    let xu = xuInput;
    let xr = xl;
    let prevXr = xr;
    let error = 100;
    let iteration = 0;
    const maxIterations = 100;

    const tableBody = document.querySelector("table tbody");
    tableBody.innerHTML = ""; // Clear previous table

    const xrArray = [];

    const fxl0 = f(xl);
    const fxu0 = f(xu);
    if (fxl0 * fxu0 > 0) {
        alert("f(xl) and f(xu) must have opposite signs.");
        return;
    }

    while (error > epsInput && iteration < maxIterations) {
        iteration++;

        const fxl = f(xl);
        const fxu = f(xu);

        xr = xu - (fxu * (xl - xu)) / (fxl - fxu);
        const fxr = f(xr);

        error = iteration === 1 ? 100 : Math.abs((xr - prevXr) / xr) * 100;

        // Save current row BEFORE updating xl/xu
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${iteration}</td>
            <td>${xl.toFixed(6)}</td>
            <td>${fxl.toFixed(6)}</td>
            <td>${xu.toFixed(6)}</td>
            <td>${fxu.toFixed(6)}</td>
            <td>${xr.toFixed(6)}</td>
            <td>${fxr.toFixed(6)}</td>
            <td>${error.toFixed(4)}%</td>
        `;
        tableBody.appendChild(row);

        // Update bounds
        if (fxl * fxr < 0) {
            xu = xr;
        } else {
            xl = xr;
        }

        prevXr = xr;
        xrArray.push(xr);
    }

    // Display root
    document.querySelector(".the-root").innerText = `The Root = ${xr.toFixed(6)}`;

    // Plot the chart
    plotGraph(xrArray);
});

document.getElementById("clear").addEventListener("click", function () {
    document.getElementById("equation").value = "";
    document.getElementById("xl").value = "";
    document.getElementById("xu").value = "";
    document.getElementById("eps").value = "0.1";

    document.querySelector("table tbody").innerHTML = "";
    document.querySelector(".the-root").innerText = "The Root = ";

    if (window.iterChart) {
        window.iterChart.data.labels = [];
        window.iterChart.data.datasets[0].data = [];
        window.iterChart.update();
    }
});

function plotGraph(xrArray) {
    const ctx = document.getElementById("iterationChart").getContext("2d");

    if (window.iterChart) {
        window.iterChart.data.labels = xrArray.map((_, i) => i + 1);
        window.iterChart.data.datasets[0].data = xrArray;
        window.iterChart.update();
    } else {
        window.iterChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: xrArray.map((_, i) => i + 1),
                datasets: [{
                    label: 'XR (Root) per Iteration',
                    data: xrArray,
                    borderColor: 'blue',
                    backgroundColor: 'lightblue',
                    fill: false,
                    tension: 0.2,
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: true },
                    title: {
                        display: true,
                        text: 'False Position Method - Root Approximation'
                    }
                },
                scales: {
                    x: {
                        title: { display: true, text: 'Iteration' }
                    },
                    y: {
                        title: { display: true, text: 'XR Value' }
                    }
                }
            }
        });
    }
}
