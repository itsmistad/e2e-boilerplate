import { jest } from '@jest/globals';
import { cleanup, configure } from '@testing-library/react-native';
import { setUpTests } from 'react-native-reanimated';

jest.useFakeTimers();

configure({
    asyncUtilTimeout: 5_000,
});

setUpTests();

afterEach(() => {
    cleanup();
});

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});
