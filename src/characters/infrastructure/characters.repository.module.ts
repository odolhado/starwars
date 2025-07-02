import { Module } from '@nestjs/common';
import { CHARACTERS_REPOSITORY } from '../application/ports/characters.repository';
import { CharactersRepository } from './characters.repository';

@Module({
  providers: [{
    provide: CHARACTERS_REPOSITORY,
    useClass: CharactersRepository
  }],
  exports: [CHARACTERS_REPOSITORY],
})
export class CharactersRepositoryModule {}
