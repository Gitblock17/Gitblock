const express = require('express');
const path = require('path');

const app = express();

// Rewrite /swap to /swap.html
app.get('/swap', (req, res) => res.sendFile(path.join(__dirname, 'swap.html')));

// Static files
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`GitBlock Cloud → http://localhost:${PORT}`);
});
