/**
 * Allowed browser origins for CORS / Socket.IO.
 * Set CLIENT_URL to a comma-separated list in production (e.g. https://app.example.com,https://www.example.com).
 */
function getAllowedOrigins() {
  if (process.env.CLIENT_URL) {
    return process.env.CLIENT_URL.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:4173',
    'http://127.0.0.1:4173',
  ];
}

module.exports = { getAllowedOrigins };
