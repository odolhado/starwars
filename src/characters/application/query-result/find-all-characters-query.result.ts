import { Observable } from 'rxjs';
import { CharactersResponseDto } from '../domain/characters.response';

export interface FindAllCharactersQueryResult {
  findAll(page: number, limit: number): Observable<CharactersResponseDto>
}

export const FIND_ALL_CHARACTERS_QUERY_RESULT: symbol = Symbol('FIND_ALL_CHARACTERS_QUERY_RESULT');
