

export const setCheckAdmin=(isAdmin)=>{
  localStorage.setItem("isAdmin", isAdmin);

}

export const getCheckAdmin = () => {
  return localStorage.setItem("isAdmin");
} ;

export const setTokenAndRoleInLocalStorage = (token, role, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role",  role  );
    localStorage.setItem("user", JSON.stringify(user));
  };
  
  export const getTokenFromLocalStorage = () => {
    return localStorage.getItem("token");
  };

  export const getUserFromLocalStorage = () => {
    return localStorage.getItem("user");
  };
  
  export const getRoleFromLocalStorage = () => {
    return localStorage.getItem("role");
  };
  
  export const clearLocalStorage = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");

  };
  