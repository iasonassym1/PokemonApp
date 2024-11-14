import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, ActivityIndicator, StyleSheet, Text, TouchableOpacity, Modal, Image } from 'react-native';
import PokemonList from './components/PokemonList';
import useFetchPokemon from './services/PokemonData';

interface TypeSelectionModalProps {
  visible: boolean;
  selectedType: string;
  onSelectType: (type: string) => void;
  onClose: () => void;
}

const TypeSelectionModal: React.FC<TypeSelectionModalProps> = ({ visible, selectedType, onSelectType, onClose }) => (
  <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
    <TouchableOpacity style={styles.modalOverlay} onPress={onClose}>
      <View style={styles.modalContent}>
        {types.map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.modalOption, selectedType === type && styles.modalOptionSelected]}
            onPress={() => onSelectType(type)}
          >
            {typeImages[type] && <Image source={typeImages[type]} style={styles.typeImage} />}
            <Text style={styles.modalOptionText}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </TouchableOpacity>
  </Modal>
);

// Define a type that includes all possible keys for typeImages
type PokemonTypeImages = {
  [key in 'fire' | 'water' | 'grass' | 'electric' | 'dragon' | 'psychic' | 'ghost' | 'dark' | 'steel' | 'fairy' | 'All Types']: any;
};

// Apply the type to typeImages
const typeImages: PokemonTypeImages = {
  fire: require('./assets/images/fire.png'),
  water: require('./assets/images/water.png'),
  grass: require('./assets/images/grass.png'),
  electric: require('./assets/images/electric.png'),
  dragon: require('./assets/images/dragon.png'),
  psychic: require('./assets/images/psychic.png'),
  ghost: require('./assets/images/ghost.png'),
  dark: require('./assets/images/dark.png'),
  steel: require('./assets/images/steel.png'),
  fairy: require('./assets/images/fairy.png'),
  'All Types': null,
};

// Define `types` as a readonly array to ensure each type is treated as a literal
const types = ['All Types', 'fire', 'water', 'grass', 'electric', 'dragon', 'psychic', 'ghost', 'dark', 'steel', 'fairy'] as const;


// Define the interface for the PokemonList ref
interface PokemonListRef {
  scrollToTop: () => void;
}

const App = () => {
  const [selectedType, setSelectedType] = useState('All Types');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const { pokemon, loading, error } = useFetchPokemon(selectedType === 'All Types' ? '' : selectedType);

  const itemsPerPage = 10;
  const pokemonListRef = useRef<PokemonListRef>(null);

  const filteredPokemon = pokemon.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const paginatedPokemon = filteredPokemon.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filteredPokemon.length / itemsPerPage);

  const nextPage = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
      pokemonListRef.current?.scrollToTop();
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
      pokemonListRef.current?.scrollToTop();
    }
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    setPage(1);
    pokemonListRef.current?.scrollToTop();
    setModalVisible(false);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setPage(1); // Reset page to 1 when clearing the search
    pokemonListRef.current?.scrollToTop();
  };

  // New useEffect to reset the page when searchTerm changes
  useEffect(() => {
    setPage(1); // Reset to page 1 on search term change
    pokemonListRef.current?.scrollToTop();
  }, [searchTerm]);

  const renderFooter = () => (
    <View style={styles.paginationContainer}>
      <TouchableOpacity style={styles.paginationButton} onPress={prevPage} disabled={page === 1}>
        <Text style={styles.paginationButtonText}>Previous</Text>
      </TouchableOpacity>
      <Text style={[styles.paginationButtonText, styles.pageInfoText]}>{`Page ${page} of ${totalPages}`}</Text>
      <TouchableOpacity style={styles.paginationButton} onPress={nextPage} disabled={page === totalPages}>
        <Text style={styles.paginationButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
  
  return (
    <View style={styles.container}>
      {/* Search and Dropdown Selection */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search Pokémon"
          style={styles.input}
          onChangeText={setSearchTerm}
          value={searchTerm}
        />
        <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
          <Text style={styles.clearButtonText}>Clear Text</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dropdown} onPress={() => setModalVisible(true)}>
          <Text style={styles.dropdownText}>{selectedType}</Text>
        </TouchableOpacity>
      </View>
  
      {/* Type Selection Modal */}
      <TypeSelectionModal
        visible={modalVisible}
        selectedType={selectedType}
        onSelectType={handleTypeChange}
        onClose={() => setModalVisible(false)}
      />
  
      {/* Pokémon List or No Results Image */}
      {loading ? (
        <ActivityIndicator style={styles.loadingIndicator} />
      ) : error ? (
        <Text style={styles.errorText}>Error: {error.message}</Text>
      ) : filteredPokemon.length === 0 ? (
        <Image source={require('./assets/images/errorImage.png')} style={styles.noResultsImage} />
      ) : (
        <PokemonList
          ref={pokemonListRef}
          data={paginatedPokemon}
          ListFooterComponent={filteredPokemon.length > 0 ? renderFooter : undefined}
        />
      )}
    </View>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'red',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    backgroundColor: 'white',
  },
  clearButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: '#f0f0f0', // Same as dropdown
    borderRadius: 5, // Same as dropdown
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16, // Same as dropdownText
    fontWeight: 'bold', // Same as dropdownText
    color: '#333',
  },
  dropdown: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 5,
    width: '30%',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalOptionSelected: {
    backgroundColor: '#ddd',
  },
  modalOptionText: {
    fontSize: 16,
    textAlign: 'auto',
  },
  typeImage: {
    width: 30,
    height: 30,
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  paginationButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  paginationButtonText: {
    fontSize: 16,
    color: '#333',
  },
  pageInfoText: {
    flex: 1,
    textAlign: 'center',
  },
  loadingIndicator: {
    marginTop: 20,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'red',
  },
  noResultsText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'gray',
    marginTop: 20,
  },
  noResultsImage: {
    width: 300,      // Adjust width as needed
    height: 400,     // Adjust height as needed
    alignSelf: 'center',
    marginTop: 50,
  },
});

export default App;
