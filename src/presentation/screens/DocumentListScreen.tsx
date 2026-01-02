import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Appbar, List, FAB, Searchbar, Text, Divider, ActivityIndicator } from 'react-native-paper';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../state/StoreContext';
import { useNavigation } from '@react-navigation/native';
import { Document } from '../../core/entities/Document';

export const DocumentListScreen = observer(() => {
    const { documentStore } = useStores();
    const navigation = useNavigation<any>();
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        documentStore.loadDocuments();
    }, []);

    const filteredDocs = documentStore.documents.filter(d =>
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const renderItem = ({ item }: { item: Document }) => (
        <List.Item
            title={item.title}
            description={`${item.mimeType} • ${item.createdAt.toLocaleDateString()}`}
            left={props => <List.Icon {...props} icon={item.mimeType.includes('image') ? 'image' : 'file-document'} />}
            onPress={() => {
                documentStore.selectDocument(item.id);
                navigation.navigate('DocumentDetail', { id: item.id });
            }}
        />
    );

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.Content title="Documents" />
            </Appbar.Header>

            <Searchbar
                placeholder="Search documents..."
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchBar}
            />

            {documentStore.isLoading && <ActivityIndicator animating={true} style={styles.loader} />}

            {!documentStore.isLoading && filteredDocs.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text variant="bodyLarge">No documents found</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredDocs}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    ItemSeparatorComponent={() => <Divider />}
                />
            )}

            <FAB
                icon="plus"
                style={styles.fab}
                onPress={() => navigation.navigate('DocumentAdd')} // Needs implementation
            />
        </View>
    );
});

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    searchBar: { margin: 16 },
    loader: { margin: 20 },
    emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    fab: { position: 'absolute', margin: 16, right: 0, bottom: 0 },
});
