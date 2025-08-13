import { useEffect, useState } from 'react';
import './App.css';
import io from 'socket.io-client';

const socket = io('http://localhost:3002');

function App() {

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit('message', message);
    const myMessage = {
      from: 'Me',
      body: message,
    }
    setMessages([ myMessage, ...messages])
    setMessage('')
  }

  useEffect(() => {
    const reciveMessage = (message) => {
      setMessages([message, ...messages])
    }
    socket.on('message', reciveMessage)
    return () => {
      socket.off('message', reciveMessage)
    }
  }, [messages])

  return (
    <div className='h-screen bg-zinc-800 text-white flex  items-center justify-center'>
      <form onSubmit={handleSubmit} className='bg-zinc-900 p-10'>
      <h1 className='text-2xl font-bold my-2'>Chat React</h1>
        <input value={message} type="text" onChange={e => setMessage(e.target.value)} className='w-full bg-white border-2 border-zinc-500 p-2 text-black' />
        <ul className='h-80 overflow-y-auto'>
          {
            messages.map((message, index) => (
              <li className={`my-2 p-2 table text-sm rounded-md ${message.from === 'Me' ? 'bg-sky-700 ml-auto' : 'bg-black'}`} key={index}>
                <p>{message.from}: {message.body}</p>
              </li>
            ))
          }
        </ul>
      </form>
    </div>
  );
}

export default App;
