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
    id: 1,
    name: "Primary",
    baseUrl: "https://moviesapi.club",
    urlSeparator: "-"
  },
  {
    id: 2,
    name: "Secondary",
    baseUrl: "https://player.autoembed.cc/embed/",
    urlSeparator: "/"
  },
  {
    id: 3,
    name: "VideoLink",
    baseUrl: "https://vidlink.pro",
    urlSeparator: "/",
     idType: 'id'
   
  },
  {
    id: 5,
    name: "Embed",
    baseUrl: "https://embed.su/embed",
    urlSeparator: "/"
  },
  {
    id: 4,
    name: "Alt",
    baseUrl: "https://v2.vidsrc.me/embed/",
    urlSeparator: "/",
  }
];