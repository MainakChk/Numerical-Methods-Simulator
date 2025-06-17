document.getElementById('btn').addEventListener('click', function() {
    const inputData = document.getElementById('hermiteData').value.trim().split('\n');

    let xValues = [];
    let yValues = [];
    let derivatives = [];

    // Parse input: x, y, y'
    inputData.forEach(line => {
        const [x, y, derivative] = line.trim().split(/\s+/).map(Number);
        if (!isNaN(x) && !isNaN(y) && !isNaN(derivative)) {
            xValues.push(x);
            yValues.push(y);
            derivatives.push(derivative);
        }
    });

    if (xValues.length < 2 || yValues.length !== xValues.length || derivatives.length !== xValues.length) {
        alert("Please enter valid data points and derivatives.");
        return;
    }

    const interpolateX = parseFloat(document.getElementById('interpolateX').value);
    if (isNaN(interpolateX)) {
        alert("Please enter a valid x value.");
        return;
    }

    // Calculate Lagrange basis polynomial L_i(x)
    function lagrangeBasis(i, x) {
        let result = 1;
        for (let j = 0; j < xValues.length; j++) {
            if (j !== i) {
                result *= (x - xValues[j]) / (xValues[i] - xValues[j]);
            }
        }
        return result;
    }

    // Calculate derivative of L_i(x) evaluated at x_i
    function lagrangeBasisDerivative(i) {
        let sum = 0;
        for (let j = 0; j < xValues.length; j++) {
            if (j !== i) {
                let product = 1 / (xValues[i] - xValues[j]);
                for (let k = 0; k < xValues.length; k++) {
                    if (k !== i && k !== j) {
                        product *= (xValues[i] - xValues[k]) / (xValues[i] - xValues[k]); // Always 1, so can omit
                    }
                }
                sum += product;
            }
        }
        return sum;
    }

    function hermiteInterpolation(x) {
        let n = xValues.length;
        let result = 0;

        for (let i = 0; i < n; i++) {
            const L_i = lagrangeBasis(i, x);
            const L_i_prime = lagrangeBasisDerivative(i);

            const h_i = (1 - 2 * (x - xValues[i]) * L_i_prime) * (L_i * L_i);
            const h_i_hat = (x - xValues[i]) * (L_i * L_i);

            result += h_i * yValues[i] + h_i_hat * derivatives[i];
        }

        return result;
    }

    const interpolatedValue = hermiteInterpolation(interpolateX);

    document.getElementById('resultPolynomial').innerHTML = `Interpolated value at x = ${interpolateX}: ${interpolatedValue.toFixed(6)}`;
});

// Clear button
document.getElementById('clear').addEventListener('click', function() {
    document.getElementById('hermiteData').value = '';
    document.getElementById('interpolateX').value = '';
    document.getElementById('resultPolynomial').innerHTML = '';
});
