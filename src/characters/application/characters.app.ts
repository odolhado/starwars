import { Inject, Injectable } from '@nestjs/common';
import { CharacterDto } from './../application/domain/character.dto';
import { CharactersResponseDto } from './../application/domain/characters.response';
import { map, Observable, of, switchMap } from 'rxjs';
import { CHARACTERS_REPOSITORY, CharactersRepositoryInterface } from './ports/characters.repository';
import { CHARACTERS_STORAGE, CharactersStorageInterface } from './ports/characters.storage';
import { UpdateCharactersInterface } from './commands/update-character.command';
import { InitializeCharactersInterface } from './commands/initialize-character.command';
import { FindAllCharactersQueryResult } from './query-result/find-all-characters-query.result';
import { FindOneCharacterQueryResult } from './query-result/find-one-by-episode-query.result';

@Injectable()
export class CharactersApp implements InitializeCharactersInterface, UpdateCharactersInterface,
  FindAllCharactersQueryResult, FindOneCharacterQueryResult {

  constructor(
    @Inject(CHARACTERS_REPOSITORY) private readonly charactersRepository: CharactersRepositoryInterface,
    @Inject(CHARACTERS_STORAGE) private readonly charactersStorage: CharactersStorageInterface,
  ) {
  }

  updateCharacter(character: CharacterDto): Observable<void> {
    return this.charactersStorage.updateOne(character);
  }

  createCharacter(character: CharacterDto): Observable<void> {
    return this.charactersStorage.createOne(character);
  }

  deleteCharacter(characterid: string): Observable<void> {
    return this.charactersStorage.deleteOne(characterid);
  }

  initializeCharacters(): Observable<void> {
    return this.charactersRepository.getCharacters().pipe(
      switchMap(characters => {
        return this.charactersStorage.initialize(characters);
      })
    );
  }

  findAll(page: number = 1, limit: number = 1): Observable<CharactersResponseDto> {
    return this.charactersStorage.selectAll().pipe(map((characters: CharacterDto[])=>{

      // todo:: move pagination to the Storage, as pagination is specific to the database, and could be done differently
      const total = characters.length;
      const pages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      return {
        characters: characters.slice(startIndex, endIndex),
        pagination: {
          page,
          limit,
          total,
          pages
        }
      };
    }));
  }

  // todo: it should really return only one record. but now, there is no limit applied
  findOne(name: string): Observable<CharacterDto | undefined> {
    // todo: move filtering to the Storage, as we cant always return all the records (1M) to the State. storage is database specific
    return this.charactersStorage.selectAll().pipe(
      map(characters => characters.find(
        character => character.name.toLowerCase() === name.toLowerCase()
      ))
    );
  }

  findOneByEpisode(episode: string): Observable<CharacterDto | undefined> {
    // todo: move filtering to the Storage, as we cant always return all the records (1M) to the State. storage is database specific
    return this.charactersStorage.selectAll().pipe(
      map(characters => characters.find(
        character => character.episodes.includes(episode.toUpperCase())
      ))
    );
  }
}
