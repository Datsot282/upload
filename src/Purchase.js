import React, { useState } from 'react';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { auth } from './firebase'; // Ensure that you import auth to access the current user's uid
import './Purchase.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faUser, faDollarSign, faCreditCard } from "@fortawesome/free-solid-svg-icons";

const Purchase = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        price: '',
        quantity: '',
    });

    const db = getFirestore();

    // Function to handle form input changes
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    // Function to handle adding the product to Firestore
    const store = async () => {
        try {
            const { name, description, category, price, quantity } = formData;

            // Validation
            if (!name || !description || !category || price <= 0 || quantity <= 0) {
                alert('Please fill out all fields with valid values.');
                return;
            }

            // Get the current user's UID
            const uid = auth.currentUser.uid;

            // Create a reference to the Firestore document using uid
            const docRef = doc(db, 'products', uid); // Using the user's UID as the document ID

            // Add the product to Firestore under the user's UID
            await setDoc(docRef, {
                name,
                description,
                category,
                price: Number(price),
                quantity: Number(quantity),
            });

            alert('Product added successfully!');
            setFormData({
                name: '',
                description: '',
                category: '',
                price: '',
                quantity: '',
            });
        } catch (error) {
            console.error('Error adding product: ', error);
            alert('Failed to add product. Please try again.');
        }
    };

    return (
        <>
            <title>Inventory Management System</title>
            <div className="navbar" id="navbar">
                <a className="navbar-brand" href="#">Inventory Management</a>
                <div className="navbar-nav">
                <li>
      <Link to="/Dashboard" className="nav-link">
        <FontAwesomeIcon icon={faHome} className="nav-icon" /> Dashboard
      </Link>
    </li>
    <li>
      <Link to="/Purchase" className="nav-link">
        <FontAwesomeIcon icon={faUser} className="nav-icon" /> Purchase
      </Link>
      </li>
      <li>
      <Link to="/Sales" className="nav-link">
        <FontAwesomeIcon icon={faDollarSign} className="nav-icon" /> Sales
        </Link>
        </li>
        <li>
        <Link to="/Transaction" className="nav-link">
        <FontAwesomeIcon icon={faCreditCard} className="nav-icon" /> Transaction
      </Link>
      </li>
    
                </div>
            </div>

            <div className="main-content">
                <h1>Product Form</h1>

                <form id="productForm" onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <label htmlFor="name" className="form-label">Product Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            placeholder="Enter product name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="form-label">Description</label>
                        <input
                            type="text"
                            className="form-control"
                            id="description"
                            placeholder="Enter description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="category" className="form-label">Category</label>
                        <input
                            type="text"
                            className="form-control"
                            id="category"
                            placeholder="Enter category"
                            value={formData.category}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="price" className="form-label">Price</label>
                        <input
                            type="number"
                            className="form-control"
                            id="price"
                            placeholder="Enter price"
                            value={formData.price}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="quantity" className="form-label">Quantity</label>
                        <input
                            type="number"
                            className="form-control"
                            id="quantity"
                            placeholder="Enter quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="button" className="btn-primary" id="addProductBtn" onClick={store}>
                        Add Product
                    </button>
                </form>
            </div>
        </>
    );
};

export default Purchase;
