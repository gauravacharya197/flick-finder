import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface FetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

const useFetch = <T>(fetchFunction: () => Promise<T>, dependencies: any[] = []): FetchResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchFunction()
      .then((response) => {
        setData(response);
      })
      .catch((error) => {
        setError(error.message || 'Error fetching data');
        toast.error("Error fetching movie details:", error);

      })
      .finally(() => {
        setLoading(false);
      });
  }, dependencies);

  return { data, loading, error };
};

export default useFetch;