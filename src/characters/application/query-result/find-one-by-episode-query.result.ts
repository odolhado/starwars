import { Observable } from 'rxjs';
import { CharacterDto } from '../domain/character.dto';

export interface FindOneCharacterQueryResult {
  findOne(name: string): Observable<CharacterDto | undefined>
  findOneByEpisode(episode: string): Observable<CharacterDto | undefined>
}

export const FIND_ONE_CHARACTER_QUERY_RESULT: symbol = Symbol('FIND_ONE_CHARACTER_QUERY_RESULT');
