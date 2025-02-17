export const setAuthCookie = () => {
    document.cookie = "admin-auth=true; path=/; max-age=86400"; // 24 hours
  };
  
  export const removeAuthCookie = () => {
    document.cookie = "admin-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  };