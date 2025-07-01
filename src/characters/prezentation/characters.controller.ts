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
import { Delete, Put } from '@nestjs/common/decorators/http/request-mapping.decorator';
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
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (starts from 1)',
    example: 1,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
    example: 10,
    type: Number,
  })
  findAll(
    @Query('episode') episode?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ): Observable<CharactersResponseDto> {
    if (episode) {
      return this.findOneCharacterQueryResult.findOne(episode).pipe(
        map((character: CharacterDto | undefined) => {
          return {
            characters: [character],
            pagination: {
              page: 1,
              pages: 1,
              total: 1,
              limit: 1
            }
          }
        })
      );
    }

    return this.findAllCharactersQueryResult.findAll(page, limit);
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

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an existing character' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the character to delete',
    example: '1',
  })
  @ApiResponse({ status: 200, description: 'Character deleted successfully', type: CharacterDto })
  @ApiResponse({ status: 404, description: 'Character not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  deleteCharacter(
    @Param('id') id: string,
  ): Observable<void> {

    return this.updateCharactersCommand.deleteCharacter(id);
  }
}
