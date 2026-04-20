'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Link } from '@/i18n/navigation';

type Term = { slug: string; term: string; definition: string };

export default function GlossaryClient({ terms, locale }: { terms: Term[]; locale: string }) {
  const [query, setQuery] = useState('');
  const isFr = locale === 'fr';

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return terms;
    return terms.filter(
      (t) => t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q)
    );
  }, [query, terms]);

  const letters = useMemo(() => {
    const set = new Set(filtered.map((t) => t.term[0].toUpperCase()));
    return Array.from(set).sort();
  }, [filtered]);

  const grouped = useMemo(() => {
    return letters.map((letter) => ({
      letter,
      terms: filtered.filter((t) => t.term[0].toUpperCase() === letter),
    }));
  }, [filtered, letters]);

  return (
    <div className="min-h-screen pb-24 pt-32">
      <div className="mx-auto max-w-4xl px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <span className="mb-3 inline-block text-[0.65rem] font-bold uppercase tracking-[0.3em] text-orange-400">
            {isFr ? 'Référence' : 'Reference'}
          </span>
          <h1 className="font-heading text-4xl font-bold text-white md:text-5xl">
            {isFr ? 'Glossaire d\'électricité' : 'Electrical Glossary'}
          </h1>
          <p className="mt-4 text-gray-400">
            {isFr
              ? `${terms.length} termes essentiels en électricité résidentielle et commerciale au Québec.`
              : `${terms.length} essential electrical terms for residential and commercial work in Quebec.`}
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-10">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isFr ? 'Rechercher un terme…' : 'Search a term…'}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder-gray-500 outline-none transition focus:border-orange-500/40 focus:ring-0"
          />
        </div>

        {/* Letter nav */}
        {!query && (
          <div className="mb-10 flex flex-wrap gap-2">
            {letters.map((l) => (
              <a
                key={l}
                href={`#letter-${l}`}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xs font-bold text-white/60 transition hover:border-orange-500/40 hover:text-orange-400"
              >
                {l}
              </a>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <p className="text-center text-gray-500">
            {isFr ? 'Aucun résultat.' : 'No results found.'}
          </p>
        ) : (
          <div className="space-y-12">
            {grouped.map(({ letter, terms: groupTerms }) => (
              <div key={letter} id={`letter-${letter}`}>
                <div className="mb-4 flex items-center gap-3">
                  <span className="font-heading text-2xl font-bold text-orange-500">{letter}</span>
                  <div className="h-px flex-1 bg-white/8" />
                </div>
                <dl className="space-y-4">
                  {groupTerms.map((term) => (
                    <div
                      key={term.slug}
                      id={term.slug}
                      className="rounded-xl border border-white/8 bg-white/3 p-5 scroll-mt-24"
                    >
                      <dt className="font-heading text-base font-bold text-white">
                        {term.term}
                      </dt>
                      <dd className="mt-2 text-sm leading-relaxed text-gray-400">
                        {term.definition}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 rounded-2xl border border-orange-500/20 bg-orange-500/5 p-8 text-center">
          <h2 className="font-heading text-xl font-bold text-white">
            {isFr ? 'Un projet électrique en tête?' : 'Have an electrical project in mind?'}
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            {isFr
              ? 'Nos maîtres électriciens certifiés sont disponibles pour répondre à vos questions.'
              : 'Our certified master electricians are available to answer your questions.'}
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-block rounded-full bg-orange-500 px-8 py-3 text-sm font-semibold text-white transition hover:bg-orange-400"
          >
            {isFr ? 'Obtenir une soumission' : 'Get a Quote'}
          </Link>
        </div>
      </div>
    </div>
  );
}
