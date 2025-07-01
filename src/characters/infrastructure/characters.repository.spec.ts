import { Test, TestingModule } from '@nestjs/testing';
import { CharactersRepository } from './characters.repository';
import { lastValueFrom } from 'rxjs';
import { CharacterDto } from '../application/domain/character.dto';

// Mock the characters.json data
jest.mock('./utils/characters.json', () => ({
  characters: [
    {
      name: 'Luke Skywalker',
      episodes: ['NEWHOPE', 'EMPIRE', 'JEDI'],
      planet: 'Tatooine'
    },
    {
      name: 'Darth Vader',
      episodes: ['NEWHOPE', 'EMPIRE', 'JEDI'],
      planet: 'Tatooine'
    }
  ]
}));

// Mock uuid to return predictable values
jest.mock('uuid', () => ({
  v4: jest.fn()
    .mockReturnValueOnce('uuid-1')
    .mockReturnValueOnce('uuid-2')
}));

describe('CharactersRepository', () => {
  let repository: CharactersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CharactersRepository],
    }).compile();

    repository = module.get<CharactersRepository>(CharactersRepository);
  });

  describe('getCharacters', () => {
    it('should return an array of characters with generated UUIDs', async () => {
      // Act
      const result = await lastValueFrom(repository.getCharacters());

      // Assert
      expect(result).toHaveLength(2);
      expect(result).toEqual([
        {
          name: 'Luke Skywalker',
          episodes: ['NEWHOPE', 'EMPIRE', 'JEDI'],
          planet: 'Tatooine',
          id: 'uuid-1'
        },
        {
          name: 'Darth Vader',
          episodes: ['NEWHOPE', 'EMPIRE', 'JEDI'],
          planet: 'Tatooine',
          id: 'uuid-2'
        }
      ]);
    });

    it('should return CharacterDto objects', async () => {
      // Act
      const result = await lastValueFrom(repository.getCharacters());

      // Assert
      result.forEach(character => {
        expect(character).toHaveProperty('id');
        expect(character).toHaveProperty('name');
        expect(character).toHaveProperty('episodes');
        expect(Array.isArray(character.episodes)).toBeTruthy();
      });
    });
  });
});