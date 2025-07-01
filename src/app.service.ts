import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { take } from 'rxjs';
import {
  INITIALIZE_CHARACTERS_COMMAND,
  InitializeCharactersInterface
} from './characters/application/commands/initialize-character.command';

@Injectable()
export class AppService implements OnModuleInit {

  constructor(
    @Inject(INITIALIZE_CHARACTERS_COMMAND) private readonly initializeCharactersCommand: InitializeCharactersInterface,
  ) {}

  onModuleInit() {
    this.initializeCharactersCommand.initializeCharacters().pipe(take(1)).subscribe();
  }
}
