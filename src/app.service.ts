import { Injectable, OnModuleInit } from '@nestjs/common';
import { CharactersState } from './characters/application/state/characters.state';
import { take } from 'rxjs';

@Injectable()
export class AppService implements OnModuleInit {

  constructor(private readonly charactersState: CharactersState) {}

  getHello(): string {
    return 'Hello World!';
  }

  onModuleInit() {
    this.charactersState.initialize().pipe(take(1)).subscribe();
    console.log('Character state initialized');
  }
}
