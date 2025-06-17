function luDecomposition() {
  // Retrieve matrix A from input fields
  const A = [
    [parseFloat(document.getElementById('r1x1').value), parseFloat(document.getElementById('r1x2').value), parseFloat(document.getElementById('r1x3').value)],
    [parseFloat(document.getElementById('r2x1').value), parseFloat(document.getElementById('r2x2').value), parseFloat(document.getElementById('r2x3').value)],
    [parseFloat(document.getElementById('r3x1').value), parseFloat(document.getElementById('r3x2').value), parseFloat(document.getElementById('r3x3').value)]
  ];

  // Validate if input matrix contains all valid numbers
  if (A.some(row => row.some(val => isNaN(val)))) {
    alert('Please enter valid numbers for all input values.');
    return;
  }

  const n = A.length;
  const L = new Array(n).fill().map(() => new Array(n).fill(0)); // Lower triangular matrix
  const U = new Array(n).fill().map(() => new Array(n).fill(0)); // Upper triangular matrix

  // LU Decomposition process
  for (let i = 0; i < n; i++) {
    // Step 1: Set L matrix diagonal elements to 1
    L[i][i] = 1;

    // Step 2: Calculate U matrix values
    for (let j = i; j < n; j++) {
      let sum = 0;
      for (let k = 0; k < i; k++) {
        sum += L[i][k] * U[k][j];
      }
      U[i][j] = A[i][j] - sum;
    }

    // Step 3: Calculate L matrix values
    for (let j = i + 1; j < n; j++) {
      let sum = 0;
      for (let k = 0; k < i; k++) {
        sum += L[j][k] * U[k][i];
      }
      L[j][i] = (A[j][i] - sum) / U[i][i];
    }
  }

  // Retrieve vector b from input fields
  const b = [
    parseFloat(document.getElementById('e1').value),
    parseFloat(document.getElementById('e2').value),
    parseFloat(document.getElementById('e3').value)
  ];

  if (b.some(val => isNaN(val))) {
    alert('Please enter valid numbers for the constants.');
    return;
  }

  // Forward substitution to solve Ly = b
  const y = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let k = 0; k < i; k++) {
      sum += L[i][k] * y[k];
    }
    y[i] = (b[i] - sum);
  }

  // Backward substitution to solve Ux = y
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let sum = 0;
    for (let k = i + 1; k < n; k++) {
      sum += U[i][k] * x[k];
    }
    x[i] = (y[i] - sum) / U[i][i];
  }

  // Display the final solution (x)
  const finalResult = document.getElementById("steps");
  finalResult.innerHTML = `
    <h3>Lower Triangular Matrix (L):</h3>
    <pre>${L.map(row => row.join(" ")).join("\n")}</pre>
    <h3>Upper Triangular Matrix (U):</h3>
    <pre>${U.map(row => row.join(" ")).join("\n")}</pre>
    <h3>Final Solution (x):</h3>
    <pre>${x.join("\n")}</pre>
  `;

  // Display the steps of the LU decomposition
  const stepsDisplay = document.getElementById("stepsDisplay");
  stepsDisplay.innerHTML = `
    <h3>Steps of LU Decomposition:</h3>
    <ol>
      <li>Set diagonal elements of L to 1.</li>
      <li>Calculate U matrix values using the formula: U[i][j] = A[i][j] - sum(L[i][k] * U[k][j]).</li>
      <li>Calculate L matrix values using the formula: L[j][i] = (A[j][i] - sum(L[j][k] * U[k][i])) / U[i][i].</li>
      <li>Repeat for all rows.</li>
    </ol>
  `;
}