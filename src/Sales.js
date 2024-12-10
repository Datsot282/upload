import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, updateDoc, collection, addDoc, getDocs } from 'firebase/firestore';
import { auth } from './firebase';
import './Sales.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faUser,faDollarSign, faCreditCard } from "@fortawesome/free-solid-svg-icons";


const Sales = () => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [error, setError] = useState('');

  const db = getFirestore();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, 'products');
        const querySnapshot = await getDocs(productsCollection);
        const productData = [];
        querySnapshot.forEach((doc) => {
          productData.push({ id: doc.id, ...doc.data() });
        });
        setProducts(productData);
      } catch (error) {
        setError('Error fetching products: ' + error.message);
      }
    };

    fetchProducts();
  }, [db]);

  const handleQuantityChange = (productId, value) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Number(value),
    }));
  };

  const handleSale = async (e, product) => {
    e.preventDefault();
    const quantitySold = quantities[product.id] || 0;

    if (quantitySold <= 0) {
      setError('Please enter a valid quantity.');
      return;
    }

    try {
      const productRef = doc(db, 'products', product.id);
      const productDoc = await getDoc(productRef);

      if (productDoc.exists()) {
        const productData = productDoc.data();
        const newQuantity = productData.quantity - quantitySold;

        if (newQuantity < 0) {
          setError('Not enough stock available.');
          return;
        }

        await updateDoc(productRef, {
          quantity: newQuantity,
        });

        const totalAmount = productData.price * quantitySold;
        if (auth.currentUser) {
          await addDoc(collection(db, 'transactions'), {
            uid: auth.currentUser.uid,
            productId: product.id,
            productName: productData.productName,
            quantitySold,
            totalAmount,
            date: new Date(),
          });
        }

        alert(`Sale completed for ${productData.productName}`);
        setQuantities((prev) => ({
          ...prev,
          [product.id]: 0,
        }));
        setError('');
      } else {
        setError('Product not found.');
      }
    } catch (error) {
      setError('Error processing sale: ' + error.message);
    }
  };

  return (
    <>
      <title>Sales</title>
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

      <div className="main-content">
        <h5>Sales</h5>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <table id="myTable">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Description</th>
              <th>Category</th>
              <th>Price</th>
              <th>Qty Available</th>
              <th>Quantity Sold</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.productName}</td>
                <td>{product.description}</td>
                <td>{product.category}</td>
                <td>{product.price}</td>
                <td>{product.quantity}</td>
                <td>
                  <input
                    type="number"
                    value={quantities[product.id] || ''}
                    onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                    placeholder="Enter units sold"
                    required
                  />
                </td>
                <td>
                  <button
                    onClick={(e) => handleSale(e, product)}
                    className="btn btn-primary"
                  >
                    Sell Now
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Sales;
