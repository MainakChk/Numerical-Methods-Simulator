$(document).ready(function () {

    $("#btn").click(function () {
        let dataInput = $("#dataPoints").val().trim();
        let valueToInterp = parseFloat($("#value").val());

        if (dataInput === "" || isNaN(valueToInterp)) {
            alert("Please enter valid data points and a value.");
            return;
        }

        let points = dataInput.split(",").map(p => {
            let [x, y] = p.trim().split(" ").map(Number);
            return { x, y };
        });

        points.sort((a, b) => a.x - b.x);

        let n = points.length;
        let x = points.map(p => p.x);
        let y = points.map(p => p.y);

        // Check for equal spacing
        let h = x[1] - x[0];
        for (let i = 1; i < n - 1; i++) {
            if (Math.abs((x[i + 1] - x[i]) - h) > 0.0001) {
                alert("x values must have equal spacing.");
                return;
            }
        }

        // Build forward difference table
        let diffTable = Array.from(Array(n), () => Array(n).fill(0));
        for (let i = 0; i < n; i++) {
            diffTable[i][0] = y[i];
        }

        for (let j = 1; j < n; j++) {
            for (let i = 0; i < n - j; i++) {
                diffTable[i][j] = diffTable[i + 1][j - 1] - diffTable[i][j - 1];
            }
        }

        // Interpolation calculation
        let u = (valueToInterp - x[0]) / h;
        let interpValue = y[0];
        let uTerm = 1;
        let fact = 1;

        for (let i = 1; i < n; i++) {
            uTerm *= (u - (i - 1));
            fact *= i;
            interpValue += (uTerm * diffTable[0][i]) / fact;
        }

        // Clear previous results
        $("#resultTable tr:gt(0)").remove();

        // Display result table
        for (let i = 0; i < n; i++) {
            let deltaValues = [];
            for (let j = 1; j < n - i; j++) {
                deltaValues.push(diffTable[i][j].toFixed(4));
            }

            let row = `<tr>
                        <td>${i}</td>
                        <td>${x[i]}</td>
                        <td>${y[i]}</td>
                        <td>${deltaValues.join(", ")}</td>
                        <td>${i === 0 ? interpValue.toFixed(4) : "-"}</td>
                    </tr>`;
            $("#resultTable").append(row);
        }

        // Display interpolated value
        $("#interpolatedValue").text(interpValue.toFixed(4));
    });

    // Clear button
    $("#clear").click(function () {
        $("#dataPoints").val("");
        $("#value").val("");
        $("#resultTable tr:gt(0)").remove();
        $("#interpolatedValue").text("");
    });

});
