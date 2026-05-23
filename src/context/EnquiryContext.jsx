import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api';
import { AuthContext } from './AuthContext';

export const EnquiryContext = createContext();

export const EnquiryProvider = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    // 1. Start with safe empty state
    const [items, setItems] = useState([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // 2. Safely initialize user data ONCE when auth resolves
    useEffect(() => {
        if (loading) return;

        if (user) {
            const saved = localStorage.getItem('enquiryCart');
            if (saved) {
                try {
                    setItems(JSON.parse(saved));
                } catch (e) {
                    setItems([]);
                }
            }
        } else {
            // Unauthenticated: clear data
            setItems([]);
            localStorage.removeItem('enquiryCart');
        }
    }, [user, loading]);

    // 3. Sync changes safely without recursive dependency loops
    useEffect(() => {
        if (!loading && user) {
            localStorage.setItem('enquiryCart', JSON.stringify(items));
        }
    }, [items, user, loading]);

    const enforceAuth = () => {
        if (!user) {
            toast('Please sign in to access your personalized consultation list.', {
                icon: '🔒',
                style: {
                    background: '#F6F1EB',
                    color: '#330020',
                    border: '1px solid rgba(51, 0, 32, 0.1)',
                    borderRadius: '100px',
                    padding: '12px 24px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                }
            });
            navigate('/login', { state: { from: location } });
            return false;
        }
        return true;
    };

    const addToEnquiry = (product, quantity = 1) => {
        if (!enforceAuth()) return;
        setItems(prev => {
            const existing = prev.find(item => item.product._id === product._id);
            if (existing) {
                return prev.map(item => 
                    item.product._id === product._id 
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { product, quantity }];
        });
        setIsDrawerOpen(true);
        toast.success('Added to Your Enquiry List', {
            style: {
                background: '#F6F1EB',
                color: '#330020',
                border: '1px solid rgba(51, 0, 32, 0.1)',
                borderRadius: '100px',
                padding: '12px 24px',
                fontSize: '12px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
            },
            icon: '✨'
        });
    };

    const removeFromEnquiry = (productId) => {
        setItems(prev => prev.filter(item => item.product._id !== productId));
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) return;
        setItems(prev => prev.map(item => 
            item.product._id === productId 
                ? { ...item, quantity: newQuantity }
                : item
        ));
    };

    const clearEnquiry = () => {
        setItems([]);
    };

    const openDrawer = () => {
        if (!enforceAuth()) return;
        setIsDrawerOpen(true);
    };
    const closeDrawer = () => setIsDrawerOpen(false);

    return (
        <EnquiryContext.Provider value={{
            items,
            addToEnquiry,
            removeFromEnquiry,
            updateQuantity,
            clearEnquiry,
            isDrawerOpen,
            openDrawer,
            closeDrawer
        }}>
            {children}
        </EnquiryContext.Provider>
    );
};
