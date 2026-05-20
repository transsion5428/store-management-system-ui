import React, { useEffect, useState } from 'react';
import './home1.css';
import { Link, useNavigate } from 'react-router-dom';
import userVerification from '../../utils/userVerification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBoxesStacked,
    faTruckFast,
    faBasketShopping,
    faUsers,
    faHandHoldingDollar
} from '@fortawesome/free-solid-svg-icons';
import { API } from '../../env';
import Loading from '../../components/loading/Loading';

const Home = () => {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [dataSummary, setDataSummary] = useState(null);

    useEffect(() => {
        if (!userVerification().isAuthenticated) {
            localStorage.clear();
            navigate('/login');
            return;
        }

        (async () => {
            try {
                const res = await fetch(`${API}/api/v1/data/summary`);
                const data = await res.json();
                setDataSummary(data);
                setIsLoading(false);
            } catch (err) {
                console.log(err);
            }
        })();
    }, [navigate]);

    if (isLoading) return <Loading />;

    return (
        <div className="home-container">
            {/* ===== KPI CARDS ===== */}
            <div className="kpi-container">

                <div className="kpi-card">
                    <div className="kpi-icon">📦</div>
                    <div>
                        <h4>Total Items</h4>
                        <h2>{dataSummary?.articles?.totalArticles || 0}</h2>
                    </div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-icon">🏷️</div>
                    <div>
                        <h4>Categories</h4>
                        <h2>{dataSummary?.categories?.totalCategories || 0}</h2>
                    </div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-icon">💰</div>
                    <div>
                        <h4>Sales</h4>
                        <h2>{dataSummary?.sales?.totalSales || 0}</h2>
                    </div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-icon">🛒</div>
                    <div>
                        <h4>Purchases</h4>
                        <h2>{dataSummary?.purchases?.totalPurchases || 0}</h2>
                    </div>
                </div>

            </div>

            {/* ===== DASHBOARD CARDS ===== */}
            <div className="dashboard">

                {/* ROW 1 */}
                <div className="row">

                    {/* ITEMS */}
                    <div className="card">
                        <div className="card-header">
                            <FontAwesomeIcon icon={faBoxesStacked} />
                            <span>Items</span>
                        </div>

                        <div className="card-body">
                            <p>{dataSummary?.categories?.totalCategories || 0} Categories</p>
                            <p>{dataSummary?.articles?.totalArticles || 0} Items</p>
                            <p>{dataSummary?.articles?.totalStock || 0} In Stock</p>
                        </div>

                        <div className="card-footer">
                            <Link to="/categories" className="btn">Categories</Link>
                            <Link to="/items" className="btn">Items</Link>
                        </div>
                    </div>

                    {/* SUPPLIERS */}
                    <div className="card">
                        <div className="card-header">
                            <FontAwesomeIcon icon={faTruckFast} />
                            <span>Suppliers</span>
                        </div>

                        <div className="card-body">
                            <p>{dataSummary?.providers?.totalProviders || 0} Suppliers</p>
                        </div>

                        <div className="card-footer">
                            <Link to="/providers" className="btn">View</Link>
                        </div>
                    </div>

                    {/* CUSTOMERS */}
                    <div className="card">
                        <div className="card-header">
                            <FontAwesomeIcon icon={faUsers} />
                            <span>Customers</span>
                        </div>

                        <div className="card-body">
                            <p>{dataSummary?.customers?.totalCustomers || 0} Customers</p>
                        </div>

                        <div className="card-footer">
                            <Link to="/customers" className="btn">View</Link>
                        </div>
                    </div>
                </div>

                {/* ROW 2 */}
                <div className="row">

                    {/* PURCHASES */}
                    <div className="card">
                        <div className="card-header">
                            <FontAwesomeIcon icon={faBasketShopping} />
                            <span>Purchases</span>
                        </div>

                        <div className="card-body grid">
                            <div>
                                <h4>Total</h4>
                                <p>{dataSummary?.purchases?.totalPurchases || 0}</p>
                            </div>

                            <div>
                                <h4>Last Month</h4>
                                <p>{dataSummary?.purchases?.totalPurchasesInLastMonth || 0}</p>
                            </div>

                            <div>
                                <h4>Last Week</h4>
                                <p>{dataSummary?.purchases?.totalPurchasesInLastWeek || 0}</p>
                            </div>

                            <div>
                                <h4>Last Year</h4>
                                <p>{dataSummary?.purchases?.totalPurchasesInLastYear || 0}</p>
                            </div>
                        </div>

                        <div className="card-footer">
                            <Link to="/purchases" className="btn">View</Link>
                        </div>
                    </div>

                    {/* SALES */}
                    <div className="card">
                        <div className="card-header">
                            <FontAwesomeIcon icon={faHandHoldingDollar} />
                            <span>Sales</span>
                        </div>

                        <div className="card-body grid">
                            <div>
                                <h4>Total</h4>
                                <p>{dataSummary?.sales?.totalSales || 0}</p>
                            </div>

                            <div>
                                <h4>Last Month</h4>
                                <p>{dataSummary?.sales?.totalSalesInLastMonth || 0}</p>
                            </div>

                            <div>
                                <h4>Last Week</h4>
                                <p>{dataSummary?.sales?.totalSalesInLastWeek || 0}</p>
                            </div>

                            <div>
                                <h4>Last Year</h4>
                                <p>{dataSummary?.sales?.totalSalesInLastYear || 0}</p>
                            </div>
                        </div>

                        <div className="card-footer">
                            <Link to="/sales" className="btn">View</Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Home;