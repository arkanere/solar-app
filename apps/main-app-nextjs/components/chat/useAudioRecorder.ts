/**
 * Microphone recording for voice input. Produces a Blob and nothing more; the
 * caller decides where to send it. The mic is released as soon as recording
 * ends, and on unmount, so the browser's recording indicator never lingers.
 */
import { useEffect, useRef, useState } from 'react';

// Safari only records audio/mp4.
const CANDIDATE_MIME_TYPES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/mp4',
  'audio/ogg;codecs=opus'
];

export function useAudioRecorder() {
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // The popup never renders on the server, so the browser globals are safe here.
  const supported = typeof MediaRecorder !== 'undefined' && !!navigator.mediaDevices?.getUserMedia;

  const releaseStream = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  /** Prompt if needed, then record. Resolves false if refused or failed. */
  const start = async (): Promise<boolean> => {
    setError(null);
    chunksRef.current = [];
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setError(
        'Microphone access was blocked. Enable it in your browser settings to use voice input.'
      );
      return false;
    }
    try {
      const mimeType = CANDIDATE_MIME_TYPES.find((t) => MediaRecorder.isTypeSupported(t));
      const recorder = new MediaRecorder(streamRef.current, mimeType ? { mimeType } : undefined);
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onerror = () => {
        setError('Recording failed. Please try again.');
        setRecording(false);
        releaseStream();
      };
      recorderRef.current = recorder;
      recorder.start();
      setRecording(true);
      return true;
    } catch {
      setError('Could not start recording on this device.');
      releaseStream();
      return false;
    }
  };

  /** Stop and resolve with the audio, or null if nothing was captured. */
  const stop = (): Promise<Blob | null> => {
    const recorder = recorderRef.current;
    if (!recorder) return Promise.resolve(null);
    return new Promise((resolve) => {
      recorder.onstop = () => {
        const type = recorder.mimeType || 'audio/webm';
        const blob = chunksRef.current.length ? new Blob(chunksRef.current, { type }) : null;
        chunksRef.current = [];
        recorderRef.current = null;
        setRecording(false);
        releaseStream();
        resolve(blob);
      };
      recorder.stop();
    });
  };

  /** Abandon a recording without producing audio. */
  const cancel = () => {
    const recorder = recorderRef.current;
    if (recorder) {
      recorder.onstop = null;
      recorder.stop();
    }
    recorderRef.current = null;
    chunksRef.current = [];
    setRecording(false);
    releaseStream();
  };

  // Closing the popup mid-recording must not leave the mic open.
  useEffect(
    () => () => {
      recorderRef.current?.stop();
      streamRef.current?.getTracks().forEach((t) => t.stop());
    },
    []
  );

  return { supported, recording, error, setError, start, stop, cancel };
}

/** The upload's file name. The transcription API reads the format from the extension. */
export function audioFileName(blob: Blob): string {
  const ext = blob.type.includes('mp4') ? 'mp4' : blob.type.includes('ogg') ? 'ogg' : 'webm';
  return `recording.${ext}`;
}
