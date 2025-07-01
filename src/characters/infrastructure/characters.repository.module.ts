import { Module } from '@nestjs/common';
import { CHARACTERS_REPOSITORY } from '../application/ports/characters.repository';
import { map, of } from 'rxjs';
import * as charactersData from './utils/characters.json';
import { v4 as uuidv4 } from 'uuid';
import { CharactersRepository } from './characters.repository';

@Module({
  providers: [{
    provide: CHARACTERS_REPOSITORY,
    useClass: CharactersRepository
  }],
  exports: [CHARACTERS_REPOSITORY],
})
export class CharactersRepositoryModule {}
