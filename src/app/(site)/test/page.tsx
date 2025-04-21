'use client';
import Container from '@/components/common/Container';
import { fetchSubtitles } from '@/utils/subtitleUtil'; // Adjust the import path as needed
import { useState, useEffect } from 'react';
import HLSVideoPlayer from '@/components/HLSVideoPlayer';

const TestPage = () => {
    const [captionTracks, setCaptionTracks] = useState([]);
    const defaultFallbackUrl = 'https://jett4.routemachine.site/v3-hls-playback/81b16d8ff2956d3be046729121df2350c2fc12653e68857e2d5c18572afdca2b0ee07bcafb1eb90d55230f164691180e2a109117585b170eaa7a6e9fe383a9062dd4b6cc6dcd9f627ceac2e1368a71bb5919f5ccd6bc82d971df9fbaf07c5bfb0b98d9eb1a2703f6e6ef5dfd15326b641770b5053033788ea633610972b6f8b146ac1591d43234154a5f9a682e30df4dcdd273b9777bb5af458c3ffd6a4241397b9fd8aa6e5644be4f9a15c4241bacf75b8c406af61327f08fa7416c13919ec5/1080/index.m3u8';

    // Media parameters
    const mediaId = 129;
    const mediaType = "movie";
    const season = null;
    const episode = null;
    const streamUrl =defaultFallbackUrl
    const title = "Deadpool & Wolverine (2024)";
    
    function prepareCaptionTracks(subtitles) {
        if (!subtitles || subtitles.length === 0) {
            return [];
        }
        
        return subtitles?.slice(0,6)?.map(subtitle => ({
            src: subtitle.url,
            lang: subtitle.language,
            label: subtitle.display + (subtitle.isHearingImpaired ? ' [CC]' : '')
        }));
    }
    
    useEffect(() => {
        const loadSubtitles = async () => {
            try {
                const subtitles = await fetchSubtitles(mediaId, mediaType, season, episode);
                const formattedCaptions = prepareCaptionTracks(subtitles);
                setCaptionTracks(formattedCaptions);
            } catch (error) {
                console.error("Error loading subtitles:", error);
            }
        };
        
        loadSubtitles();
    }, [mediaId, mediaType, season, episode]);

    return (
       
            <HLSVideoPlayer
                src={streamUrl}
                captions={captionTracks}
                title={title}
                poster="https://image.tmdb.org/t/p/original/2Nti3gYAX513wvhp8IiLL6ZDyOm.jpg"
            />
       
    );
}

export default TestPage;