import { Injectable } from '@nestjs/common';
import { AuthTokenResponse } from '@supabase/supabase-js';
import { Supabase } from 'src/supabase/supabase';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly supabase: Supabase) {}

  async login(
    email: string,
    password: string,
  ): Promise<AuthTokenResponse['data']> {
    const { data, error } = await this.supabase
      .getClient()
      .auth.signInWithPassword({ email, password });

    console.log(data);
    console.log(error);

    if (error) {
      throw error;
    }

    return data;
  }

  async register(registerDto: RegisterDto): Promise<AuthTokenResponse['data']> {
    // TODO validar username único
    const { data, error } = await this.supabase.getClient().auth.signUp({
      email: registerDto.email,
      password: registerDto.password,
      options: {
        data: {
          username: registerDto.username,
        },
      },
    });

    console.log(data);
    console.log(error);

    if (error) {
      throw error;
    }

    return data;
  }
}
