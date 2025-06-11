import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to shop page since that's our main functionality
    navigate('/shop', { replace: true });
  }, [navigate]);

  return null;
};

export default HomePage;