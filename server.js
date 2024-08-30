const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Serve the index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve the admin panel
app.get('/admin-panel', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin-panel.html'));
});

// Serve the add-post form
app.get('/add-post', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'add-post.html'));
});

// Handle form submissions
app.post('/add-post', (req, res) => {
    const { title, author, content } = req.body;

    // Read existing posts from JSON file
    fs.readFile(path.join(__dirname, 'data', 'posts.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Internal Server Error');
        }

        let posts;
        try {
            posts = JSON.parse(data).posts;
        } catch (err) {
            console.error('Error parsing JSON:', err);
            return res.status(500).send('Internal Server Error');
        }

        // Add new post to the posts array
        posts.push({
            title,
            date: new Date().toLocaleDateString(),
            content
        });

        // Write updated posts array back to JSON file
        fs.writeFile(path.join(__dirname, 'data', 'posts.json'), JSON.stringify({ posts }, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return res.status(500).send('Internal Server Error');
            }
            // Redirect to the admin panel page after successful post addition
            res.redirect('/admin-panel');
        });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
