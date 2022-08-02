import axios from 'axios';
import { useEffect, useState } from 'react';

// This is the baser equest hook
export const useGetRequest = <T>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // AbortController only works with acios 0.22+. Use deprecated axios.CancelToken for earlier versions.
    const controller = new AbortController();
    setIsPending(true);
    (async () => {
      try {
        const { data } = await axios.get<T>(url, { signal: controller.signal });
        setData(data);
        setError(null);
      } catch (error) {
        setData(null);
        setError(error);
      } finally {
        setIsPending(false);
      }
    })();
    return () => controller.abort();
  }, [url]);
  return { error, isPending, data };
};

// Custom hook and interface for fetching random beer data
interface Beer {
  uid: string;
  brand: string;
  name: string;
  style: string;
  alcohol: string;
}

export const useRandomBeer = () =>
  useGetRequest<Beer>('https://random-data-api.com/api/beer/random_beer');

// Custom hook and interface for fetching random coffee data
interface Coffee {
  uid: string;
  blend_name: string;
  origin: string;
  variety: string;
  notes: string;
}

export const useRandomCoffee = () =>
  useGetRequest<Coffee>('https://random-data-api.com/api/coffee/random_coffee');
