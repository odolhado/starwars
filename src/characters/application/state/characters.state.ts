import { Inject, Injectable } from '@nestjs/common';
import { CharacterDto } from '../../application/domain/character.dto';
import { CharactersResponseDto } from '../../application/domain/characters.response';
import { map, Observable, of, switchMap } from 'rxjs';
import { CHARACTERS_REPOSITORY, CharactersRepositoryInterface } from '../ports/characters.repository';
import { CHARACTERS_STORAGE, CharactersStorageInterface } from '../ports/characters.storage';

@Injectable()
export class CharactersState {
  private readonly characters$: Observable<CharacterDto[]> = this.charactersStorage.selectAll();

  constructor(
    @Inject(CHARACTERS_REPOSITORY) private readonly charactersRepository: CharactersRepositoryInterface,
    @Inject(CHARACTERS_STORAGE) private readonly charactersStorage: CharactersStorageInterface,
  ) {}

  initialize(): Observable<void> {
    return this.charactersRepository.getCharacters().pipe(
      switchMap(characters => {
        return this.charactersStorage.initialize(characters);
      })
    );
  }

  findAll(): Observable<CharactersResponseDto> {
    console.log('> findAll');
    return this.characters$.pipe(
      map(characters => (
        {
          characters: characters
        }
      ))
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
