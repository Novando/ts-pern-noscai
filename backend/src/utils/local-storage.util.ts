import { AsyncLocalStorage } from "async_hooks";
import type { Dayjs } from "dayjs";
import type { PoolClient } from "pg";

/**
 * The shape of the store object for AsyncLocalStorage
 */
export type Store = {
  pgTx?: PoolClient;
  userId?: string;
  tenantId?: number;
  endpoint: string;
  timeNow: Dayjs;
}

const asyncLocalStorage = new AsyncLocalStorage<Store>();

/**
 * Run a function inside a new AsyncLocalStorage context
 */
export function runWithStore<T>(store: Store, fn: () => T): T {
  return asyncLocalStorage.run(store, fn);
}

/**
 * Get all value from the current store by key, excluding pgTx
 */
export function getAllAsyncLocalStorage(): Omit<Store, 'pgTx'> | undefined  {
  const store = asyncLocalStorage.getStore();

  if (!store) return undefined;

  const { ...rest } = store;

  return rest;
}

/**
 * Get a value from the current store by key
 */
export function getAsyncLocalStorage<K extends keyof Store>(storeName: K): Store[K] | undefined  {
  return asyncLocalStorage.getStore()?.[storeName];
}

/**
 * Set a value in the current store by key
 */
export function setAsyncLocalStorage<K extends keyof Store>(storeName: K, setData: Store[K]): void {
  const store = asyncLocalStorage.getStore();

  if (store) store[storeName] = setData;
}
