import { ReactNode } from 'react';
import { defer, LoaderFunctionArgs, useLoaderData, Await as AwaitReactRouter, AwaitProps as AwaitPropsReactRouter } from 'react-router-dom';

export const deferredLoader = <T extends Record<string, unknown>>(dataFunc: (args: LoaderFunctionArgs) => T) => {
  return (args: LoaderFunctionArgs) => defer(dataFunc(args)) as Omit<ReturnType<typeof defer>, 'data'> & { data: T };
};

export const useDeferredLoaderData = <T extends ReturnType<typeof deferredLoader>>() => {
  return useLoaderData() as ReturnType<T>['data'];
};

type AwaitProps<T> = Omit<AwaitPropsReactRouter, 'children' | "resolve"> & {
  children: (data: Awaited<T>) => ReactNode;
  resolve: Promise<T>;
};

export const Await = <T,>(props: AwaitProps<T>) => {
  return <AwaitReactRouter {...props} />;
};
