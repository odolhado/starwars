import { BehaviorSubject, defer, map, Observable, of } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { CharactersStorageInterface } from '../../application/ports/characters.storage';
import { CharacterDto } from '../../application/domain/character.dto';

@Injectable()
export class CharactersStorage implements CharactersStorageInterface {

  private charactersInMemory: BehaviorSubject<any> =
    new BehaviorSubject<CharacterDto[]>([]);

  initialize(
    characters: CharacterDto[]
  ): Observable<void> {

    return defer(() => {
      this.charactersInMemory.next(characters);
      console.log('> characters initialized', this.charactersInMemory.getValue());

      return of(void 0);
    });
  }

  selectAll(): Observable<CharacterDto[]>{
    return of(this.charactersInMemory.getValue());
  }

  updateOne(
    changedCharacter: CharacterDto,
  ): Observable<void> {
    const characters = this.charactersInMemory.getValue()
    let found = false;

    const updatedCharacters = characters?.map((character: CharacterDto)=> {
      if (character.id === changedCharacter.id) {
        found = true;
        return changedCharacter;
      }
      return character;
    })

    if (found) {
      this.charactersInMemory.next(updatedCharacters);
      console.log('> updatedCharacters', updatedCharacters);
    }

    return of(void 0);
  }

  createOne(
    changedCharacter: CharacterDto,
  ): Observable<void> {
    this.charactersInMemory.next([...this.charactersInMemory.getValue(), changedCharacter]);
    console.log('> createOne', this.charactersInMemory.getValue());

    return of(void 0);
  }
}