function gaussJordan() {
  // Get the input values
  const a = [
    [parseFloat(document.getElementById("r1x1").value), parseFloat(document.getElementById("r1x2").value), parseFloat(document.getElementById("r1x3").value)],
    [parseFloat(document.getElementById("r2x1").value), parseFloat(document.getElementById("r2x2").value), parseFloat(document.getElementById("r2x3").value)],
    [parseFloat(document.getElementById("r3x1").value), parseFloat(document.getElementById("r3x2").value), parseFloat(document.getElementById("r3x3").value)]
  ];
  const b = [parseFloat(document.getElementById("e1").value), parseFloat(document.getElementById("e2").value), parseFloat(document.getElementById("e3").value)];

  // Perform Gauss Jordan method
  const n = a.length;
  const steps = [];
  for (let k = 0; k < n; k++) {
    // Find pivot row
    let max = Math.abs(a[k][k]);
    let pivot = k;
    for (let i = k + 1; i < n; i++) {
      if (Math.abs(a[i][k]) > max) {
        max = Math.abs(a[i][k]);
        pivot = i;
      }
    }
    if (pivot !== k) {
      // Swap rows
      [a[k], a[pivot]] = [a[pivot], a[k]];
      [b[k], b[pivot]] = [b[pivot], b[k]];
      steps.push(`Swap row ${k + 1} with row ${pivot + 1}`);
    }
    if (a[k][k] !== 1) {
      // Scale pivot row
      const scale = a[k][k];
      for (let j = k; j < n; j++) {
        a[k][j] /= scale;
      }
      b[k] /= scale;
      steps.push(`Scale row ${k + 1} by ${1 / scale}`);
    }
    // Eliminate entries below pivot
    for (let i = k + 1; i < n; i++) {
      if (a[i][k] !== 0) {
        const factor = a[i][k];
        for (let j = k; j < n; j++) {
          a[i][j] -= factor * a[k][j];
        }
        b[i] -= factor * b[k];
        steps.push(`Eliminate (${i + 1},${k + 1}) using row ${k + 1}`);
      }
    }
    // Eliminate entries above pivot
    for (let i = k - 1; i >= 0; i--) {
      if (a[i][k] !== 0) {
        const factor = a[i][k];
        for (let j = k; j < n; j++) {
          a[i][j] -= factor * a[k][j];
        }
        b[i] -= factor * b[k];
        steps.push(`Eliminate (${i + 1},${k + 1}) using row ${k + 1}`);
      }
    }
  }

  // Display the solution
  const solutionDiv = document.getElementById("solution");
  let solutionHTML = "<h4>Solution:</h4><br>";
  for (let i = 0; i < n; i++) {
    solutionHTML += `x${i+1} = ${b[i]}<br>`;
  }
  solutionDiv.innerHTML = solutionHTML;

  // Display the steps
  const stepsDiv = document.getElementById("steps");
  let stepsHTML = "<h4>Steps:</h4><br>";
  stepsHTML += "<ul>";
  for (let i = 0; i < steps.length; i++) {
    stepsHTML += `<li>${steps[i]}</li>`;
  }
  stepsHTML += "</ul>";
  stepsDiv.innerHTML = stepsHTML;

  // Display all results inside SContain
  const sContain = document.getElementById("SContain");
  sContain.innerHTML = solutionHTML + stepsHTML;
}


function clearFields() {

  document.getElementById("r1x1").value = "";
  document.getElementById("r1x2").value = "";
  document.getElementById("r1x3").value = "";
  document.getElementById("r2x1").value = "";
  document.getElementById("r2x2").value = "";
  document.getElementById("r2x3").value = "";
  document.getElementById("r3x1").value = "";
  document.getElementById("r3x2").value = "";
  document.getElementById("r3x3").value = "";
  document.getElementById("e1").value = "";
  document.getElementById("e2").value = "";
  document.getElementById("e3").value = "";


  document.getElementById("matrix").innerHTML = "";
  document.getElementById("solution").innerHTML = "";
  document.getElementById("steps").innerHTML = "";
  

  const sContain = document.getElementById("SContain");
  sContain.innerHTML = "";
}