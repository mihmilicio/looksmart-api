import { ClothingItemReferenceDto } from './clothing-item-reference.dto';

export class LookDto {
  usage: string;
  season: string;
  lowConfiability: boolean;
  top: ClothingItemReferenceDto;
  bottom: ClothingItemReferenceDto;
  footwear: ClothingItemReferenceDto;
}
