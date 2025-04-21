// utils/subtitleUtils.js

/**
 * Fetches SRT subtitles from a URL and converts them to WebVTT format
 * @param {string} srtUrl - The URL to fetch SRT subtitles from
 * @returns {Promise<string|null>} - A blob URL to the converted WebVTT file or null if error
 */
export async function fetchAndConvertSubtitles(srtUrl) {
    try {
        console.log('Fetching subtitles from:', srtUrl);
       
        const response = await fetch(srtUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
       
        const srtData = await response.text();
        console.log('SRT data received, length:', srtData.length);
       
        // Check if it looks like SRT format
        if (srtData.includes('-->')) {
            console.log('SRT format detected, converting to WebVTT');
           
            // Convert SRT to WebVTT
            let vttData = 'WEBVTT\n\n';
           
            // Split by double newline to get each subtitle entry
            const entries = srtData.split(/\r?\n\r?\n/).filter(entry => entry.trim() !== '');
           
            entries.forEach(entry => {
                // Process each entry
                const lines = entry.trim().split(/\r?\n/);
               
                if (lines.length >= 2) {
                    // Find the line with the timestamp
                    const timestampLine = lines.find(line => line.includes('-->'));
                   
                    if (timestampLine) {
                        // Replace commas with periods in timestamps
                        const fixedTimestamp = timestampLine
                            .replace(/(\d{2}):(\d{2}):(\d{2}),(\d{3})/g, '$1:$2:$3.$4');
                       
                        // Get text content (everything after the timestamp line)
                        const startIdx = lines.indexOf(timestampLine) + 1;
                        const textContent = lines.slice(startIdx).join('\n');
                       
                        // Add to VTT data (skip the subtitle ID for simplicity)
                        vttData += fixedTimestamp + '\n' + textContent + '\n\n';
                    }
                }
            });
           
            console.log('WebVTT conversion successful');
            return vttData; // Return the VTT text directly, not a Blob URL
        } else {
            console.error('The subtitle file format is not recognized or empty.');
            console.log('First 100 characters:', srtData.substring(0, 100));
            return null;
        }
    } catch (error) {
        console.error('Error fetching or processing subtitles:', error);
        return null;
    }
}

/**
 * Fetches subtitle information for a media item
 * @param {string|number} mediaId - The ID of the media
 * @param {string} mediaType - The type of media ('movie' or 'tv')
 * @param {number|null} season - Season number (only for TV shows)
 * @param {number|null} episode - Episode number (only for TV shows)
 * @returns {Promise<Array>} - Array of subtitle information
 */
export async function fetchSubtitles(mediaId, mediaType, season = null, episode = null) {
    try {
        let url = `https://sub.wyzie.ru/search?id=${mediaId}`;
        
        // Add season and episode parameters for TV shows
        if (mediaType === 'tv' && season !== null && episode !== null) {
            url += `&season=${season}&episode=${episode}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch subtitles');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching subtitles:', error);
        return [];
    }
}

// Export a helper function to load subtitles directly into a video player
export async function loadSubtitlesForVideo(videoElement, mediaId, mediaType, season = null, episode = null) {
    try {
        // First fetch available subtitles
        const subtitleData = await fetchSubtitles(mediaId, mediaType, season, episode);
        
        // Remove any existing tracks
        while (videoElement.firstChild) {
            if (videoElement.firstChild.tagName === 'TRACK') {
                videoElement.removeChild(videoElement.firstChild);
            } else {
                break;
            }
        }
        
        // Process each subtitle and add as a track
        const tracks = [] as any;
        
        for (const subtitle of subtitleData) {
            if (subtitle.url) {
                const vttUrl = await fetchAndConvertSubtitles(subtitle.url);
                
                if (vttUrl) {
                    const track = document.createElement('track');
                    track.kind = 'subtitles';
                    track.label = subtitle.language || 'Unknown';
                    track.srclang = subtitle.languageCode || 'en';
                    track.src = vttUrl;
                    
                    videoElement.appendChild(track);
                    tracks.push({
                        element: track,
                        blobUrl: vttUrl
                    });
                }
            }
        }
        
        return tracks;
    } catch (error) {
        console.error('Error loading subtitles:', error);
        return [];
    }
}