const API_BASE_URL = 'http://localhost:3000/api';

export class DatabaseService {
  // Generic create operation
  static async create(endpoint: string, data: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create resource');
      return await response.json();
    } catch (error) {
      console.error('Error creating resource:', error);
      throw error;
    }
  }

  // Generic read operation
  static async read(endpoint: string, id: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/${endpoint}/${id}`);
      if (!response.ok) throw new Error('Failed to read resource');
      return await response.json();
    } catch (error) {
      console.error('Error reading resource:', error);
      throw error;
    }
  }

  // Generic update operation
  static async update(endpoint: string, id: string, data: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/${endpoint}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update resource');
      return await response.json();
    } catch (error) {
      console.error('Error updating resource:', error);
      throw error;
    }
  }

  // Generic delete operation
  static async delete(endpoint: string, id: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/${endpoint}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete resource');
      return true;
    } catch (error) {
      console.error('Error deleting resource:', error);
      throw error;
    }
  }

  // Query operation (with basic filtering)
  static async query(endpoint: string, filters: any) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`${API_BASE_URL}/${endpoint}?${queryParams}`);
      if (!response.ok) throw new Error('Failed to query resources');
      return await response.json();
    } catch (error) {
      console.error('Error querying resources:', error);
      throw error;
    }
  }
} 