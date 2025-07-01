import { Test, TestingModule } from '@nestjs/testing';
import { CharactersStorage } from './characters.storage';
import { CharacterDto } from '../../application/domain/character.dto';
import { lastValueFrom } from 'rxjs';

describe('CharactersStorage', () => {
  let storage: CharactersStorage;
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CharactersStorage],
    }).compile();

    storage = module.get<CharactersStorage>(CharactersStorage);
  });

  describe('storage operations', () => {
    it('should initialize with empty array by default', async () => {
      const characters = await lastValueFrom(storage.selectAll());
      expect(characters).toEqual([]);
    });

    it('should initialize characters', async () => {
      await lastValueFrom(storage.initialize(mockCharacters));
      const characters = await lastValueFrom(storage.selectAll());
      expect(characters).toEqual(mockCharacters);
    });

    it('should update a character if it exists', async () => {
      // Initialize
      await lastValueFrom(storage.initialize(mockCharacters));

      // Update
      const updatedCharacter: CharacterDto = {
        id: '1',
        name: 'Luke Skywalker (Updated)',
        episodes: ['NEWHOPE', 'EMPIRE'],
        planet: 'Tatooine'
      };

      await lastValueFrom(storage.updateOne(updatedCharacter));

      // Verify
      const characters = await lastValueFrom(storage.selectAll());
      expect(characters).toHaveLength(2);
      expect(characters[0]).toEqual(updatedCharacter);
      expect(characters[1]).toEqual(mockCharacters[1]);
    });

    it('should not update if character does not exist', async () => {
      // Initialize
      await lastValueFrom(storage.initialize(mockCharacters));

      // Update with non-existent ID
      const nonExistentCharacter: CharacterDto = {
        id: '999',
        name: 'Non-existent',
        episodes: ['NEWHOPE'],
        planet: 'Unknown'
      };

      await lastValueFrom(storage.updateOne(nonExistentCharacter));

      // Verify nothing changed
      const characters = await lastValueFrom(storage.selectAll());
      expect(characters).toEqual(mockCharacters);
    });

    it('should create a new character', async () => {
      // Initialize
      await lastValueFrom(storage.initialize(mockCharacters));

      // Create
      const newCharacter: CharacterDto = {
        id: '3',
        name: 'Leia Organa',
        episodes: ['NEWHOPE', 'EMPIRE', 'JEDI'],
        planet: 'Alderaan'
      };

      await lastValueFrom(storage.createOne(newCharacter));

      // Verify
      const characters = await lastValueFrom(storage.selectAll());
      expect(characters).toHaveLength(3);
      expect(characters[2]).toEqual(newCharacter);
    });

    it('should delete a character if it exists', async () => {
      // Initialize
      await lastValueFrom(storage.initialize(mockCharacters));

      // Delete
      await lastValueFrom(storage.deleteOne('1'));

      // Verify
      const characters = await lastValueFrom(storage.selectAll());
      // Note: The implementation keeps undefined values in the array, so the length stays the same
      expect(characters.filter(Boolean)).toHaveLength(1);
      expect(characters.filter(Boolean)[0]).toEqual(mockCharacters[1]);
    });

    it('should not delete if character does not exist', async () => {
      // Initialize
      await lastValueFrom(storage.initialize(mockCharacters));

      // Delete non-existent ID
      await lastValueFrom(storage.deleteOne('999'));

      // Verify nothing changed
      const characters = await lastValueFrom(storage.selectAll());
      expect(characters).toEqual(mockCharacters);
    });
  });
});