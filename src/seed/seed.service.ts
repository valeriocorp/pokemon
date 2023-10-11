import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter,
  ) {}
 
  async executeSeed() {
   const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');

   const pokemonToInsert: {name: string, no: number}[] = [];

   data.results.forEach((pokemonApi) => {
    const segments = pokemonApi.url.split('/');
    const no: number = +segments[segments.length - 2];
    console.log(`Creating pokemon ${ pokemonApi.name } with no ${ no }`);
    //const pokemon = await this.pokemonModel.create({ no, name: pokemonApi.name });
    pokemonToInsert.push({ no, name: pokemonApi.name });
   })
  await this.pokemonModel.insertMany(pokemonToInsert);
    return 'Seed executed';
  }
}
