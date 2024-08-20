export function generateOTP(length: number): string {
  const digits = '123456789';
  let OTP = '';
  for (let i = 0; i < length; i++) {
    OTP += digits[Math.floor(Math.random() * 9)];
  }
  return OTP;
}
