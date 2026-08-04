// Stand-in for $env/static/private, which only exists inside a SvelteKit build.
//
// Deliberately fake values: any code path that would actually use one of these
// to reach a third party (SendGrid, Twilio, Brevo, Cloudinary) is mocked in the
// test that exercises it. A test that reaches the network is a test that fails
// for the wrong reasons.

export const POSTGRES_URL = process.env.TEST_POSTGRES_URL ?? '';
export const JWT_SECRET = 'test-jwt-secret-not-a-real-key';
export const SENDGRID_API_KEY = 'test-sendgrid-key';
export const BREVO_API_KEY = 'test-brevo-key';
export const TWILIO_ACCOUNT_SID = 'test-twilio-sid';
export const TWILIO_AUTH_TOKEN = 'test-twilio-token';
export const CLOUDINARY_API_KEY = 'test-cloudinary-key';
export const CLOUDINARY_API_SECRET = 'test-cloudinary-secret';
