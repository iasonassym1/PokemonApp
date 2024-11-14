import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface PokemonProps {
  pokemon: {
    name: string;
    url: string;
  };
}

const typeColors: { [key: string]: string } = {
  fire: '#f08030',
  water: '#6390F0',
  grass: '#7AC74C',
  electric: '#F7D02C',
  dragon: '#6F35FC',
  psychic: '#F95587',
  ghost: '#735797',
  dark: '#705746',
  steel: '#B7B7D0',
  fairy: '#F6A8B5',
  normal: '#A8A878',
  ice: '#98D8D8',
};

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000', // Name in black
    textTransform: 'capitalize',
    marginBottom: 10,
    textAlign: 'center',
  },
  image: {
    width: 150, // Set image size here
    height: 150,
    resizeMode: 'contain',
    marginBottom: 15,
  },
  statContainer: {
    width: '100%',
    marginTop: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  statValue: {
    fontSize: 14,
    color: '#555',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
});

const PokemonCard = ({ pokemon }: PokemonProps) => {
  const [pokemonImage, setPokemonImage] = useState('');
  const [pokemonStats, setPokemonStats] = useState({
    hp: 0,
    attack: 0,
    defense: 0,
  });
  const [pokemonType, setPokemonType] = useState<string>('');

  // Set the type color based on the Pokémon type, defaulting to a fallback color
  const typeColor = pokemonType ? typeColors[pokemonType.toLowerCase()] : '#f9f9f9'; // Default to light gray if type is not found

  // Calculate a contrasting color for the stats container (darker shade of the type color)
  const getContrastedColor = (color: string) => {
    if (!color) return '#ccc'; // Default color in case of undefined color

    let r = parseInt(color.slice(1, 3), 16);
    let g = parseInt(color.slice(3, 5), 16);
    let b = parseInt(color.slice(5, 7), 16);
    
    // Calculate the average brightness of the color
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    // If brightness is higher (lighter color), darken it for contrast; otherwise, lighten it
    if (brightness > 127) {
      r = Math.max(r - 50, 0);
      g = Math.max(g - 50, 0);
      b = Math.max(b - 50, 0);
    } else {
      r = Math.min(r + 50, 255);
      g = Math.min(g + 50, 255);
      b = Math.min(b + 50, 255);
    }

    // Return the new hex color
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  const contrastedStatsColor = getContrastedColor(typeColor);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      const response = await fetch(pokemon.url);
      const data = await response.json();
      setPokemonImage(data.sprites.front_default);

      // Extract stats from the API response
      const stats = data.stats.reduce((acc: any, stat: any) => {
        if (stat.stat.name === 'hp') acc.hp = stat.base_stat;
        if (stat.stat.name === 'attack') acc.attack = stat.base_stat;
        if (stat.stat.name === 'defense') acc.defense = stat.base_stat;
        return acc;
      }, {});

      setPokemonStats(stats);

      // Get the type of the Pokémon from the response
      if (data.types && data.types.length > 0) {
        setPokemonType(data.types[0].type.name); // Get the first type (since Pokémon can have more than one type)
      }
    };

    fetchPokemonDetails();
  }, [pokemon.url]);

  // Dynamically apply styles here
  const dynamicStyle = {
    backgroundColor: `${typeColor}40`, // Light background with some transparency
    borderColor: typeColor,           // Border color based on type
  };

  return (
    <View style={[{ 
      alignItems: 'center', 
      padding: 15, 
      margin: 10, 
      borderWidth: 1, 
      borderRadius: 8,
      elevation: 2, // adds a shadow on Android
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 }, // adds a shadow on iOS
      shadowOpacity: 0.3,
      shadowRadius: 3,
      ...dynamicStyle // Add the dynamic background color and border color
    }]}>
      {/* Pokémon Name */}
      <Text style={styles.header}>{pokemon.name}</Text>

      {/* Pokémon Image */}
      {pokemonImage ? (
        <Image source={{ uri: pokemonImage }} style={styles.image} />
      ) : (
        <Text>Loading image...</Text>
      )}

      {/* Pokémon Stats */}
      <View style={[styles.statContainer, { backgroundColor: contrastedStatsColor }]}>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>HP:</Text>
          <Text style={styles.statValue}>{pokemonStats.hp}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Attack:</Text>
          <Text style={styles.statValue}>{pokemonStats.attack}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Defense:</Text>
          <Text style={styles.statValue}>{pokemonStats.defense}</Text>
        </View>
      </View>
    </View>
  );
};

export default PokemonCard;
