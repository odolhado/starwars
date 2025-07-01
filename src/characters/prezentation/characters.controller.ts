import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CharactersResponseDto } from '../application/domain/characters.response';
import { CharacterDto } from '../application/domain/character.dto';
import { map, Observable } from 'rxjs';
import { CharactersState } from '../application/state/characters.state';

@ApiTags('characters')
@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersState: CharactersState) {}

  @Get()
  @ApiOperation({ summary: 'Get all Star Wars characters' })
  @ApiResponse({
    status: 200,
    description: 'Returns all Star Wars characters',
    type: CharactersResponseDto,
  })
  @ApiQuery({
    name: 'episode',
    required: false,
    description: 'Filter characters by episode',
    example: '',
  })
  findAll(@Query('episode') episode?: string): Observable<CharactersResponseDto> {
    if (episode) {
      return this.charactersState.findByEpisode(episode);
    }
    return this.charactersState.findAll();
  }

  @Get(':name')
  @ApiOperation({ summary: 'Get a character by name' })
  @ApiParam({
    name: 'name',
    description: 'The name of the character',
    example: 'Luke Skywalker',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the character',
    type: CharacterDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Character not found',
  })
  findOne(@Param('name') name: string): Observable<CharacterDto> {
    return this.charactersState.findByName(name).pipe(map((character)=>{
      if (!character) {
        throw new Error('Character not found');
      }
      return character;
    }));
  }
}
