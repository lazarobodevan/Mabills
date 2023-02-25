const app = require('./app');
const mongo = require('./loaders/mongodb');

mongo();

app.listen(8080, () => console.log("Running in port 8080"));