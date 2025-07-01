import { Module } from '@nestjs/common';
import { CharactersController } from './characters.controller';
import { CharactersStateModule } from '../application/state/characters.state.module';

@Module({
  controllers: [CharactersController],
  imports: [CharactersStateModule],
})
export class CharactersModule {}
