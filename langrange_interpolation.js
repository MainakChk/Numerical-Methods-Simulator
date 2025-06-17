document.getElementById("btn").addEventListener("click", function () {
    const xValues = document.getElementById("xValues").value.split(',').map(Number);
    const yValues = document.getElementById("yValues").value.split(',').map(Number);
    const point = parseFloat(document.getElementById("point").value);

    // Ensure there are valid inputs
    if (xValues.length !== yValues.length || xValues.length < 2 || isNaN(point)) {
        alert("Please provide valid x and y values and a number to interpolate.");
        return;
    }

    // Calculate Lagrange Interpolation
    let result = lagrangeInterpolation(xValues, yValues, point);

    // Display the result in the table
    displayTable(xValues, yValues, point, result);

    // Update the graph
    updateGraph(xValues, yValues, point, result);
});

document.getElementById("clear").addEventListener("click", function () {
    document.getElementById("xValues").value = '';
    document.getElementById("yValues").value = '';
    document.getElementById("point").value = '';
    document.getElementById("resultBody").innerHTML = '';
    document.querySelector(".the-root").innerHTML = 'Interpolated Value = ';
    
    if (window.myChart instanceof Chart) {
        window.myChart.destroy();
    }
});

function lagrangeInterpolation(x, y, point) {
    let result = 0;

    for (let i = 0; i < x.length; i++) {
        let term = y[i];
        for (let j = 0; j < x.length; j++) {
            if (i !== j) {
                term *= (point - x[j]) / (x[i] - x[j]);
            }
        }
        result += term;
    }
    return result;
}

function displayTable(x, y, point, result) {
    const resultBody = document.getElementById("resultBody");
    resultBody.innerHTML = ''; // Clear previous results

    let sum = 0;
    for (let i = 0; i < x.length; i++) {
        let li = 1;
        for (let j = 0; j < x.length; j++) {
            if (i !== j) {
                li *= (point - x[j]) / (x[i] - x[j]);
            }
        }
        let term = y[i] * li;
        sum += term;

        const row = `<tr>
                        <td>${i}</td>
                        <td>${x[i]}</td>
                        <td>${y[i]}</td>
                        <td>${li.toFixed(6)}</td>
                        <td>${term.toFixed(6)}</td>
                    </tr>`;
        resultBody.innerHTML += row;
    }

    // Display interpolated value
    document.querySelector(".the-root").innerHTML = `Interpolated Value = <span id="interpolatedValue">${result.toFixed(4)}</span>`;
}

function updateGraph(x, y, point, result) {
    const ctx = document.getElementById('myChart').getContext('2d');

    // Create the dataset including the interpolated point
    const extendedX = [...x];
    const extendedY = [...y];

    // Add interpolated point to the graph
    extendedX.push(point);
    extendedY.push(result);

    // Sort the points by x for a clean line graph
    const sortedData = extendedX.map((val, idx) => ({ x: val, y: extendedY[idx] }))
        .sort((a, b) => a.x - b.x);

    const data = {
        labels: sortedData.map(p => p.x),
        datasets: [{
            label: 'Interpolation Curve',
            data: sortedData.map(p => p.y),
            fill: false,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.3,
            pointRadius: 5,
            pointHoverRadius: 6
        }]
    };

    // Destroy previous chart if exists
    if (window.myChart instanceof Chart) {
        window.myChart.destroy();
    }

    // Create the chart
    window.myChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Lagrange Interpolation Graph'
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'X'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Y'
                    }
                }
            }
        }
    });
}
