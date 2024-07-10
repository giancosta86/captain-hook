import { describe, it, expect } from "vitest";
import React from "react";
import { render } from "@testing-library/react";
import { measureDuration } from "@giancosta86/time-utils";
import { createBarrier } from "@giancosta86/sync-tools";
import { UseAsyncFetcherTestBox } from "./useAsyncFetcher.test.box.js";
import {
  TestFetchers,
  FastFetcher,
  SlowFetcher,
  CancelingErrorFetcher,
  ThrowingFetcher
} from "./_testFetchers/index.js";

describe("useAsyncFetcher()", () => {
  describe("when passing a fetcher that returns immediately", () => {
    it("should work", async () => {
      const fetchedValue = await new Promise<string | undefined>(
        (resolve, reject) => {
          render(
            <UseAsyncFetcherTestBox
              fetcher={FastFetcher.run}
              onData={resolve}
              onError={reject}
              onCancel={reject}
              onStale={reject}
              dependencies={[]}
            />
          );
        }
      );

      expect(fetchedValue).toBe(TestFetchers.value);
    });

    describe("when the fetcher throws", () => {
      it("should call onError()", async () => {
        const error = await new Promise<unknown>((resolve, reject) => {
          render(
            <UseAsyncFetcherTestBox
              fetcher={ThrowingFetcher.run}
              onData={reject}
              onError={resolve}
              onCancel={reject}
              onStale={reject}
              dependencies={[]}
            />
          );
        });

        expect((error as Error).message).toBe(ThrowingFetcher.errorMessage);
      });
    });

    describe("when passing a throwing data processor", () => {
      it("should call onError()", async () => {
        const dataProcessingErrorMessage = "Data processing error";

        const error = await new Promise<unknown>((resolve, reject) => {
          render(
            <UseAsyncFetcherTestBox
              fetcher={FastFetcher.run}
              onData={() => {
                throw new Error(dataProcessingErrorMessage);
              }}
              onError={resolve}
              onCancel={reject}
              onStale={reject}
              dependencies={[]}
            />
          );
        });

        expect((error as Error).message).toBe(dataProcessingErrorMessage);
      });
    });
  });

  describe("when passing a fetcher with delayed return", () => {
    describe("when the pipeline has no dependencies", () => {
      it("should work", async () => {
        const elapsedTime = await measureDuration(async () => {
          const fetchedValue = await new Promise<string | undefined>(
            (resolve, reject) => {
              render(
                <UseAsyncFetcherTestBox
                  fetcher={SlowFetcher.run}
                  onData={resolve}
                  onError={reject}
                  onCancel={reject}
                  onStale={reject}
                  dependencies={[]}
                />
              );
            }
          );

          expect(fetchedValue).toBe(TestFetchers.value);
        });

        expect(elapsedTime).toBeGreaterThan(SlowFetcher.delayTestInterval);
      });
    });

    describe("when the pipeline dependencies remain unaltered while the pipeline is running", () => {
      it("should not re-run the pipeline", () => {
        const dependencies = [92, 98, "Yogi"] as const;

        return new Promise<void>((resolve, reject) => {
          const { rerender } = render(
            <UseAsyncFetcherTestBox
              fetcher={() =>
                SlowFetcher.run(
                  SlowFetcher.fetchDelay + SlowFetcher.fetchDelay / 2
                )
              }
              onData={() => resolve()}
              onError={reject}
              onCancel={reject}
              onStale={reject}
              dependencies={dependencies}
            />
          );

          rerender(
            <UseAsyncFetcherTestBox
              fetcher={SlowFetcher.run}
              onData={reject}
              onError={reject}
              onCancel={reject}
              onStale={reject}
              dependencies={dependencies}
            />
          );
        });
      });
    });

    describe("when the pipeline dependencies change while the pipeline is running", () => {
      describe("when the stale processor runs fine", () => {
        it("should complete just the latest pipeline", () =>
          createBarrier(2, (addToken, reject) => {
            const { rerender } = render(
              <UseAsyncFetcherTestBox
                fetcher={() =>
                  SlowFetcher.run(
                    SlowFetcher.fetchDelay + SlowFetcher.fetchDelay / 2
                  )
                }
                onData={reject}
                onError={reject}
                onCancel={reject}
                onStale={addToken}
                dependencies={[0]}
              />
            );

            rerender(
              <UseAsyncFetcherTestBox
                fetcher={SlowFetcher.run}
                onData={addToken}
                onError={reject}
                onCancel={reject}
                onStale={reject}
                dependencies={[1]}
              />
            );
          }));
      });

      describe("when the stale processor throws an error", () => {
        it("should call the related onError()", () =>
          createBarrier(2, (addToken, reject) => {
            const { rerender } = render(
              <UseAsyncFetcherTestBox
                fetcher={() =>
                  SlowFetcher.run(
                    SlowFetcher.fetchDelay + SlowFetcher.fetchDelay / 2
                  )
                }
                onData={reject}
                onError={addToken}
                onCancel={reject}
                onStale={() => {
                  throw new Error("Stale handling error");
                }}
                dependencies={[0]}
              />
            );

            rerender(
              <UseAsyncFetcherTestBox
                fetcher={SlowFetcher.run}
                onData={addToken}
                onError={reject}
                onCancel={reject}
                onStale={reject}
                dependencies={[1]}
              />
            );
          }));
      });
    });
  });

  describe("when passing a fetcher returning undefined", () => {
    it("should cancel the pipeline and call onCancel()", () =>
      new Promise<void>((resolve, reject) => {
        render(
          <UseAsyncFetcherTestBox
            fetcher={CancelingErrorFetcher.run}
            onData={reject}
            onError={reject}
            onCancel={resolve}
            onStale={reject}
            dependencies={[]}
          />
        );
      }));

    describe("when passing a throwing cancel processor", () => {
      it("should call onError()", async () => {
        const cancelErrorMessage = "Cancel error";

        const error = await new Promise<unknown>((resolve, reject) => {
          render(
            <UseAsyncFetcherTestBox
              fetcher={CancelingErrorFetcher.run}
              onData={reject}
              onError={resolve}
              onCancel={() => {
                throw new Error(cancelErrorMessage);
              }}
              onStale={reject}
              dependencies={[]}
            />
          );
        });

        expect((error as Error).message).toBe(cancelErrorMessage);
      });
    });
  });
});
