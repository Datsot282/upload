import React, { useState, useEffect } from 'react';
import { getFirestore, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { auth } from './firebase'; // Ensure this is where you initialize Firebase
import { Link } from 'react-router-dom';
import './Dashboard.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faUser,faDollarSign,faCreditCard } from "@fortawesome/free-solid-svg-icons";

const Dashboard = () => {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');
  const [product, setProduct] = useState(null); // To hold the fetched product data

  const db = getFirestore();

  useEffect(() => {
    // Fetch the product data from Firestore based on the current user's uid
    const fetchProduct = async () => {
      try {
        const uid = auth.currentUser.uid;
        const docRef = doc(db, 'products', uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProduct(docSnap.data());
          setProductName(docSnap.data().productName);
          setDescription(docSnap.data().description);
          setCategory(docSnap.data().category);
          setPrice(docSnap.data().price);
          setQuantity(docSnap.data().quantity);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching product: ', error);
      }
    };

    fetchProduct();
  }, [db]);

  // Handle Save Product
  const handleSaveProduct = async (e) => {
    e.preventDefault();

    if (!productName || !description || !category || !price || !quantity) {
      setError('All fields are required');
      return;
    }

    try {
      const uid = auth.currentUser.uid;
      const docRef = doc(db, 'products', uid);

      await setDoc(docRef, {
        productName,
        description,
        category,
        price,
        quantity,
      });

      alert('Product updated successfully');
      setError('');
    } catch (error) {
      setError('Error saving product: ' + error.message);
    }
  };
  
  // Handle Delete Product
  const handleDeleteProduct = async () => {
    try {
      const uid = auth.currentUser.uid;
      const docRef = doc(db, 'products', uid);

      await deleteDoc(docRef);
      alert('Product deleted successfully');
      // Clear form data after deletion
      setProductName('');
      setDescription('');
      setCategory('');
      setPrice('');
      setQuantity('');
    } catch (error) {
      console.error('Error deleting product: ', error);
      alert('Failed to delete product. Please try again.');
    }
  };

  return (
    <>
      <title>Stock Status</title>
      <div className="navbar">
  <a className="navbar-brand" href="#">Inventory Management System</a>
  <ul className="navbar-nav">
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
  </ul>
</div>


      <div className="container1">
        <h5>Stock Status</h5>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <form onSubmit={handleSaveProduct}>
          <table id="myTable">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Description</th>
                <th>Category</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><input type="text" id="product_name" value={productName} onChange={(e) => setProductName(e.target.value)} required /></td>
                <td><input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} required /></td>
                <td><input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} required /></td>
                <td><input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required /></td>
                <td><input type="number" id="quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} required /></td>
                <td>
                  <button type="submit" name="save_btn">Update</button>
                  {product && (
                    <button type="button" onClick={handleDeleteProduct} style={{ backgroundColor: 'red', color: 'white' }}>Delete</button>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    </>
  );
};

export default Dashboard;
