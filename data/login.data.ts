
import users from './users.json';

// Allowed login results
export type LoginExpectedResult = 'success' | 'failure';

// Login test data structure
export interface LoginTestData {
    email: string;
    password: string;
    scenario: string;
    expectedResult: LoginExpectedResult;
}

// Raw JSON data structure
interface RawLoginTestData {
    email: string;
    password: string;
    scenario: string;
    expectedResult: string;
}

// Validate login test data
function validateLoginData(
    data: RawLoginTestData[],
    dataType: string
): LoginTestData[] {

    if (!Array.isArray(data)) {
        throw new Error(`${dataType} must be an array`);
    }

    return data.map((user, index) => {

        if (!user.scenario?.trim()) {
            throw new Error(
                `${dataType}[${index}]: Scenario is required`
            );
        }

        if (
            user.expectedResult !== 'success' &&
            user.expectedResult !== 'failure'
        ) {
            throw new Error(
                `${user.scenario}: Invalid expectedResult '${user.expectedResult}'`
            );
        }

        if (
            typeof user.email !== 'string' ||
            typeof user.password !== 'string'
        ) {
            throw new Error(
                `${user.scenario}: Email and password must be strings`
            );
        }

        return {
            email: user.email,
            password: user.password,
            scenario: user.scenario,
            expectedResult: user.expectedResult
        };
    });
}

// Valid login users
export const validUsers: LoginTestData[] =
    validateLoginData(users.validUsers, 'validUsers');

// Invalid login users
export const invalidUsers: LoginTestData[] =
    validateLoginData(users.invalidUsers, 'invalidUsers');

// All login users
export const allLoginUsers: LoginTestData[] = [
    ...validUsers,
    ...invalidUsers
];
