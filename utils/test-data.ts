/**
 * Central location for reusable test data.
 * Kept separate from Page Objects and step definitions so that all tests
 * reference the same, well-typed dataset.
 */
export interface User {
  username: string;
  password: string;
}

export const users: Record<'validUser' | 'invalidUser', User> = {
  validUser: {
    username: 'standard_user',
    password: 'secret_sauce'
  },
  invalidUser: {
    username: 'invalid_user',
    password: 'wrong_password'
  }
};
