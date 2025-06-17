document.getElementById("btn").addEventListener("click", () => {
    const xValues = document.getElementById("xValues").value.split(",").map(x => parseFloat(x.trim()));
    const fxValues = document.getElementById("fxValues").value.split(",").map(x => parseFloat(x.trim()));
    const xToInterp = parseFloat(document.getElementById("xToInterp").value);

    const n = xValues.length;
    if (fxValues.length !== n) {
        alert("Number of x and f(x) values must be the same.");
        return;
    }
    if (n % 2 === 0) {
        alert("Please enter an odd number of points (e.g., 3, 5, 7...) for Stirling's method.");
        return;
    }

    // Check equal spacing of x values
    const h = xValues[1] - xValues[0];
    for (let i = 1; i < n - 1; i++) {
        if (Math.abs((xValues[i + 1] - xValues[i]) - h) > 1e-10) {
            alert("x values must be equally spaced.");
            return;
        }
    }

    // Find middle index for central difference
    const mid = Math.floor(n / 2);
    const x0 = xValues[mid];
    const u = (xToInterp - x0) / h;

    // Build difference table: diffTable[i][j] = j-th order difference starting at i
    let diffTable = Array(n).fill(0).map(() => Array(n).fill(null));
    for (let i = 0; i < n; i++) {
        diffTable[i][0] = fxValues[i];
    }

    // Fill difference table
    for (let j = 1; j < n; j++) {
        for (let i = 0; i < n - j; i++) {
            diffTable[i][j] = diffTable[i + 1][j - 1] - diffTable[i][j - 1];
        }
    }

    // Factorial function
    function factorial(num) {
        let fact = 1;
        for (let i = 2; i <= num; i++) fact *= i;
        return fact;
    }

    // Stirling interpolation calculation
    let result = diffTable[mid][0];
    let uPower = u; // To keep track of powers of u in odd terms
    let doubleFactor = 1; // For double factorial in denominators (1*3*5...)

    // For each order difference i
    for (let i = 1; i < n; i++) {
        let term = 0;
        if (i % 2 === 1) {
            // Odd terms: Use central differences at mid - floor(i/2)
            let k = (i + 1) / 2;
            let idx = mid - k + 1;
            if (diffTable[idx] && diffTable[idx][i] !== null) {
                term = (uPower * diffTable[idx][i]) / factorial(i);
                result += term;
            }
            // Update uPower for next odd term:
            // multiply by (u² - (k-1)²)
            uPower *= (u * u - (k - 1) * (k - 1));
        } else {
            // Even terms: average of differences at mid - i/2 and mid - i/2 + 1
            let k = i / 2;
            let idx1 = mid - k;
            let idx2 = idx1 + 1;
            if (
                diffTable[idx1] && diffTable[idx2] &&
                diffTable[idx1][i] !== null && diffTable[idx2][i] !== null
            ) {
                term = (((diffTable[idx1][i] + diffTable[idx2][i]) / 2) * Math.pow(u, i)) / factorial(i);
                result += term;
            }
        }
    }

    document.getElementById("result").innerText = result.toFixed(6);

    // Render table headers dynamically
    const headerRow = document.getElementById("resultTableHead");
    let headerHTML = "<tr><th>i</th><th>x</th><th>f(x)</th>";
    for (let order = 1; order < n; order++) {
        headerHTML += `<th>Δ<sup>${order}</sup>f(x)</th>`;
    }
    headerHTML += "</tr>";
    headerRow.innerHTML = headerHTML;

    // Render table body with proper empty cells for missing differences
    const body = document.getElementById("resultTable");
    body.innerHTML = "";
    for (let i = 0; i < n; i++) {
        let rowHTML = `<tr><td>${i}</td><td>${xValues[i]}</td>`;
        for (let j = 0; j < n; j++) {
            if (diffTable[i][j] !== null && diffTable[i][j] !== undefined) {
                rowHTML += `<td>${diffTable[i][j].toFixed(6)}</td>`;
            } else {
                rowHTML += `<td></td>`; // empty cell for missing values
            }
        }
        rowHTML += "</tr>";
        body.innerHTML += rowHTML;
    }
});

document.getElementById("clear").addEventListener("click", () => {
    document.getElementById("xValues").value = "";
    document.getElementById("fxValues").value = "";
    document.getElementById("xToInterp").value = "";
    document.getElementById("result").innerText = "";
    document.getElementById("resultTable").innerHTML = "";
    document.getElementById("resultTableHead").innerHTML = `
      <tr>
        <th>i</th><th>x</th><th>f(x)</th><th>Δf(x)</th><th>Δ²f(x)</th><th>Δ³f(x)</th><th>...</th>
      </tr>`;
});
