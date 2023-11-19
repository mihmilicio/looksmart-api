import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { ArticleDto } from './dto/article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  async create(dto: ArticleDto): Promise<Article> {
    return this.articleRepository.save({ ...dto });
  }

  async update(id: string, dto: ArticleDto): Promise<Article> {
    const article = new Article();
    article.title = dto.title;
    article.subtitle = dto.subtitle;
    article.imageUrl = dto.imageUrl;
    article.imageDescription = dto.imageDescription;
    article.body = dto.body;
    article.category = dto.category;

    await this.articleRepository.update({ id }, article);
    return this.articleRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.articleRepository.delete(id);
  }

  findAll(): Promise<Article[]> {
    return this.articleRepository.find();
  }

  findOne(id: string): Promise<Article | null> {
    return this.articleRepository.findOneBy({ id });
  }
}
