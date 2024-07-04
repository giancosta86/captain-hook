# captain-hook

_TypeScript hooks for React_

![GitHub CI](https://github.com/giancosta86/captain-hook/actions/workflows/publish-to-npm.yml/badge.svg)
[![npm version](https://badge.fury.io/js/@giancosta86%2Fcaptain-hook.svg)](https://badge.fury.io/js/@giancosta86%2Fcaptain-hook)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](/LICENSE)

**captain-hook** is a **TypeScript** library for **React** dedicated to _functional programming_ via _hooks_ - as described in [this article](https://react.dev/blog/2023/03/16/introducing-react-dev#going-all-in-on-modern-react-with-hooks).

## Installation

The package on NPM is:

> @giancosta86/captain-hook

The public API is partitioned into the following modules:

- **defineContext**: for the `defineContext` multi-factory function.

- **useAsyncFetcher**: for the `useAsyncFetcher` hook.

## Usage

### defineContext()

Factory function removing boilerplate code from the creation of a _React context_; you simply need to know:

- the _interface_ of the context

- the _hook_ function for obtaining the (probably memoized via `useMemo()`) _context value_ that will be passed to the `Provider` component upon each rendering

and it will return (in this order):

- the _hook_ internally calling `useContext()` to obtain the current _context value_ within the `Provider` component tree

- the `Provider` component itself, ready to use - and with no additional properties

For example:

```typescript
// Defining the context interface.
interface CounterContext {
  numericValue: number;
  increase(): void;
}

// This creates both the context-access hook
// and the context provider component.
const [useCounterContext, CounterContextProvider] =
  defineContext<CounterContext>(
    // This is actually a hook, so it must
    // obey all the hook rules.
    //
    // Its result must be the context value passed
    // by the context provider to its component tree.
    () => {
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

const ContextClient: FC = () => {
  const { numericValue, increase } = useCounterContext();

  // Use the context data here, and return the JSX...
};

// Somewhere in the React component tree...
<CounterContextProvider>
  <ContextClient />
</CounterContextProvider>

```

### useAsyncFetcher()

Multi-stage approach to data fetching, alternative to [SWR](https://swr.vercel.app/).

It creates a sort of _fetching pipeline_ having the following parameters - to be packed into an object:

- `fetcher`: the `() => Promise<T | undefined>` function used to fetch data - for example, from some API. If the function returns `Promise<undefined>`, the process will be stopped and `onCancel` (if passed) will be called instead of `onData`

- `onData`: basically a `(data: T) => void | Promise<void>` function manipulating the fetched data; for example, you might want to call _React state setters_

- `onError`: precisely an `(err: unknown) => void | Promise<void>` function only called if an error is thrown by `fetcher` or any other handler (including `onCancel` and `onStale`)

- `onCancel`: optional `() => void | Promise<void>` function called in lieu of `onData` when `fetcher` returns `undefined`

- `onStale`: optional `() => void | Promise<void>` function called when `fetcher` returns but in the meantime another fetcher has been started because of a change in `dependencies`

- `dependencies`: the array of dependencies referenced by the internal `useEffect()`; the hook by itself does **not** automatically set any implicit dependency.
