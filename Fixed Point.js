document.addEventListener("DOMContentLoaded", function () {
  const xiInput = document.getElementById("xi");
  const espInput = document.getElementById("esp");
  const equationInput = document.getElementById("equation");
  const calculateBtn = document.getElementById("btn");
  const clearBtn = document.getElementById("clear");
  const table = document.querySelector("table");
  const rootDisplay = document.querySelector(".the-root");

  let chart; // For storing the Chart.js instance

  // Update EPS input to dropdown
  espInput.outerHTML = `
    <select id="esp" class="m-2">
      <option value="0.1">0.1</option>
      <option value="0.01">0.01</option>
      <option value="0.001">0.001</option>
      <option value="0.0001">0.0001</option>
      <option value="0.00001">0.00001</option>
    </select>
  `;

  calculateBtn.addEventListener("click", function () {
    const g = equationInput.value.trim();
    const xi = parseFloat(xiInput.value);
    const eps = parseFloat(document.getElementById("esp").value);

    if (isNaN(xi) || isNaN(eps) || g === "") {
      alert("Please enter valid input values.");
      return;
    }

    try {
      const compiled = math.compile(g);
      let xi_curr = xi;
      let xi_next = 0;
      let error = 100;
      let i = 0;
      const maxIter = 100;
      const values = [];

      // Clear previous rows except header
      table.querySelectorAll("tr:not(:first-child)").forEach(row => row.remove());

      while (error > eps && i < maxIter) {
        xi_next = compiled.evaluate({ x: xi_curr });
        error = Math.abs((xi_next - xi_curr) / xi_next);
        values.push({ i: i + 1, xi: xi_next, fx: g.replace("x", xi_next.toFixed(4)), err: error });

        const row = table.insertRow(-1);
        row.innerHTML = `
          <td>${i + 1}</td>
          <td>${xi_next.toFixed(6)}</td>
          <td>${compiled.evaluate({ x: xi_next }).toFixed(6)}</td>
          <td>${error.toFixed(6)}</td>
        `;

        xi_curr = xi_next;
        i++;
      }

      rootDisplay.textContent = `The Root = ${xi_next.toFixed(6)}`;

      plotChart(values);

    } catch (err) {
      alert("Invalid function or input.");
      console.error(err);
    }
  });

  clearBtn.addEventListener("click", function () {
    equationInput.value = "";
    xiInput.value = "";
    document.getElementById("esp").value = "0.01";
    rootDisplay.textContent = "The Root = ";
    if (chart) chart.destroy();
    table.querySelectorAll("tr:not(:first-child)").forEach(row => row.remove());
  });

  function plotChart(data) {
    const ctxId = "chartCanvas";

    // Remove old canvas if exists
    const oldCanvas = document.getElementById(ctxId);
    if (oldCanvas) oldCanvas.remove();

    const canvas = document.createElement("canvas");
    canvas.id = ctxId;
    canvas.className = "w-75 m-auto bg-white";
    document.getElementById("middle").appendChild(canvas);

    const ctx = canvas.getContext("2d");
    const labels = data.map(point => point.i);
    const xValues = data.map(point => point.xi);

    if (chart) chart.destroy();
    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: "xi values per iteration",
          data: xValues,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.3,
          fill: false
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
          title: {
            display: true,
            text: "Fixed Point Iteration Convergence",
            color: "black"
          }
        },
        scales: {
          x: {
            title: { display: true, text: "Iteration", color: "black" }
          },
          y: {
            title: { display: true, text: "xi", color: "black" }
          }
        }
      }
    });
  }
});
