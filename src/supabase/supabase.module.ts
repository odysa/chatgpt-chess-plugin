import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Supabase } from './supabase';

@Module({
  imports: [ConfigModule],
  providers: [Supabase],
  exports: [Supabase],
})
export class SupabaseModule {}
