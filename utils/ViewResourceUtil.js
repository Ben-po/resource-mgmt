const fs = require('fs').promises;
const path = require('path');
const RESOURCES_FILE = path.join('utils', 'resources.json');
async function viewResources(req, res) {
    try {
        const data = await fs.readFile(RESOURCES_FILE, 'utf8');
        const allResources = JSON.parse(data);
        return res.status(200).json(allResources);
    } catch (error) {
        // Handle case where file does not exist yet
        if (error.code === 'ENOENT') {
            return res.status(200).json([]); // return empty list if no file
        }
        return res.status(500).json({ message: error.message });
    }
}
module.exports = { viewResources };