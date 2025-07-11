import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { CharactersAppModule } from './characters/application/characters.app.module';
import { CharactersController } from './characters/presentation/characters.controller';

@Module({
  imports: [CharactersAppModule ],
  controllers: [CharactersController],
  providers: [AppService],
})
export class AppModule {}
