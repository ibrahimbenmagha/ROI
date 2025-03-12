

  
  export const setTokenAndRoleInLocalStorage = (role, user) => {
      localStorage.setItem("role",  Role  );
      localStorage.setItem("user", JSON.stringify(user));
    };
    
    export const getUserFromLocalStorage = () => {
      return localStorage.getItem("user");
    };
    
    export const getRoleFromLocalStorage = () => {
      return localStorage.getItem("role");
    };
    
    export const clearLocalStorage = () => {
      localStorage.removeItem("role");
      localStorage.removeItem("user");
  
    };
    