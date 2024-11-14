import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Audio, AVPlaybackStatusSuccess } from "expo-av";
import * as Progress from "react-native-progress";
import { LinearGradient } from "expo-linear-gradient";

interface PokemonProps {
  pokemon: {
    name: string;
    url: string;
  };
  type: string;
}

const PokemonCard = ({ pokemon, type }: PokemonProps) => {
  const [pokemonImage, setPokemonImage] = useState("");
  const [pokemonStats, setPokemonStats] = useState({
    hp: 0,
    attack: 0,
    defense: 0,
    specialDefense: 0,
    specialAttack: 0,
    speed: 0,
    cry: null,
  });

  const rotation = useRef(new Animated.Value(0)).current; // Animated value for rotation

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      const response = await fetch(pokemon.url);
      const data = await response.json();
      setPokemonImage(data.sprites.front_default);
      const stats = data.stats.reduce((acc: any, stat: any) => {
        if (stat.stat.name === "hp") acc.hp = stat.base_stat;
        if (stat.stat.name === "attack") acc.attack = stat.base_stat;
        if (stat.stat.name === "defense") acc.defense = stat.base_stat;
        if (stat.stat.name === "special-defense")
          acc.specialDefense = stat.base_stat;
        if (stat.stat.name === "special-attack")
          acc.specialAttack = stat.base_stat;
        if (stat.stat.name === "speed") acc.speed = stat.base_stat;
        return acc;
      }, {});
      stats.cry = data.cries.latest ?? null;
      setPokemonStats(stats);
    };

    fetchPokemonDetails();
  }, [pokemon.url]);

  const playSound = async () => {
    const cryUrl = pokemonStats.cry;
    if (cryUrl) {
      const { sound } = await Audio.Sound.createAsync(
        { uri: cryUrl },
        { shouldPlay: true }
      );
      await sound.playAsync();

      sound.setOnPlaybackStatusUpdate((status) => {
        const playbackStatus = status as AVPlaybackStatusSuccess;
        if (playbackStatus.didJustFinish) {
          sound.unloadAsync();
        }
      });
    }
  };

  const handleImagePress = () => {
    // Start the rotation animation for 3 full spins
    Animated.sequence([
      Animated.timing(rotation, {
        toValue: 3, // 3 full rotations
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(rotation, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start();

    playSound();
  };

  // Interpolate rotation value to 1080 degrees for 3 full rotations
  const rotateInterpolation = rotation.interpolate({
    inputRange: [0, 3],
    outputRange: ["0deg", "1080deg"], // 3 full spins
  });

  const textColor = typeTextColors[type] || "#333"; // Fallback to dark color if type is not found

  return (
    <LinearGradient colors={typeGradients[type]} style={styles.card}>
      <Text style={[styles.name, { color: textColor }]}>
        {pokemon.name.toUpperCase()}
      </Text>
      <View style={styles.imageContainer}>
        {pokemonImage ? (
          <TouchableOpacity
            onPress={handleImagePress}
            style={styles.imageContainer}
          >
            <Animated.Image
              source={{ uri: pokemonImage }}
              style={[
                styles.image,
                { transform: [{ rotate: rotateInterpolation }] },
              ]}
            />
          </TouchableOpacity>
        ) : (
          <Text style={[styles.loadingText, { color: textColor }]}>
            Loading image...
          </Text>
        )}
      </View>
      <View style={styles.stats}>
        <StatBar label="HP" value={pokemonStats.hp} textColor={textColor} />
        <StatBar
          label="Attack"
          value={pokemonStats.attack}
          textColor={textColor}
        />
        <StatBar
          label="Defense"
          value={pokemonStats.defense}
          textColor={textColor}
        />
        <StatBar
          label="Sp. Atk"
          value={pokemonStats.specialAttack}
          textColor={textColor}
        />
        <StatBar
          label="Sp. Def"
          value={pokemonStats.specialDefense}
          textColor={textColor}
        />
        <StatBar
          label="Speed"
          value={pokemonStats.speed}
          textColor={textColor}
        />
      </View>
    </LinearGradient>
  );
};

const StatBar = ({
  label,
  value,
  textColor,
}: {
  label: string;
  value: number;
  textColor: string;
}) => (
  <View style={styles.statContainer}>
    <Text style={[styles.statLabel, { color: textColor }]}>{label}</Text>
    <Progress.Bar
      progress={value / 100}
      width={150}
      color="#6C757D"
      unfilledColor="#D3D3D3"
      borderColor="transparent"
    />
    <Text style={[styles.statValue, { color: textColor }]}>{value}</Text>
  </View>
);

const typeTextColors: Record<string, string> = {
  "All Types": "#333",
  fire: "#333",
  water: "#333",
  grass: "#333",
  electric: "#333",
  dragon: "black",
  psychic: "#333",
  ghost: "#FFFFFF",
  dark: "#FFFFFF",
  steel: "#333",
  fairy: "#333",
};

const typeGradients: Record<string, [string, string]> = {
  "All Types": ["#F0E68C", "#DAA520"],
  fire: ["#ffd966", "#ff6f61"],
  water: ["#ADD8E6", "#4682B4"],
  grass: ["#98FB98", "#32CD32"],
  electric: ["#FFFACD", "#FFD700"],
  dragon: ["#9370DB", "#8A2BE2"],
  psychic: ["#FFB6C1", "#DB7093"],
  ghost: ["#D8BFD8", "#8A2BE2"],
  dark: ["#A9A9A9", "#2F4F4F"],
  steel: ["#D3D3D3", "#A9A9A9"],
  fairy: ["#FFD1DC", "#FF69B4"],
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  imageContainer: {
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  image: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
  loadingText: {
    fontSize: 16,
  },
  stats: {
    width: "85%",
    alignItems: "center",
    marginTop: 10,
  },
  statContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 14,
    width: 70,
    textAlign: "right",
    marginRight: 8,
  },
  statValue: {
    fontSize: 14,
    marginLeft: 8,
  },
});

export default PokemonCard;
