import { describe, it, expect } from "vitest";
import React, { FC, useEffect, useMemo, useState } from "react";
import { defineContext } from "./defineContext";
import { render } from "@testing-library/react";

interface CounterContext {
  numericValue: number;
  increase(): void;
}

const [useCounterContext, CounterContextProvider] =
  defineContext<CounterContext>(() => {
    const [numericValue, setNumericValue] = useState(0);

    const contextValue = useMemo(
      () => ({
        numericValue,
        increase() {
          setNumericValue(current => current + 1);
        }
      }),
      [numericValue]
    );

    return contextValue;
  });

interface ContextClientProps {
  resolveTest: () => void;
}

const ContextClient: FC<ContextClientProps> = ({ resolveTest }) => {
  const { numericValue, increase } = useCounterContext();

  useEffect(() => {
    increase();
    increase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (numericValue == 2) {
      resolveTest();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numericValue]);

  return <></>;
};

const ProviderBox: FC<ContextClientProps> = props => (
  <CounterContextProvider>
    <ContextClient {...props} />
  </CounterContextProvider>
);

describe("Defining a context", () => {
  it("should work", () =>
    new Promise<void>(resolve => {
      render(<ProviderBox resolveTest={resolve} />);
    }));
});

describe("Accessing a context", () => {
  describe("when not in a provider", () => {
    it("should fail", () => {
      expect(() => {
        render(<ContextClient resolveTest={() => {}} />);
      }).toThrow(
        "The context must be accessed from within a Context provider!"
      );
    });
  });
});
