import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function Home() {
  const navigate = useNavigate();

  const createList = async () => {
    const res = await api.post('/lists');
    navigate(`/l/${res.data.id}`);
  };

  return (
    <div style={{
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      marginLeft: 600,  
      }}>
      <h1>ShopSmart</h1>
      <button onClick={createList}>Создать список</button>
    </div>
  );
}
