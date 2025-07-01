import { Module } from '@nestjs/common';
import { CharactersState } from './characters.state';
import { CharactersRepositoryModule } from '../../infrastructure/characters.repository.module';
import { CharactersStorageModule } from '../../infrastructure/storage/characters.storage.module';

@Module({
  imports: [CharactersRepositoryModule, CharactersStorageModule],
  providers: [CharactersState],
  exports: [CharactersState],
})
export class CharactersStateModule {}
