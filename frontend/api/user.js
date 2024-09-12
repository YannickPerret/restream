import Api from './api';

export default class UserApi extends Api {
    static async getAll() {
        const response = await fetch(`${this.baseUrl}/api/users`, {
            method: 'GET',
            headers: this.getHeaders(),
        });
        if (!response.ok) {
            const errorBody = await response.text();
            console.error('Error status:', response.status, 'Error body:', errorBody);
            throw new Error('Error while fetching users');
        }
        return await response.json();
    }

    static async getOne(id) {
        const response = await fetch(`${this.baseUrl}/api/users/${id}`, {
            method: 'GET',
            headers: this.getHeaders(),
        });
        if(!response.ok) {
            throw new Error('Error while fetching users');
        }
        return await response.json();
    }

    static async create(data) {
        const response = await fetch(`${this.baseUrl}/api/users`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(data),
        });
        if(!response.ok) {
            throw new Error('Error while creating users');
        }
        return await response.json();
    }

    static async update(id, data) {
        const response = await fetch(`${this.baseUrl}/api/users/${id}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(data),
        });
        if(!response.ok) {
            throw new Error('Error while updating users');
        }
        return await response.json();
    }

    static async delete(id) {
        const response = await fetch(`${this.baseUrl}/api/users/${id}`, {
            method: 'DELETE',
            headers: this.getHeaders(),
        });
        if(!response.ok) {
            throw new Error('Error while deleting users');
        }
    }
}