import React, { useEffect, useState } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useNavigate,
    useLocation
} from 'react-router-dom';

import './App.css';

import Login from './pages/login/Login';
import Home from './pages/home/Home';

import Categories from './pages/categories/Categories';
import NewCategory from './pages/categories/new-category/NewCategory';
import EditCategory from './pages/categories/edit-category/EditCategory';

import Items from './pages/items/Items';
import NewItem from './pages/items/new-item/NewItem';
import EditItem from './pages/items/edit-item/EditItem';

import Product from './pages/product/Product';
import Positions from './pages/position/Positions';

import Providers from './pages/providers/Providers';
import NewProvider from './pages/providers/new-provider/NewProvider';
import EditProvider from './pages/providers/edit-provider/EditProvider';

import Purchases from './pages/purchases/Purchases';
import SelectProvider from './pages/purchases/new-purchase/SelectProvider';
import NewPurchase from './pages/purchases/new-purchase/NewPurchase';
import DetailPurchase from './pages/purchases/detail-purchase/DetailPurchase';

import Customers from './pages/customers/Customers';
import NewCustomer from './pages/customers/new-customer/NewCustomer';
import EditCustomer from './pages/customers/edit-customer/EditCustomer';

import Sales from './pages/sales/Sales';
import NewSale from './pages/sales/new-sale/NewSale';
import DetailSale from './pages/sales/detail-sale/DetailSale';

import Users from './pages/users/Users';
import NewUser from './pages/users/new-user/NewUser';
import EditUser from './pages/users/edit-user/EditUser';
import EditUserData from './pages/users/edit-user/editing-options/EditUserData';
import EditUserPassword from './pages/users/edit-user/editing-options/EditUserPassword';

import Sidebar from './components/sidebar/Sidebar';
import Navbar from './components/navbar/Navbar';

import ForgotLogin from './pages/login/forgot-login/ForgotLogin';
import AccessValidation from './pages/login/forgot-login/AccessValidation';
import NotFound from './pages/not-found/NotFound';

import userVerification from './utils/userVerification';


import setupLocatorUI from "@locator/runtime";

if (process.env.NODE_ENV === "development") {
  setupLocatorUI();
}

const hasMenuAccess = (path) => {
    try {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        const menus = JSON.parse(localStorage.getItem('menus') || '[]');

        if (user?.admin) return true;

        return menus.some(menu => menu.path === path);
    } catch (error) {
        console.log(error);
        return false;
    }
};

function App() {
    return (
        <Router>
            <div className="app-container">
                <Routes>
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/forgot-login" element={<ForgotLogin />} />
                    <Route path="/access-validation" element={<AccessValidation />} />
                    <Route path="/*" element={<MainLayout />} />
                </Routes>
            </div>
        </Router>
    );
}

const MainLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [tabs, setTabs] = useState([]);

    const pageTitles = {
        '/home': 'Home',
        '/categories': 'Categories',
        '/items': 'Items',
        '/products': 'Products',
        '/providers': 'Suppliers',
        '/purchases': 'Purchases',
        '/customers': 'Customers',
        '/sales': 'Sales',
        '/positions': 'Positions',
        '/users': 'Users',
        '/new-category': 'New Category',
        '/new-item': 'New Item',
        '/new-provider': 'New Provider',
        '/new-customer': 'New Customer',
        '/new-sale': 'New Sale',
        '/new-user': 'New User'
    };

    useEffect(() => {
        if (!userVerification().isAuthenticated) {
            localStorage.clear();
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        const title = pageTitles[location.pathname];
        if (!title) return;

        setTabs(prev => {
            const exists = prev.find(tab => tab.path === location.pathname);
            if (exists) return prev;

            return [...prev, {
                title,
                path: location.pathname
            }];
        });
    }, [location.pathname]);

    const closeTab = (path) => {
        const remainingTabs = tabs.filter(tab => tab.path !== path);
        setTabs(remainingTabs);

        if (location.pathname === path) {
            navigate(
                remainingTabs.length
                    ? remainingTabs[remainingTabs.length - 1].path
                    : '/home'
            );
        }
    };

    return (
        <>
            <Sidebar />

            <Navbar
                tabs={tabs}
                activePath={location.pathname}
                closeTab={closeTab}
            />

            <div className="main-content">
                <Routes>
                    <Route path="/home" element={<Home />} />

                    <Route path="/categories" element={
                        hasMenuAccess('/categories') ? <Categories /> : <Navigate to="/home" replace />
                    } />

                    <Route path="/new-category" element={
                        hasMenuAccess('/categories') ? <NewCategory /> : <Navigate to="/home" replace />
                    } />

                    <Route path="/edit-category" element={
                        hasMenuAccess('/categories') ? <EditCategory /> : <Navigate to="/home" replace />
                    } />

                    <Route path="/items" element={
                        hasMenuAccess('/items') ? <Items /> : <Navigate to="/home" replace />
                    } />

                    <Route path="/products" element={
                        hasMenuAccess('/products') ? <Product /> : <Navigate to="/home" replace />
                    } />

                    <Route path="/new-item" element={
                        hasMenuAccess('/items') ? <NewItem /> : <Navigate to="/home" replace />
                    } />

                    <Route path="/edit-item" element={
                        hasMenuAccess('/items') ? <EditItem /> : <Navigate to="/home" replace />
                    } />

                    <Route path="/providers" element={
                        hasMenuAccess('/providers') ? <Providers /> : <Navigate to="/home" replace />
                    } />

                    <Route path="/new-provider" element={
                        hasMenuAccess('/providers') ? <NewProvider /> : <Navigate to="/home" replace />
                    } />

                    <Route path="/edit-provider/:id" element={
                        hasMenuAccess('/providers') ? <EditProvider /> : <Navigate to="/home" replace />
                    } />

                    <Route path="/purchases" element={
                        hasMenuAccess('/purchases') ? <Purchases /> : <Navigate to="/home" replace />
                    } />

                    <Route path="/new-purchase" element={
                        hasMenuAccess('/purchases') ? <SelectProvider /> : <Navigate to="/home" replace />
                    } />

                    <Route path="/new-purchase/:providerId" element={
                        hasMenuAccess('/purchases') ? <NewPurchase /> : <Navigate to="/home" replace />
                    } />

                    <Route path="/detail-purchase/:id" element={
                        hasMenuAccess('/purchases') ? <DetailPurchase /> : <Navigate to="/home" replace />
                    } />

                    <Route path="/customers" element={
                        hasMenuAccess('/customers') ? <Customers /> : <Navigate to="/home" replace />
                    } />

                    <Route path="/new-customer" element={
                        hasMenuAccess('/customers') ? <NewCustomer /> : <Navigate to="/home" replace />
                    } />

                    <Route path="/edit-customer/:id" element={
                        hasMenuAccess('/customers') ? <EditCustomer /> : <Navigate to="/home" replace />
                    } />

                    <Route path="/sales" element={
                        hasMenuAccess('/sales') ? <Sales /> : <Navigate to="/home" replace />
                    } />

                    <Route path="/new-sale" element={
                        hasMenuAccess('/sales') ? <NewSale /> : <Navigate to="/home" replace />
                    } />

                    <Route path="/detail-sale/:id" element={
                        hasMenuAccess('/sales') ? <DetailSale /> : <Navigate to="/home" replace />
                    } />

                    <Route path="/users" element={
                        hasMenuAccess('/users') ? <Users /> : <Navigate to="/home" replace />
                    } />

                    <Route path="/positions" element={
                        hasMenuAccess('/positions') ? <Positions /> : <Navigate to="/home" replace />
                    } />

                    <Route path="/new-user" element={
                        hasMenuAccess('/users') ? <NewUser /> : <Navigate to="/home" replace />
                    } />

                    <Route path="/edit-user/:id" element={
                        hasMenuAccess('/users') ? <EditUser /> : <Navigate to="/home" replace />
                    } />

                    <Route path="/edit-user-data/:id" element={
                        hasMenuAccess('/users') ? <EditUserData /> : <Navigate to="/home" replace />
                    } />

                    <Route path="/edit-user-pass/:id" element={
                        hasMenuAccess('/users') ? <EditUserPassword /> : <Navigate to="/home" replace />
                    } />

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </>
    );
};

export default App;