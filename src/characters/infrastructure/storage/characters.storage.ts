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

    const allCharacters = this.charactersInMemory.getValue();
    console.log('> selectAll?', this.charactersInMemory);


    return of(allCharacters);
  }

  updateOne(
    character: CharacterDto,
  ): Observable<void> {
    console.log('> updateOne::', JSON.stringify(character));
    const characters = this.charactersInMemory.getValue()

    characters.all.find((user)=> {

    })

    this.charactersInMemory.next(characters);

    return of(void 0);
  }
}