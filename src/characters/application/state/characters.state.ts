import { Inject, Injectable } from '@nestjs/common';
import { CharacterDto } from '../../application/domain/character.dto';
import { CharactersResponseDto } from '../../application/domain/characters.response';
import { map, Observable, switchMap } from 'rxjs';
import { CHARACTERS_REPOSITORY, CharactersRepositoryInterface } from '../ports/characters.repository';
import { CHARACTERS_STORAGE, CharactersStorageInterface } from '../ports/characters.storage';

@Injectable()
export class CharactersState {

  constructor(
    @Inject(CHARACTERS_REPOSITORY) private readonly charactersRepository: CharactersRepositoryInterface,
    @Inject(CHARACTERS_STORAGE) private readonly charactersStorage: CharactersStorageInterface,
  ) {
  }

  initialize(): Observable<void> {
    return this.charactersRepository.getCharacters().pipe(
      switchMap(characters => {
        console.log('> initializing characters', characters.length);
        return this.charactersStorage.initialize(characters);
      })
    );
  }

  findAll(): Observable<CharactersResponseDto> {
    return this.charactersStorage.selectAll().pipe(map((characters)=>{
      return { characters }
    }));
  }

  findByName(name: string): Observable<CharacterDto | undefined> {
    console.log('> findByName:', name);
    return this.charactersStorage.selectAll().pipe(
      map(characters => characters.find(
        character => character.name.toLowerCase() === name.toLowerCase()
      ))
    );
  }

  findByEpisode(episode: string): Observable<CharactersResponseDto> {
    return this.charactersStorage.selectAll().pipe(
      map(characters => {
        const filteredCharacters = characters.filter(character =>
          character.episodes.includes(episode.toUpperCase())
        );
        return { characters: filteredCharacters };
      })
    );
  }
}
