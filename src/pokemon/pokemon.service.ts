import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dto/pagimation.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService,
  ) {
    console.log(configService.get('mongodb'));
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    
    try{
      const pokemon = await this.pokemonModel.create(createPokemonDto);

      return pokemon;
    } catch (error) {
      this.handleException(error);
    }
   
  }

  findAll(paginationDto: PaginationDto) {
    
    const { limit = 10, offset = 0 } = paginationDto;

    return this.pokemonModel.find()
    .limit(limit)
    .skip(offset)
    .sort({ no: 1 })
    .select('-_id -__v');
  }

  async findOne(term: string) {
   let pokemon: Pokemon;

   // Check if term is a number
   if (!isNaN(+term)) {
    //  Find by no
     pokemon = await this.pokemonModel.findOne({ no: +term });
   }

    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    // Find by name
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase().trim()});
    }

   if (!pokemon) {
    throw new NotFoundException(`Pokemon with term ${ term } not found`);
   }
   return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);
    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    }


    try {
      await pokemon.updateOne(updatePokemonDto, { new: true });
      return {...pokemon.toJSON(), ...updatePokemonDto};
    } catch (error) {
      this.handleException(error);
    }
  }

  async remove(id: string) {
    // const pokemon = await  this.findOne(id);
    // await pokemon.deleteOne();
    // const result = await this.pokemonModel.findByIdAndDelete(id);
    // if (!result) {
    //   throw new NotFoundException(`Pokemon with id ${ id } not found`);
    // }

    const result = await this.pokemonModel.deleteOne({ _id: id });
    
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Pokemon with id ${ id } not found`);
    }
    return result;
  }

  private handleException(error: any) {
    console.log(error);
    if (error.code === 11000) {
      throw new BadRequestException(`Pokemon exists in database ${ JSON.stringify(error.keyValue) }`);
    }
    console.log(error);
    throw new InternalServerErrorException(`Can't create pokemon`)   
  }
}
