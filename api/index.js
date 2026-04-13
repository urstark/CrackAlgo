import server from '../server.js';

export default async (req, res) => {
  try {
    // Add logging to verify the function is being hit
    console.log(`[Vercel] Handling request: ${req.method} ${req.url}`);
    
    // Express app is a function (req, res), so we just call it
    return server(req, res);
  } catch (err) {
    console.error('[Vercel] Execution Error:', err);
    res.status(500).json({
      message: 'Internal Server Error during function execution',
      error: err.message
    });
  }
};

