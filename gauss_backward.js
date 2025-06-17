document.getElementById('btn').addEventListener('click', function () {
    const xInput = document.getElementById('xValues').value.trim();
    const yInput = document.getElementById('yValues').value.trim();
    const interpolateX = parseFloat(document.getElementById('interpolateX').value.trim());

    if (!xInput || !yInput || isNaN(interpolateX)) {
        alert("Please enter valid inputs");
        return;
    }

    const x = xInput.split(',').map(Number);
    const y = yInput.split(',').map(Number);

    if (x.length !== y.length) {
        alert("X and Y must have the same number of values");
        return;
    }

    const n = x.length;
    const h = x[1] - x[0];
    for (let i = 2; i < n; i++) {
        if (Math.abs((x[i] - x[i - 1]) - h) > 1e-6) {
            alert("X values must be equally spaced");
            return;
        }
    }

    // Build backward difference table
    let diffTable = Array.from({ length: n }, () => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
        diffTable[i][0] = y[i];
    }
    for (let j = 1; j < n; j++) {
        for (let i = n - 1; i >= j; i--) {
            diffTable[i][j] = diffTable[i][j - 1] - diffTable[i - 1][j - 1];
        }
    }

    // Find suitable i for Gauss Backward
    let i = n - 1;
    while (i > 0 && interpolateX < x[i]) {
        i--;
    }

    let u = (interpolateX - x[i]) / h;
    let interpolatedValue = diffTable[i][0];
    let uTerm = 1;

    // Clear previous header and fill dynamically
    const tableHeader = document.getElementById('tableHeader');
    tableHeader.innerHTML = '';

    const thStep = document.createElement('th');
    thStep.textContent = 'Step';
    tableHeader.appendChild(thStep);

    for (let order = 0; order < n; order++) {
        const th = document.createElement('th');
        th.textContent = `Δ^${order}`;
        tableHeader.appendChild(th);
    }

    const thTerm = document.createElement('th');
    thTerm.textContent = 'Term';
    tableHeader.appendChild(thTerm);

    const thInterp = document.createElement('th');
    thInterp.textContent = 'Interpolated Value';
    tableHeader.appendChild(thInterp);

    // Clear previous results
    const tbody = document.querySelector('#resultTable tbody');
    tbody.innerHTML = '';

    // Step 0 row
    let tr = document.createElement('tr');
    tr.appendChild(createCell(0)); // Step

    for (let order = 0; order < n; order++) {
        let td = document.createElement('td');
        td.textContent = order === 0 ? diffTable[i][0].toFixed(6) : '';
        tr.appendChild(td);
    }

    tr.appendChild(createCell(interpolatedValue.toFixed(6))); // Term
    tr.appendChild(createCell(interpolatedValue.toFixed(6))); // Interpolated
    tbody.appendChild(tr);

    // Higher order steps
    for (let order = 1; order < n; order++) {
        if (i - order < 0) break;

        uTerm *= (u + order - 1) / order;
        const term = uTerm * diffTable[i][order];
        interpolatedValue += term;

        tr = document.createElement('tr');
        tr.appendChild(createCell(order)); // Step

        for (let k = 0; k < n; k++) {
            let td = document.createElement('td');
            if (k <= order && i - k >= 0) {
                td.textContent = diffTable[i][k].toFixed(6);
            } else {
                td.textContent = '';
            }
            tr.appendChild(td);
        }

        tr.appendChild(createCell(term.toFixed(6))); // Term
        tr.appendChild(createCell(interpolatedValue.toFixed(6))); // Interpolated
        tbody.appendChild(tr);
    }

    document.getElementById('interpolatedResult').textContent = interpolatedValue.toFixed(6);
});

function createCell(content) {
    let td = document.createElement('td');
    td.textContent = content;
    return td;
}

// Clear button
document.getElementById('clear').addEventListener('click', function () {
    document.getElementById('xValues').value = '';
    document.getElementById('yValues').value = '';
    document.getElementById('interpolateX').value = '';
    document.getElementById('interpolatedResult').textContent = '';
    document.querySelector('#resultTable tbody').innerHTML = '';
    //document.getElementById('tableHeader').innerHTML = '';
});
