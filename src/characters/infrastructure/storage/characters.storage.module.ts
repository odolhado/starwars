import { Module } from '@nestjs/common';
import { CharactersStorage } from './characters.storage';
import { CHARACTERS_STORAGE } from '../../application/ports/characters.storage';

@Module({
  providers: [{
    provide: CHARACTERS_STORAGE,
    useClass: CharactersStorage
  }],
  exports: [CHARACTERS_STORAGE],
})
export class CharactersStorageModule {}
