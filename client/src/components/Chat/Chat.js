import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import InfoBar from '../control/Infobar/Infobar';
import Messages from '../Messages/Messages';
import TextContainer from '../control/TextContainer/TextContainer';
import Input from '../control/Input/Input';

import './Chat.css';
const ENDPOINT = 'http://localhost:5000/';
let socket;

const Chat = ({ location }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const { room, name } = queryString.parse(location.search);
    setRoom(room);
    setName(name);

    socket = io(ENDPOINT, { transports: ['websocket', 'polling', 'flashsocket'] });
    socket.emit('join', { name, room }, (error) => {
      if (error) alert(error);
    });

    return () => {
      socket.emit('disconnect');
      socket.off();
    };
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((messages) => [...messages, message]);
    });
    socket.on('roomData', ({ users }) => {
      setUsers(users);
    });
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (socket && message) socket.emit('sendMessage', message, () => setMessage(''));
  };

  return (
    <h1>
      {' '}
      <div className="outerContainer">
        <div className="container">
          <InfoBar room={room} />
          <Messages messages={messages} name={name} />
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
        </div>
        <TextContainer users={users} />
      </div>
    </h1>
  );
};
export default Chat;
