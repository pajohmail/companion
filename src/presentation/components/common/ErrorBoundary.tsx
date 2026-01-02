import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { Logger } from '../../../infrastructure/utils/Logger';
// import { Restart } from 'fiction-expo-restart'; // Hypothetical, usually requires Updates.reloadAsync()

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        Logger.error('Uncaught error in ErrorBoundary', error, errorInfo);
    }

    handleRestart = () => {
        // Simple state reset for now, in prod mostly likely needs app reload
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <View style={styles.container}>
                    <Text style={styles.title}>Something went wrong</Text>
                    <Text style={styles.message}>{this.state.error?.message}</Text>
                    <Button mode="contained" onPress={this.handleRestart} style={styles.button}>
                        Try Again
                    </Button>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#B00020',
    },
    message: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    button: {
        marginTop: 10,
    },
});
