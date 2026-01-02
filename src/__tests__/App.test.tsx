import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../../App';

describe('App', () => {
    it('renders correctly', () => {
        // Basic render test to verify environment
        const tree = render(<App />).toJSON();
        expect(tree).toBeDefined();
    });
});
