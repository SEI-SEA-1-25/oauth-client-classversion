import { useEffect, useState } from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Profile from './pages/Profile'
import SaveToken from './pages/SaveToken'
import jwt from 'jsonwebtoken'

const App = () => {

    const [user, setUser] = useState(null)

    // Problem: When we refresh the page, it logs us out.. EVEN THOUGH
    // We have a token!
    // Solution: useEffect to log in the user from the saved token
    useEffect(() => {
        // Check if there's a token in local storage..
        const token = localStorage.getItem('jwt')
        // If there's a token - decode it and use it as the user state
        try {
            if(token) {
                // Attempt to decode that token
                const user = jwt.decode(token)
                // If that token is expired... it'll throw an error
                // To the 'catch' block
                // console.log('this is the user', user)
                setUser(user)
            }
        } catch(err) {
            console.log(err)
            console.log('The token is expired!!!')
            localStorage.removeItem('jwt')
            setUser(null)
        }
    }, [])

    const handleLogout = () => {
        // log out the user by deleting it's JWT
        if(localStorage.getItem('jwt')) {
            localStorage.removeItem('jwt')
            // and removing the user state variable
            setUser(null)
        }
    }

    return (
        <Router>
            <Navbar user={user} handleLogout={handleLogout} />
            <div className="container">
                <Switch>
                    <Route exact path="/">
                        <Home/>
                    </Route>
                    <Route path="/profile">
                        <Profile user={user} />
                    </Route>
                    <Route path="/login">
                        <Login/>
                    </Route>
                    <Route path='/saveToken'>
                        <SaveToken setUser={setUser} />
                    </Route>
                </Switch>
            </div>
        </Router>
    )
}

export default App