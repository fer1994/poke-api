import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto.js';
import { UpdatePokemonDto } from './dto/update-pokemon.dto.js';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity.js';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {

  constructor( 
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon> 
  ) { }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase()

    try {

      const pokemon = await this.pokemonModel.create(createPokemonDto)
      return pokemon
    } catch (error: any) {
       this.handlerExceptions(error)
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(id: string) {

    let pokemon: Pokemon | null = null;
    
    if( !isNaN(+id)) {
      pokemon = await this.pokemonModel.findOne({no : +id})
    }


    if( !pokemon && isValidObjectId(id)) {
      pokemon = await this.pokemonModel.findById(id)
    }

    if(!pokemon) {
      pokemon = await this.pokemonModel.findOne({name : id.toLowerCase().trim()})
    }

    if(!pokemon) {
      throw new NotFoundException(`Pokemon with term '${id}' not found`)
    }

    return pokemon
  }

  async update(id: string, updatePokemonDto: UpdatePokemonDto) {
    try{

    const pokemon = await this.findOne(id);

    if(updatePokemonDto.name) updatePokemonDto.name = updatePokemonDto.name.toLowerCase()
 
    await pokemon.updateOne(updatePokemonDto)
    return {...pokemon.toJSON(),...updatePokemonDto}
    }catch (error: any) {
      this.handlerExceptions(error)
    }
  }

  async remove(id: string) {
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id})

    if(deletedCount === 0) {
      throw new BadRequestException(`Pokemon by id ${id} not found`)
    }

    return;
  }

  private handlerExceptions( error: any ) {

      if(error.code === 11000) {
        throw new BadRequestException(`Ya existe ese pokemon en la BD ${ JSON.stringify(error.keyValue)}`)
      }

      throw new InternalServerErrorException('Cant create pokemon - Check logs')
  }
}
