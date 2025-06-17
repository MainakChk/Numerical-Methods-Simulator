document.addEventListener("DOMContentLoaded", function () {
    const calculateButton = document.getElementById("btn");
    const clearButton = document.getElementById("clear");
    const equationInput = document.getElementById("equation");
    const xlInput = document.getElementById("xl");
    const xuInput = document.getElementById("xu");
    const epsInput = document.getElementById("esp");
    const rootDisplay = document.querySelector(".the-root");
    const resultBody = document.getElementById("resultBody");
    const ctx = document.getElementById("resultChart").getContext("2d");

    let chart;

    function evaluateMath(expression, variable, value) {
        const parsedExpression = math.parse(expression);
        const compiledExpression = parsedExpression.compile();
        return compiledExpression.evaluate({ [variable]: value });
    }

    function secantMethod(equation, xl, xu, epsilon) {
        let error = 1;
        let iteration = 0;
        const maxIterations = 100;
        const results = [];
        const rootValues = [];

        while (error > epsilon && iteration < maxIterations) {
            const fXl = evaluateMath(equation, "x", xl);
            const fXu = evaluateMath(equation, "x", xu);

            if (fXl === fXu) throw new Error("Division by zero error.");

            const nextX = xu - (fXu * (xu - xl)) / (fXu - fXl);
            error = Math.abs((nextX - xu) / nextX);

            results.push({
                iteration: iteration + 1,
                xl: xl.toFixed(6),
                fXl: fXl.toFixed(6),
                xu: xu.toFixed(6),
                fXu: fXu.toFixed(6),
                error: error.toFixed(6)
            });

            rootValues.push(nextX.toFixed(6));
            xl = xu;
            xu = nextX;
            iteration++;
        }

        return { results, root: xu.toFixed(6), rootValues };
    }

    function populateTable(results) {
        resultBody.innerHTML = "";
        results.forEach(result => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${result.iteration}</td>
                <td>${result.xl}</td>
                <td>${result.fXl}</td>
                <td>${result.xu}</td>
                <td>${result.fXu}</td>
                <td>${result.error}</td>
            `;
            resultBody.appendChild(row);
        });
    }

    function plotGraph(values) {
        if (chart) chart.destroy();
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: values.map((_, i) => i + 1),
                datasets: [{
                    label: 'Root Approximation',
                    data: values,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.2
                }]
            },
            options: {
                scales: {
                    x: { title: { display: true, text: 'Iteration' } },
                    y: { title: { display: true, text: 'x value' } }
                }
            }
        });
    }

    calculateButton.addEventListener("click", () => {
        try {
            const equation = equationInput.value.trim();
            const xl = parseFloat(xlInput.value);
            const xu = parseFloat(xuInput.value);
            const epsilon = parseFloat(epsInput.value);

            if (!equation || isNaN(xl) || isNaN(xu) || isNaN(epsilon)) {
                alert("Please enter all valid inputs.");
                return;
            }

            const { results, root, rootValues } = secantMethod(equation, xl, xu, epsilon);

            populateTable(results);
            rootDisplay.textContent = `The Root = ${root}`;
            plotGraph(rootValues);

        } catch (error) {
            alert(error.message);
        }
    });

    clearButton.addEventListener("click", () => {
        equationInput.value = "";
        xlInput.value = "";
        xuInput.value = "";
        epsInput.selectedIndex = 0;
        rootDisplay.textContent = "The Root = ";
        resultBody.innerHTML = "";
        if (chart) chart.destroy();
    });
});
