const { Resource } = require('../models/Resource');
const fs = require('fs').promises;
const path = require('path');
const RESOURCES_FILE = path.join('utils', 'resources.json');
const TEMPLATE_FILE = path.join('utils', 'resources.template.json');
async function addResource(req, res) {
    try {
        const { name, location, description, owner } = req.body;
        const newResource = new Resource(name, location, description, owner);
        let resources = [];
        try {
            // Try reading the existing resources.json
            const data = await fs.readFile(RESOURCES_FILE, 'utf8');
            resources = JSON.parse(data);
        } catch (err) {
            if (err.code === 'ENOENT') {
                // If resources.json doesn't exist, create it from the template
                const templateData = await fs.readFile(TEMPLATE_FILE, 'utf8');
                resources = JSON.parse(templateData);
                await fs.writeFile(RESOURCES_FILE, JSON.stringify(resources, null, 2), 'utf8');
            } else {
                throw err;
            }
        }
        // Add new resource and save to file
        resources.push(newResource);
        await fs.writeFile(RESOURCES_FILE, JSON.stringify(resources, null, 2), 'utf8');
        return res.status(201).json(resources);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}
module.exports = { addResource };