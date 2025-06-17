document.getElementById("btn").addEventListener("click", besselInterpolation);
document.getElementById("clear").addEventListener("click", clearFields);

function parseInput() {
    const dataPointsInput = document.getElementById("dataPoints").value.trim();
    const xValue = parseFloat(document.getElementById("xValue").value.trim());

    if (!dataPointsInput) {
        alert("Please provide data points.");
        return null;
    }
    if (isNaN(xValue)) {
        alert("Please enter a valid number for x.");
        return null;
    }

    const dataPoints = dataPointsInput.split("\n").map(line => {
        return line.trim().split(/\s+/).map(Number);
    });

    for (let dp of dataPoints) {
        if (dp.length !== 2 || dp.some(isNaN)) {
            alert("Each data point should contain exactly two numbers (x and y).");
            return null;
        }
    }

    return { dataPoints, xValue };
}

function besselInterpolation() {
    const parsed = parseInput();
    if (!parsed) return;

    const { dataPoints, xValue } = parsed;
    const n = dataPoints.length;

    // Check equal spacing of x
    const h = dataPoints[1][0] - dataPoints[0][0];
    for (let i = 1; i < n - 1; i++) {
        if (Math.abs((dataPoints[i+1][0] - dataPoints[i][0]) - h) > 1e-10) {
            alert("x values must be equally spaced.");
            return;
        }
    }

    const xValues = dataPoints.map(dp => dp[0]);
    const yValues = dataPoints.map(dp => dp[1]);

    // Build difference table (forward differences)
    // deltaTable[0] = y values, deltaTable[1] = first differences, etc.
    let deltaTable = [];
    deltaTable.push(yValues.slice());

    for (let order = 1; order < n; order++) {
        let differences = [];
        const prev = deltaTable[order - 1];
        for (let i = 0; i < prev.length - 1; i++) {
            differences.push(prev[i + 1] - prev[i]);
        }
        deltaTable.push(differences);
    }

    // Find the index of the center point (closest x to xValue)
    let centerIndex = 0;
    let minDiff = Math.abs(xValues[0] - xValue);
    for (let i = 1; i < n; i++) {
        const diff = Math.abs(xValues[i] - xValue);
        if (diff < minDiff) {
            minDiff = diff;
            centerIndex = i;
        }
    }

    // Calculate p = (x - x_center)/h
    const p = (xValue - xValues[centerIndex]) / h;

    // Bessel interpolation formula — simplified and using first few terms:
    // See: https://en.wikipedia.org/wiki/Bessel%27s_interpolation_formula

    // First term:
    let result = deltaTable[0][centerIndex];

    // For factorial
    function factorial(num) {
        let f = 1;
        for (let i = 2; i <= num; i++) f *= i;
        return f;
    }

    // Use a helper for central differences combining forward and backward:
    // Since Bessel uses averages of forward and backward differences around centerIndex

    function avgDiff(order, index) {
        // average of forward and backward differences for order-th difference at index
        // Watch boundaries to avoid undefined
        const forward = deltaTable[order][index] !== undefined ? deltaTable[order][index] : 0;
        const backward = deltaTable[order][index - 1] !== undefined ? deltaTable[order][index - 1] : 0;
        return (forward + backward) / 2;
    }

    // Compute terms of the series
    // terms alternate between even and odd order differences
    // For simplicity, compute up to 4th order difference terms

    let termSign = 1;
    for (let i = 1; i <= 4; i++) {
        let val = 0;
        if (i % 2 === 1) {
            // odd terms use first difference * p (or (p² -1)/2!) etc.
            const k = Math.floor((i + 1) / 2);
            if (k === 1) {
                // first order difference
                val = p * avgDiff(1, centerIndex);
            } else if (k === 2) {
                val = (p * (p * p - 1) / factorial(3)) * avgDiff(3, centerIndex);
            }
        } else {
            // even terms use second difference
            const k = i / 2;
            if (k === 1) {
                val = (p * p / factorial(2)) * avgDiff(2, centerIndex);
            } else if (k === 2) {
                val = (p * p * (p * p - 1) / factorial(4)) * avgDiff(4, centerIndex);
            }
        }
        result += val;
    }

    document.querySelector(".the-root").textContent = "Interpolated Value = " + result.toFixed(6);

    populateTable(deltaTable, xValues);
}

function populateTable(deltaTable, xValues) {
    const tableBody = document.getElementById("besselTableBody");
    if (!tableBody) return;

    tableBody.innerHTML = "";

    const n = xValues.length;
    // Maximum order of differences
    const maxOrder = deltaTable.length - 1;

    for (let i = 0; i < n; i++) {
        const row = document.createElement("tr");

        // i
        let cell = document.createElement("td");
        cell.textContent = i;
        row.appendChild(cell);

        // xi
        cell = document.createElement("td");
        cell.textContent = xValues[i];
        row.appendChild(cell);

        // Δ⁰f(x) = y-values
        cell = document.createElement("td");
        cell.textContent = deltaTable[0][i];
        row.appendChild(cell);

        // Higher order differences Δf, Δ²f, ...
        for (let order = 1; order <= maxOrder; order++) {
            cell = document.createElement("td");
            // For each order, only print difference if index i is valid
            if (i < deltaTable[order].length) {
                cell.textContent = deltaTable[order][i].toFixed(6);
            } else {
                cell.textContent = "";
            }
            row.appendChild(cell);
        }

        tableBody.appendChild(row);
    }
}

function clearFields() {
    document.getElementById("dataPoints").value = "";
    document.getElementById("xValue").value = "";
    document.querySelector(".the-root").textContent = "Interpolated Value = ";
    const tableBody = document.getElementById("besselTableBody");
    if (tableBody) {
        tableBody.innerHTML = "<tr><td colspan='7' class='text-center'>No data yet</td></tr>";
    }
}
