enum Episode {
  NEWHOPE = "NEWHOPE",
  EMPIRE = "EMPIRE",
  JEDI = "JEDI"
}

// interface Character {
//   name: string;
//   episodes: Episode[];
//   planet?: string;
// }

export interface Character {
  name: string;
  episodes: string[];
  planet?: string;
}

export interface Characters {
  characters: Character[];
}