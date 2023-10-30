import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/common/constants';
import { AuthError } from '@supabase/supabase-js';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      return await this.authService.login(loginDto.email, loginDto.password);
    } catch (err) {
      if (err instanceof AuthError) {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      }

      throw new InternalServerErrorException();
    }
  }

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    try {
      return await this.authService.register(registerDto);
    } catch (err) {
      if (err instanceof AuthError) {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      }

      throw new InternalServerErrorException();
    }
  }
}
