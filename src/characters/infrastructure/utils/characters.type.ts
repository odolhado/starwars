
export interface Character {
  name: string;
  episodes: string[];
  planet?: string;
}

export interface Characters {
  characters: Character[];
}