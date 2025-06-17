document.getElementById("btn").addEventListener("click", eulerMethod);
document.getElementById("clear").addEventListener("click", clearFields);

function eulerMethod() {
    const funcStr = document.getElementById("function").value;
    const x0 = parseFloat(document.getElementById("x0").value);
    const y0 = parseFloat(document.getElementById("y0").value);
    const h = parseFloat(document.getElementById("h").value);
    const xn = parseFloat(document.getElementById("xn").value);
    const table = document.getElementById("result-table");
    const result = document.getElementById("final-result");

    table.innerHTML = "";
    result.innerHTML = "";

    if (isNaN(x0) || isNaN(y0) || isNaN(h) || isNaN(xn) || !funcStr) {
        alert("Please enter all required values correctly.");
        return;
    }

    if (x0 > xn) {
        alert("Initial x₀ must be less than final xₙ.");
        return;
    }

    let f;
    try {
        f = new Function("x", "y", `return ${funcStr};`);
        f(x0, y0); // test eval
    } catch (err) {
        alert("Invalid function expression. Use 'x' and 'y' as variables (e.g., x + y, x * y).");
        return;
    }

    let x = x0;
    let y = y0;
    let i = 0;

    while (x <= xn) {
        const fx = f(x, y);
        const row = `<tr>
                        <td>${i}</td>
                        <td>${x.toFixed(4)}</td>
                        <td>${y.toFixed(6)}</td>
                        <td>${fx.toFixed(6)}</td>
                     </tr>`;
        table.innerHTML += row;
        y = y + h * fx;
        x = x + h;
        x = Math.round(x * 1000000000) / 1000000000; // avoid floating-point precision issues
        i++;
    }

    result.innerText = y.toFixed(6);
}

function clearFields() {
    document.getElementById("function").value = "";
    document.getElementById("x0").value = "";
    document.getElementById("y0").value = "";
    document.getElementById("h").value = "";
    document.getElementById("xn").value = "";
    document.getElementById("result-table").innerHTML = "";
    document.getElementById("final-result").innerText = "";
}
