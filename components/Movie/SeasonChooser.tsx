import { Select } from "antd";
import React, { useEffect, useState } from "react";
import { FaPlay } from "react-icons/fa"; // Import play icon from react-icons

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
}

const SeasonChooser: React.FC<SeasonChooserProps> = ({ seasons }) => {
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
  const [playingEpisode, setPlayingEpisode] = useState<number | null>(null); // State for the currently playing episode

  const handleSeasonChange = (seasonNumber: number) => {
    const season = seasons.find(
      (season) => season.seasonNumber === seasonNumber,
    );
    setSelectedSeason(season || null);
    setPlayingEpisode(1); // Reset the playing episode when a new season is selected
  };
  const handlePlayEpisode = (episodeNumber: number) => {
    setPlayingEpisode(episodeNumber); // Set the currently playing episode
  };
  useEffect(() => {
    setSelectedSeason(seasons?.[0]);
  }, [seasons]);

  return (
    <div className="flex flex-col gap-4 -mt-4">
      <Select
        placeholder="Select a season"
        options={seasons?.map((season) => ({
          value: season.seasonNumber,
          label: season.name,
        }))}
        value={selectedSeason?.seasonNumber}
        onChange={(value) => handleSeasonChange(value)}
      />

      {selectedSeason && (
        <div>
          <p>{selectedSeason.overview}</p>
          
          <ul>
            {(() => {
              const episodes: JSX.Element[] = []; // Explicitly type the array
              for (let i = 1; i <= (selectedSeason?.episodeCount || 0); i++) {
                episodes.push(
                  <li key={i} className="mb-3 flex items-center gap-3">
                    <FaPlay
                      className={`cursor-pointer ${
                        playingEpisode === i ? "text-blue-500" : "text-gray-500"
                      }`}
                      onClick={() => handlePlayEpisode(i)} // Handle play icon click
                    />
                    <h5
                      className={`${
                        playingEpisode === i ? "font-bold text-blue-500" : ""
                      }`}
                    >
                      Episode {i}
                    </h5>
                  </li>,
                );
              }
              return episodes;
            })()}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SeasonChooser;
