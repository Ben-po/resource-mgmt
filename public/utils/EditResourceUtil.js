const fs = require('fs').promises;
const path = require('path');
const RESOURCES_FILE = path.join('utils', 'resources.json');
async function editResource(req, res) {
    try {
        const { id } = req.params;
        const { name, location, description, owner } = req.body;
        let resources = [];
        try {
            const data = await fs.readFile(RESOURCES_FILE, 'utf8');
            resources = JSON.parse(data);
        } catch (err) {
            if (err.code === 'ENOENT') {
                return res.status(404).json({ message: 'No resources found to edit.' });
            } else {
                throw err;
            }
        }
        const resourceIndex = resources.findIndex(r => r.id == id);
        if (resourceIndex === -1) {
            return res.status(404).json({ message: 'Resource not found.' });
        }
        // Update resource fields
        resources[resourceIndex] = {
            ...resources[resourceIndex],
            name: name || resources[resourceIndex].name,
            location: location || resources[resourceIndex].location,
            description: description || resources[resourceIndex].description,
            owner: owner || resources[resourceIndex].owner
        };
        await fs.writeFile(RESOURCES_FILE, JSON.stringify(resources, null, 2), 'utf8');
        return res.status(200).json({
            message: 'Resource updated successfully!',
            resource: resources[resourceIndex]
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}
module.exports = { editResource };