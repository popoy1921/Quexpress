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
import AdminCustomerWindow from './AdminPage/CustomerWindow/MainPage'
import AdminAds from './AdminPage/AdsDisplay/MainPage'
import AdminAnnouncement from './AdminPage/Announcement/MainPage'
import UploadPage from './AdminPage/AdsDisplay/UploadPage'
import TabletCounter from './TabletCounter/TabletCounter'
import TabletBusinessPermit from './TabletCounter/TabletBusinessPermit'
import TabletEndorsingOffices from './TabletCounter/TabletEndorsingOffices'
import TabletBusinessPermitSub from './TabletCounter/TabletBusinessPermitSub'
import TabletLocalCivilRegistry from './TabletCounter/TabletLocalCivilRegistry'
import TabletLocalCivilRegistrySub from './TabletCounter/TabletLocalCivilRegistrySub'
import TabletLocalCivilRegistryCorrection from './TabletCounter/TabletLocalCivilRegistryCorrection'
import TabletPayment from './TabletCounter/TabletPayment'
import TabletConfirmation from './TabletCounter/TabletConfirmation'
import DisplayMonitor1 from './DisplayMonitor/DisplayMonitor1'
import DisplayMonitor2 from './DisplayMonitor/DisplayMonitor2';
import TellerControl from './TellerPage/TransactionControl/MainPage'
import TellerReports from './TellerPage/Reports/MainPage'
import { FileProvider } from './AdminPage/AdsDisplay/FileContext';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

const App: React.FC = () => {
  return (
    <FileProvider>
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
          <Route path="/AdminCustomerWindow" element={<AdminCustomerWindow/>} />
          <Route path="/AdminAds" element={<AdminAds />} />
          <Route path="/AdminAnnouncement" element={<AdminAnnouncement />} />
          <Route path="/AdminAdsUpload" element={<UploadPage/>} />
          <Route path="/Teller/:TransactionCode" element={<TellerControl/>} />
          <Route path='/TellerReports/:TransactionCode' element={<TellerReports/>} />
          <Route path="/CounterTablet" element={<TabletCounter/>} />
          <Route path="/CounterBusinessPermit" element={<TabletBusinessPermit/>} />
          <Route path="/CounterBusinessPermitSub" element={<TabletBusinessPermitSub/>} />
          <Route path="/CounterEndorsingOffices" element={<TabletEndorsingOffices/>} />
          <Route path="/CounterLocalCivilRegistry" element={<TabletLocalCivilRegistry/>} />
          <Route path="/CounterLocalCivilRegistrySub" element={<TabletLocalCivilRegistrySub/>} />
          <Route path="/CounterLocalCivilRegistryCorrection" element={<TabletLocalCivilRegistryCorrection/>} />
          <Route path="/CounterPayment" element={<TabletPayment/>} />
          <Route path="/CounterConfirmation" element={<TabletConfirmation/>} />
          <Route path="/DisplayMonitor1" element={<DisplayMonitor1/>}/>
          <Route path="/DisplayMonitor2" element={<DisplayMonitor2/>}/>
          
        </Routes>
      </Router>
    </FileProvider>
  );
};

export default App;
 