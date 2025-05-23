import React, { createContext, useContext, useEffect, useState } from 'react';


const UserCon = createContext();

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setUser(userInfo);
    }
  }, []);

  return (
    <UserCon.Provider value={{ user, setUser }}>
      {children}
    </UserCon.Provider>
  );
};

export const useUserContext = () => useContext(UserCon);

export default UserContextProvider;
