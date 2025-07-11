import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { CharactersStateModule } from './characters/application/characters.state.module';
import { CharactersController } from './characters/presentation/characters.controller';

@Module({
  imports: [CharactersStateModule ],
  controllers: [CharactersController],
  providers: [AppService],
})
export class AppModule {}
