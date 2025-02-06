export default function makeCancellablePromise<T>(promise: Promise<T>): {
  promise: Promise<T>;
  cancel(): void;
} {
  const controller = new AbortController();
  const signal = controller.signal;

  const wrappedPromise: Promise<T> = new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(signal.reason);
    }

    promise.then(resolve).catch(reject);

    signal.addEventListener('abort', () => {
      reject(signal.reason);
    });
  });

  return {
    promise: wrappedPromise,
    cancel() {
      controller.abort();
    },
  };
}
