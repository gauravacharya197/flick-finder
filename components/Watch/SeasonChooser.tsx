import React, { useEffect, useState } from 'react';
import { FaChevronDown, FaPlay, FaTv } from 'react-icons/fa';
import { MdMenu } from 'react-icons/md';


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

const SeasonChooser: React.FC<SeasonChooserProps> = ({
  seasons,
  onSeasonChange,
  onEpisodeChange,
  mediaId
}) => {
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [playingEpisode, setPlayingEpisode] = useState<number>(1);

  useEffect(() => {
    if (seasons?.length > 0) {
      // Load saved state from localStorage
      const savedState = localStorage.getItem(`media-${mediaId}`);
      if (savedState) {
        const { seasonNumber, episodeNumber } = JSON.parse(savedState);
        const savedSeason = seasons.find(s => s.seasonNumber === seasonNumber) || seasons[0];
        setSelectedSeason(savedSeason);
        setPlayingEpisode(episodeNumber);
        onSeasonChange(seasonNumber);
        onEpisodeChange(episodeNumber);
      } else {
        setSelectedSeason(seasons[0]);
        setPlayingEpisode(1);
        onSeasonChange(1);
        onEpisodeChange(1);
      }
    }
  }, [seasons, mediaId]);

  const saveState = (seasonNumber: number, episodeNumber: number) => {
    localStorage.setItem(`media-${mediaId}`, JSON.stringify({
      seasonNumber,
      episodeNumber
    }));
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

  if (!seasons?.length) return null;

  return (
    <div className="w-full max-w-md bg-gray-900/95 text-gray-100 rounded-lg shadow-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors duration-200"
      >
        <div className="flex items-center space-x-3">
          <FaPlay className="w-4 h-4" />
          <span className="font-medium">{selectedSeason?.name || 'Select Season'}</span>
        </div>
        <FaChevronDown 
          className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="border-t border-gray-800">
          {seasons.map((season) => (
            <button
              key={season.id}
              className={`w-full p-4 flex items-center space-x-3 transition-colors duration-200
                ${selectedSeason?.id === season.id 
                  ? 'bg-primary-500 text-white' 
                  : 'hover:bg-gray-800/50'}`}
              onClick={() => handleSeasonChange(season)}
            >
              <FaTv className="w-4 h-4" />
              <span>{season.name}</span>
            </button>
          ))}
        </div>
      )}

      {selectedSeason && !isOpen && (
        <div className="border-t border-gray-800">
          {Array.from({ length: selectedSeason.episodeCount }, (_, i) => i + 1).map((episodeNum) => (
            <button
              key={episodeNum}
              className={`w-full p-4 flex items-center space-x-3 transition-colors duration-200
                ${playingEpisode === episodeNum 
                  ? 'bg-primary-500 text-white' 
                  : 'hover:bg-gray-800/50'}`}
              onClick={() => handleEpisodeClick(episodeNum)}
            >
              <FaPlay className="w-4 h-4" />
              <span>Episode {episodeNum}</span>
            </button>
          ))}
        </div>
      )}

      {selectedSeason && (
        <div className="border-t border-gray-800 p-4 flex items-center space-x-3 bg-gray-800/30">
          <MdMenu className="w-4 h-4" />
          <span className="font-medium">
            {selectedSeason.name} • Episode {playingEpisode}
          </span>
        </div>
      )}
    </div>
  );
};

export default SeasonChooser;