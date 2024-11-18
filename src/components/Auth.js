
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Auth = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Reset messages when toggling between login / signup
        setErrorMessage('');
        setSuccessMessage('');
    }, [isSignUp]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSignUp) {
            // Registration logic
            try {
                const response = await fetch('http://localhost:5000/api/users/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                });

                const data = await response.json();

                if (!response.ok) {
                    setErrorMessage(data.message);
                } else {
                    setSuccessMessage('Registration successful! Please log in now.');
                    // Clear input fields
                    setUsername('');
                    setPassword('');
                    // Switch to login mode after 3 seconds
                    setTimeout(() => {
                        setIsSignUp(false);
                    }, 3000);
                }
            } catch (error) {
                setErrorMessage('Network error. Please try again later.');
                console.error('Error during registration:', error);
            }
        } else {
            // Login logic
            try {
                const response = await fetch('http://localhost:5000/api/users');
                const users = await response.json();
                const user = users.find(user => user.username === username);

                if (!user) {
                    setErrorMessage('User not registered. Please sign up.');
                } else if (user.password !== password) {
                    setErrorMessage('Incorrect password.');
                } else {
                    // Call the onLogin function if user exists and password matches
                    onLogin(username);
                    navigate('/dashboard'); // Navigate to dashboard on successful login
                }
            } catch (error) {
                setErrorMessage('Network error. Please try again later.');
                console.error('Error during login:', error);
            }
        }
    };

    return (
        <div>
            <marquee><img src="maswaby.png" alt="Cafe Logo" />
            <h3>WELCOME TO WINGS CAFE INVENTORY MANAGEMENT</h3></marquee>
            <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>
            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
            {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
            <form onSubmit={handleSubmit}>
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
                <button type="submit">{isSignUp ? 'Register' : 'Login'}</button>
            </form>
            <button onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
            </button>
        </div>
    );
};

export default Auth;
