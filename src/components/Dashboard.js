
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    PieChart,
    Pie,
    Cell,
    Legend,
    LabelList
} from 'recharts';
import './Dashboard.css'; // Import the CSS file for styles

// Define a color palette
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6F91', '#FFA07A'];

const Dashboard = ({ products = [], sales = [] }) => {
    const [lowStockMessages, setLowStockMessages] = useState([]);
    const [soldData, setSoldData] = useState([]);

    // Function to format currency
    const formatCurrency = (amount) => {
        if (typeof amount !== 'number') {
            console.error(`Invalid amount passed: ${amount}`);
            return "M0.00"; // or return null/undefined depending on your needs
        }
        return `M${amount.toFixed(2)}`;
    };

    // Calculate total revenue based on sold products
    const calculatedTotalRevenue = Array.isArray(sales)
        ? sales.reduce((total, sale) => {
            const sellingPricePerUnit = products.find(p => p.id === sale.product_id)?.price || 0;
            return total + (sellingPricePerUnit * sale.quantity);
        }, 0)
        : 0;

    // Effect to check stock levels and set messages for low stock
    useEffect(() => {
        const messages = products
            .filter(product => product.stock < 5)
            .map(product => `${product.name} has low stock levels: ${product.stock} remaining.`);
        setLowStockMessages(messages);
    }, [products]);

    // Prepare data for the sold products chart
    useEffect(() => {
        const data = Array.isArray(sales)
            ? sales.reduce((acc, sale) => {
                const product = products.find(p => p.id === sale.product_id);
                if (product) {
                    const existing = acc.find(item => item.id === sale.product_id);
                    const totalQuantity = existing ? existing.quantity + sale.quantity : sale.quantity;
                    if (existing) {
                        existing.quantity = totalQuantity;
                    } else {
                        acc.push({ 
                            name: product.name, 
                            quantity: totalQuantity, 
                            id: product.id 
                        });
                    }
                }
                return acc;
            }, [])
            : [];
        setSoldData(data);
    }, [sales, products]);

    return (
        <div>
            <div className="image-container">
                <img className="animated-image" src="wings0.jpeg" alt="" />
                <img className="animated-image" src="wings1.jpeg" alt="" />
                <img className="animated-image" src="wings2.jpeg" alt="" />
                <img className="animated-image" src="wings3.jpeg" alt="" />
                <img className="animated-image" src="wings4.jpeg" alt="" />
                <img className="animated-image" src="wings5.jpeg" alt="" />
                <span className="spinning-text">😊ENJOY TO THE FULLEST 😊</span>
            </div>
            
            <h2>Dashboard</h2>

            {/* Available Stock Graph */}
            <h3>Available Stock</h3>
            {products.length === 0 ? (
                <p>No products available.</p>
            ) : (
                <BarChart width={600} height={300} data={products}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="stock" barSize={30}>
                        {products.map((product, index) => (
                            <Cell key={product.id} fill={COLORS[index % COLORS.length]} />
                        ))}
                       
                    </Bar>
                </BarChart>
            )}

            {/* Display low stock messages */}
            {lowStockMessages.length > 0 && (
                <div style={{ color: 'red', marginTop: '10px' }}>
                    {lowStockMessages.map((message, index) => (
                        <p key={index}>{message}</p>
                    ))}
                </div>
            )}

            {/* Sold Products Graph */}
            <h3>Sold Products</h3>
            {soldData.length > 0 ? (
                <div>
                    <PieChart width={600} height={300}>
                        <Pie 
                            data={soldData} 
                            dataKey="quantity" 
                            nameKey="name" 
                            cx="50%" 
                            cy="50%" 
                            outerRadius={80} 
                            fill="#82ca9d" 
                            label={({ name, quantity }) => `${name}: ${quantity} `}>
                            {soldData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend
                            wrapperStyle={{ position: 'absolute', top: 0, right: 10 }}
                            formatter={(value, entry) => (
                                <span style={{ color: entry.color }}>{value}</span>
                            )}
                        />
                    </PieChart>
                </div>
            ) : (
                <p>No products sold.</p>
            )}

            <h3>Total Revenue: {formatCurrency(calculatedTotalRevenue)}</h3>
        </div>
    );
};

Dashboard.propTypes = {
    products: PropTypes.array.isRequired,
    sales: PropTypes.array.isRequired,
};

export default Dashboard;
