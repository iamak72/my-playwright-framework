
import {
    validUsers,
    invalidUsers,
    allLoginUsers
} from './login.data';

// Centralized test data
export const TestData = {

    login: {
        validUsers,
        invalidUsers,
        allLoginUsers
    }

} as const;
