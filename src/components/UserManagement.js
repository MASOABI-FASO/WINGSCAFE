
import React, { useState, useEffect } from 'react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Fetch Users Function
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/users');
            if (!response.ok) {
                throw new Error('Failed to fetch users.');
            }
            const data = await response.json();
            setUsers(data);
            setMessage(''); // Reset message
        } catch (error) {
            console.error('Failed to fetch users:', error);
            setMessage('Error fetching users: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Get users on component mount
    useEffect(() => {
        fetchUsers();
    }, []);

    // Handle Delete User Function
    const handleDeleteUser = async (username) => {
        if (window.confirm(`Are you sure you want to delete user ${username}?`)) {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:5000/api/users/${username}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error('Failed to delete user.');
                }
                setMessage(`User ${username} deleted successfully.`);
                fetchUsers(); // Refresh the user list
            } catch (error) {
                console.error('Error deleting user:', error);
                setMessage(`Error deleting user: ${error.message}`);
            } finally {
                setLoading(false);
            }
        }
    };

    // Handle Register User Function
    const handleRegisterUser = async (e) => {
        e.preventDefault();
        if (!username.trim() || !password.trim()) {
            setMessage('Username and password cannot be empty.');
            return;
        }
        
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password, // Use the password input by the user
                }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error adding user. Please try again.');
            }
            fetchUsers(); // Refresh the user list
            setUsername('');
            setPassword(''); // Clear password field
            setMessage(`User ${username} registered successfully.`);
        } catch (error) {
            console.error('Failed to register user:', error);
            setMessage(`Error registering user: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>User Management</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <h3>Registered Users</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="2">No users found.</td>
                                </tr>
                            ) : (
                                users.map((user, index) => (
                                    <tr key={index}>
                                        <td>{user.username}</td>
                                        <td>
                                            <button onClick={() => handleDeleteUser(user.username)}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    <h3>Register User</h3>
                    <form onSubmit={handleRegisterUser}>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit">Register User</button>
                    </form>

                    {message && <div className="message">{message}</div>}
                </>
            )}
        </div>
    );
};

export default UserManagement;
