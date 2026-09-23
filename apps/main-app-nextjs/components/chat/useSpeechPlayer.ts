/**
 * Reads assistant replies aloud through /api/speak. Takes text and owns
 * playback only; whether a reply gets spoken is the caller's decision.
 */
import { useEffect, useRef, useState } from 'react';
import { apiUrl } from '@/lib/api';
import { stripMarkdown } from '@/lib/chat/markdown';

export function useSpeechPlayer() {
  const [speaking, setSpeaking] = useState(false);
  // Fetching the audio, before playback starts.
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urlRef = useRef<string | null>(null);
  // Only the newest request may take effect: a reply that starts speaking
  // while an older one is still being fetched wins.
  const requestRef = useRef(0);

  const release = () => {
    if (audioRef.current) {
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
  };

  /** Halt playback. Safe to call when nothing is playing. */
  const stop = () => {
    requestRef.current++;
    release();
    setSpeaking(false);
    setLoading(false);
  };

  /** Speak `text`, interrupting whatever is playing. */
  const speak = async (text: string) => {
    stop();
    const spoken = stripMarkdown(text);
    if (!spoken) return;
    const id = requestRef.current;
    setLoading(true);
    setError(null);

    // Ending, erroring and being stopped all have to land in the same clean
    // state, or the button sticks on "speaking".
    const finish = () => {
      if (id !== requestRef.current) return;
      release();
      setSpeaking(false);
      setLoading(false);
    };

    try {
      const res = await fetch(apiUrl('/api/speak'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: spoken, voice: 'alloy' })
      });
      if (!res.ok) throw new Error(`Speech request failed: ${res.status}`);
      const blob = await res.blob();
      if (id !== requestRef.current) return;

      urlRef.current = URL.createObjectURL(blob);
      const audio = new Audio(urlRef.current);
      audio.onended = finish;
      audio.onerror = () => {
        if (id !== requestRef.current) return;
        setError('Could not play that audio.');
        finish();
      };
      audioRef.current = audio;
      setLoading(false);
      setSpeaking(true);
      await audio.play();
    } catch (err) {
      if (id !== requestRef.current) return;
      console.error('Text-to-speech failed:', err);
      // Autoplay policy rejects play() until the visitor has interacted with
      // the page; anything else is the endpoint or the network.
      setError(
        err instanceof DOMException && err.name === 'NotAllowedError'
          ? 'Your browser blocked audio playback. Try clicking the page first.'
          : 'Could not read that message aloud.'
      );
      finish();
    }
  };

  // Closing the popup silences it.
  useEffect(
    () => () => {
      requestRef.current++;
      release();
    },
    []
  );

  return { speaking, loading, error, setError, speak, stop };
}
