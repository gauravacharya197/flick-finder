import React, { useEffect, useState } from 'react';
import { FaPlay } from 'react-icons/fa';
import { FaDownload } from 'react-icons/fa6';
import { MdArrowDropDown, MdMenu } from 'react-icons/md';

interface Episode {
  airDate: string;
  episodeNumber: number;
  id: number;
  name: string;
  overview: string;
  voteAverage: number;
}

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
}



const SeasonChooser: React.FC<SeasonChooserProps> = ({
  seasons,
  onSeasonChange,
  onEpisodeChange,
}) => {
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [playingEpisode, setPlayingEpisode] = useState<number>(1);

  useEffect(() => {
    if (seasons?.length > 0) {
      setSelectedSeason(seasons[0]);
      setPlayingEpisode(1);
      onSeasonChange(1);
      onEpisodeChange(1);
    }
  }, [seasons]);

  const handleSeasonChange = (season: Season) => {
    setSelectedSeason(season);
    setPlayingEpisode(1);
    setIsOpen(false);
    onSeasonChange(season.seasonNumber);
    onEpisodeChange(1);
  };

  const handleEpisodeClick = (episodeNumber: number) => {
    setPlayingEpisode(episodeNumber);
    onEpisodeChange(episodeNumber);
  };

  return (
    <div className="w-full max-w-md bg-black/95 text-gray-300 rounded-lg -mt-4">
      <div className="p-4 cursor-pointer hover:bg-gray-800/50">
        <div 
          className="flex items-center justify-between"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center space-x-2">
            <FaPlay />
            <span>{selectedSeason?.name || 'Select Season'}</span>
           
          </div>
          
          <div className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
            <MdArrowDropDown className='text-2xl' />
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-gray-800">
          {seasons.map((season) => (
            <div
              key={season.id}
              className={`p-4 cursor-pointer flex items-center space-x-2
                ${selectedSeason?.id === season.id 
                  ? 'bg-primary text-white' 
                  : 'hover:bg-gray-800/50'}`}
              onClick={() => handleSeasonChange(season)}
            >
              <span>{season.name}</span>
             
            </div>
          ))}
        </div>
      )}

      {selectedSeason && !isOpen && (
        <div className="border-t border-gray-800">
          {Array.from({ length: selectedSeason.episodeCount }, (_, i) => i + 1).map((episodeNum) => (
            <div
              key={episodeNum}
              className={`p-4 cursor-pointer flex items-center space-x-2
                ${playingEpisode === episodeNum 
                  ? 'bg-primary text-white' 
                  : 'hover:bg-gray-800/50'}`}
              onClick={() => handleEpisodeClick(episodeNum)}
            >
              <span>Episode {episodeNum}</span>
            </div>
          ))}
        </div>
      )}

      {selectedSeason && (
        <div className="border-t border-gray-800 p-4 flex items-center space-x-2">
          <MdMenu />
          <span>{selectedSeason.name} Episode {playingEpisode}</span>
        </div>
      )}
    </div>
  );
};

export default SeasonChooser;