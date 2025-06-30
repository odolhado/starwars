import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CharactersService } from './characters.service';
import { CharactersResponseDto } from '../application/domain/characters.response';
import { CharacterDto } from '../application/domain/character.dto';

@ApiTags('characters')
@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

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
    example: 'NEWHOPE',
  })
  findAll(@Query('episode') episode?: string): CharactersResponseDto {
    if (episode) {
      return this.charactersService.findByEpisode(episode);
    }
    return this.charactersService.findAll();
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
  findOne(@Param('name') name: string): CharacterDto {
    const character = this.charactersService.findByName(name);
    if (!character) {
      throw new Error('Character not found');
    }
    return character;
  }
}
