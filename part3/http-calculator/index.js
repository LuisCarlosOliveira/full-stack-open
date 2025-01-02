const express = require('express');
const app = express();

// Define a function to calculate the result based on the operation
const calculate = (num1, num2, operation) => {
    switch (operation) {
        case 'sum':
            return num1 + num2;
        case 'sub':
            return num1 - num2;
        case 'mul':
            return num1 * num2;
        case 'div':
            if (num2 === 0) return 'Cannot divide by 0';
            return num1 / num2;
        default:
            return 'Invalid operation';
    }
};

// Define a route to handle the operation
app.get('/:operation/:num1/:num2', (req, res) => {
    const { operation, num1, num2 } = req.params;
    const n1 = Number(num1);
    const n2 = Number(num2);

    if (isNaN(n1) || isNaN(n2)) {
        return res.send('Please provide valid numbers.');
    }

    const result = calculate(n1, n2, operation);

    if (result === 'Invalid operation') {
        return res.send('Operation not supported.');
    }

    res.send(`The result of ${operation} between ${n1} and ${n2} is ${result}`);
});

app.get('/', (req, res) => {
    res.send('Welcome to http calculator!');
});

app.use((req, res) => {
    res.status(404).send('Page not found');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
