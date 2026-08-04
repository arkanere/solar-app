// Per-test-file setup. Runs before the module under test is imported, which
// matters for SESSION_SECRET: SessionManager reads it through $env/dynamic/private
// at call time, but setting it here keeps every file independent of ordering.
process.env.SESSION_SECRET ??= 'test-session-secret-not-a-real-key';
