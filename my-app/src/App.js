import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Login from './Auth/Login';
import Home from './pages/Home';
import SecurityOffices from './components/SecurityOffices';
import Organization  from './components/Organization';
import ArmedSecurityGuard  from './components/ArmedSecurityGuard';
import Register  from './components/Register';
import Order from './components/Order';
import MakeOrder from './components/MakeOrder';
function App() {
    return (
        <Router> {/* This must wrap all routes */}
            <Routes>
                <Route path="/" element={<Login />} />
                <Route
                    path="/home"
                    element={
                        <>
                            <NavBar />
                            <Home />
                         
                         
                        </>
                    }
                />
                <Route path= 'securityguard' element = {<ArmedSecurityGuard/>}/>
                <Route path= 'order' element = {<Order/>}/>
                <Route path= 'register' element = {<Register/>}/>
                <Route path= 'makeorder' element = {<MakeOrder/>}/>
                <Route path= 'organization' element = {<Organization/>}/>
                <Route path='securityOffices' element={<SecurityOffices/>}/>
            </Routes>
        </Router>
    );
}

export default App;
