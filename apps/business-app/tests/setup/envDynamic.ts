// Stand-in for $env/dynamic/private. Backed by process.env so a test can set a
// value (SESSION_SECRET, notably) before importing the code that reads it.
export const env = process.env as Record<string, string | undefined>;
