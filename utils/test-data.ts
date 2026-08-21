/**
 * Central location for reusable test data.
 * Kept separate from Page Objects and step definitions so that all tests
 * reference the same, well-typed dataset.
 */
export interface User {
  email: string;
  password: string;
}

export const users: Record<'validUser' | 'invalidUser', User> = {
  validUser: {
    email: 'student01@zinc.test',
    password: '9pJolA7GBQec'
  },
  invalidUser: {
    email: 'invalid_user',
    password: 'wrong_password'
  }
};
