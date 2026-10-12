-- Conversation persistence for the FastAPI chatbot (chatbotmessagesstore)
--
-- solar-agent-backend writes one row per user message and one per assistant
-- reply, sharing a session_id. `metadata` carries the parts of its NDJSON event
-- stream that have no column of their own: intent classification, deterministic
-- citations, tool name/result, dispatched business events, INR cost, and the
-- stopped/error flags. Deliberately excludes leadProfile — name/phone/email
-- belong in leaddata, not duplicated across every chat row.
--
-- Run manually: psql $POSTGRES_URL < 052-chatbot-conversation-metadata.sql

BEGIN;

ALTER TABLE chatbotmessagesstore
  ADD COLUMN IF NOT EXISTS metadata JSONB;

-- Reading a conversation back is "every row for one session, in order", which
-- is the whole point of storing session_id. Rows from the old chatbot minted a
-- fresh uuid per request and so will not group, but the index costs nothing
-- there and the new writer keeps one id for the life of a conversation.
CREATE INDEX IF NOT EXISTS chatbotmessagesstore_session_idx
  ON chatbotmessagesstore (session_id, "timestamp");

COMMIT;
