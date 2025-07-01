import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { AppModule } from './../src/app.module';

describe('CharactersController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /characters', () => {
    it('should return paginated list of characters', () => {
      return request(app.getHttpServer())
        .get('/characters')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('characters');
          expect(res.body).toHaveProperty('pagination');
          expect(Array.isArray(res.body.characters)).toBe(true);
          expect(res.body.pagination).toHaveProperty('page');
          expect(res.body.pagination).toHaveProperty('limit');
          expect(res.body.pagination).toHaveProperty('total');
          expect(res.body.pagination).toHaveProperty('pages');
        });
    });

    it('should respect pagination parameters', () => {
      return request(app.getHttpServer())
        .get('/characters?page=1&limit=2')
        .expect(200)
        .expect((res) => {
          expect(res.body.characters.length).toBeLessThanOrEqual(2);
          expect(res.body.pagination.page).toBe("1");
          expect(res.body.pagination.limit).toBe("2");
        });
    });

    it('should filter characters by episode', () => {
      return request(app.getHttpServer())
        .get('/characters?episode=NEWHOPE')
        .expect(200)
        .expect((res) => {
          if (res.body.characters.length > 0) {
            res.body.characters.forEach(character => {
              expect(character?.episodes).toContain('NEWHOPE');
            });
          }
        });
    });
  });

  describe('GET /characters/:name', () => {
    it('should return a character by name', () => {
      return request(app.getHttpServer())
        .get('/characters')
        .then(res => {
          if (res.body.characters.length > 0) {
            const character = res.body.characters[0];

            return request(app.getHttpServer())
              .get(`/characters/${encodeURIComponent(character.name)}`)
              .expect(200)
              .expect(res => {
                expect(res.body).toHaveProperty('name');
                expect(res.body.name).toEqual('Luke Skywalker');
                expect(res.body).toHaveProperty('id');
                expect(res.body).toHaveProperty('episodes');
                // expect(res.body).toHaveProperty('planet');
                // expect(res.body).toHaveProperty([]);
              });
          }
        });
    });

    // it('should return 404 for non-existent character', () => {
    //   return request(app.getHttpServer())
    //     .get('/characters/NonExistentCharacter123456')
    //     .expect(404);
    // });
  });

  describe('POST /characters', () => {
    it('should create a new character', () => {
      const newCharacter = {
        name: 'Test Character',
        episodes: ['NEWHOPE', 'EMPIRE'],
        planet: 'Test Planet'
      };

      return request(app.getHttpServer())
        .post('/characters')
        .send(newCharacter)
        .expect(201);
    });
  });

  describe('PUT /characters/:id', () => {
    it('should update an existing character', async () => {
      const getResponse = await request(app.getHttpServer()).get('/characters');

      if (getResponse.body.characters.length > 0) {
        const character = getResponse.body.characters[0];
        const updatedData = {
          name: `${character.name} Updated`,
          episodes: character.episodes,
          planet: character.planet
        };

        return request(app.getHttpServer())
          .put(`/characters/${character.id}`)
          .send(updatedData)
          .expect(200);
      }
    });
  });

  describe('DELETE /characters/:id', () => {
    it('should delete a character', async () => {
      const newCharacter = {
        name: 'Character To Delete',
        episodes: ['NEWHOPE'],
        planet: 'Test Planet'
      };

      await request(app.getHttpServer())
        .post('/characters')
        .send(newCharacter);

      const getResponse = await request(app.getHttpServer()).get('/characters');
      const characterToDelete = getResponse.body.characters.find(c => c.name === 'Character To Delete');

      if (characterToDelete) {
        return request(app.getHttpServer())
          .delete(`/characters/${characterToDelete.id}`)
          .expect(200);
      }
    });
  });
});