import React, { createContext, useContext, ReactNode } from 'react';
import { RootStore } from './RootStore';

let store: RootStore;

export const StoreContext = createContext<RootStore | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
    // Lazy init singleton
    if (!store) {
        store = new RootStore();
    }

    return (
        <StoreContext.Provider value={store}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStores = () => {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error('useStores must be used within a StoreProvider');
    }
    return context;
};
