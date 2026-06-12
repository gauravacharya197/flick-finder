export interface Sport {
  id: string;
  name: string;
}

export interface Team {
  name: string;
  badge: string;
}

export interface Source {
  source: string;
  id: string;
}

export interface Match {
  id: string;
  title: string;
  category: string;
  date: number;
  poster: string;
  popular: boolean;
  teams: {
    home: Team;
    away: Team;
  };
  sources: Source[];
}