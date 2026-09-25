import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service.js';
import { PokemonController } from './pokemon.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Pokemon, PokemonSchema } from './entities/pokemon.entity.js';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [PokemonController],
  providers: [PokemonService],
  exports: [MongooseModule],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{
      name: Pokemon.name,
      schema: PokemonSchema
    }])
  ]
})
export class PokemonModule {}
