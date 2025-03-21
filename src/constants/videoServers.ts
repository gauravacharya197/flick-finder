// constants/videoServers.ts
//re deploy
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
   baseUrl :"https://111movies.com/",
    urlSeparator:"/"
  },
  {
    id: 4,
    name: "VidSrc",
    baseUrl: "https://v2.vidsrc.me/embed/",
    urlSeparator: "/"
  },
  {
    id: 3,
    name: "VidLink",
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
    id: 6,
    name: "Alt",
    baseUrl: "https://player.autoembed.cc/embed/",
    urlSeparator: "/",
  },
  {
    id:2,
    name: "Secondary",
     baseUrl: "https://moviesapi.club",
    urlSeparator: "-"
  }
];