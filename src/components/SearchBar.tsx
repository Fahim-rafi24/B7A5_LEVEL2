'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = query.trim()
      ? `/properties?search=${encodeURIComponent(query.trim())}`
      : '/properties';
    router.push(target);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 bg-white/10 backdrop-blur-sm p-2 rounded-2xl border border-white/10 max-w-xl"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by Properties name"
        className="flex-1 bg-transparent text-white placeholder-white/50 px-4 py-3 outline-none text-sm"
      />
      <button type="submit" className="btn-primary whitespace-nowrap justify-center">
        <Search className="w-4 h-4" /> Search
      </button>
    </form>
  );
}
