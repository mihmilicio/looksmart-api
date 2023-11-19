export class GenerateLookRequestDto {
  closet: {
    id: string;
    type: string;
    season: string;
    usage: string;
    image: string;
  }[];
  season: string;
  usage: string;
  top?: string;
  bottom?: string;
  footwear?: string;
}
