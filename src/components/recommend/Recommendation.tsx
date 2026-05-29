'use client'
import React, { useState, useCallback, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  getRecommendations,
  addRecommendation,
  voteRecommendation,
  searchForRecommend,
  getVoteStatus,
  RecommendationItem,
} from '@/services/RecommendationService'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { getUserFingerprint } from '.././../utils/getUserFingetPrint'
import { toast } from 'react-hot-toast'
import Skeleton from '../common/Skeleton'
// ─── Constants ────────────────────────────────────────────────────────────────
const TMDB_IMG = 'https://image.tmdb.org/t/p/w185'
const PAGE_SIZE = 12

const CACHE = {
  recommendations: 5 * 60 * 1000,
  search:          30 * 1000,
  voteStatus:      10 * 60 * 1000,
} as const

// ─── Types ────────────────────────────────────────────────────────────────────
type MediaFilter = 'all' | 'movie' | 'tv'
type SortField    = 'votes' | 'date'
type SortDir      = 'asc'   | 'desc'
type VoteAction   = 'added' | 'removed' | 'switched' | null

interface SortState { field: SortField; dir: SortDir }

interface VoteStatus {
  hasVoted: boolean
  isUpvote?: boolean
}

interface SearchResult {
  id: number
  mediaType: string        // backend now returns camelCase mediaType
  media_type?: string      // fallback if old shape arrives
  title?: string
  name?: string
  displayTitle?: string
  overview: string
  posterPath: string
  voteAverage: number
  vote_average?: number    // fallback
  releaseDate?: string
  firstAirDate?: string
  displayReleaseDate?: string
  release_date?: string
  first_air_date?: string
  episode_run_time?: number[]
  runtime?: number
}

