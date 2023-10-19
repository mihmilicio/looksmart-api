import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { LookService } from './look.service';

@Controller('look')
export class LookController {
  constructor(private readonly lookService: LookService) {}

  @Get()
  generate() {
    try {
      return this.lookService.generate('Casual', 'Calor');
    } catch (err) {
      throw new HttpException(
        'Algo de errado aconteceu. Tente novamente',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
