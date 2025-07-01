import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { CharactersStorageInterface } from '../../application/ports/characters.storage';
import { CharacterDto } from '../../application/domain/character.dto';

@Injectable()
export class CharactersStorage implements CharactersStorageInterface {

  private charactersInMemory: BehaviorSubject<any> =
    new BehaviorSubject<any>({
      all: new Map<number, CharacterDto>([]),
    });

  initialize(
    characters: CharacterDto[]
  ): Observable<void> {
    console.log('> initialize', characters);
    return of(this.charactersInMemory.next(characters));
  }

  selectAll(): Observable<CharacterDto[]>{
    return this.charactersInMemory.asObservable().pipe(map((data)=>data.all));
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