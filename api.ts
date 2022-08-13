import axios, { AxiosError } from 'axios';
import { useEffect, useRef, useState } from 'react';

/*
  This is a simplified example of building utility hooks for fetching data with axios. Recommend using axios-hooks for a more robust, configurable solution which supports SSR. (see https://github.com/simoneb/axios-hooks)
*/

interface RequestState<T> {
  /** Response body returned by axios. `null` before response is received or when an error occurs.  */
  data: T | null;
  /** `true` while request is in flight */
  isPending: boolean;
  /** Error object when request fails or null. */
  error: AxiosError<T> | Error | null;
}

/** Sends a get request after first render and provides the state of the request. (isPending, data, error) */
export const useAxios = <T>(url: string): RequestState<T> => {
  const [state, setState] = useState<RequestState<T>>({
    data: null,
    isPending: true,
    error: null,
  });

  useEffect(() => {
    // AbortController only works with axios 0.22+. Use deprecated axios.CancelToken for earlier versions.
    const controller = new AbortController();
    setState((prevState) => ({ ...prevState, isPending: true }));
    (async () => {
      try {
        const { data } = await axios.get<T>(url, { signal: controller.signal });
        setState({ isPending: false, data, error: null });
      } catch (error) {
        setState({ isPending: false, data: null, error });
      }
    })();
    return () => controller.abort();
  }, [url]);
  return state;
};

/** Async function which resolves an object with data or an error */
type Requestor<T> = () => Promise<{
  data?: T;
  error?: RequestState<T>['error'];
}>;

/** Use this hook when the request should not be sent immediately. Common use case would be waiting for a user interaction before sending the request. */
export const useLazyAxios = <T>(
  url: string,
  abortController = new AbortController()
): [Requestor<T>, RequestState<T>, () => void] => {
  const [state, setState] = useState<RequestState<T>>({
    data: null,
    isPending: false,
    error: null,
  });
  const sendRequest = async () => {
    setState((prevState) => ({ ...prevState, isPending: true }));
    try {
      const { data } = await axios.get<T>(url, {
        signal: abortController.signal,
      });
      setState({ isPending: false, data, error: null });
      return { data };
    } catch (error) {
      setState({ isPending: false, data: null, error });
      return { error };
    }
  };
  const cancelRequest = () => abortController.abort();

  // cancel request when component unmounts
  useEffect(() => cancelRequest, []);

  return [sendRequest, state, cancelRequest];
};

// Custom hook and interface for fetching random beer data
export interface Beer {
  uid: string;
  brand: string;
  name: string;
  style: string;
  alcohol: string;
}

export const useRandomBeer = () =>
  useAxios<Beer>('https://random-data-api.com/api/beer/random_beer');

// Custom hook and interface for fetching random coffee data
export interface Coffee {
  uid: string;
  blend_name: string;
  origin: string;
  variety: string;
  notes: string;
}

export const useRandomCoffee = () =>
  useAxios<Coffee>('https://random-data-api.com/api/coffee/random_coffee');

export const useLazyCoffee = () =>
  useLazyAxios<Coffee>('https://random-data-api.com/api/coffee/random_coffee');

export const useLazyBeer = () =>
  useLazyAxios<Beer>('https://random-data-api.com/api/beer/random_beer');
