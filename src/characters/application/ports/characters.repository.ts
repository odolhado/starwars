import { Observable } from 'rxjs';
import { CharacterDto } from '../domain/character.dto';

export interface CharactersRepositoryInterface {
  getCharacters(): Observable<CharacterDto[]>
}

export const CHARACTERS_REPOSITORY: symbol = Symbol('CHARACTERS_REPOSITORY');
