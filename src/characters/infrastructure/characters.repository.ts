import { Injectable } from '@nestjs/common';
import * as charactersData from './utils/characters.json';
import { map, Observable, of } from 'rxjs';
import { CharactersRepositoryInterface } from '../application/ports/characters.repository';
import { CharacterDto } from '../application/domain/character.dto';
import { v4 as uuidv4 } from 'uuid';
import { Character } from './utils/characters.type';

@Injectable()
export class CharactersRepository implements CharactersRepositoryInterface {

  getCharacters(): Observable<CharacterDto[]> {
    return of(charactersData.characters.map( (character: Character)=> {
      return {
        ...character,
        id: uuidv4()
      } as CharacterDto
    }));
  }
}
