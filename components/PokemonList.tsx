import React, { useImperativeHandle, forwardRef } from "react";
import { FlatList, StyleSheet } from "react-native";
import PokemonCard from "./PokemonCard";

interface PokemonListProps {
  data: {
    name: string;
    url: string;
  }[];
  type: string;
  ListFooterComponent?: () => JSX.Element; // Make ListFooterComponent optional
}

const PokemonList = forwardRef(
  ({ data,type, ListFooterComponent }: PokemonListProps, ref) => {
    const flatListRef = React.useRef<FlatList>(null);

    // Expose a scrollToTop function to the parent component
    useImperativeHandle(ref, () => ({
      scrollToTop: () =>
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true }),
    }));

    return (
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={({ item }) => <PokemonCard pokemon={item} type={type} />}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={ListFooterComponent}
      />
    );
  }
);

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 20,
  },
});

export default PokemonList;