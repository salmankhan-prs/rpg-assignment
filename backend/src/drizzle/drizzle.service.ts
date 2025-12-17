import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

@Injectable()
export class DrizzleService implements OnModuleInit {
  public db!: PostgresJsDatabase<typeof schema>;
  private client!: postgres.Sql;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const databaseUrl = this.configService.get<string>('DATABASE_URL');
    if (!databaseUrl) {
      throw new Error('DATABASE_URL is not defined');
    }

    // Create postgres client
    this.client = postgres(databaseUrl, { ssl: 'require' });

    // Create drizzle instance with schema
    this.db = drizzle(this.client, { schema });

    console.log('Database connected successfully');
  }
}

