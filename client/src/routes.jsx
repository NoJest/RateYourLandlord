import React from 'react'
import App from './App'
import Login from './components/UserLogin/Login'
import SignUp from './components/UserLogin/Signup'
import Homepage from './components/Homepage'
import UserDashboard from './components/UserDashboard'
import Searchpage from './components/Searchpage'
import AddLandlord from './components/AddLandlord'
import LandlordPage from './components/LandlordPage'
import AddProperty from './components/AddProperty'
import AddRating from './components/AddRating'
import AddIssue from './components/AddIssue'
import ChatBot from './components/ChatBot/ChatComponent'

const routes = [
    {path: '/', element: <App />, 
        children: [ 
            {path: '/', element: <Homepage/>},
            {path: 'login', element: <Login />},
            {path: 'signup', element: <SignUp />},
            {path: 'dashboard', element: <UserDashboard />},
            {path: 'search', element: <Searchpage />},
            {path: 'addlandlord', element: <AddLandlord />},
            { path: 'landlord/:id', element: <LandlordPage /> },
            { path: 'AddProperty/:id', element: <AddProperty /> },
            { path: 'AddRating/:id', element: <AddRating /> },
            { path: 'AddIssue/:id', element: <AddIssue /> },
            { path: 'ChatBot', element: <ChatBot/> },
        ] 
    },
]
export default routes