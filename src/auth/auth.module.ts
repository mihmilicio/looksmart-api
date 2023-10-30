import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { AuthController } from './auth.controller';

@Module({
  providers: [AuthService],
  imports: [SupabaseModule],
  controllers: [AuthController],
})
export class AuthModule {}
