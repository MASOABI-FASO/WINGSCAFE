
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Auth from './components/Auth';
import ProductManagement from './components/ProductManagement';
import Dashboard from './components/Dashboard';
import SalesManagement from './components/SalesManagement';
import UserManagement from './components/UserManagement';
import './App.css';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [sales, setSales] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Fetch initial data from the server and load users from local storage
        const fetchData = async () => {
            const [usersResponse, productsResponse, salesResponse] = await Promise.all([
                fetch('http://localhost:5000/api/users'),
                fetch('http://localhost:5000/api/products'),
                fetch('http://localhost:5000/api/sales'),
            ]);

            const usersData = await usersResponse.json();
            const productsData = await productsResponse.json();
            const salesData = await salesResponse.json();

            setUsers(usersData);
            setProducts(productsData);
            setSales(salesData);
        };

        fetchData();
    }, []);

    const loginUser = (username) => {
        setIsLoggedIn(true);
        setMessage(`Logged in successfully as ${username}!`);
        // Reset message on successful login
    };

    const logoutUser = () => {
        setIsLoggedIn(false);
        setMessage('Logged out successfully!');
    };

    const registerUser = (newUser) => {
        const updatedUsers = [...users, newUser]; // Add user to state
        localStorage.setItem('users', JSON.stringify(updatedUsers)); // Save to localStorage
        setUsers(updatedUsers); // Update users state
    };

    return (
        <Router>
            <div className="App">
                {!isLoggedIn ? (
                    <Auth onLogin={loginUser} onRegister={registerUser} />
                ) : (
                    <div>
                        {/* Your authenticated routes and content */}
                        <header className="header">
                            <h2>Welcome to Wings Cafe</h2>
                            <nav className="navbar">
                                <button><Link to="/dashboard">Dashboard</Link></button>
                                <button><Link to="/productManagement">Product Management</Link></button>
                                <button><Link to="/salesManagement">Sales Management</Link></button>
                                <button><Link to="/userManagement">User Management</Link></button>
                                <button onClick={logoutUser}>Logout</button>
                            </nav>
                        </header>
                        {message && <div>{message}</div>}
                        <div className="content">
                            <Routes>
                                <Route 
                                    path="/dashboard" 
                                    element={<Dashboard products={products} sales={sales} />} 
                                />
                                <Route 
                                    path="/productManagement" 
                                    element={<ProductManagement setProducts={setProducts} />} 
                                />
                                <Route 
                                    path="/salesManagement" 
                                    element={<SalesManagement products={products} setSales={setSales} />} 
                                />
                                <Route 
                                    path="/userManagement" 
                                    element={<UserManagement users={users} />} 
                                />
                            </Routes>
                        </div>
                    </div>
                )}
            </div>
        </Router>
    );
}

export default App;
