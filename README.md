# captain-hook

_TypeScript hooks for React_

![GitHub CI](https://github.com/giancosta86/captain-hook/actions/workflows/publish-to-npm.yml/badge.svg)
[![npm version](https://badge.fury.io/js/@giancosta86%2Fcaptain-hook.svg)](https://badge.fury.io/js/@giancosta86%2Fcaptain-hook)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](/LICENSE)

**captain-hook** is a **TypeScript** library for **React** dedicated to _functional programming_ via _hooks_ - as described in [this article](https://react.dev/blog/2023/03/16/introducing-react-dev#going-all-in-on-modern-react-with-hooks).

## Installation

The package on NPM is:

> @giancosta86/captain-hook

The public API entirely resides in the root package index, so you shouldn't reference specific modules.

## Usage

### useAsyncFetcher()

Multi-stage approach to data fetching, alternative to [SWR](https://swr.vercel.app/).

It creates a sort of _fetching pipeline_ having the following parameters - to be packed into an object:

- `fetcher`: the `() => Promise<T | undefined>` function used to fetch data - for example, from some API. If the function returns `Promise<undefined>`, the process will be stopped and `onCancel` (if passed) will be called instead of `onData`

- `onData`: basically a `(data: T) => void | Promise<void>` function manipulating the fetched data; for example, you might want to call _React state setters_

- `onError`: precisely an `(err: unknown) => void | Promise<void>` function only called if an error is thrown by `fetcher` or any other handler (including `onCancel` and `onStale`)

- `onCancel`: optional `() => void | Promise<void>` function called in lieu of `onData` when `fetcher` returns `undefined`

- `onStale`: optional `() => void | Promise<void>` function called when `fetcher` returns but in the meantime another fetcher has been started because of a change in `dependencies`

- `dependencies`: the array of dependencies referenced by the internal `useEffect()`; the hook by itself does **not** automatically set any implicit dependency.
