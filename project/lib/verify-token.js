import { jwtVerify } from 'jose';

export async function verifyOnlyToken(token) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload; // contains user info like id, email if you added
  } catch (err) {
    return null;
  }
}
