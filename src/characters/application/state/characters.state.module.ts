import { Module } from '@nestjs/common';
import { CharactersState } from './characters.state';

@Module({
  providers: [CharactersState],
  exports: [CharactersState],
})
export class CharactersStateModule {}
