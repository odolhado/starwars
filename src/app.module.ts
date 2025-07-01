import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CharactersStateModule } from './characters/application/state/characters.state.module';
import { CharactersModule } from './characters/prezentation/characters.module';

@Module({
  imports: [CharactersStateModule, CharactersModule ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
