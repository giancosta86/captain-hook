import React, { useContext, createContext, PropsWithChildren, FC } from "react";

/**
 * Hook used to access a context of the given type.
 */
export type UseContextHook<TContext> = () => TContext;

/**
 * Hook internally used by the context provider to obtain
 * an instance - usually memoized via useMemo() - of the context.
 */
export type UseContextProviderValueHook<TContext> = () => TContext;

/**
 * Creates a context, returning both its access hook and the Provider component.
 *
 * Its only parameter is the `useContextProviderValue` function, which
 * must be a hook function - that is, a function (even a closure)
 * respecting the hook rules - returning the context instance
 * which will be passed to the `value` property of the Provider.
 */
export function defineContext<TContext>(
  useContextProviderValue: UseContextProviderValueHook<TContext>
): [UseContextHook<TContext>, FC<PropsWithChildren>] {
  const potentialContext = createContext<TContext | undefined>(undefined);

  function useDefinedContext(): TContext {
    const actualContext = useContext(potentialContext);

    if (!actualContext) {
      throw new Error(
        "The context must be accessed from within a Context provider!"
      );
    }

    return actualContext;
  }

  const ContextProvider: FC<PropsWithChildren> = (props: PropsWithChildren) => {
    const contextProviderValue = useContextProviderValue();

    return (
      <potentialContext.Provider value={contextProviderValue}>
        {props.children}
      </potentialContext.Provider>
    );
  };

  return [useDefinedContext, ContextProvider];
}
