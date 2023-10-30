import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    console.log(ExtractJwt.fromAuthHeaderAsBearerToken());
    console.log(configService.get('SUPABASE_JWT_SECRET'));
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('SUPABASE_JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    console.log(payload);
    return { userId: payload.sub, user: payload.user };
  }
}
