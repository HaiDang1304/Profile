module.exports = (req, res) => {
  res.json({
    env_db_host: process.env.DB_HOST || 'MISSING',
    env_db_name: process.env.DB_NAME || 'MISSING',
    node_version: process.version,
    message: 'Hello from test API!'
  });
};
