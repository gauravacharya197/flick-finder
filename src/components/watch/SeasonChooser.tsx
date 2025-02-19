'use client'
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FaChevronDown, FaTv } from 'react-icons/fa';
import { MdMenu } from 'react-icons/md';
import { fetchEpisodes } from '@/services/TVService';
import EpisodeCard from './EpisodeCard';
import Skeleton from '../common/Skeleton';

interface Season {
  airDate: string;
  episodeCount: number;
  id: number;
  name: string;
  overview: string;
  posterPath: string;
  seasonNumber: number;
  voteAverage: number;
}

interface SeasonChooserProps {
  seasons: Season[];
  onSeasonChange: (seasonNumber: number) => void;
  onEpisodeChange: (episodeNumber: number) => void;
  mediaId: string;
}

const EpisodeLoading = () => (
  <div className="pt-2 animate-pulse ">
    <Skeleton 
          className="h-16 p-0"
          rows={1}
          showTitle={false}
          rowHeight="h-16"
          spacing="space-y-0"
        />
  </div>
);

const SeasonChooser: React.FC<SeasonChooserProps> = ({
  seasons,
  onSeasonChange,
  onEpisodeChange,
  mediaId
}) => {
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [playingEpisode, setPlayingEpisode] = useState<number>(1);

  // Filter out Specials only if it's the first season
  const filteredSeasons = seasons[0]?.name === "Specials" 
    ? seasons.slice(1) 
    : seasons;

  const { data: episodes, isLoading } = useQuery({
    queryKey: ['episodes', mediaId, selectedSeason?.seasonNumber],
    queryFn: () => fetchEpisodes({ 
      mediaId, 
      seasonNumber: selectedSeason?.seasonNumber || 1 
    }),
    staleTime:Infinity,
    enabled: !!selectedSeason,
  });

  useEffect(() => {
    if (filteredSeasons?.length > 0) {
      const savedState = JSON.parse(localStorage.getItem("mediaState") || "{}");
  
      if (savedState[mediaId]) {
        const { seasonNumber, episodeNumber } = savedState[mediaId];
        const savedSeason = filteredSeasons.find(s => s.seasonNumber === seasonNumber) || filteredSeasons[0];
        setSelectedSeason(savedSeason);
        setPlayingEpisode(episodeNumber);
        onSeasonChange(seasonNumber);
        onEpisodeChange(episodeNumber);
      } else {
        setSelectedSeason(filteredSeasons[0]);
        setPlayingEpisode(1);
        onSeasonChange(1);
        onEpisodeChange(1);
      }
    }
  }, [filteredSeasons, mediaId]);

  const saveState = (seasonNumber: number, episodeNumber: number) => {
    const savedState = JSON.parse(localStorage.getItem("mediaState") || "{}");
    savedState[mediaId] = { seasonNumber, episodeNumber };
    localStorage.setItem("mediaState", JSON.stringify(savedState));
  };

  const handleSeasonChange = (season: Season) => {
    setSelectedSeason(season);
    setPlayingEpisode(1);
    setIsOpen(false);
    onSeasonChange(season.seasonNumber);
    onEpisodeChange(1);
    saveState(season.seasonNumber, 1);
  };

  const handleEpisodeClick = (episodeNumber: number) => {
    setPlayingEpisode(episodeNumber);
    onEpisodeChange(episodeNumber);
    saveState(selectedSeason?.seasonNumber || 1, episodeNumber);
  };

  if (!filteredSeasons?.length) return null;

  return (
    <div className="w-full max-w-3xl bg-gray-900/90 text-gray-100 rounded-lg overflow-hidden backdrop-blur-sm">
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between bg-gray-800/50 hover:bg-gray-800/100 transition-colors duration-200"
      >
        <div className="flex items-center gap-2">
          <FaTv className="w-4 h-4 text-primary-400" />
          <span className="font-medium">{selectedSeason?.name || 'Select Season'}</span>
        </div>
        <FaChevronDown 
          className={`w-3 h-3 text-primary-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="border-t border-gray-800 max-h-64 overflow-y-auto">
          {filteredSeasons.map((season) => (
            <button
              key={season.id}
              className={`w-full px-4 py-3 flex items-center gap-2 transition-all duration-200
                ${selectedSeason?.id === season.id 
                  ? 'bg-primary-500/20 text-primary-400' 
                  : 'hover:bg-gray-800/30'}`}
              onClick={() => handleSeasonChange(season)}
            >
              <FaTv className="w-4 h-4" />
              <div className="flex items-center justify-between w-full">
                <span className="font-medium">{season.name}</span>
                <span className="text-xs text-gray-400">{season.episodeCount} Ep</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {selectedSeason && !isOpen && (
        <div className="border-t border-gray-800 max-h-[100vh] sm:max-h-[80vh] overflow-y-auto">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <EpisodeLoading key={index} />
            ))
          ) : (
            episodes?.map((episode) => (
              <EpisodeCard
                key={episode.id}
                episode={episode}
                isPlaying={playingEpisode === episode.episode_number}
                onClick={() => handleEpisodeClick(episode.episode_number)}
              />
            ))
          )}
        </div>
      )}

      {selectedSeason && (
        <div className="border-t border-gray-800 px-4 py-3 flex items-center gap-2 bg-gray-800/30 backdrop-blur-sm">
          <MdMenu className="w-4 h-4 text-primary-400" />
          <span className="text-sm font-medium">
            {selectedSeason.name} • Ep {playingEpisode}
          </span>
        </div>
      )}
    </div>
  );
};

export default SeasonChooser;