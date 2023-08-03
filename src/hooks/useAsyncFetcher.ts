import { useEffect } from "react";

export type UseAsyncFetcherParams<T> = Readonly<{
  fetcher: () => Promise<T | undefined>;

  onData: (data: T) => void | Promise<void>;

  onError: (err: unknown) => void | Promise<void>;

  onCancel?: () => void | Promise<void>;

  onStale?: () => void | Promise<void>;

  dependencies: React.DependencyList;
}>;

export const useAsyncFetcher = <T>({
  fetcher,
  onData,
  onError,
  onCancel,
  onStale,
  dependencies
}: UseAsyncFetcherParams<T>) => {
  useEffect(() => {
    let canProcessData = true;

    (async () => {
      try {
        const fetchedData = await fetcher();

        if (!canProcessData) {
          await onStale?.();
          return;
        }

        if (fetchedData === undefined) {
          await onCancel?.();
          return;
        }

        await onData(fetchedData);
      } catch (err) {
        await onError(err);
      }
    })();

    return () => {
      canProcessData = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
};
