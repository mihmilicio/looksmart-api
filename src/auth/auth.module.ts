import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { AuthController } from './auth.controller';
import { APP_GUARD } from '@nestjs/core';
import { SupabaseGuard } from 'src/supabase/supabase.guard';
import { PassportModule } from '@nestjs/passport';

@Module({
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: SupabaseGuard,
    },
  ],
  imports: [SupabaseModule, PassportModule],
  controllers: [AuthController],
})
export class AuthModule {}
