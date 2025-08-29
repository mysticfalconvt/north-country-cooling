import bcrypt from 'bcryptjs';
import { getDb } from './db';
import { adminUsers } from './db/schema';
import { eq } from 'drizzle-orm';

export async function verifyAdmin(username: string, password: string): Promise<boolean> {
  try {
    const db = getDb();
    const user = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.username, username))
      .limit(1);

    if (user.length === 0) {
      return false;
    }

    const isValid = await bcrypt.compare(password, user[0].passwordHash);
    return isValid;
  } catch (error) {
    console.error('Auth error:', error);
    return false;
  }
}

export async function createAdminUser(username: string, password: string): Promise<boolean> {
  try {
    const db = getDb();
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.insert(adminUsers).values({
      username,
      passwordHash: hashedPassword,
    });
    return true;
  } catch (error) {
    console.error('Create admin error:', error);
    return false;
  }
}