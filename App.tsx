import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, TouchableOpacity, Text, Modal, ScrollView } from 'react-native';
import PokemonList from './components/PokemonList';

const types = [
  'fire', 'water', 'grass', 'electric', 'dragon', 
  'psychic', 'ghost', 'dark', 'steel', 'fairy'
];

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1, // Ensures it uses full height and width
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  dropdown: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 16,
  },
  dropdownText: {
    fontSize: 16,
    fontWeight: 'bold',
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
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalOptionSelected: {
    backgroundColor: '#ddd',
  },
});

const App = () => {
  const [selectedType, setSelectedType] = useState('fire');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    setModalVisible(false);
  };

  const handleSearch = (text: string) => {
    setSearchTerm(text.toLowerCase());
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <TextInput
          placeholder="Search Pokémon"
          style={styles.input}
          onChangeText={handleSearch}
          value={searchTerm}
        />
        <TouchableOpacity style={styles.dropdown} onPress={openModal}>
          <Text style={styles.dropdownText}>Type: {selectedType}</Text>
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

        <PokemonList/>
      </View>
    </ScrollView>
  );
};

export default App;