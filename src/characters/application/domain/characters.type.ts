enum Episode {
  NEWHOPE = "NEWHOPE",
  EMPIRE = "EMPIRE",
  JEDI = "JEDI"
}

interface Character {
  name: string;
  episodes: Episode[];
  planet?: string;
}

interface Characters {
  characters: Character[];
}