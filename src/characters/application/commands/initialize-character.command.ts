import { Observable } from 'rxjs';

export interface InitializeCharactersInterface {
  initializeCharacters(): Observable<void>
}

export const INITIALIZE_CHARACTERS_COMMAND: symbol = Symbol('INITIALIZE_CHARACTERS_COMMAND');
