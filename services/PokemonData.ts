import { useState, useEffect } from 'react';

const useFetchPokemon = (type: string) => {
  const [pokemon, setPokemon] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("test")
        const apiRoot = `https://pokeapi.co/api/v2/type/${type}`
        console.log(apiRoot)
        const response = await fetch(apiRoot);
        console.log(response)

        const data = await response.json();
        console.log(data.pokemon)
        // Extract the list of Pokémon from the type response
        const pokemonList = data.pokemon.map((p: any) => p.pokemon);
        setPokemon(pokemonList);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [type]); // Re-fetch when the type changes

  return { pokemon, loading, error };
};

export default useFetchPokemon;
