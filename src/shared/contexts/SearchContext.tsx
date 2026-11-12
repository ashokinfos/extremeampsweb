'use client';

import { useState, useContext, useCallback, createContext } from 'react';

type SearchContextType = {
  query: string;
  setQuery: (q: string) => void;
  commit: () => void;
  clearSearch: () => void;
  committed: string;
};

const SearchContext = createContext<SearchContextType>({
  query: '',
  setQuery: () => {},
  commit: () => {},
  clearSearch: () => {},
  committed: '',
});

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState('');
  const [committed, setCommitted] = useState('');

  const commit = useCallback(() => setCommitted(query), [query]);
  const clearSearch = useCallback(() => {
    setQuery('');
    setCommitted('');
  }, []);

  return (
    <SearchContext.Provider value={{ query, setQuery, commit, clearSearch, committed }}>
      {children}
    </SearchContext.Provider>
  );
}

export const useSearch = () => useContext(SearchContext);