// ─── Query key factory ────────────────────────────────────────────────────────
const qk = {
  recommendations: (filter: MediaFilter, sort: string) =>
    ['recommendations', filter, sort] as const,
  search: (q: string) =>
    ['recommend-search', q] as const,
  voteStatus: (id: number, fp: string) =>
    ['vote-status', id, fp] as const,
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function poster(path: string) {
  return path ? `${TMDB_IMG}${path}` : null
}

function yearOf(d: string) {
  return d ? d.slice(0, 4) : ''
}

function runtimeLabel(mins: number) {
  if (!mins) return null
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

function toSortOption(s: SortState): 'votes_desc' | 'votes_asc' | 'date_desc' | 'date_asc' {
  return `${s.field}_${s.dir}` as any
}

/** Normalise the search result shape coming from the backend */
function normaliseSearchResult(item: SearchResult): SearchResult {
  return {
    ...item,
    // prefer the explicit displayTitle the backend sends
    title: item.displayTitle || item.title || item.name || 'Unknown',
    // unify mediaType (backend sends camelCase; guard against snake_case too)
    mediaType: item.mediaType || item.media_type || 'movie',
    // unify voteAverage
    voteAverage: item.voteAverage ?? item.vote_average ?? 0,
    // unify releaseDate
    releaseDate:
      item.displayReleaseDate || item.releaseDate || item.firstAirDate ||
      item.release_date || item.first_air_date || '',
  }
}

/** Build the watch URL: /watch/movie/<id>/<slug> or /watch/tv/<id>/<slug> */
function watchUrl(item: SearchResult | RecommendationItem): string {
  const type  = ('mediaType' in item ? item.mediaType : 'movie') ?? 'movie'
  const rawTitle =
    ('displayTitle' in item && (item as any).displayTitle) ||
    ('title' in item && (item as any).title) ||
    ('name'  in item && (item as any).name)  ||
    'untitled'
  const slug = String(rawTitle)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return `/watch/${type}/${item.id}/${slug}`
}

// ─── ScoreRing ────────────────────────────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
  const pct   = Math.round((score / 10) * 100)
  const color = pct >= 70 ? '#20C5A8' : pct >= 50 ? '#f59e0b' : '#ef4444'
  return (
    <div className="relative w-8 h-8 flex-shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
        <circle
          cx="18" cy="18" r="15" fill="none"
          stroke={color} strokeWidth="3"
          strokeDasharray={`${(pct / 100) * 94.25} 94.25`}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white">
        {pct}%
      </span>
    </div>
  )
}

// ─── VoteBtn ──────────────────────────────────────────────────────────────────
function VoteBtn({
  direction, count, active, isLoading, onClick,
}: {
  direction: 'up' | 'down'
  count: number
  active: boolean
  isLoading: boolean
  onClick: () => void
}) {
  const isUp = direction === 'up'
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      title={active ? (isUp ? 'Remove upvote' : 'Remove downvote') : (isUp ? 'Upvote' : 'Downvote')}
      className={`
        flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold
        transition-all duration-150 select-none cursor-pointer
        ${isLoading ? 'opacity-40 pointer-events-none' : ''}
        ${active
          ? isUp
            ? 'bg-teal-500/15 text-teal-400 border border-teal-500/30'
            : 'bg-red-500/10 text-red-400 border border-red-500/25'
          : 'text-gray-600 hover:text-gray-300 border border-white/[0.05] hover:border-white/[0.12] bg-white/[0.02] hover:bg-white/[0.04]'
        }
      `}
    >
      {isLoading ? (
        <div className="w-3 h-3 rounded-full border border-transparent border-t-current animate-spin" />
      ) : (
        <svg
          className="w-3 h-3"
          fill={active ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={2.5}
          viewBox="0 0 24 24"
        >
          {isUp
            ? <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            : <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />}
        </svg>
      )}
      <span className="tabular-nums">{count}</span>
    </button>
  )
}

// ─── RecommendationCard ───────────────────────────────────────────────────────
function RecommendationCard({
  item, index, voteStatus, isVoting, onVote,
}: {
  item: RecommendationItem
  index: number
  voteStatus: VoteStatus
  isVoting: boolean
  onVote: (id: number, isUpvote: boolean) => void
}) {
  const { hasVoted, isUpvote } = voteStatus
  const posterUrl = poster(item.posterPath)
  const netVotes  = item.upVotes - item.downVotes
  const href      = watchUrl(item)

  return (
    <div
      className="group relative flex rounded-xl overflow-hidden border border-white/[0.04]
        hover:border-white/[0.08] transition-all duration-200"
      
    >
      {/* Voted accent */}
      {hasVoted && (
        <div className={`absolute left-0 top-0 bottom-0 w-[2px]
          ${isUpvote ? 'bg-teal-500' : 'bg-red-500'}`} />
      )}

      {/* Poster — clicking navigates to watch page */}
      <Link href={href} className="relative flex-shrink-0 w-[80px] block">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={item.title}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-white/[0.03] flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
          </div>
        )}
        {/* Media type badge */}
        <span className={`absolute top-1.5 left-1.5 text-[8px] font-black uppercase tracking-wider px-1 py-0.5 rounded
          ${item.mediaType === 'movie'
            ? 'bg-teal-500 text-gray-900'
            : 'bg-gray-900/80 text-teal-400 border border-teal-500/30 backdrop-blur-sm'}`}>
          {item.mediaType === 'movie' ? 'Movie' : 'TV'}
        </span>
      </Link>

      {/* Content */}
      <div className="flex-1 min-w-0 p-3 flex flex-col justify-between">
        <div>
          <div className="flex items-start gap-2 mb-1">
            {/* Title links to watch page */}
            <Link
              href={href}
              className="flex-1 text-[13px] font-semibold text-white leading-snug line-clamp-1
                hover:text-teal-400 transition-colors duration-150"
            >
              {item.title}
            </Link>
            {item.voteAverage > 0 &&  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/10">
      <span className="text-yellow-400 text-xs">★</span>
      <span className="text-white text-xs font-semibold">{item.voteAverage.toFixed(1)}</span>
    </div>}
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-gray-600 mb-2">
            {item.releaseDate && <span>{yearOf(item.releaseDate)}</span>}
            {item.runtime > 0 && (
              <>
                <span>·</span>
                <span>{runtimeLabel(item.runtime)}</span>
              </>
            )}
          </div>

          <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed">
            {item.overview}
          </p>
        </div>

        {/* Vote row */}
        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/[0.04]">
          <div className="flex items-center gap-1.5">
            <VoteBtn
              direction="up"
              count={item.upVotes}
              active={hasVoted && isUpvote === true}
              isLoading={isVoting}
              onClick={() => onVote(item.id, true)}
            />
            <VoteBtn
              direction="down"
              count={item.downVotes}
              active={hasVoted && isUpvote === false}
              isLoading={isVoting}
              onClick={() => onVote(item.id, false)}
            />
          </div>

          <span className={`text-[10px] font-semibold tabular-nums
            ${netVotes > 0 ? 'text-teal-400' : netVotes < 0 ? 'text-red-400' : 'text-gray-700'}`}>
            {netVotes > 0 ? '+' : ''}{netVotes}
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── SearchRow ────────────────────────────────────────────────────────────────
function SearchRow({
  item, onRecommend, loading, done,
}: {
  item: SearchResult
  onRecommend: (item: SearchResult) => void
  loading: boolean
  done: boolean
}) {
  const n          = normaliseSearchResult(item)
  const title      = n.title || 'Unknown'
  const date       = n.releaseDate || ''
  const isTv       = n.mediaType === 'tv'
  const posterUrl  = poster(n.posterPath)
  const score      = n.voteAverage

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.02] transition-colors border-b border-white/[0.03] last:border-0">
      <div className="flex-shrink-0 w-8 rounded overflow-hidden bg-white/[0.04]" style={{ height: '48px' }}>
        {posterUrl
          ? <img src={posterUrl} alt={title} loading="lazy" className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-gray-700 text-xs">?</div>
        }
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-white truncate">{title}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          {date && <span className="text-[10px] text-gray-600">{yearOf(date)}</span>}
          {/* Media type badge */}
          <span className={`text-[9px] font-bold uppercase tracking-wider px-1 py-0.5 rounded
            ${isTv
              ? 'text-teal-400 border border-teal-500/25'
              : 'text-teal-500 bg-teal-500/10'}`}>
            {isTv ? 'TV' : 'Movie'}
          </span>
          {score > 0 && (
            <span className="text-[10px] text-gray-600">★ {score.toFixed(1)}</span>
          )}
        </div>
      </div>

      <button
        onClick={() => onRecommend(n)}
        disabled={loading || done}
        className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold
          transition-all duration-150 disabled:opacity-50
          ${done
            ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
            : 'border border-white/[0.08] text-gray-500 hover:border-teal-500/30 hover:text-teal-400'
          }`}
      >
        {done ? (
          <>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            Added
          </>
        ) : loading ? (
          <div className="w-3 h-3 border border-gray-600 border-t-teal-400 rounded-full animate-spin" />
        ) : (
          'Add'
        )}
      </button>
    </div>
  )
}

// ─── AddModal ─────────────────────────────────────────────────────────────────
function AddModal({
  open, onClose, fingerprint, onAdded,
}: {
  open: boolean
  onClose: () => void
  fingerprint: string
  onAdded: () => void
}) {
  const [query, setQuery]           = useState('')
  const [debouncedQ, setDebouncedQ] = useState('')
  const [addingId, setAddingId]     = useState<number | null>(null)
  const [doneIds, setDoneIds]       = useState<Set<number>>(new Set())
  const [errorMsg, setErrorMsg]     = useState('')
  const inputRef                    = useRef<HTMLInputElement>(null)
  const queryClient                 = useQueryClient()

  useEffect(() => {
    if (!open) return
    setTimeout(() => inputRef.current?.focus(), 150)
    setQuery(''); setDebouncedQ(''); setErrorMsg(''); setDoneIds(new Set())
  }, [open])

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(query.trim()), 350)
    return () => clearTimeout(t)
  }, [query])

  const { data: searchData, isFetching: searching } = useQuery({
    queryKey: qk.search(debouncedQ),
    queryFn:  () => searchForRecommend(debouncedQ),
    enabled:  debouncedQ.length >= 2,
    staleTime: CACHE.search,
    gcTime:    CACHE.search * 2,
  })

  const results: SearchResult[] = searchData?.results ?? []

  const handleRecommend = async (item: SearchResult) => {
    if (!fingerprint) return
    const n = normaliseSearchResult(item)
    setAddingId(n.id); setErrorMsg('')
    try {
      await addRecommendation({
        externalId:  String(n.id),
        mediaType:   n.mediaType === 'tv' ? 'tv' : 'movie',
        title:       n.title || '',
        overview:    n.overview || '',
        posterPath:  n.posterPath || '',
        voteAverage: n.voteAverage || 0,
        releaseDate: n.releaseDate || '',
        runtime:     n.runtime || n.episode_run_time?.[0] || 0,
        fingerprint,
      })
      setDoneIds((prev) => new Set([...prev, n.id]))
      queryClient.invalidateQueries({ queryKey: ['recommendations'] })
      onAdded()
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || 'Already recommended or an error occurred.')
    } finally {
      setAddingId(null)
    }
  }

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* ↓ backdrop: was backdrop-blur-sm — now backdrop-blur-[2px] for medium blur */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-[480px] rounded-2xl overflow-hidden border border-white/[0.06] shadow-2xl
          animate-in fade-in zoom-in-95 duration-200"
        style={{ background: '#141b2d' }}
      >
        {/* Top accent line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-teal-500/50 to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <div>
            <h2 className="text-base font-bold text-white">Recommend a Title</h2>
            <p className="text-[11px] text-gray-600 mt-0.5">Search movies or TV series to add</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-600 hover:text-gray-400 hover:bg-white/[0.04] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search input */}
        <div className="px-5 pb-3">
          <div className="relative">
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title..."
              className="w-full bg-white/[0.03] border border-white/[0.07] focus:border-teal-500/40
                rounded-lg px-3.5 py-2.5 pr-9 text-sm text-white placeholder-gray-700
                focus:outline-none transition-colors"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {searching
                ? <div className="w-3.5 h-3.5 border border-gray-700 border-t-teal-400 rounded-full animate-spin" />
                : <svg className="w-3.5 h-3.5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
              }
            </div>
          </div>
          {errorMsg && (
            <p className="text-[11px] text-red-400 mt-2 flex items-center gap-1">
              <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errorMsg}
            </p>
          )}
        </div>

        {/* Results */}
        <div className="max-h-[380px] overflow-y-auto">
          {debouncedQ.length >= 2 && !searching && results.length === 0 && (
            <div className="py-10 text-center text-gray-600 text-sm">
              No results for &ldquo;{debouncedQ}&rdquo;
            </div>
          )}
          {results.map((item) => (
            <SearchRow
              key={item.id}
              item={item}
              onRecommend={handleRecommend}
              loading={addingId === item.id}
              done={doneIds.has(item.id)}
            />
          ))}
          {debouncedQ.length < 2 && (
            <div className="py-10 text-center space-y-1.5">
              <div className="text-2xl">🎬</div>
              <p className="text-gray-700 text-xs">Type at least 2 characters to search</p>
            </div>
          )}
        </div>

        <div className="h-px bg-white/[0.04]" />
        <div className="px-5 py-3 flex items-center justify-between">
          <p className="text-[10px] text-gray-700">Powered by TMDB</p>
          {doneIds.size > 0 && (
            <span className="text-[11px] text-teal-400 font-medium">{doneIds.size} added</span>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── SkeletonCard — uses the shared <Skeleton> component ──────────────────────
function SkeletonCard() {
  return (
    <div
      className="flex rounded-xl overflow-hidden border border-white/[0.03]"
    >
      {/* Poster placeholder */}
      <div
        className="w-[80px] flex-shrink-0 bg-white/[0.03] animate-pulse"
        style={{ minHeight: '130px' }}
      />

      {/* Content area */}
      <div className="flex-1 p-3 flex flex-col justify-between">
        {/* Title + meta + overview rows */}
        <Skeleton
          showTitle
          titleHeight="h-3"
          rows={2}
          rowHeight="h-2"
          rowWidths={['w-full', 'w-5/6']}
          spacing="space-y-2"
          animate
        />

        {/* Vote button placeholders */}
        <div className="flex items-center gap-1.5 pt-2 mt-2 border-t border-white/[0.04]">
          <Skeleton
            showTitle={false}
            rows={1}
            rowHeight="h-6"
            rowWidths={['w-14']}
            spacing="space-y-0"
            animate
          />
          <Skeleton
            showTitle={false}
            rows={1}
            rowHeight="h-6"
            rowWidths={['w-14']}
            spacing="space-y-0"
            animate
          />
        </div>
      </div>
    </div>
  )
}

// ─── SortButton ───────────────────────────────────────────────────────────────
function SortButton({
  label, icon, active, dir, onClick,
}: {
  label: string
  icon: React.ReactNode
  active: boolean
  dir: SortDir
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-all duration-150
        ${active
          ? 'bg-teal-500/10 text-teal-400 border-teal-500/20'
          : 'text-gray-600 border-white/[0.05] hover:text-gray-400 bg-white/[0.02] hover:border-white/[0.10]'}`}
    >
      {icon}
      {label}
      <svg
        className={`w-2.5 h-2.5 transition-transform duration-150 ${active && dir === 'asc' ? 'rotate-180' : ''}`}
        fill="none" stroke="currentColor" viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export const Recommendation = () => {
  const [fingerprint, setFingerprint]   = useState('')
  const [mediaFilter, setMediaFilter]   = useState<MediaFilter>('all')
  const [sort, setSort]                 = useState<SortState>({ field: 'votes', dir: 'desc' })
  const [modalOpen, setModalOpen]       = useState(false)
  const [votingIds, setVotingIds]       = useState<Set<number>>(new Set())
  const queryClient                     = useQueryClient()

  const sortOption = toSortOption(sort)

  useEffect(() => {
    getUserFingerprint().then(setFingerprint)
  }, [])

  // ── Infinite recommendations list ─────────────────────────────────────────
  const {
    data, fetchNextPage, hasNextPage,
    isFetching, isLoading, isError, refetch,
  } = useInfiniteQuery({
    queryKey: qk.recommendations(mediaFilter, sortOption),
    queryFn: ({ pageParam = 1 }) =>
      getRecommendations(
        mediaFilter === 'all' ? undefined : mediaFilter,
        sortOption,
        pageParam as number,
        PAGE_SIZE,
      ),
    getNextPageParam: (last) => last.page < last.totalPages ? last.page + 1 : undefined,
    initialPageParam: 1,
    staleTime: CACHE.recommendations,
    gcTime:    CACHE.recommendations * 2,
    refetchOnWindowFocus: false,
  })

  const observerRef  = useInfiniteScroll({ fetchNextPage, hasNextPage, isFetching })
  const items        = data?.pages.flatMap((p) => p.results) ?? []
  const totalResults = data?.pages[0]?.totalResults ?? 0

  // ── Per-item vote status ──────────────────────────────────────────────────
  const { map: voteStatusMap, trackers: voteTrackers } = useVoteStatusMap(items, fingerprint)

  // ── Vote handler ──────────────────────────────────────────────────────────
  const handleVote = useCallback(async (id: number, isUpvote: boolean) => {
    if (!fingerprint || votingIds.has(id)) return

    setVotingIds((prev) => new Set([...prev, id]))

    const current = voteStatusMap[id] ?? { hasVoted: false }
    const isRemove = current.hasVoted && current.isUpvote === isUpvote
    const isSwitch = current.hasVoted && current.isUpvote !== isUpvote

    const newStatus: VoteStatus = isRemove
      ? { hasVoted: false, isUpvote: undefined }
      : { hasVoted: true, isUpvote }

    queryClient.setQueryData(qk.voteStatus(id, fingerprint), {
      hasVoted: newStatus.hasVoted,
      voteType: newStatus.isUpvote,
    })

    queryClient.setQueriesData({ queryKey: ['recommendations'] }, (old: any) => {
      if (!old) return old
      return {
        ...old,
        pages: old.pages.map((page: any) => ({
          ...page,
          results: page.results.map((item: RecommendationItem) => {
            if (item.id !== id) return item
            if (isRemove) {
              return {
                ...item,
                upVotes:   isUpvote  ? item.upVotes   - 1 : item.upVotes,
                downVotes: !isUpvote ? item.downVotes - 1 : item.downVotes,
              }
            }
            if (isSwitch) {
              return {
                ...item,
                upVotes:   isUpvote  ? item.upVotes   + 1 : item.upVotes   - 1,
                downVotes: !isUpvote ? item.downVotes + 1 : item.downVotes - 1,
              }
            }
            return {
              ...item,
              upVotes:   isUpvote  ? item.upVotes   + 1 : item.upVotes,
              downVotes: !isUpvote ? item.downVotes + 1 : item.downVotes,
            }
          }),
        })),
      }
    })

    try {
      const response = await voteRecommendation(id, fingerprint, isUpvote)
      const action: VoteAction = response?.voteAction ?? null

      if (action === 'removed') toast('Vote removed', { icon: '↩️' })
      else if (action === 'switched') toast(isUpvote ? 'Switched to upvote' : 'Switched to downvote', { icon: '🔄' })
      else toast.success(isUpvote ? 'Upvoted!' : 'Downvoted!')

      if (response?.recommendation) {
        queryClient.setQueriesData({ queryKey: ['recommendations'] }, (old: any) => {
          if (!old) return old
          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              results: page.results.map((item: RecommendationItem) =>
                item.id !== id ? item : {
                  ...item,
                  upVotes:   response.recommendation.upVotes,
                  downVotes: response.recommendation.downVotes,
                }
              ),
            })),
          }
        })
      }
    } catch {
      queryClient.setQueryData(qk.voteStatus(id, fingerprint), {
        hasVoted: current.hasVoted,
        voteType: current.isUpvote,
      })
      queryClient.invalidateQueries({ queryKey: ['recommendations'] })
      toast.error('Vote failed. Please try again.')
    } finally {
      setVotingIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }, [fingerprint, votingIds, voteStatusMap, queryClient])

  // ── Sort toggle ───────────────────────────────────────────────────────────
  const toggleSort = (field: SortField) => {
    setSort((prev) =>
      prev.field === field
        ? { field, dir: prev.dir === 'desc' ? 'asc' : 'desc' }
        : { field, dir: 'desc' }
    )
  }

  const FILTERS: { label: string; value: MediaFilter }[] = [
    { label: 'All',    value: 'all' },
    { label: 'Movies', value: 'movie' },
    { label: 'TV',     value: 'tv' },
  ]

  return (
    <div className="min-h-screen">

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">Recommendations</h1>
          {totalResults > 0 && (
            <p className="text-[11px] text-gray-600 mt-0.5">
              {totalResults.toLocaleString()} community picks
            </p>
          )}
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12px] font-semibold text-gray-900
            bg-teal-500 hover:bg-teal-400 transition-colors duration-150"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Add
        </button>
      </div>

      {/* ── Vote info ─────────────────────────────────────────────────────── */}
      <p className="text-[11px] text-gray-700 mb-4 leading-relaxed">
        Votes are tied to your device. Click an active vote to remove it, or the opposite to switch.
      </p>

      {/* ── Filter + Sort ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-1 p-0.5 rounded-lg border border-white/[0.05] bg-white/[0.02]">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setMediaFilter(f.value)}
              className={`px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all duration-150
                ${mediaFilter === f.value
                  ? 'bg-teal-500 text-gray-900'
                  : 'text-gray-600 hover:text-gray-400'}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <SortButton
            label="Votes"
            active={sort.field === 'votes'}
            dir={sort.dir}
            onClick={() => toggleSort('votes')}
            icon={
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            }
          />
          <SortButton
            label="Date"
            active={sort.field === 'date'}
            dir={sort.dir}
            onClick={() => toggleSort('date')}
            icon={
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          />
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────────────────── */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : isError ? (
        <div className="text-center py-16 space-y-3">
          <p className="text-gray-500 text-sm">Failed to load recommendations.</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-teal-500 text-gray-900 text-xs font-semibold rounded-lg hover:bg-teal-400 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : items.length === 0 ? (
        <div
          className="text-center py-16 rounded-xl border border-white/[0.04]"
          style={{ background: '#141b2d' }}
        >
          <div className="text-4xl mb-3">🎬</div>
          <h3 className="text-sm font-semibold text-white mb-1.5">No Recommendations Yet</h3>
          <p className="text-gray-600 text-xs mb-5 max-w-xs mx-auto">
            Be the first to recommend a movie or TV series.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-gray-900 bg-teal-500 rounded-lg hover:bg-teal-400 transition-colors"
          >
            Add First Recommendation
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {items.map((item, i) => (
              <RecommendationCard
                key={item.id}
                item={item}
                index={i}
                voteStatus={voteStatusMap[item.id] ?? { hasVoted: false }}
                isVoting={votingIds.has(item.id)}
                onVote={handleVote}
              />
            ))}
          </div>

          {hasNextPage && (
            <div ref={observerRef} className="py-8 flex justify-center">
              {isFetching && (
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <div className="w-3 h-3 border border-gray-700 border-t-teal-500 rounded-full animate-spin" />
                  Loading more…
                </div>
              )}
            </div>
          )}

          {!hasNextPage && items.length > 0 && (
            <div className="text-center py-8">
              <span className="text-[11px] text-gray-700">
                All {totalResults} recommendations loaded
              </span>
            </div>
          )}
        </>
      )}

      <AddModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        fingerprint={fingerprint}
        onAdded={() => queryClient.invalidateQueries({ queryKey: ['recommendations'] })}
      />
      <div style={{ display: 'none' }}>{voteTrackers}</div>
    </div>
  )
}

