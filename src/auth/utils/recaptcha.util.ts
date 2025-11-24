import axios from 'axios';

export async function verifyRecaptcha(
    token: string,
): Promise<boolean> {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if(!secretKey) throw new Error('RECAPTCHA_SECRET_KEY is not set in environment');

    const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';

    try {
        const response = await axios.post<IRecaptchaResponse>(verifyUrl, null, {
            params: { secret: secretKey, response: token },
        });
        return response.data.success === true;
    } catch (error) {
        console.error('Recaptcha Validation Error:', error);
        return false;
    }
}

interface IRecaptchaResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  score?: number;
  action?: string;
}