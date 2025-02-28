'use client'
import React from 'react';
import { Switch } from '@/components/ui/primitives/switch';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/primitives/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Button } from '@/components/ui/primitives/button';
import { useSelector } from 'react-redux';
import { Option } from '../../types/option';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { SavePreferences, FetchUserPreferences } from '@/services/AccountService';
import Skeleton from '../common/Skeleton';
import { FaEraser } from 'react-icons/fa';

export const UserSettings = () => {
  const [selectedGenres, setSelectedGenres] = React.useState<string[]>([]);
  const { genres } = useSelector((state: any) => state.filters);

  // Log the genres from Redux to check their format

  const genreOptions: Option[] = genres?.map((genre: any) => ({
    value: genre.externalId.toString(), // Convert to string here
    label: genre.name,
  }));

  // Fetch user preferences
  const { data: userPreferences, isLoading } = useQuery({
    queryKey: ['userPreferences'],
    queryFn: FetchUserPreferences,
  });

  // Update selected genres when preferences are loaded
  React.useEffect(() => {
    if (userPreferences?.data?.genresList) {
      const genreIds = userPreferences.data.genresList.map(id => id.toString());
  
      setSelectedGenres(genreIds);
    }
  }, [userPreferences, genres]); // Added genres as dependency

  // Save preferences mutation
  const { mutate: savePreferencesMutation, isPending } = useMutation({
    mutationFn: (genreIds: number[]) => SavePreferences({ genresList: genreIds }),
    onSuccess: () => {
      toast.success('Preferences saved successfully');
    },
    onError: (error) => {
      toast.error('Failed to save preferences');
    },
  });

  const toggleGenre = (genre: string) => {
    setSelectedGenres(current => {
      if (current.includes(genre)) {
        // Always allow removing genres
        return current.filter(g => g !== genre);
      } else {
        // Check if adding would exceed the limit
        if (current.length >= 3) {
          toast(<span> {`You can only select up to ${3} genres`}</span>);
          return current;
        }
        return [...current, genre];
      }
    });
  };
  const handleSavePreferences = () => {
    const selectedGenreIds = selectedGenres.map(genreId => parseInt(genreId, 10));
    savePreferencesMutation(selectedGenreIds);
  };

  // Check if a genre is selected
  const isGenreSelected = (genreValue: string) => {
    return selectedGenres.includes(genreValue);
  };

  if (isLoading) {
    return <div className="max-w-3xl mx-auto p-6">{Array.from({ length: 3 }, (_, i) => (
      <Skeleton key={i} />
    ))} </div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
    <h1 className="text-3xl font-bold mb-8">Settings</h1>

    <Card>
      <CardHeader>
        <CardTitle>Playback Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">AutoPlay</h3>
            <p className="text-sm text-gray-500">Automatically start playing media without any interaction</p>
          </div>
          <Switch disabled checked className='bg-gray-50' />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Auto Next Episode</h3>
            <p className="text-sm text-gray-500">Jump straight into the next episode when the current one ends</p>
          </div>
          <Switch disabled checked className='bg-gray-50' />
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Streaming Quality</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <p className="text-sm text-gray-500 mb-2">Choose your preferred video resolution for the best viewing experience</p>
          <Select defaultValue="high" disabled>
            <SelectTrigger className="w-40 ring-black">
              <SelectValue placeholder="Select quality" />
            </SelectTrigger>
            <SelectContent className="border-gray-700 bg-gray-800 text-gray-100">
              <SelectItem value="auto">Auto</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personalized Genres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">Select your preferred genres to get better recommendations</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {genreOptions.map((genre) => (
                <button
                  key={genre.value}
                  onClick={() => toggleGenre(genre.value)}
                  className={`
                    p-3 text-sm rounded-lg transition-all text-white
                    ${isGenreSelected(genre.value)
                      ? 'border-2 bg-primary bg-teal-500/10'
                      : 'border-2 border-gray-700 hover:bg-primary/50'}
                  `}
                >
                  {genre.label}
                </button>
              ))}
            </div>

            <div className="pt-4">
              <Button 
                className="w-full sm:w-auto text-white"
                onClick={handleSavePreferences}
                disabled={isPending}
              >
                {isPending ? 'Saving...' : 'Save Preferences'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserSettings;