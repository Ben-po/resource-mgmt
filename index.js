var express = require('express');
var bodyParser = require("body-parser");
var app = express();

const PORT = process.env.PORT || 5050;
const startPage = "index.html";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("./public"));

// ROUTES
const { editResource } = require('./utils/EditResourceUtil');
app.put('/edit-resource/:id', editResource);

const { deleteResource } = require('./utils/DeleteResourceUtil');
app.delete('/delete-resource/:id', deleteResource);

const { addResource } = require('./utils/AddResourceUtil');
app.post('/add-resource', addResource);

const { viewResources } = require('./utils/ViewResourceUtil');
app.get('/view-resources', viewResources);

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/" + startPage);
});

let server = null;

// 🚀 START SERVER ONLY IF NOT RUNNING TESTS
if (process.env.JEST_WORKER_ID === undefined) {
  server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} else {
  afterAll((done) => {
    server.close(done);
  });
}

module.exports = { app, server };
