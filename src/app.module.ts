import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PokemonModule } from './pokemon/pokemon.module.js';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module.js';
import { SeedModule } from './seed/seed.module.js';
import { ConfigModule } from '@nestjs/config';
import { EnvConfig } from './common/config/app.config.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [ EnvConfig ],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(import.meta.dirname, '..', 'public'),
    }),
    PokemonModule,
    CommonModule,
    MongooseModule.forRoot(process.env.MONGODB ?? '', {
      dbName: 'pokemonsdb'
    }),
    SeedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
}
