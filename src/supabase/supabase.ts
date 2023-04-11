import { Injectable, Logger, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({ scope: Scope.DEFAULT })
export class Supabase {
  private readonly logger = new Logger(Supabase.name);
  private clientInstance: SupabaseClient;

  constructor(private readonly configService: ConfigService) { }

  getClient() {
    this.logger.log('getting supabase client...');
    if (this.clientInstance) {
      this.logger.log('client exists - returning for current Scope.REQUEST');
      return this.clientInstance;
    }

    this.logger.log('initialising new supabase client for new Scope.REQUEST');

    this.clientInstance = createClient(
      this.configService.get('SUPABASE_URL'),
      this.configService.get('SUPABASE_KEY'),
    );
    return this.clientInstance;
  }
}
