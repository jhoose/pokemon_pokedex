import React, {useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import _Pokemon from './pokemon.json';
import _PokemonTypes from './pokemon-types.json';
import _Types from './types.json';
import "tailwindcss/tailwind.css";


// import {groupBy, keyBy} from 'lodash';

interface TypesResponse {
  id: number;
  identifier: string;
  generation_id: number;
  damage_class_id: number;
}

interface PokemonTypesResponse {
  pokemon_id: number,
  type_id: number,
  slot: number,
}

interface PokemonResponse {
  id: number;
  identifier: string;
  species_id: number;
  height: number;
  weight: number;
  base_experience: number | string;
  order: number | string;
  is_default: number;
}

const Pokemon = _Pokemon as PokemonResponse[];
const PokemonTypes = _PokemonTypes as PokemonTypesResponse[];

const Types = _Types as TypesResponse[];

interface PokemonListItem extends PokemonResponse {
  types: (PokemonTypesResponse & TypesResponse)[];
}

//  const example = {
//   id: number;
//   identifier: string;
//   species_id: number;
//   height: number;
//   weight: number;
//   base_experience: number | string;
//   order: number | string;
//   is_default: number;
//   types: [
//     {
//        id: number;
//       identifier: string;
//       generation_id: number;
//       damage_class_id: number;
//        pokemon_id: number,
//       type_id: number,
//       slot: number,
//     }
//   ]
// }


// Limit for items per page
const LIM = 20;
let lastPage: number;

const agrigatePokemon = (page: number): PokemonListItem[] => {
  // Return the list of pokemon, a PokemonListItem []
  // PokemonTypes' pokemon_id === Pokemon's id
  // PokemonTypes' type_id === Types' id.

  let newArray = [];

  // 1st loop
  for (let p = 0; p < Pokemon.length; p++) {

    // create a new pokemon object attribute called "types"
    // it will be an array
    // since many pokemon can fit into many catagories like "grass and fighting type"
    Pokemon[p]['types'] = [];

    // 2nd loop 
    for (let pt = 0; pt < PokemonTypes.length; pt++) {
      
      if (Pokemon[p].id === PokemonTypes[pt].pokemon_id) {
        Pokemon[p]['types'].push(PokemonTypes[pt]);

        // 3rd loop
        for (let t = 0; t < Types.length; t++) {

          if (PokemonTypes[pt].type_id === Types[t].id) {

            // bulbasaur pokemon is type 12 and 4
            // Types[t].id == 4)) {
            // .find(x => x.type_id === 12);
            var tempTypesIndex = Pokemon[p]['types'].findIndex(x => x.type_id === Types[t].id);
            Pokemon[p]['types'][tempTypesIndex].id = Types[t].id;
            Pokemon[p]['types'][tempTypesIndex].identifier = Types[t].identifier;
            Pokemon[p]['types'][tempTypesIndex].generation_id = Types[t].generation_id;
            Pokemon[p]['types'][tempTypesIndex].damage_class_id = Types[t].damage_class_id;

          } // end if statement type_id = id
        } // end 3rd loop
      } // end if statement within 2nd loop
    } // end 2nd for loop

    // console.log(Pokemon[0]);
    // console.log(Pokemon[5]);
    newArray.push(Pokemon[p]);
  } // end 1st for loop

  console.log(newArray);
  let pokemonArrayLength = newArray.length - 1;
  lastPage = Math.floor(pokemonArrayLength / LIM);
  // 7 maxium pages, starting at 140 index
  console.log('pokemon Array Length');
  console.log(pokemonArrayLength);
  console.log('last Page');
  console.log(lastPage);
  // since first page starts at 0 must add +1 to display page numbers
  // (technically ends on page 7 not 8)
  console.log('on page');
  console.log(page);

  var arrayIndexStart = 0;
  var arrayIndexEnd = 20;

  if (page !== 0) {
    arrayIndexStart = page * LIM;
    //   2 * 20 = 40
    arrayIndexEnd = arrayIndexStart + 20;
  } else {
    arrayIndexStart = 0;
    arrayIndexEnd = 20;
  }
  console.log('array Index Start');
  console.log(arrayIndexStart);
  console.log('array Index End');
  console.log(arrayIndexEnd);

  let pokemonPageArray = newArray.slice(arrayIndexStart,arrayIndexEnd);
  console.log('pokemon Page array');
  console.log(pokemonPageArray);

  // console.log(Pokemon);
  // console.log(PokemonTypes);
  // console.log(Types);
  // return [];
  return pokemonPageArray;
}


const usePokemonList = ({page}: {page: number}) => {
  return useQuery({
    queryKey: ['pokemon', page],
    queryFn: async () => await agrigatePokemon(page),
    staleTime: Infinity,
    cacheTime: Infinity
  }) as {data: PokemonListItem[] | undefined};
}


export default function App() {

  const [page, setPage] = useState(0);

  const {data} = usePokemonList({page});

  // tailwind is like bootstrap, documentation: https://tailwindcss.com/docs/padding
  // Made the CSS match DESIGN_SPEC.png
  return (
    <div className='px-6 bg-black'>
      <h1 className="text-white">Pokedex</h1>
      <ul className="flex flex-wrap">
        {data?.map((v, i) =>
          <li key={v.identifier} className="w-40 bg-white m-1 rounded grid justify-items-center">
            <h2 className="capitalize font-medium">{v.identifier}</h2>
            <img className="" src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${v.id}.png`} alt=""/>
            <div className="flex flex-row m-2 space-x-1.5">
              {v.types.map(type => {
                return <div className={`bg-${type.identifier} rounded px-3`} key={`${v.id}_${type.identifier}`}>
                  <span className="opacity-70 capitalize text-xs font-bold">{type.identifier}</span>
                </div>
              })}
            </div>
          </li>
        )}
      </ul>
      <div className="text-white pb-6 grid grid-flow-col">
        <div>
          <span className="text-white text-sm">Page: {page + 1}</span>
        </div>
        <div className="text-sm">
         <button className="disabled:opacity-50 px-3" disabled={page === 0} type="button" onClick={() => { setPage(p => p - 1)}}
          >Previous Page</button>
          <button className="disabled:opacity-50 px-3" disabled={page === lastPage} type="button" onClick={() => setPage(p => p + 1)}>Next Page</button>
        </div>
       
      </div>
    </div>
  );
}

/* <div className="text-white pb-6 grid grid-fr-auto"> */
 
// Tailwind Pokemon Type Class Lookup table.
// the class bg-fire applies the fire type background color.
const bgclasses = {
  fire: 'bg-fire',
  normal: 'bg-normal',
  water: 'bg-water',
  fighting: 'bg-fighting',
  flying: 'bg-flying',
  poison: 'bg-poison',
  ground: 'bg-ground',
  rock: 'bg-rock',
  bug: 'bg-bug',
  ghost: 'bg-ghost',
  steel: 'bg-steel',
  grass: 'bg-grass',
  electric: 'bg-electric',
  psychic: 'bg-psychic',
  ice: 'bg-ice',
  dragon: 'bg-dragon',
  dark: 'bg-dark',
  fairy: 'bg-fairy',
};
