'use client'

import { useState } from 'react'
import { Search, Loader2, MapPin, Calendar, Users, Star, CheckCircle2, XCircle, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Hotel {
  hotel_id: string
  name: string
  address: string
  city: string
  stars: number
  rating: number
  review_count: number
  nightly: number | null
  stay_total: number | null
  nights: number | null
  refundable: boolean
  cancel_tag: string
  mi_to_landmark: number | null
  landmark_name: string | null
  thumbnail: string | null
}

interface SearchResult {
  ok: boolean
  hotels: Hotel[]
  recommendation?: {
    hotel_id: string
    name: string
    nightly: number | null
    stay_total: number | null
    cancel_tag: string
    why: string
  }
  place_label?: string
  dates?: {
    check_in: string
    check_out: string
  }
  nights?: number
  error?: string
  message?: string
}

export default function Home() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SearchResult | null>(null)
  const [cityWarning, setCityWarning] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const lowerQuery = query.toLowerCase()
    const otherCities = ['new york', 'nyc', 'los angeles', 'la', 'chicago', 'boston', 'seattle', 'denver', 'austin', 'miami']
    const hasOtherCity = otherCities.some(city => lowerQuery.includes(city))
    
    if (hasOtherCity && !lowerQuery.includes('san francisco') && !lowerQuery.includes('sf')) {
      setCityWarning(true)
      setTimeout(() => setCityWarning(false), 4000)
      return
    }

    setLoading(true)
    setCityWarning(false)
    
    try {
      const response = await fetch('/api/hotels/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })
      
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        ok: false,
        error: 'network_error',
        message: 'Failed to connect to search API',
        hotels: [],
      })
    } finally {
      setLoading(false)
    }
  }

  const exampleQueries = [
    'Thanksgiving weekend, 2 nights',
    'Downtown SF, November 23-27',
    'Union Square area, 3 nights mid-November',
  ]

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-bg/80 border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green to-green-deep flex items-center justify-center shadow-lg shadow-green/25">
                <span className="text-bg font-bold text-sm">WoS</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-cream font-sans tracking-tight">Week Of Stay</h1>
                <p className="text-xs text-muted uppercase tracking-wider font-medium">San Francisco PoC</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-full bg-green/10 border border-green/30 text-green text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
                Live
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        {/* Hero Section */}
        <section className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-cream leading-tight">
              Describe your week.<br />
              <span className="italic text-green">Get the stay decision.</span>
            </h2>
            <p className="text-xl text-cream-dim max-w-2xl leading-relaxed">
              Intent-driven stay planning for San Francisco. Voice or text. One city per session.
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted">
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Downtown SF, Thanksgiving weekend, 2 nights..."
                disabled={loading}
                className={cn(
                  "w-full pl-14 pr-6 py-5 rounded-2xl bg-bg-card border text-cream placeholder:text-muted",
                  "focus:outline-none focus:ring-2 focus:ring-green/50 focus:border-green/50",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "text-lg transition-all",
                  cityWarning ? "border-rose ring-2 ring-rose/50" : "border-white/10"
                )}
              />
              {query && (
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-green to-green-deep text-bg font-semibold hover:shadow-lg hover:shadow-green/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Search
                </button>
              )}
            </div>

            {cityWarning && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-rose/10 border border-rose/30 animate-in fade-in slide-in-from-top-2">
                <XCircle className="w-5 h-5 text-rose flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-rose mb-1">San Francisco only for now</p>
                  <p className="text-sm text-rose/80">
                    This proof-of-concept focuses on SF. Try "Downtown SF" or "Union Square" instead.
                  </p>
                </div>
              </div>
            )}

            {!result && !loading && (
              <div className="flex flex-wrap gap-2">
                {exampleQueries.map((example, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setQuery(example)}
                    className="px-4 py-2 rounded-lg bg-bg-card border border-white/10 text-cream-dim text-sm hover:border-green/50 hover:text-cream transition-all"
                  >
                    {example}
                  </button>
                ))}
              </div>
            )}
          </form>
        </section>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-12 h-12 text-green animate-spin" />
            <p className="text-lg text-cream-dim">Searching live inventory...</p>
          </div>
        )}

        {/* Error State */}
        {result && !result.ok && !loading && (
          <div className="p-6 rounded-2xl bg-rose/10 border border-rose/30">
            <div className="flex items-start gap-3">
              <XCircle className="w-6 h-6 text-rose flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-rose mb-2">Search failed</h3>
                <p className="text-rose/80">{result.message || 'Unable to complete search. Please try again.'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {result && result.ok && !loading && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Trip Details */}
            <div className="p-6 rounded-2xl bg-bg-card border border-white/10">
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-green" />
                  <div>
                    <p className="text-xs text-muted uppercase tracking-wide font-medium">Location</p>
                    <p className="text-cream font-semibold">{result.place_label || 'San Francisco'}</p>
                  </div>
                </div>
                {result.dates && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-green" />
                    <div>
                      <p className="text-xs text-muted uppercase tracking-wide font-medium">Dates</p>
                      <p className="text-cream font-semibold">
                        {new Date(result.dates.check_in).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {new Date(result.dates.check_out).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-green" />
                  <div>
                    <p className="text-xs text-muted uppercase tracking-wide font-medium">Guests</p>
                    <p className="text-cream font-semibold">2 adults · 1 room</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendation */}
            {result.recommendation && (
              <div className="p-8 rounded-2xl bg-gradient-to-br from-green/5 to-green-deep/5 border border-green/20 shadow-xl">
                <div className="flex items-start gap-3 mb-4">
                  <Sparkles className="w-6 h-6 text-green flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-2xl font-serif text-cream mb-2">Our recommendation</h3>
                    <p className="text-cream-dim leading-relaxed">{result.recommendation.why}</p>
                  </div>
                </div>
                <div className="mt-6 p-6 rounded-xl bg-bg-card border border-white/10">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h4 className="text-xl font-semibold text-cream">{result.recommendation.name}</h4>
                    <div className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5",
                      result.recommendation.cancel_tag.includes('RFN') 
                        ? "bg-green/10 border border-green/30 text-green"
                        : "bg-muted/10 border border-muted/30 text-muted"
                    )}>
                      {result.recommendation.cancel_tag.includes('RFN') ? (
                        <><CheckCircle2 className="w-3.5 h-3.5" /> Refundable</>
                      ) : (
                        <><XCircle className="w-3.5 h-3.5" /> Non-refundable</>
                      )}
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2 mb-4">
                    {result.recommendation.nightly !== null && (
                      <span className="text-3xl font-bold text-green">${result.recommendation.nightly.toFixed(0)}</span>
                    )}
                    <span className="text-muted">per night</span>
                    {result.recommendation.stay_total !== null && (
                      <span className="text-cream-dim ml-auto">
                        ${result.recommendation.stay_total.toFixed(0)} total
                      </span>
                    )}
                  </div>
                  <a
                    href="https://www.myreservations.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full block text-center px-6 py-3.5 rounded-xl bg-gradient-to-r from-green to-green-deep text-bg font-bold hover:shadow-xl hover:shadow-green/25 transition-all"
                  >
                    Book on myreservations.com
                  </a>
                </div>
              </div>
            )}

            {/* Hotel List */}
            {result.hotels && result.hotels.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-2xl font-serif text-cream">
                  {result.hotels.length} hotels found
                </h3>
                <div className="grid gap-4">
                  {result.hotels.slice(0, 8).map((hotel) => (
                    <div key={hotel.hotel_id} className="p-6 rounded-xl bg-bg-card border border-white/10 hover:border-green/30 transition-all">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-3">
                            <h4 className="text-lg font-semibold text-cream flex-1">{hotel.name}</h4>
                            {hotel.rating > 0 && (
                              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green/10 border border-green/20">
                                <Star className="w-4 h-4 text-green fill-green" />
                                <span className="text-sm font-bold text-green">{hotel.rating.toFixed(1)}</span>
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-muted mb-2">{hotel.address}</p>
                          {hotel.mi_to_landmark !== null && (
                            <p className="text-sm text-cream-dim">
                              {hotel.mi_to_landmark.toFixed(1)} mi to {hotel.landmark_name}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          {hotel.nightly !== null && (
                            <div className="mb-2">
                              <span className="text-2xl font-bold text-cream">${hotel.nightly.toFixed(0)}</span>
                              <span className="text-sm text-muted block">per night</span>
                            </div>
                          )}
                          <div className={cn(
                            "px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wide",
                            hotel.refundable 
                              ? "bg-green/10 text-green"
                              : "bg-muted/10 text-muted"
                          )}>
                            {hotel.refundable ? 'Refundable' : 'Non-refundable'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        {!loading && (
          <footer className="pt-12 border-t border-white/10 text-center text-sm text-muted">
            <p>Week Of Stay · San Francisco Proof-of-Concept · Live pricing via Feedz/LiteAPI</p>
            <p className="mt-2">Book CTA: per-product deep link to myreservations.com</p>
          </footer>
        )}
      </div>
    </main>
  )
}
