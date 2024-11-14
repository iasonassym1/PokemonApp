import React, { useState } from 'react';
import { FlatList, Text, View, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import PokemonCard from './PokemonCard';
import useFetchPokemon from '../services/PokemonData';

// List of types with lowercase starting letters
const types = [
  'fire', 'water', 'grass', 'electric', 'dragon', 
  'psychic', 'ghost', 'dark', 'steel', 'fairy'
];

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 20,
  },
  dropdown: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 5,
    width: '80%',
  },
  modalOption: {
    padding: 10,
    fontSize: 18,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalOptionSelected: {
    backgroundColor: '#ddd',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  paginationButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    margin: 5,
  },
  paginationButtonText: {
    fontSize: 16,
    color: '#333',
  },
});

const PokemonList = () => {
  const [selectedType, setSelectedType] = useState('fire');
  const [modalVisible, setModalVisible] = useState(false);
  const [page, setPage] = useState(1); // Page state for pagination
  const { pokemon, loading, error } = useFetchPokemon(selectedType);

  // Paginate the results: get only 10 Pokémon for the current page
  const itemsPerPage = 10;
  const paginatedPokemon = pokemon.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(pokemon.length / itemsPerPage);

  const handleTypeChange = (itemValue: string) => {
    setSelectedType(itemValue);
    setPage(1); // Reset to the first page when the type changes
    setModalVisible(false); // Close the modal after selection
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const nextPage = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  if (loading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  if (error) {
    return <Text style={styles.loadingText}>Error: {error.message}</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Dropdown Button */}
      <TouchableOpacity style={styles.dropdown} onPress={openModal}>
        <Text style={styles.dropdownText}>{selectedType}</Text>
      </TouchableOpacity>

      {/* Modal for selecting Pokémon type */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalView}>
          <View style={styles.modalContent}>
            <Text style={styles.dropdownText}>Select Pokémon Type</Text>
            {types.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.modalOption,
                  selectedType === type && styles.modalOptionSelected,
                ]}
                onPress={() => handleTypeChange(type)}
              >
                <Text>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Render the Pokémon list based on the selected type */}
      <FlatList
        data={paginatedPokemon}
        renderItem={({ item }) => <PokemonCard pokemon={item} />}
        keyExtractor={(item) => item.name}
      />

      {/* Pagination Controls */}
      <View style={styles.paginationContainer}>
        <TouchableOpacity 
          style={styles.paginationButton} 
          onPress={prevPage}
          disabled={page === 1}
        >
          <Text style={styles.paginationButtonText}>Previous</Text>
        </TouchableOpacity>
        <Text style={styles.paginationButtonText}>{`Page ${page} of ${totalPages}`}</Text>
        <TouchableOpacity style={styles.paginationButton} onPress={nextPage}>
          <Text style={styles.paginationButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PokemonList;
