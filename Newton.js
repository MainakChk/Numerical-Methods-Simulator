// Newton.js
// Wait for DOM loaded
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btn");
  const clearBtn = document.getElementById("clear");

  const equationInput = document.getElementById("equation");
  const xiInput = document.getElementById("xi");
  const espSelect = document.getElementById("esp");

  const table = document.querySelector("table");
  const rootDisplay = document.querySelector(".the-root");
  const ctx = document.getElementById("newtonChart").getContext("2d");

  let chart; // Chart instance

  // Function to compute derivative symbolically using math.js
  function derivative(expr) {
    return math.derivative(expr, 'x').toString();
  }

  // Clear all results
  function clearAll() {
    equationInput.value = "";
    xiInput.value = "";
    espSelect.value = "Select";
    rootDisplay.textContent = "The Root = ";
    // Remove all rows except header
    while (table.rows.length > 1) table.deleteRow(1);
    if (chart) {
      chart.destroy();
      chart = null;
    }
  }

  // Evaluate function f(x)
  function f(expr, x) {
    const scope = {x: x};
    return math.evaluate(expr, scope);
  }

  btn.addEventListener("click", () => {
    const equation = equationInput.value.trim();
    let xi = parseFloat(xiInput.value);
    const esp = parseFloat(espSelect.value);

    if (!equation) {
      alert("Please enter an equation.");
      return;
    }
    if (isNaN(xi)) {
      alert("Please enter a valid initial guess Xi.");
      return;
    }
    if (isNaN(esp) || espSelect.value === "Select") {
      alert("Please select a valid EPS value.");
      return;
    }

    // Clear previous results
    while (table.rows.length > 1) table.deleteRow(1);
    rootDisplay.textContent = "The Root = ";
    if (chart) {
      chart.destroy();
      chart = null;
    }

    // Calculate derivative expression
    let derExpr;
    try {
      derExpr = derivative(equation);
    } catch (err) {
      alert("Error computing derivative: " + err);
      return;
    }

    let i = 0;
    let error = 1;
    let prevXi;
    const iterations = [];
    const rootValues = [];

    while (error > esp && i < 50) {
      // f(xi)
      let fx = f(equation, xi);
      // f'(xi)
      let fdx = f(derExpr, xi);
      if (fdx === 0) {
        alert("Zero derivative encountered. Stopping iterations.");
        break;
      }
      // Newton formula
      let xi1 = xi - (fx / fdx);

      // Calculate approximate relative error
      if (i > 0) {
        error = Math.abs((xi1 - xi) / xi1);
      }

      // Add row to table
      const row = table.insertRow();
      row.insertCell(0).textContent = i + 1;
      row.insertCell(1).textContent = xi.toFixed(6);
      row.insertCell(2).textContent = fx.toExponential(6);
      row.insertCell(3).textContent = fdx.toExponential(6);
      row.insertCell(4).textContent = i === 0 ? "—" : error.toExponential(6);

      iterations.push(i + 1);
      rootValues.push(xi);

      prevXi = xi;
      xi = xi1;
      i++;
    }

    rootDisplay.textContent = "The Root = " + xi.toFixed(6);

    // Draw Chart
    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: iterations,
        datasets: [{
          label: "Root Approximation",
          data: rootValues,
          borderColor: "blue",
          backgroundColor: "rgba(0, 0, 255, 0.1)",
          tension: 0.3,
          fill: false,
          pointBackgroundColor: "red",
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: "Iteration"
            }
          },
          y: {
            title: {
              display: true,
              text: "Root Value"
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: "top"
          },
          tooltip: {
            mode: "index",
            intersect: false
          }
        }
      }
    });
  });

  clearBtn.addEventListener("click", clearAll);
});
