import React from 'react';
import './App.css';
import MainPage from './MainPage'
import SignInAdmin from './AdminPage/SignInAdmin'
import SignInAccount from './TellerPage/SignIn'
import SignInCustomer from './CustomerPage/SignInCustomer'
import SignUpCustomer from './CustomerPage/NewSignUpCustomer'
import SuccessfulRegister from './CustomerPage/SuccessfulRegister'
import SignUpTeller from './AdminPage/AccountManagement/SignUpTeller'
import SignUpCashier from './AdminPage/AccountManagement/SignUpCashier'
import EditAccount from './AdminPage/AccountManagement/EditAccount'
import AdminDashboard from './AdminPage/Dashboard/MainPage'
import AdminAccountManagement from './AdminPage/AccountManagement/MainPage'
import AdminReports from './AdminPage/Reports/MainPage'
import AdminStatus from './AdminPage/StatusWindow/MainPage'
import TabletCounter from './TabletCounter/TabletCounter'
import TabletBusinessPermit from './TabletCounter/TabletBusinessPermit'
import TabletLocalCivilRegistry from './TabletCounter/TabletLocalCivilRegistry'
import TabletConfirmation from './TabletCounter/TabletConfirmation'
import TabletPrint from './TabletCounter/CounterPrint'
import DisplayMonitor from './DisplayMonitor/DisplayNumber'
import TellerControl from './TellerPage/TransactionControl/MainPage'
import TellerReports from './TellerPage/Reports/MainPage'
import CashierReports from './CashierPage/Reports/Dashboard'
import CashierControl from './CashierPage/Dashboard'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<MainPage/>} />
        <Route path="/SignInAdmin" element={<SignInAdmin/>} />
        <Route path="/SignUpTeller" element={<SignUpTeller/>} />
        <Route path="/SignUpCashier" element={<SignUpCashier/>} />
        <Route path="/EditAccount/:UserId" element={<EditAccount/>} />
        <Route path="/SignInAccount" element={<SignInAccount/>} />
        <Route path="/SignUpCustomer" element={<SignUpCustomer/>} />
        <Route path="/SuccessfulRegistration/:AccountId" element={<SuccessfulRegister/>} />
        <Route path="/SignInCustomer" element={<SignInCustomer/>} />
        <Route path="/Admin" element={<AdminDashboard/>} />
        <Route path="/AdminAccountManagement" element={<AdminAccountManagement/>} />
        <Route path="/AdminReport" element={<AdminReports/>} />
        <Route path="/AdminStatusWindow" element={<AdminStatus/>} />
        <Route path="/Teller/:TransactionCode" element={<TellerControl/>} />
        <Route path='/TellerReports/:TransactionCode' element={<TellerReports/>} />
        <Route path="/Cashier" element={<CashierControl/>} />
        <Route path="/CashierReports" element={<CashierReports/>} />
        <Route path="/Counter" element={<TabletCounter/>} />
        <Route path="/CounterTablet" element={<TabletCounter/>} />
        <Route path="/CounterBusinessPermit" element={<TabletBusinessPermit/>} />
        <Route path="/CounterLocalCivilRegistry" element={<TabletLocalCivilRegistry/>} />
        <Route path="/CounterConfirmation" element={<TabletConfirmation/>} />
        <Route path="/CounterPrint" element={<TabletPrint/>} />
        <Route path="/DisplayMonitor" element={<DisplayMonitor/>}/>
        
      </Routes>
    </Router>
  );
};

export default App;
 