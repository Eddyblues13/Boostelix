export const getUserFromLocalStorage = () => {
  try {
    const storedUser = localStorage.getItem('userData');
    if (!storedUser) return null;
    const parsedUser = JSON.parse(storedUser);
     return parsedUser;
  } 
  catch (error) {
    console.error("Failed to parse user from localStorage:", error);
    return null;
  }
};
