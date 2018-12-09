const express = require('express');
const app = express();
const path = require('path');

const bodyParser = require('body-parser');

const port = process.env.port || 8080;

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {console.log(`Listening on port ${port}`);});
