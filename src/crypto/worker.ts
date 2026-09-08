import { execute } from './operations';
import type { Request } from '../types/crypto';
self.onmessage = (event: MessageEvent<Request>) => {
  try {
    self.postMessage({ result: execute(event.data) });
  } catch {
    self.postMessage({
      error:
        'The operation could not complete. Check the inputs and parameter set, then reset the lab and try again.',
    });
  }
};
