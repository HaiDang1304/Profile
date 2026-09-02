try {
  const app = require('../server/index.js');
  module.exports = app;
} catch (error) {
  module.exports = (req, res) => {
    res.status(500).json({
      message: 'Failed to load server/index.js',
      error: error.message,
      stack: error.stack,
      name: error.name
    });
  };
}
