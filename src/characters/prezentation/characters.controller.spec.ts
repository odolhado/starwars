import { Test, TestingModule } from '@nestjs/testing';
import { CharactersController } from './characters.controller';
import { FIND_ONE_CHARACTER_QUERY_RESULT } from '../application/query-result/find-one-by-episode-query.result';
import { FIND_ALL_CHARACTERS_QUERY_RESULT } from '../application/query-result/find-all-characters-query.result';
import { CharacterDto, CharacterNewDto } from '../application/domain/character.dto';
import { lastValueFrom, of, take } from 'rxjs';
import { UPDATE_CHARACTER_COMMAND } from '../application/commands/update-character.command';
import { CharactersResponseDto } from '../application/domain/characters.response';
import { PaginationDto } from '../application/domain/pagination.dto';

describe('CharactersController', () => {
  let controller: CharactersController;

  const mockCharacter: CharacterDto = {
    id: '1',
    name: 'Luke Skywalker',
    episodes: ['NEWHOPE', 'EMPIRE']
  };
  const pagination: PaginationDto = {
    page: 1,
    pages: 1,
    total: 1,
    limit: 1
  };
  const mockCharacters: CharactersResponseDto = {
    characters: [mockCharacter],
    pagination: pagination
  };
  const mockUpdateCommand = {
    updateCharacter: jest.fn(() => of(undefined)),
    createCharacter: jest.fn(() => of(undefined)),
    deleteCharacter: jest.fn(() => of(undefined))
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CharactersController],
      providers: [
        {
          provide: UPDATE_CHARACTER_COMMAND,
          useValue: mockUpdateCommand
        },
        {
          provide: FIND_ONE_CHARACTER_QUERY_RESULT,
          useValue: {
            findOne: jest.fn((name) => of(mockCharacter))
          }
        },
        {
          provide: FIND_ALL_CHARACTERS_QUERY_RESULT,
          useValue: {
            findAll: jest.fn(() => of(mockCharacters))
          }
        }
      ],
    }).compile();

    controller = app.get<CharactersController>(CharactersController);
  });

  describe('characters API', () => {
    it('should return list of characters', async () => {
      const result = await lastValueFrom(controller.findAll());
      expect(result).toEqual(mockCharacters);
    });

    it('should filter characters by episode', async () => {
      const result = await lastValueFrom(controller.findAll('NEWHOPE'));
      expect(result).toEqual({ characters: [mockCharacter], pagination });
    });

    it('should update the character', async () => {
      const characterToUpdate: CharacterDto = {
        id: '1',
        name: 'Updated Luke',
        episodes: ['NEWHOPE']
      };

      await lastValueFrom(controller.updateCharacter('1', characterToUpdate));
      expect(mockUpdateCommand.updateCharacter).toHaveBeenCalledWith({
        ...characterToUpdate,
        id: '1'
      });
    });

    it('should create the character', async () => {
      const newCharacter: CharacterNewDto = {
        name: 'Rey',
        episodes: ['FORCE_AWAKENS']
      };

      jest.mock('uuid', () => ({
        v4: jest.fn().mockReturnValue('mock-uuid')
      }));

      await lastValueFrom(controller.createCharacter(newCharacter));
      expect(mockUpdateCommand.createCharacter).toHaveBeenCalledWith({
        ...newCharacter,
        id: expect.any(String)
      });
    });

    it('should find the character by name', async () => {
      const result = await lastValueFrom(controller.findOne('Luke Skywalker'));
      expect(result).toEqual(mockCharacter);
    });

    it('should delete the character', async () => {
      await lastValueFrom(controller.deleteCharacter('1'));
      expect(mockUpdateCommand.deleteCharacter).toHaveBeenCalledWith('1');
    });
  });
});
