import { Body, Controller, Get, Inject, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CharactersResponseDto } from '../application/domain/characters.response';
import { CharacterDto, CharacterNewDto } from '../application/domain/character.dto';
import { map, Observable } from 'rxjs';
import { UPDATE_CHARACTER_COMMAND, UpdateCharactersInterface } from '../application/commands/update-character.command';
import {
  FIND_ALL_CHARACTERS_QUERY_RESULT,
  FindAllCharactersQueryResult
} from '../application/query-result/find-all-characters-query.result';
import {
  FIND_ONE_CHARACTER_QUERY_RESULT,
  FindOneCharacterQueryResult
} from '../application/query-result/find-one-by-episode-query.result';
import { Put } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { v4 as uuidv4 } from 'uuid';

@ApiTags('characters')
@Controller('characters')
export class CharactersController {
  constructor(
    @Inject(UPDATE_CHARACTER_COMMAND) private readonly updateCharactersCommand: UpdateCharactersInterface,
    @Inject(FIND_ONE_CHARACTER_QUERY_RESULT) private readonly findOneCharacterQueryResult: FindOneCharacterQueryResult,
    @Inject(FIND_ALL_CHARACTERS_QUERY_RESULT) private readonly findAllCharactersQueryResult: FindAllCharactersQueryResult) {
  }

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
  findAll(@Query('episode') episode?: string): Observable<CharactersResponseDto | CharacterDto | undefined> {
    if (episode) {
      return this.findOneCharacterQueryResult.findOne(episode);
    }
    return this.findAllCharactersQueryResult.findAll();
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
    return this.findOneCharacterQueryResult.findOne(name).pipe(map((character) => {
      if (!character) {
        throw new Error('Character not found');
      }
      return character;
    }));
  }

  @Post()
  @ApiOperation({ summary: 'Create a new character' })
  @ApiResponse({ status: 201, description: 'Character created successfully', type: CharacterNewDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  createCharacter(@Body() characterDto: CharacterNewDto): Observable<void> {
    const characterIdentified: CharacterDto = {
      ...characterDto,
      id: uuidv4()
    }

    return this.updateCharactersCommand.createCharacter(characterIdentified);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing character' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the character to update',
    example: '1',
  })
  @ApiResponse({ status: 200, description: 'Character updated successfully', type: CharacterDto })
  @ApiResponse({ status: 404, description: 'Character not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  updateCharacter(
    @Param('id') id: string,
    @Body() characterDto: CharacterDto
  ): Observable<void> {

    const characterWithId = { ...characterDto, id };

    return this.updateCharactersCommand.updateCharacter(characterWithId);
  }
}
