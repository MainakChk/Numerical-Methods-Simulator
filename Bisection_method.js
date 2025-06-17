document.getElementById("btn").addEventListener("click", function () {
  const equation = document.getElementById("equation").value;
  const xl = parseFloat(document.getElementById("xl").value);
  const xu = parseFloat(document.getElementById("xu").value);
  const eps = parseFloat(document.getElementById("eps").value);

  const resultTable = document.getElementById("result-table");
  resultTable.innerHTML = "";

  let iter = 0;
  let xr, fxl, fxu, fxr, oldXr;
  let error = 100;
  let xrValues = [];

  function evaluateFn(eq, x) {
    try {
      let expr = eq.replace(/\^/g, "**")
                   .replace(/e\^x/g, "Math.exp(x)")
                   .replace(/e/g, "Math.exp(1)");
      return Function('x', `return ${expr}`)(x);
    } catch (e) {
      alert("Invalid equation!");
      return NaN;
    }
  }

  let low = xl;
  let high = xu;
  let fl = evaluateFn(equation, low);
  let fh = evaluateFn(equation, high);

  if (isNaN(fl) || isNaN(fh)) return;

  if (fl * fh > 0) {
    alert("Function values at the interval endpoints must have opposite signs.");
    return;
  }

  document.getElementById("middle").classList.remove("d-none");

  do {
    oldXr = xr;
    xr = (low + high) / 2;
    fxl = evaluateFn(equation, low);
    fxu = evaluateFn(equation, high);
    fxr = evaluateFn(equation, xr);

    if (fxl * fxr < 0) {
      high = xr;
    } else {
      low = xr;
    }

    if (iter > 0) {
      error = Math.abs((xr - oldXr) / xr) * 100;
    }

    const row = `<tr>
      <td>${iter}</td>
      <td>${low.toFixed(6)}</td>
      <td>${fxl.toExponential(3)}</td>
      <td>${high.toFixed(6)}</td>
      <td>${fxu.toExponential(3)}</td>
      <td>${xr.toFixed(6)}</td>
      <td>${fxr.toExponential(3)}</td>
      <td>${error.toFixed(6)}</td>
    </tr>`;
    resultTable.innerHTML += row;

    xrValues.push(xr);
    iter++;
  } while (error > eps && iter < 100);

  document.getElementById("final-root").innerText = xr.toFixed(6);

  // Draw XR vs Iteration Graph
  const ctx = document.getElementById("xrGraph").getContext("2d");
  if (window.xrChart) window.xrChart.destroy();

  window.xrChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: xrValues.map((_, i) => i),
      datasets: [{
        label: 'XR (Approximate Root)',
        data: xrValues,
        borderColor: 'blue',
        backgroundColor: 'white',
        tension: 0.3,
        pointRadius: 5,
        pointBackgroundColor: 'blue',
        pointBorderColor: 'white',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true },
        tooltip: { enabled: true }
      },
      scales: {
        x: {
          title: { display: true, text: 'Iteration' },
          ticks: { stepSize: 1 }
        },
        y: {
          title: { display: true, text: 'XR' },
          beginAtZero: false
        }
      }
    }
  });
});

document.getElementById("clear").addEventListener("click", function () {
  document.getElementById("bisection-form").reset();
  document.getElementById("result-table").innerHTML = "";
  document.getElementById("middle").classList.add("d-none");
  document.getElementById("final-root").innerText = "";
  if (window.xrChart) window.xrChart.destroy();
});
