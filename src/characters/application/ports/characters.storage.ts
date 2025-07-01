import { Observable } from 'rxjs';
import { CharacterDto } from '../domain/character.dto';

export interface CharactersStorageInterface {
  initialize(chatacters: CharacterDto[]): Observable<void>
  selectAll(): Observable<CharacterDto[]>
  updateOne(chatacter: CharacterDto): Observable<void>
  createOne(chatacter: CharacterDto): Observable<void>
}

export const CHARACTERS_STORAGE: symbol = Symbol('CHARACTERS_STORAGE');
