import { useEffect } from 'react';

function Dashboard() {
  useEffect(() => {
    const handleLogin = () => {
     
      window.location.href = "http://localhost:80/login";
    };

  
    handleLogin();
  }, []);

  return null; 
}

export default Dashboard;
