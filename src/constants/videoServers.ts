// constants/videoServers.ts
export interface VideoServer {
  id: number;
  name: string;
  baseUrl: string;
  urlSeparator?: string;
  idType?: 'imdbID' | 'id';
}

export const VIDEO_SERVERS: VideoServer[] = [
  {
    id: 5,
    name: "MClub",
    baseUrl: "https://moviesapi.club",
    urlSeparator: "-"
  },
  {
    id: 3,
    name: "VidSrc",
    baseUrl: "https://v2.vidsrc.me/embed/",
    urlSeparator: "/"
  },
  {
    id: 4,
    name: "VideoLink",
    baseUrl: "https://vidlink.pro",
    urlSeparator: "/",
     idType: 'id'
   
  },
  {
    id: 2,
    name: "Secondary",
    baseUrl: "https://embed.su/embed",
    urlSeparator: "/"
  },
  {
    id: 6,
    name: "Alt",
    baseUrl: "https://player.autoembed.cc/embed/",
    urlSeparator: "/",
  },
  {
    id:1,
    name: "Primary",
    baseUrl :"https://111movies.com/",
    urlSeparator:"/"
  }
];