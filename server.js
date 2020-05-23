const conf = require('./conf');
const app = require('./app');
const port = conf.port;
app.listen(port, () => {
    console.log(`Server in runnin on port ${port}`);
});