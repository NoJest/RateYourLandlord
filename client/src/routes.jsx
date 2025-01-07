import React from 'react'
import App from './App'
import Login from './components/UserLogin/Login'
import SignUp from './components/UserLogin/Signup'
import Homepage from './components/Homepage'
import UserDashboard from './components/UserDashboard'
import Searchpage from './components/Searchpage'
import AddLandlord from './components/AddLandlord'
import LandlordPage from './components/LandlordPage'

const routes = [
    {path: '/', element: <App />, 
        children: [ 
            {path: 'homepage', element: <Homepage/>},
            {path: 'login', element: <Login />},
            {path: 'signup', element: <SignUp />},
            {path: 'dashboard', element: <UserDashboard />},
            {path: 'search', element: <Searchpage />},
            {path: 'addlandlord', element: <AddLandlord />},
            { path: 'landlord/:id', element: <LandlordPage /> },
        ] 
    },
]
export default routes