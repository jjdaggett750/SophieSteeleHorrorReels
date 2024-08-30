const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve combined JSON data
app.get('/api/posts', (req, res) => {
    const dataDir = path.join(__dirname, 'public', 'data');
    
    fs.readdir(dataDir, (err, files) => {
        if (err) {
            return res.status(500).send('Unable to read data directory');
        }

        const jsonFiles = files.filter(file => file.endsWith('.json'));
        let posts = [];

        jsonFiles.forEach((file, index) => {
            const filePath = path.join(dataDir, file);
            
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            posts = posts.concat(JSON.parse(fileContent));

            // Send response after all files are read
            if (index === jsonFiles.length - 1) {
                res.json(posts);
            }
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
