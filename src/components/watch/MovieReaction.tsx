// ===== MAIN COMPONENT =====
// components/MovieReaction.tsx
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMovieReactions, removeMovieReaction, addMovieReaction } from "@/services/MovieService";
import { getUserFingerprint } from ".././../utils/getUserFingetPrint"; // Assuming this function exists to get user fingerprint

interface Reaction {
  reactionType: string;
  emojiCode: string;
  displayName: string;
  count: number;
}

interface MutationVariables {
  reactionType: string;
}

// ===== MAIN COMPONENT =====
const MovieReaction: React.FC<any> = ({ movie, mediaType }) => {
  const [userFingerprint, setUserFingerprint] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState<any>({});
  const queryClient = useQueryClient();
  
  const title: string = movie?.title || movie?.name || '';
  const id: number = movie.id;
  const finalMediaType: string = mediaType === "movie" ? "Movie" : "TV";

  // Get user fingerprint on component mount
  useEffect(() => {
    const initFingerprint = async (): Promise<void> => {
      try {
        const fingerprint: string = await getUserFingerprint();
        setUserFingerprint(fingerprint);
      } catch (error) {
        console.error('Failed to get fingerprint:', error);
        // Fallback to a random ID
        setUserFingerprint(`fallback_${Math.random().toString(36).substr(2, 9)}`);
      }
    };
    
    initFingerprint();
  }, []);

  // Fetch movie reactions
  const {
    data: reactionData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['movieReactions', id, userFingerprint],
    queryFn: (): Promise<any> => getMovieReactions(id, userFingerprint!),
    enabled: !!userFingerprint && !!id,
    refetchOnWindowFocus: false,
  });

  // Mutation for adding/updating reactions
  const reactionMutation = useMutation({
    mutationFn: ({ reactionType }: MutationVariables) => 
      addMovieReaction(id, reactionType, userFingerprint!),
    onMutate: async ({ reactionType }: MutationVariables) => {
      // Trigger animation
      setIsAnimating(prev => ({ ...prev, [reactionType]: true }));
      
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['movieReactions', id, userFingerprint] });
      
      // Snapshot previous value
      const previousData = queryClient.getQueryData(['movieReactions', id, userFingerprint]) as any;
      
      // Optimistically update
      if (previousData) {
        const newData = {
          ...previousData,
          reactions: previousData.reactions.map((reaction: Reaction) => {
            if (reaction.reactionType === reactionType) {
              const isCurrentUserReaction = previousData.userCurrentReaction === reactionType;
              return {
                ...reaction,
                count: isCurrentUserReaction ? reaction.count - 1 : reaction.count + 1
              };
            }
            if (reaction.reactionType === previousData.userCurrentReaction) {
              return {
                ...reaction,
                count: reaction.count - 1
              };
            }
            return reaction;
          }),
          userCurrentReaction: previousData.userCurrentReaction === reactionType ? null : reactionType
        };
        
        queryClient.setQueryData(['movieReactions', id, userFingerprint], newData);
      }
      
      return { previousData };
    },
    onError: (err: Error, variables: MutationVariables, context?): void => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(['movieReactions', id, userFingerprint], context.previousData);
      }
    },
    onSettled: (data: any | undefined, error: Error | null, { reactionType }: MutationVariables): void => {
      // Remove animation
      setTimeout(() => {
        setIsAnimating(prev => ({ ...prev, [reactionType]: false }));
      }, 300);
      
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['movieReactions', id, userFingerprint] });
    }
  });

  const handleReactionClick = (reactionType: string): void => {
    if (!userFingerprint || reactionMutation.isPending) return;
    
    reactionMutation.mutate({ reactionType });
  };

  if (!userFingerprint) {
    return (
      <div className="bg-gradient-to-br from-gray-900/60 via-gray-800/40 to-slate-900/60 backdrop-blur-xl rounded-xl text-white p-4 border border-gray-700/30 shadow-2xl mt-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg mb-4 w-48"></div>
          <div className="flex gap-3">
            {[1, 2, 3, 4, 5, 6].map((i: number) => (
              <div key={i} className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-600 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-gray-900/60 via-gray-800/40 to-slate-900/60 backdrop-blur-xl rounded-xl text-white p-4 border border-red-500/20 mt-4">
        <div className="text-center">
          <div className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent text-lg font-semibold mb-2">
            Failed to load reactions
          </div>
          <button 
            onClick={() => queryClient.invalidateQueries({ queryKey: ['movieReactions', id, userFingerprint] })}
            className="mt-3 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-red-500/25 transform hover:scale-105"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900/70 via-slate-800/50 to-gray-900/70 backdrop-blur-xl rounded-xl text-white border border-gray-700/30 shadow-2xl overflow-hidden mt-6">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 via-transparent to-cyan-500/5 pointer-events-none"></div>
      
      <div className="relative flex flex-col lg:flex-row gap-6 p-4 ">
        {/* Header Section */}
        <div className="flex-1">
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-teal-400 via-teal-500 to-cyan-400 bg-clip-text text-transparent leading-tight">
              What do you feel about this {finalMediaType.toLowerCase()}?
            </h3>
            <p className="text-gray-300 text-lg font-medium bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
              {title}
            </p>
          </div>

          {/* Reactions Grid */}
          {isLoading ? (
            <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
              {[1, 2, 3, 4, 5, 6].map((i: number) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gradient-to-br from-gray-700 to-gray-600 rounded-xl h-20 w-full"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
              {/* Keep original order - no sorting */}
              {reactionData?.reactions?.map((reaction: Reaction) => {
                const isSelected: boolean = reactionData.userCurrentReaction === reaction.reactionType;
                const isAnimatingThis: boolean = isAnimating[reaction.reactionType];
                
                return (
                  <button
                    key={reaction.reactionType}
                    onClick={() => handleReactionClick(reaction.reactionType)}
                    disabled={reactionMutation.isPending}
                    className={`
                      group relative overflow-hidden rounded-xl p-4 transition-all duration-300 transform hover:scale-105 active:scale-95 border
                      ${isSelected 
                        ? 'bg-gradient-to-br from-teal-500/90 via-teal-600/80 to-cyan-500/90 shadow-lg shadow-teal-500/30 border-teal-400/50' 
                        : 'bg-gradient-to-br from-gray-800/60 via-slate-700/40 to-gray-800/60 hover:from-gray-700/70 hover:via-slate-600/50 hover:to-gray-700/70 border-gray-600/30 hover:border-teal-500/30'
                      }
                      ${reactionMutation.isPending ? 'opacity-70' : ''}
                    `}
                  >
                    {/* Glow effect for selected */}
                    {isSelected && (
                      <div className="absolute inset-0 bg-gradient-to-br from-teal-400/30 to-cyan-400/30 rounded-xl blur-xl"></div>
                    )}
                    
                    {/* Hover glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500/0 to-cyan-500/0 group-hover:from-teal-500/10 group-hover:to-cyan-500/10 rounded-xl transition-all duration-300"></div>
                    
                    {/* Content */}
                    <div className="relative z-10 text-center">
                      <div className={`text-3xl mb-2 transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-12 ${isAnimatingThis ? 'scale-125 rotate-3' : 'scale-100 rotate-0'} ${isSelected ? 'drop-shadow-lg' : ''}`}>
                        {reaction.emojiCode}
                      </div>
                      
                      <div className={`text-xs font-semibold mb-2 transition-colors ${isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                        {reaction.displayName}
                      </div>
                      
                      <div className={`text-sm font-bold transition-colors ${isSelected ? 'text-white drop-shadow-sm' : 'text-gray-400 group-hover:bg-gradient-to-r group-hover:from-teal-400 group-hover:to-cyan-400 group-hover:bg-clip-text group-hover:text-transparent'}`}>
                        {reaction.count.toLocaleString()}
                      </div>
                    </div>
                    {/* Ripple effect */}
                  </button>
                );
              })}
            </div>
          )}

          {/* Total Reactions Summary */}
          {!isLoading && reactionData && (
            <div className="mt-6 pt-4  border-gradient-to-r from-transparent via-gray-600/50 to-transparent">
              <div className="bg-gradient-to-r from-gray-800/40 via-slate-700/30 to-gray-800/40 rounded-lg p-3 border border-gray-600/20">
                <div className="flex items-center justify-between text-sm">
                  <span className="bg-gradient-to-r from-gray-300 to-gray-400 bg-clip-text text-transparent font-medium">
                    Total reactions: <span className="font-bold text-white">{reactionData.reactions?.reduce((sum: number, r: Reaction) => sum + r.count, 0).toLocaleString()}</span>
                  </span>
                  {reactionData.userCurrentReaction && (
                    <span className="flex items-center gap-2 bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent font-medium">
                      <span className="w-2 h-2 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full animate-pulse shadow-lg shadow-teal-400/50"></span>
                      You reacted with {reactionData.reactions?.find((r: Reaction) => r.reactionType === reactionData.userCurrentReaction)?.displayName}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Side Panel with Popular Reactions */}
        {!isLoading && reactionData && (
          <div className="lg:w-72">
            <div className="bg-gradient-to-br from-gray-800/50 via-slate-700/30 to-gray-800/50 rounded-xl p-4 border border-gray-600/30 backdrop-blur-sm">
              <h4 className="text-lg font-bold mb-3 bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Popular Reactions
              </h4>
              <div className="space-y-2">
                {[...reactionData.reactions]
                  ?.sort((a: Reaction, b: Reaction) => b.count - a.count)
                  ?.slice(0, 3)
                  ?.map((reaction: Reaction, index: number) => (
                    <div key={reaction.reactionType} className="group relative overflow-hidden">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-gray-700/40 via-slate-600/30 to-gray-700/40 border border-gray-600/20 hover:border-teal-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/10">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl filter drop-shadow-sm">{reaction.emojiCode}</span>
                          <span className="text-sm font-semibold text-gray-200 group-hover:bg-gradient-to-r group-hover:from-teal-400 group-hover:to-cyan-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                            {reaction.displayName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                            {reaction.count}
                          </span>
                          {index === 0 && reaction.count > 0 && (
                            <span className="text-xs bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-2 py-1 rounded-full font-bold shadow-lg animate-pulse">
                              👑
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieReaction;