import { useState, useEffect } from 'react';

interface Pokemon {
  name: string;
  url: string;
}

interface PokemonTypeResponse {
  pokemon: { pokemon: Pokemon }[];
}

interface PokemonAllResponse {
  results: Pokemon[];
}

const types = ['fire', 'water', 'grass', 'electric', 'dragon', 'psychic', 'ghost', 'dark', 'steel', 'fairy'];

const useFetchPokemon = (type: string) => {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      setLoading(true);
      setError(null);

      try {
        let pokemonList: Pokemon[] = [];

        if (type === '' || type === 'All Types') {
          // Fetch all types individually to include multi-type Pokémon
          const allTypePromises = types.map(async (type) => {
            const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
            const data: PokemonTypeResponse = await response.json();
            return data.pokemon.map((p) => p.pokemon);
          });

          // Wait for all type data and combine results
          const allTypesPokemon = (await Promise.all(allTypePromises)).flat();

          // Remove duplicates by using a Set
          const uniquePokemonMap = new Map<string, Pokemon>();
          allTypesPokemon.forEach((p) => uniquePokemonMap.set(p.name, p));
          pokemonList = Array.from(uniquePokemonMap.values());
        } else {
          // Fetch Pokémon of the specific type and include those with secondary types
          const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
          const data: PokemonTypeResponse = await response.json();
          pokemonList = data.pokemon.map((p) => p.pokemon);
        }

        setPokemon(pokemonList);
      } catch (error) {
        setError(error instanceof Error ? error : new Error("An error occurred"));
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [type]);

  return { pokemon, loading, error };
};

export default useFetchPokemon;