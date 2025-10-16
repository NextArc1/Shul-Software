import React from 'react';
import NotFound from '../pages/NotFound';

const MasterAdminRoute = ({ children }) => {
  // Check if user is master admin
  const checkMasterAdmin = () => {
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        return user.is_staff === true;
      }
      return false;
    } catch (error) {
      console.error('Error checking master admin status:', error);
      return false;
    }
  };

  const isMasterAdmin = checkMasterAdmin();

  // If not master admin, show 404 page
  if (!isMasterAdmin) {
    return <NotFound />;
  }

  // If master admin, render the children (the protected page)
  return children;
};

export default MasterAdminRoute;
