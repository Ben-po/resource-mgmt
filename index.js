var express = require('express');
var bodyParser = require("body-parser");
var app = express();

const PORT = process.env.PORT || 5050
var startPage = "index.html";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("./public"));

const { editResource } = require('./utils/EditResourceUtil');
app.put('/edit-resource/:id', editResource);
const { deleteResource } = require('./utils/DeleteResourceUtil');
app.delete('/delete-resource/:id', deleteResource);
const { addResource } = require('./utils/AddResourceUtil')
app.post('/add-resource', addResource);

const { viewResources } = require('./utils/ViewResourceUtil')
app.get('/view-resources', viewResources)
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/" + startPage);
})

server = app.listen(PORT, function () {
    const address = server.address();
    const baseUrl = `http://${address.address == "::" ? 'localhost' :
        address.address}:${address.port}`;
    console.log(`Demo project at: ${baseUrl}`);
});

module.exports = { app, server }