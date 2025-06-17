function gaussElimination() {
	const A = [
	  [parseFloat(document.getElementById('r1x1').value), parseFloat(document.getElementById('r1x2').value), parseFloat(document.getElementById('r1x3').value), parseFloat(document.getElementById('e1').value)],
	  [parseFloat(document.getElementById('r2x1').value), parseFloat(document.getElementById('r2x2').value), parseFloat(document.getElementById('r2x3').value), parseFloat(document.getElementById('e2').value)],
	  [parseFloat(document.getElementById('r3x1').value), parseFloat(document.getElementById('r3x2').value), parseFloat(document.getElementById('r3x3').value), parseFloat(document.getElementById('e3').value)]
	];
	const n = A.length;
	let x = new Array(n).fill(0);
  
	console.log(`Input matrix: ${A}`);
  
	stepsElement.innerHTML = "Steps of the solution:";
  
	for (let i = 0; i < n - 1; i++) {
const stepElement = document.createElement("p");
  
	  stepElement.innerHTML = `Step ${i+1}:<br>Pivot element: ${A[i][i]}<br>`;
  
	  for (let j = i + 1; j < n; j++) {
		const factor = A[j][i] / A[i][i];
  
		stepElement.innerHTML += `Row ${j+1} = Row ${j+1} - (${factor.toFixed(2)}) * Row ${i+1}<br>`;
  
		for (let k = i; k < n + 1; k++) {
		  A[j][k] -= factor * A[i][k];
		}
  
		console.log(A);
	  }
  
	  stepsElement.appendChild(stepElement);
	}
  
	const finalStepElement = document.createElement("p");
  
	finalStepElement.innerHTML = `Step ${n}:<br>Pivot element: ${A[n-1][n-1]}<br>`;
  
	for (let i = n - 1; i >= 0; i--) {
	  let sum = 0;
  
	  for (let j = i + 1; j < n; j++) {
		sum += A[i][j] * x[j];
	  }
  
	  x[i] = (A[i][n] - sum) / A[i][i];
	  finalStepElement.innerHTML += `x${i+1} = (${A[i][n].toFixed(2)} - (${sum.toFixed(2)})) / (${A[i][i].toFixed(2)}) = ${x[i].toFixed(2)}<br>`;
	}
  
	stepsElement.appendChild(finalStepElement);
  
  
	const solutionElement = document.getElementById("solution");
	solutionElement.innerHTML = `x1 = ${x[0].toFixed(2)}, x2 = ${x[1].toFixed(2)}, x3 = ${x[2].toFixed(2)}`;
  }

  const matrixElement = document.getElementById("matrix");
  const solutionElement = document.getElementById("solution");
  const stepsElement = document.getElementById("steps");


function clearFields() {
    document.getElementById('r1x1').value = '';
    document.getElementById('r1x2').value = '';
    document.getElementById('r1x3').value = '';
    document.getElementById('e1').value = '';
    document.getElementById('r2x1').value = '';
    document.getElementById('r2x2').value = '';
    document.getElementById('r2x3').value = '';
    document.getElementById('e2').value = '';
    document.getElementById('r3x1').value = '';
    document.getElementById('r3x2').value = '';
    document.getElementById('r3x3').value = '';
    document.getElementById('e3').value = '';
    document.getElementById('matrix').innerHTML = "";
    document.getElementById('solution').innerHTML = "";
    document.getElementById('steps').innerHTML = "";
}
