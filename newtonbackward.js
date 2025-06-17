$(document).ready(function () {
  $("#btn").click(function () {
    // Clear previous results
    $("#result-value").text("");
    $("#result-table").empty();
    $("#result-header").empty();

    // Get and validate inputs
    let x_values = $("#x_values").val().split(",").map(Number);
    let fx_values = $("#fx_values").val().split(",").map(Number);
    let x_to_interp = parseFloat($("#interpolate_x").val());
    let n = x_values.length;

    if (x_values.length !== fx_values.length) {
      alert("Number of x values and f(x) values must be the same.");
      return;
    }
    if (x_values.length < 2) {
      alert("Please enter at least two data points.");
      return;
    }
    if (isNaN(x_to_interp)) {
      alert("Please enter a valid interpolation x value.");
      return;
    }

    // Build dynamic table header
    let headerRow = `<tr><th>i</th><th>x</th><th>f(x)</th>`;
    for (let j = 1; j < n; j++) {
      headerRow += `<th>Δ<sup>${j}</sup>f(x)</th>`;
    }
    headerRow += `</tr>`;
    $("#result-header").append(headerRow);

    // Initialize difference table
    let diffTable = new Array(n);
    for (let i = 0; i < n; i++) {
      diffTable[i] = new Array(n).fill(0);
      diffTable[i][0] = fx_values[i];
    }

    // Build backward difference table
    for (let j = 1; j < n; j++) {
      for (let i = n - 1; i >= j; i--) {
        diffTable[i][j] = diffTable[i][j - 1] - diffTable[i - 1][j - 1];
      }
    }

    // Populate rows
    for (let i = 0; i < n; i++) {
      let row = `<tr><td>${i}</td><td>${x_values[i]}</td><td>${fx_values[i]}</td>`;
      for (let j = 1; j < n; j++) {
        if (i >= j) {
          row += `<td>${diffTable[i][j].toFixed(4)}</td>`;
        } else {
          row += `<td></td>`;
        }
      }
      row += `</tr>`;
      $("#result-table").append(row);
    }

    // Interpolation calculation
    let h = x_values[1] - x_values[0];
    let p = (x_to_interp - x_values[n - 1]) / h;
    let result = fx_values[n - 1];
    let p_term = 1;

    for (let i = 1; i < n; i++) {
      p_term *= (p + i - 1);
      result += (p_term * diffTable[n - 1][i]) / factorial(i);
    }

    $("#result-value").text(result.toFixed(6));
  });

  // Clear functionality
  $("#clear").click(function () {
    $("#x_values").val("");
    $("#fx_values").val("");
    $("#interpolate_x").val("");
    $("#result-value").text("");
    $("#result-table").empty();
    $("#result-header").empty();
  });
});

// Factorial utility
function factorial(num) {
  if (num === 0 || num === 1) return 1;
  let fact = 1;
  for (let i = 2; i <= num; i++) fact *= i;
  return fact;
}
