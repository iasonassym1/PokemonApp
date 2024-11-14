import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Svg, { Image as SvgImage } from 'react-native-svg';

interface PokemonProps {
  pokemon: {
    name: string;
    url: string;
  };
}

const PokemonCard = ({ pokemon }: PokemonProps) => {
  const [pokemonImage, setPokemonImage] = useState('');
  const [pokemonStats, setPokemonStats] = useState({
    hp: 0,
    attack: 0,
    defense: 0,
  });

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      const response = await fetch(pokemon.url);
      const data = await response.json();
      setPokemonImage(data.sprites.front_default);
      const stats = data.stats.reduce((acc: any, stat: any) => {
        if (stat.stat.name === 'hp') acc.hp = stat.base_stat;
        if (stat.stat.name === 'attack') acc.attack = stat.base_stat;
        if (stat.stat.name === 'defense') acc.defense = stat.base_stat;
        return acc;
      }, {});
      setPokemonStats(stats);
    };

    fetchPokemonDetails();
  }, [pokemon.url]);

  return (
    <View style={styles.card}>
      <Text style={styles.name}>{pokemon.name}</Text>
      <View style={styles.imageContainer}>
        {pokemonImage ? (
          <Image source={{ uri: pokemonImage }} style={styles.image} />
        ) : (
          <Text>Loading image...</Text>
        )}
      </View>
      <View style={styles.stats}>
        <Text>HP: {pokemonStats.hp}</Text>
        <Text>Attack: {pokemonStats.attack}</Text>
        <Text>Defense: {pokemonStats.defense}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: '#f8f8f8',
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageContainer: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  svgBackground: {
    position: 'absolute', // Make the SVG a background by positioning it absolutely
    top: 0,
    left: 0,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  stats: {
    marginTop: 8,
    alignItems: 'center',
  },
});

export default PokemonCard;
