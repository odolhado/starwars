import { Injectable } from '@nestjs/common';
import { CharacterDto } from '../../application/domain/character.dto';
import { CharactersResponseDto } from '../../application/domain/characters.response';
import * as charactersData from '../../infrastructure/utils/characters.json';
import { map, Observable, of } from 'rxjs';

@Injectable()
export class CharactersState {
  private readonly characters$: Observable<CharacterDto[]> = of(charactersData.characters);

  findAll(): Observable<CharactersResponseDto> {
    return this.characters$.pipe(
      map(characters => ({ characters }))
    );
  }

  findByName(name: string): Observable<CharacterDto | undefined> {
    return this.characters$.pipe(
      map(characters => characters.find(
        character => character.name.toLowerCase() === name.toLowerCase()
      ))
    );
  }

  findByEpisode(episode: string): Observable<CharactersResponseDto> {
    return this.characters$.pipe(
      map(characters => {
        const filteredCharacters = characters.filter(character =>
          character.episodes.includes(episode.toUpperCase())
        );
        return { characters: filteredCharacters };
      })
    );
  }
}
