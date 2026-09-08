import { useEffect, useRef, useState } from 'react';
import type { Request, Result } from '../types/crypto';
export function useCrypto() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const current = useRef<Worker | null>(null);
  const pending = useRef<((value: Result | null) => void) | null>(null);
  const cancel = () => {
    current.current?.terminate();
    current.current = null;
    pending.current?.(null);
    pending.current = null;
    setBusy(false);
  };
  useEffect(
    () => () => {
      current.current?.terminate();
      pending.current?.(null);
    },
    [],
  );
  async function run(request: Request): Promise<Result | null> {
    if (current.current) return null;
    if (!globalThis.crypto?.getRandomValues || typeof Worker === 'undefined') {
      setError(
        'This browser needs secure randomness and Web Workers. Use a current browser over HTTPS or localhost.',
      );
      return null;
    }
    setError('');
    setBusy(true);
    return new Promise((resolve) => {
      pending.current = resolve;
      try {
        const worker = new Worker(
          new URL('../crypto/worker.ts', import.meta.url),
          { type: 'module' },
        );
        current.current = worker;
        const finish = (result: Result | null, error = '') => {
          worker.terminate();
          current.current = null;
          pending.current = null;
          setBusy(false);
          setError(error);
          resolve(result);
        };
        worker.onmessage = (
          event: MessageEvent<{ result?: Result; error?: string }>,
        ) => finish(event.data.result ?? null, event.data.error);
        worker.onerror = () =>
          finish(
            null,
            'The cryptography worker could not load. Reload the page and check that its static assets are available.',
          );
        worker.postMessage(request);
      } catch {
        current.current = null;
        pending.current = null;
        setBusy(false);
        setError('Unable to start cryptography in this browser.');
        resolve(null);
      }
    });
  }
  return { run, busy, error, cancel };
}
