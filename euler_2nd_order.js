document.getElementById("btn").addEventListener("click", eulerSecondOrder);
document.getElementById("clear").addEventListener("click", clearFields);

function eulerSecondOrder() {
    const equation = document.getElementById("function").value.trim();
    const x0 = parseFloat(document.getElementById("x0").value);
    const y0 = parseFloat(document.getElementById("y0").value);
    const h = parseFloat(document.getElementById("h").value);
    const xn = parseFloat(document.getElementById("xn").value);

    if (isNaN(x0) || isNaN(y0) || isNaN(h) || isNaN(xn)) {
        alert("Please enter valid numerical values for x0, y0, h, and xn.");
        return;
    }
    if (equation === "") {
        alert("Please enter a valid equation.");
        return;
    }

    let x = x0;
    let y = y0;
    let results = [];
    let i = 0;

    while (x <= xn + 1e-12) {  // Add a small epsilon to include xn
        const f = evalEquation(equation, x, y);
        if (isNaN(f)) {
            alert("Error computing function values. Please check your equation.");
            return;
        }
        const yPredicted = y + h * f;
        const fPredicted = evalEquation(equation, x + h, yPredicted);
        if (isNaN(fPredicted)) {
            alert("Error computing predicted function values. Please check your equation.");
            return;
        }
        const yCorrected = y + (h / 2) * (f + fPredicted);

        results.push({ i, x: x, yPredicted, yCorrected, f });

        console.log(`i=${i}, x=${x.toFixed(4)}, yPred=${yPredicted.toFixed(4)}, yCorr=${yCorrected.toFixed(4)}, f=${f.toFixed(4)}`);

        x += h;
        y = yCorrected;
        i++;
    }

    const resultTable = document.querySelector("tbody");
    resultTable.innerHTML = "";

    results.forEach(result => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${result.i}</td>
            <td>${result.x.toFixed(4)}</td>
            <td>${result.yPredicted.toFixed(4)}</td>
            <td>${result.yCorrected.toFixed(4)}</td>
            <td>${result.f.toFixed(4)}</td>
        `;
        resultTable.appendChild(row);
    });

    document.querySelector(".the-root").textContent = `Result at x = ${xn} is y = ${y.toFixed(4)}`;
}

function evalEquation(equation, x, y) {
    // Add Math. prefix to common functions for safe evaluation
    let safeEq = equation
        .replace(/sin/g, "Math.sin")
        .replace(/cos/g, "Math.cos")
        .replace(/tan/g, "Math.tan")
        .replace(/log/g, "Math.log")
        .replace(/exp/g, "Math.exp")
        .replace(/sqrt/g, "Math.sqrt");

    safeEq = safeEq.replace(/x/g, `(${x})`).replace(/y/g, `(${y})`);

    try {
        return eval(safeEq);
    } catch (e) {
        alert("Error evaluating the equation. Please check the syntax.");
        return NaN;
    }
}

function clearFields() {
    document.getElementById("function").value = "";
    document.getElementById("x0").value = "";
    document.getElementById("y0").value = "";
    document.getElementById("h").value = "";
    document.getElementById("xn").value = "";
    document.querySelector("tbody").innerHTML = "";
    document.querySelector(".the-root").textContent = "Result at x = ... is y = ...";
}
