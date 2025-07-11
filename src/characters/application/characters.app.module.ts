import { Module } from '@nestjs/common';
import { CharactersApp } from './characters.app';
import { CharactersRepositoryModule } from './../infrastructure/characters.repository.module';
import { CharactersStorageModule } from './../infrastructure/storage/characters.storage.module';
import { INITIALIZE_CHARACTERS_COMMAND } from './commands/initialize-character.command';
import { UPDATE_CHARACTER_COMMAND } from './commands/update-character.command';
import { FIND_ALL_CHARACTERS_QUERY_RESULT } from './query-result/find-all-characters-query.result';
import { FIND_ONE_CHARACTER_QUERY_RESULT } from './query-result/find-one-by-episode-query.result';

@Module({
  imports: [CharactersRepositoryModule, CharactersStorageModule],
  providers: [
    { provide: INITIALIZE_CHARACTERS_COMMAND, useClass: CharactersApp},
    { provide: UPDATE_CHARACTER_COMMAND, useClass: CharactersApp},
    { provide: FIND_ALL_CHARACTERS_QUERY_RESULT, useClass: CharactersApp},
    { provide: FIND_ONE_CHARACTER_QUERY_RESULT, useClass: CharactersApp}
  ],
  exports: [
    INITIALIZE_CHARACTERS_COMMAND,
    UPDATE_CHARACTER_COMMAND,
    FIND_ALL_CHARACTERS_QUERY_RESULT,
    FIND_ONE_CHARACTER_QUERY_RESULT,
  ],
})
export class CharactersAppModule {}
