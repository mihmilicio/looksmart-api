import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { DefaultExceptionDto } from 'src/exceptions/default-exception.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserDetailsService } from './user-details.service';
import { UserDetailsDto } from './dto/user-details.dto';
import { FileUploadFailedException } from 'src/exceptions/file-upload-failed.exception';

@Controller('user-details')
export class UserDetailsController {
  constructor(private readonly userDetailsService: UserDetailsService) {}

  @Post('avatar')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiUnprocessableEntityResponse({
    type: DefaultExceptionDto,
    description: 'Error saving avatar',
  })
  @ApiInternalServerErrorResponse({
    type: DefaultExceptionDto,
  })
  @UseInterceptors(FileInterceptor('image'))
  updateAvatar(@UploadedFile() image: Express.Multer.File, @Request() req) {
    try {
      return this.userDetailsService.updateAvatar(image, req.user.userId);
    } catch (err) {
      console.error(err);
      if (err instanceof FileUploadFailedException) {
        throw new HttpException(
          'Não foi possível fazer o upload da imagem',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      throw new HttpException(
        'Algo de errado aconteceu. Tente novamente',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiNotFoundResponse({
    type: DefaultExceptionDto,
  })
  @ApiInternalServerErrorResponse({
    type: DefaultExceptionDto,
  })
  async findOne(@Request() req: any) {
    try {
      const details = await this.userDetailsService.findOne(req.user.userId);

      if (details) {
        return details;
      }

      throw new NotFoundException('Não encontramos os dados deste usuário.');
    } catch (err) {
      console.error(err);
      if (err instanceof NotFoundException) {
        throw err;
      }

      throw new HttpException(
        'Algo de errado aconteceu. Tente novamente',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('location')
  @ApiNotFoundResponse({
    type: DefaultExceptionDto,
  })
  @ApiInternalServerErrorResponse({
    type: DefaultExceptionDto,
  })
  async updateLocation(
    @Body() userDetailsDto: UserDetailsDto,
    @Request() req: any,
  ) {
    try {
      return await this.userDetailsService.updateLocation(
        userDetailsDto.location,
        req.user.userId,
      );
    } catch (err) {
      console.error(err);

      throw new HttpException(
        'Algo de errado aconteceu. Tente novamente',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
