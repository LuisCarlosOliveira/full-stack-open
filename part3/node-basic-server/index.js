const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Welcome to my server!');
});

app.get('/about', (req, res) => {
    res.send('About me');
});

app.use((req, res) => {
    res.status(404).send('Page not found');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});