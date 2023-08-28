import React from "react";
import { UseAsyncFetcherParams, useAsyncFetcher } from "./useAsyncFetcher";

export type UseAsyncFetcherTestBoxProps = Required<
  UseAsyncFetcherParams<string>
>;

export const UseAsyncFetcherTestBox = ({
  fetcher,
  onData,
  onError,
  onCancel,
  onStale,
  dependencies
}: UseAsyncFetcherTestBoxProps) => {
  useAsyncFetcher({
    fetcher,

    onData,

    onCancel,

    onError,

    onStale,

    dependencies
  });

  return <></>;
};
