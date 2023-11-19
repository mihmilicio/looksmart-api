import { ClothingItemReferenceDto } from 'src/look/dto/clothing-item-reference.dto';

export class GenerateLookResponseDto {
  top: ClothingItemReferenceDto;
  bottom: ClothingItemReferenceDto;
  footwear: ClothingItemReferenceDto;
  percentage: number;
}
