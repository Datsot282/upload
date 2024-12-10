import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { auth } from './firebase';
import './Transaction.css';
import { Link } from 'react-router-dom';

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);

  const db = getFirestore();

  useEffect(() => {
    // Fetch the transactions for the currently logged-in user
    const fetchTransactions = async () => {
      try {
        const q = query(
          collection(db, 'transactions'),
          where('uid', '==', auth.currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const transactionData = [];
        querySnapshot.forEach((doc) => {
          transactionData.push(doc.data());
        });
        setTransactions(transactionData);
      } catch (error) {
        console.error('Error fetching transactions: ', error);
      }
    };

    fetchTransactions();
  }, [db]);

  return (
    <>
      <title>Transaction Summary</title>

      <div className="container">
        <h1>Transaction Summary</h1>
        {transactions.length > 0 ? (
          <div className="summary">
            {transactions.map((transaction, index) => (
              <div key={index}>
                <p><strong>Product Name:</strong> {transaction.productName}</p>
                <p><strong>Price per Unit:</strong> ${transaction.totalAmount / transaction.quantitySold}</p>
                <p><strong>Quantity Sold:</strong> {transaction.quantitySold}</p>
                <p><strong>Total Amount:</strong> ${transaction.totalAmount}</p>
                <p><strong>Remaining Quantity:</strong> {/* Fetch from the product details */}</p>
                <hr />
              </div>
            ))}
          </div>
        ) : (
          <p>No transactions yet.</p>
        )}
       <Link to="/Dashboard">Back to homepage</Link>
      </div>
    </>
  );
};

export default Transaction;
