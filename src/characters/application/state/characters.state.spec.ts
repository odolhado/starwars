import { Test, TestingModule } from '@nestjs/testing';
import { CharactersState } from './characters.state';
import { CHARACTERS_REPOSITORY } from '../ports/characters.repository';
import { CHARACTERS_STORAGE } from '../ports/characters.storage';
import { CharacterDto } from '../domain/character.dto';
import { lastValueFrom, of } from 'rxjs';
import { CharactersResponseDto } from '../domain/characters.response';

describe('CharactersState', () => {
  let state: CharactersState;

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
        CharactersState,
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

    state = module.get<CharactersState>(CharactersState);

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
      const result = await lastValueFrom(state.findAll());

      const expected: CharactersResponseDto = {
        characters: mockCharacters
      };

      expect(mockStorage.selectAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expected);
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