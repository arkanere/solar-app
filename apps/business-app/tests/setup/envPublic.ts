// Stand-in for $env/static/public, the counterpart to env.ts.
//
// Same rule: fake values only. The one consumer the suite reaches so far is
// postRecentProject, whose Cloudinary client is mocked in the test itself.

export const PUBLIC_CLOUDINARY_CLOUD_NAME = 'test-cloud';
