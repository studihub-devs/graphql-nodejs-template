import crypto from 'crypto';
const AES_256_KEY = Buffer.from(process.env.AES_256_KEY, 'hex');
const AES_256_IV = Buffer.from(process.env.AES_256_IV, 'hex');

export const encryptAES256 = (val: string): string => {
  const cipher = crypto.createCipheriv('aes-256-cbc', AES_256_KEY, AES_256_IV);
  let encrypted = cipher.update(val, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
};

export const decryptAES256 = (encrypted: string): string => {
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    AES_256_KEY,
    AES_256_IV,
  );
  const decrypted = decipher.update(encrypted, 'base64', 'utf8');
  return decrypted + decipher.final('utf8');
};
