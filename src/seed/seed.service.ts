import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface.js';
import { Pokemon } from '../pokemon/entities/pokemon.entity.js';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AxiosAdapter } from '../common/adapters/axios.adapter.js';

@Injectable()
export class SeedService {


  constructor(    @InjectModel(Pokemon.name)
      private readonly pokemonModel: Model<Pokemon>,
      private readonly axiosAdapter: AxiosAdapter ) {}


 async executeSeed() {
    
    this.pokemonModel.deleteMany()
    const { results } = await this.axiosAdapter.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650')

    const pokemonToInsert: {name: string, no: number}[] = []

    results.forEach(({ name, url }) => {
      const segments = url.split('/')
      const no = +segments[segments.length - 2]
      pokemonToInsert.push({name, no})
    })

    await this.pokemonModel.insertMany(pokemonToInsert)

    return 'Seed Executed';
  }
}
