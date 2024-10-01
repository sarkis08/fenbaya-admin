// lib/cors.ts
import Cors from 'cors';

// Initialize the cors middleware
const cors = Cors({
  methods: ['GET', 'HEAD'],
  origin: 'http://localhost:3001', // Your client URL
});

// Helper method to wait for a middleware to execute before continuing
function runMiddleware(req: Request, res: Response, fn: Function) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default cors;
