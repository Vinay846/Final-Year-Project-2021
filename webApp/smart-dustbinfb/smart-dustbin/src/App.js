import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar/Navbar';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './pages/Home/Home';
import Explore from './pages/Explore/index';
import Points from './pages/Points/index';
import ProfilePage from './pages/Profile/index';
import Signup from './pages/Auth/Signup';
import Login from './pages/Auth/Login';
import AuthContext from './context/auth-context';
import {Main, Background, ToastColors} from './components/Styles/styles';
import Bins from './pages/Bins/Bins';
import ResetPassword from './pages/resetPassword/resetPassword';

function App() {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [toast, setToast] = useState({show: false, message:'', color:''});

  const userInfo = useCallback(
    async() => {
      if (token === null) {
        return;
      }
      let requestBody = {
        query: `
            query {
                profile {
                    _id
                    name
                    email
                    mnumber
                    rfid
                    sumOfPoints
                }
            }
        `
      }

      fetch('https://smart-dustbin-backend.herokuapp.com/graphql', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      })
        .then(res => {
          if (res.status !== 200 && res.status !== 201) {
            throw new Error('Failed!');
          }
          return res.json();
        })
        .then(resData => {
          setProfile(resData.data.profile);
        })
        .catch(err => {
          console.log(err);

        })
    },
    [token],
  )



  const handleProfile=(updateData)=>{
    setProfile(updateData);
  }


  const login = async (token, userId) => {
    setToken(token);
    setUserId(userId);
    const saveToken = {
      token: token,
      userId: userId
    }
    await window.localStorage.setItem("smart-token", JSON.stringify(saveToken));
    userInfo();
  }

  const logout = async () => {
    setToken(null);
    setUserId(null);
    await window.localStorage.removeItem("smart-token");
    showToast( true, "Logout successful !", ToastColors.success);
  }


  useEffect(() => {
    const fetchData = async () => {
      const smartToken = await window.localStorage.getItem("smart-token");
      if (!smartToken) {
        return;
      }
      const { token, userId } = JSON.parse(smartToken);
      setToken(token);
      setUserId(userId);
    }
    fetchData();
  }, [token])

  useEffect(() => {
    userInfo();
  }, [userInfo])

  const showToast=(show, message, color)=>{
    setToast({show: show, message:message, color:color})
  }

  useEffect(() => {
    if(!toast.show){
        return;
    }
    setTimeout(() => {
        setToast({show: false, message:'', color:''});
    }, 4000);
  }, [toast.show])

  return (
    <BrowserRouter>
      <Background />
      <AuthContext.Provider value={{
        profile, token, userId, login, logout, userInfo, handleProfile, toast, showToast
      }}>
        <Navbar />
        <Main>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/home" component={Home} />
            <Route exact path="/explore" component={Explore} />
            <Route exact path="/dustbins" component={Bins} />
            <Route path="/reset/:resetToken" component={ResetPassword}/> 
            {token && <Route exact path="/points" component={Points} />}
            {token && <Route exact path="/profile" component={ProfilePage} />}
            {!token && <Route exact path="/signup" component={Signup} />}
            {!token && <Route exact path="/login" component={Login} />}
          </Switch>
        </Main>
      </AuthContext.Provider>
    </BrowserRouter>
  );
}

export default App;
