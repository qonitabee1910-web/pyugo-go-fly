import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * RideSearch - Redirect to RideBook
 * The new comprehensive ride feature handles all stages in one interface
 */
export default function RideSearch() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/ride/book');
  }, [navigate]);

  return null;
}
