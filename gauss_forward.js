document.getElementById('btn').addEventListener('click', function () {
    const xInput = document.getElementById('xValues').value;
    const yInput = document.getElementById('yValues').value;
    const xValues = xInput.split(',').map(val => parseFloat(val.trim()));
    const yValues = yInput.split(',').map(val => parseFloat(val.trim()));
    const interpolateX = parseFloat(document.getElementById('interpolateX').value);

    // Validate inputs
    if (
        xValues.length !== yValues.length ||
        xValues.length < 2 ||
        xValues.includes(NaN) ||
        yValues.includes(NaN) ||
        isNaN(interpolateX)
    ) {
        alert("Invalid input! Ensure X and Y values are equal in length and numeric. Also enter a number to interpolate.");
        return;
    }

    const n = xValues.length;
    const h = xValues[1] - xValues[0]; // assume equally spaced
    const u = (interpolateX - xValues[0]) / h;

    // Build forward difference table
    const forwardDifferences = [yValues.slice()]; // 0th order is just yValues
    for (let i = 1; i < n; i++) {
        const prev = forwardDifferences[i - 1];
        const current = [];
        for (let j = 0; j < prev.length - 1; j++) {
            current.push(prev[j + 1] - prev[j]);
        }
        forwardDifferences.push(current);
    }

    // Fill the table
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = '';
    for (let i = 0; i < n; i++) {
        const row = document.createElement('tr');
        let rowHTML = `<td>${i}</td><td>${xValues[i]}</td><td>${yValues[i]}</td>`;

        // Add Δy, Δ²y, etc.
        for (let k = 1; k <= 4; k++) {
            const val = forwardDifferences[k]?.[i] ?? '';
            rowHTML += `<td>${val !== '' ? val.toFixed(4) : ''}</td>`;
        }

        row.innerHTML = rowHTML;
        tbody.appendChild(row);
    }

    // Gauss Forward Interpolation Formula
    let interpolated = yValues[0];
    let uTerm = 1;

    for (let i = 1; i < n; i++) {
        uTerm *= (u - (i - 1));
        if (forwardDifferences[i][0] !== undefined) {
            interpolated += (uTerm * forwardDifferences[i][0]) / factorial(i);
        } else {
            break;
        }
    }

    document.querySelector('.the-root').innerHTML = `Interpolated Value = ${interpolated.toFixed(4)}`;
});

// Clear button
document.getElementById('clear').addEventListener('click', function () {
    document.getElementById('xValues').value = '';
    document.getElementById('yValues').value = '';
    document.getElementById('interpolateX').value = '';
    document.querySelector('tbody').innerHTML = '';
    document.querySelector('.the-root').innerHTML = 'Interpolated Value = ';
});

// Factorial utility
function factorial(num) {
    if (num === 0 || num === 1) return 1;
    let fact = 1;
    for (let i = 2; i <= num; i++) fact *= i;
    return fact;
}
