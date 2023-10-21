export enum ClothingItemCategoryEnum {
  Top = 'cima',
  Bottom = 'baixo',
  Footwear = 'calcado',
}

export const clothingItemsInCategory = (
  category: ClothingItemCategoryEnum,
): Array<string> => {
  if (category == ClothingItemCategoryEnum.Top) {
    return [
      'Blazer',
      'Body',
      'Moletom',
      'Manga comprida',
      'Agasalho',
      'Polo',
      'Camisa',
      'Camiseta',
      'Blusa',
      'Regata',
    ];
  }

  if (category == ClothingItemCategoryEnum.Bottom) {
    return ['Calças', 'Shorts', 'Saia'];
  }

  return ['Calçados'];
};
