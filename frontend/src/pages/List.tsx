import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import { socket } from '../services/socket';

type Item = {
  id: string;
  text: string;
  bought: boolean;
  listId: string;
};

export default function List() {
  const { id } = useParams<{ id: string }>();
  const [items, setItems] = useState<Item[]>([]);
  const [newText, setNewText] = useState<string>('');

  useEffect(() => {
    if (!id) return;

    /*
      Загрузка существующих элементов списка
    */
    api.get(`/lists/${id}`)
      .then(res => setItems(res.data.items))
      .catch(err => console.error('Ошибка загрузки списка:', err));

    /*
      WebSocket подписка
    */  
    socket.emit('join', id);
    socket.on('itemAdded', (item: Item) => {
      setItems(prev => [...prev, item]);
    });
    socket.on('itemUpdated', (updated: Item) => {
      setItems(prev => prev.map(i => (i.id === updated.id ? updated : i)));
    });
    socket.on('itemDeleted', ({ id: deletedId }: { id: string }) => {
      setItems(prev => prev.filter(i => i.id !== deletedId));
    });

    return () => {
      socket.off('itemAdded');
      socket.off('itemUpdated');
      socket.off('itemDeleted');
    };
  }, [id]);


  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    try {
      await api.post(`/lists/${id}/items`, { text: newText });
      setNewText('');
    } catch (err) {
      console.error('Ошибка при добавлении товара:', err);
    }
  };

  /*
    Копирование ссылки на список в буфер
  */
  const handleShare = () => {
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Ссылка скопирована!'))
        .catch(() => alert('Ошибка копирования ссылки'));
  };


  if (!id) {
    return <div>Неверный URL</div>;
  }

  return (
    <div style={{
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      marginLeft: 470,  
      }}
      >
      <h2>Список: {id}</h2>
      <button onClick={handleShare} style={{ marginBottom: 20 }}>
        Поделиться списком
      </button>

      <form onSubmit={handleAdd}
      style=
      {{ marginBottom: 40,
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center', 
      }}>
        <input
          type="text"
          value={newText}
          onChange={e => setNewText(e.target.value)}
          placeholder="Новый товар"
          style={{ padding: 8, width: '70%', marginRight: 8 }}
        />
        <button type="submit" style={{marginTop: 20}}>Добавить</button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {items.map(i => (
          <li key={i.id} style={{ marginBottom: 8, display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={i.bought}
              onChange={async () => {
                await api.patch(`/items/${i.id}`, { bought: !i.bought });
              }}
              style={{ marginRight: 8 }}
            />
            <span style={{ textDecoration: i.bought ? 'line-through' : 'none', flexGrow: 1 }}>
              {i.text}
            </span>
            <button
              onClick={async () => {
                await api.delete(`/items/${i.id}`);
              }}
              style={{ marginLeft: 12 }}
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
