import React from 'react';

export default React.createContext({
    token: null,
    userId: null,
    profile: null,
    toast: null,
    login:(token, userId) => {},
    logout: ()=> {},
    userInfo: ()=> {},
    handleProfile: (updateData)=>{},
    showToast: ()=> {},
    hideToast: ()=> {},
})