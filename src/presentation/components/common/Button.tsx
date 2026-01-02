import React from 'react';
import { Button as PaperButton } from 'react-native-paper';
import { StyleSheet, ViewStyle, StyleProp } from 'react-native';

interface Props {
    mode?: 'text' | 'outlined' | 'contained';
    onPress: () => void;
    children: React.ReactNode;
    loading?: boolean;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
    icon?: string;
}

export const Button = ({ mode = 'contained', onPress, children, loading, disabled, style, icon }: Props) => {
    return (
        <PaperButton
            mode={mode}
            onPress={onPress}
            loading={loading}
            disabled={disabled || loading}
            style={[styles.button, style]}
            icon={icon}
        >
            {children}
        </PaperButton>
    );
};

const styles = StyleSheet.create({
    button: {
        marginVertical: 10,
        borderRadius: 8,
    },
});
