import { test, expect } from '@fixtures/pomFixture';

test.describe('Users API (JSONPlaceholder)', () => {
  test('should get list of users', async ({ apiClient }) => {
    const response = await apiClient.get('/users');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.length).toBeGreaterThan(0);
    expect(body[0].username).toBeDefined();
  });

  test('should create a new user', async ({ apiClient }) => {
    const newUser = {
      name: 'Leanne Graham',
      username: 'Bret',
      email: 'Sincere@april.biz',
    };
    const response = await apiClient.post('/users', newUser);
    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.name).toBe(newUser.name);
    // JSONPlaceholder returns a new ID (usually 11 for users)
    expect(body.id).toBeDefined();
  });

  test('should update a user', async ({ apiClient }) => {
    const updatedUser = {
      name: 'Updated Name',
      username: 'Bret',
    };
    const response = await apiClient.put('/users/1', updatedUser);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.name).toBe(updatedUser.name);
  });

  test('should delete a user', async ({ apiClient }) => {
    const response = await apiClient.delete('/users/1');
    expect(response.status()).toBe(200);
  });
});
