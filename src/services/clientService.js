const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const getToken = () => {
  return localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
};

const getHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

export const clientService = {
  async getClients() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/clients`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch clients: ${response.statusText}`);
      }

      const data = await response.json();
      return data.clients || [];
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
  },

  async createClient(payload) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/clients`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create client');
      }

      return data.client;
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  },

  async updateClient(id, payload) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/clients/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update client');
      }

      return data.client;
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  },

  async deleteClient(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/clients/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete client');
      }

      return data;
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  },
};
