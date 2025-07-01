import { Observable } from 'rxjs';
import { CharacterDto } from '../domain/character.dto';

export interface UpdateCharactersInterface {
  updateCharacter(chatacter: CharacterDto): Observable<void>
}

export const UPDATE_CHARACTER_COMMAND: symbol = Symbol('UPDATE_CHARACTER_COMMAND');
