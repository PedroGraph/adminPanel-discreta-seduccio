
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { useGlobalSearch } from "@/hooks/useGlobalSearch";
import { GlobalSearchResults } from "./GlobalSearchResults";

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { query, setQuery, results, isLoading } = useGlobalSearch();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    if (query.length >= 2) {
      setIsOpen(true);
    }
  };

  const handleResultClick = () => {
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div className="relative w-44 sm:w-64" ref={searchRef}>
      <Input
        type="text"
        placeholder="Buscar..."
        value={query}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        className="pl-10 pr-2 h-9 text-sm bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-600"
        aria-label="Buscar"
      />
      <Search
        className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-300"
        aria-hidden="true"
      />
      
      {isOpen && (query.length >= 2 || isLoading) && (
        <GlobalSearchResults
          results={results}
          isLoading={isLoading}
          onResultClick={handleResultClick}
        />
      )}
    </div>
  );
}