// ─── Hook: per-card vote status ───────────────────────────────────────────────
function VoteStatusQuery({
  id, fingerprint, onResult,
}: {
  id: number
  fingerprint: string
  onResult: (id: number, status: VoteStatus) => void
}) {
  const { data } = useQuery({
    queryKey: qk.voteStatus(id, fingerprint),
    queryFn:  () => getVoteStatus(id, fingerprint),
    enabled:  !!fingerprint,
    staleTime: CACHE.voteStatus,
    gcTime:    CACHE.voteStatus * 2,
  })

  useEffect(() => {
    if (data !== undefined) {
      onResult(id, { hasVoted: data.hasVoted, isUpvote: data.voteType ?? undefined })
    }
  }, [id, data, onResult])

  return null
}

function useVoteStatusMap(
  items: RecommendationItem[],
  fingerprint: string,
): { map: Record<number, VoteStatus>; trackers: React.ReactNode } {
  const queryClient = useQueryClient()

  const map: Record<number, VoteStatus> = {}
  for (const item of items) {
    const cached = queryClient.getQueryData<{ hasVoted: boolean; voteType?: boolean }>(
      qk.voteStatus(item.id, fingerprint)
    )
    if (cached !== undefined) {
      map[item.id] = { hasVoted: cached.hasVoted, isUpvote: cached.voteType ?? undefined }
    }
  }

  const trackers = fingerprint ? items.map((item) => (
    <VoteStatusQuery
      key={`${item.id}-${fingerprint}`}
      id={item.id}
      fingerprint={fingerprint}
      onResult={() => {}}
    />
  )) : null

  return { map, trackers }
}