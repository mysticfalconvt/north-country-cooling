import { NextApiRequest, NextApiResponse } from 'next';
import { verifyAdmin } from '../../../lib/auth';
import { serialize } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }

  const isValid = await verifyAdmin(username, password);

  if (!isValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Create a simple session token (in production, use JWT or similar)
  const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');

  // Set HTTP-only cookie
  const cookie = serialize('admin-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });

  res.setHeader('Set-Cookie', cookie);
  res.status(200).json({ message: 'Login successful' });
}