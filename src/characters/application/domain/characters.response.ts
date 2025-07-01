import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { CharacterDto } from './character.dto';
import { PaginationDto } from './pagination.dto';

export class CharactersResponseDto {
  @ApiProperty({
    description: 'List of Star Wars characters',
    type: [CharacterDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CharacterDto)
  characters: CharacterDto[];

  @ApiProperty({ type: PaginationDto, description: 'Pagination' })
  pagination: PaginationDto;
}
