import React from "react";

const HowToUse = () => {
    return (
        <div className="container py-5">

            {/* Title */}
            <div className="text-center mb-5">
                <h1 className="fw-bold">How NexusPOS Works</h1>
                <p className="text-muted">
                    Simple guide to understand how your account and shop system works
                </p>
            </div>

            <div className="row g-4">

                {/* Step 1 */}
                <div className="col-md-4">
                    <div className="card shadow border-0 h-100">
                        <div className="card-body p-4">
                            <h4 className="text-primary">1. Create Account</h4>
                            <p className="text-muted mt-3">
                                You can register normally using your email and password.
                                Your account will be created instantly.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Step 2 */}
                <div className="col-md-4">
                    <div className="card shadow border-0 h-100">
                        <div className="card-body p-4">
                            <h4 className="text-success">2. Auto Attached to Default Shop</h4>
                            <p className="text-muted mt-3">
                                Every new user is automatically connected to the default shop (Shop ID: 1).
                                You can start using the system immediately after login.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Step 3 */}
                <div className="col-md-4">
                    <div className="card shadow border-0 h-100">
                        <div className="card-body p-4">
                            <h4 className="text-danger">3. Items & System Access</h4>
                            <p className="text-muted mt-3">
                                All items, billing system, and features are managed under the default shop.
                                You can start selling and managing data without any extra setup.
                            </p>
                        </div>
                    </div>
                </div>

            </div>

            {/* Important Notice */}
            <div className="mt-5">
                <div className="alert alert-warning shadow">
                    <h5 className="fw-bold">Important Information</h5>
                    <ul className="mb-0">
                        <li>✔ All users are attached to the default shop (Shop ID: 1)</li>
                        <li>✔ You can immediately start using NexusPOS after login</li>
                        <li>✔ Items and billing are shared under the default shop</li>
                        <li>❌ You cannot create your own shop directly</li>
                        <li>👉 To create a new shop, you must contact the admin (us)</li>
                    </ul>
                </div>
            </div>

            {/* Flow */}
            <div className="mt-5 text-center">
                <h4>System Flow</h4>
                <p className="text-muted">
                    Register → Auto Attach to Shop (ID: 1) → Login → Start Using POS → Contact Admin for Custom Shop
                </p>
            </div>

            {/* Contact CTA */}
            <div className="text-center mt-4">
                <p className="text-muted">
                    Want your own shop system? Contact us to upgrade your account.
                </p>
                <a href="/contact" className="btn btn-primary">
                    Contact Admin
                </a>
            </div>
            {/* Demo Items Section */}
            <div className="mt-5">

                <div className="text-center mb-4">
                    <h3 className="fw-bold">Demo Items for Practice</h3>
                    <p className="text-muted">
                        You can use these sample items to test billing and POS system
                    </p>
                </div>

                <div className="table-responsive">
                    <table className="table table-bordered table-hover shadow-sm">
                        <thead className="table-dark">
                            <tr>
                                <th>Item Name</th>
                                <th>Item Code</th>
                                <th>Price (NPR)</th>
                               
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>Coca Cola</td>
                                <td>1.1</td>
                                <td>50</td>
                              
                            </tr>

                            <tr>
                                <td>Milk</td>
                                <td>1.2</td>
                                <td>120</td>
                               
                            </tr>

                            <tr>
                                <td>Bread</td>
                                <td>1.3</td>
                                <td>60</td>
                             
                            </tr>

                            <tr>
                                <td>Rice (1kg)</td>
                                <td>1.4</td>
                                <td>200</td>
                              
                            </tr>

                            <tr>
                                <td>Mineral Water</td>
                                <td>1.5</td>
                                <td>20</td>
                               
                            </tr>

                            <tr>
                                <td>Chocolate</td>
                                <td>1.6</td>
                                <td>100</td>
                               
                            </tr>

                            <tr>
                                <td>Egg (per pcs)</td>
                                <td>1.7</td>
                                <td>20</td>
                               
                            </tr>

                            <tr>
                                <td>Biscuits</td>
                                <td>1.8</td>
                                <td>40</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="shortcut_panel">

                <h3 className="text-center mb-3">Keyboard Shortcuts</h3>

                <div className="row g-2 text-center">

                    <div className="col-6 col-md-3">
                        <div className="card shadow-sm p-2">
                            <kbd>F1</kbd>
                            <p className="mb-0">Search Item</p>
                        </div>
                    </div>

                    <div className="col-6 col-md-3">
                        <div className="card shadow-sm p-2">
                            <kbd>F2</kbd>
                            <p className="mb-0">Tag Customer</p>
                        </div>
                    </div>

                    <div className="col-6 col-md-3">
                        <div className="card shadow-sm p-2">
                            <kbd>F3</kbd>
                            <p className="mb-0">Discount</p>
                        </div>
                    </div>

                    <div className="col-6 col-md-3">
                        <div className="card shadow-sm p-2">
                            <kbd>F4</kbd>
                            <p className="mb-0">Reprint Bill</p>
                        </div>
                    </div>

                    <div className="col-6 col-md-3">
                        <div className="card shadow-sm p-2">
                            <kbd>F6</kbd>
                            <p className="mb-0">Hold Bill</p>
                        </div>
                    </div>

                    <div className="col-6 col-md-3">
                        <div className="card shadow-sm p-2">
                            <kbd>F7</kbd>
                            <p className="mb-0">Recall Bill</p>
                        </div>
                    </div>

                    <div className="col-6 col-md-3">
                        <div className="card shadow-sm p-2">
                            <kbd>F9</kbd>
                            <p className="mb-0">Switch Bill Type</p>
                        </div>
                    </div>

                    <div className="col-6 col-md-3">
                        <div className="card shadow-sm p-2">
                            <kbd>F10</kbd>
                            <p className="mb-0">Clear Bill</p>
                        </div>
                    </div>

                    <div className="col-12">
                        <div className="card shadow-sm p-2 bg-light">
                            <kbd>End</kbd>
                            <p className="mb-0">Proceed to Payment</p>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default HowToUse;