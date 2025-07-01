import { Inject, Injectable } from '@nestjs/common';
import { CharacterDto } from '../../application/domain/character.dto';
import { CharactersResponseDto } from '../../application/domain/characters.response';
import { map, Observable, of, switchMap } from 'rxjs';
import { CHARACTERS_REPOSITORY, CharactersRepositoryInterface } from '../ports/characters.repository';
import { CHARACTERS_STORAGE, CharactersStorageInterface } from '../ports/characters.storage';
import { UpdateCharactersInterface } from '../commands/update-character.command';
import { InitializeCharactersInterface } from '../commands/initialize-character.command';
import { FindAllCharactersQueryResult } from '../query-result/find-all-characters-query.result';
import { FindOneCharacterQueryResult } from '../query-result/find-one-by-episode-query.result';

@Injectable()
export class CharactersState implements InitializeCharactersInterface, UpdateCharactersInterface,
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

  findOne(name: string): Observable<CharacterDto | undefined> {
    console.log('> findByName:', name);
    return this.charactersStorage.selectAll().pipe(
      map(characters => characters.find(
        character => character.name.toLowerCase() === name.toLowerCase()
      ))
    );
  }
}
