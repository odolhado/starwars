import { Test, TestingModule } from '@nestjs/testing';
import { CharactersApp } from './characters.app';
import { CHARACTERS_REPOSITORY } from './ports/characters.repository';
import { CHARACTERS_STORAGE } from './ports/characters.storage';
import { CharacterDto } from './domain/character.dto';
import { lastValueFrom, of } from 'rxjs';
import { PaginationDto } from './domain/pagination.dto';

describe('CharactersApp', () => {
  let state: CharactersApp;

  const mockCharacters: CharacterDto[] = [
    {
      id: '1',
      name: 'Luke Skywalker',
      episodes: ['NEWHOPE', 'EMPIRE', 'JEDI'],
      planet: 'Tatooine'
    },
    {
      id: '2',
      name: 'Darth Vader',
      episodes: ['NEWHOPE', 'EMPIRE', 'JEDI'],
      planet: 'Tatooine'
    }
  ];
  const pagination: PaginationDto = {
    page: 1,
    pages: 1,
    total: 1,
    limit: 1
  };

  const mockRepository = {
    getCharacters: jest.fn(() => of(mockCharacters))
  };

  const mockStorage = {
    initialize: jest.fn(() => of(undefined)),
    updateOne: jest.fn(() => of(undefined)),
    createOne: jest.fn(() => of(undefined)),
    deleteOne: jest.fn(() => of(undefined)),
    selectAll: jest.fn(() => of(mockCharacters))
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CharactersApp,
        {
          provide: CHARACTERS_REPOSITORY,
          useValue: mockRepository
        },
        {
          provide: CHARACTERS_STORAGE,
          useValue: mockStorage
        }
      ],
    }).compile();

    state = module.get<CharactersApp>(CharactersApp);

    // Reset mocks before each test
    jest.clearAllMocks();
  });

  describe('updateCharacter', () => {
    it('should call storage updateOne with character', async () => {
      const character: CharacterDto = mockCharacters[0];

      await lastValueFrom(state.updateCharacter(character));

      expect(mockStorage.updateOne).toHaveBeenCalledWith(character);
      expect(mockStorage.updateOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('createCharacter', () => {
    it('should call storage createOne with character', async () => {
      const character: CharacterDto = {
        id: '3',
        name: 'Leia Organa',
        episodes: ['NEWHOPE', 'EMPIRE', 'JEDI'],
        planet: 'Alderaan'
      };

      await lastValueFrom(state.createCharacter(character));

      expect(mockStorage.createOne).toHaveBeenCalledWith(character);
      expect(mockStorage.createOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteCharacter', () => {
    it('should call storage deleteOne with character id', async () => {
      const characterId = '1';

      await lastValueFrom(state.deleteCharacter(characterId));

      expect(mockStorage.deleteOne).toHaveBeenCalledWith(characterId);
      expect(mockStorage.deleteOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('initializeCharacters', () => {
    it('should fetch characters from repository and initialize storage', async () => {
      await lastValueFrom(state.initializeCharacters());

      expect(mockRepository.getCharacters).toHaveBeenCalledTimes(1);
      expect(mockStorage.initialize).toHaveBeenCalledWith(mockCharacters);
      expect(mockStorage.initialize).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should return all characters from storage', async () => {
      const result = await lastValueFrom(state.findAll(1, 2));

      expect(mockStorage.selectAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        characters: mockCharacters,
        pagination: {
          ...pagination,
          limit: 2,
          pages: 1,
          total: 2,
        }
      });
    });
  });

  describe('findOne', () => {
    it('should find a character by name (case insensitive)', async () => {
      const result = await lastValueFrom(state.findOne('luke skywalker'));

      expect(mockStorage.selectAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockCharacters[0]);
    });

    it('should return undefined if character not found', async () => {
      const result = await lastValueFrom(state.findOne('Rey'));

      expect(mockStorage.selectAll).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
    });
  });
});