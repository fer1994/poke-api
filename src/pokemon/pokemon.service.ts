import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto.js';
import { UpdatePokemonDto } from './dto/update-pokemon.dto.js';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity.js';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {

  private defaultLimit: number;

  constructor( 
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService
  ) {
    this.defaultLimit = this.configService.get<number>('defaultLimit') ?? 10
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase()

    try {

      const pokemon = await this.pokemonModel.create(createPokemonDto)
      return pokemon
    } catch (error: any) {
       this.handlerExceptions(error)
    }
  }

  async findAll(page: number = 1, size?: number) {
    const sizeAux = size ?? this.defaultLimit
    const offset = ((page-1) * sizeAux)

    return await this.pokemonModel.find()
    .limit(sizeAux).skip(offset).sort({ no: 1}).
    select('-__v')
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
