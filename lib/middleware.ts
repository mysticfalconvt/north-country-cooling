import { NextApiRequest, NextApiResponse } from 'next';

export function isAuthenticated(req: NextApiRequest): boolean {
  const token = req.cookies['admin-token'];
  
  if (!token) {
    return false;
  }

  try {
    // Simple token validation (in production, use proper JWT verification)
    const decoded = Buffer.from(token, 'base64').toString();
    const [username, timestamp] = decoded.split(':');
    
    // Check if token is less than 24 hours old
    const tokenAge = Date.now() - parseInt(timestamp);
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    return tokenAge < maxAge && username === process.env.ADMIN_USERNAME;
  } catch (error) {
    return false;
  }
}

export function requireAuth(handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    if (!isAuthenticated(req)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    return handler(req, res);
  };
}