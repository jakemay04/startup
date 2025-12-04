import React from 'react';
import './chatroom.css';

export function Chatroom() {
  const [name, setName] = React.useState('');
  const [isConnected, setIsConnected] = React.useState(false); 

  class ChatClient {
    observers = [];
    connected = false; 
    socket = null; 
    
    constructor(setConnected) { 
      const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
      
      // CRITICAL FIX: Explicitly target the backend port (5000)
      const currentHost = window.location.hostname;
      const backendPort = 5000;
      
      this.socket = new WebSocket(`${protocol}://${currentHost}:${backendPort}/ws`);
      console.log(`Attempting WS connection to: ${protocol}://${currentHost}:${backendPort}/ws`);

      this.socket.onopen = (event) => {
        this.notifyObservers('system', 'websocket', 'connected');
        this.connected = true;
        setConnected(true); 
      };

      this.socket.onmessage = async (event) => {
        let text;
        
        // 🐛 FIX: Check if event.data is already a string (most common for text messages)
        if (typeof event.data === 'string') {
          text = event.data;
        } else if (event.data instanceof Blob) {
          // If it's a Blob (e.g., in some environments or when receiving binary data), use .text()
          try {
            text = await event.data.text();
          } catch (e) {
            console.error("Error converting Blob to text:", e);
            return;
          }
        } else {
          // Handle other types like ArrayBuffer
          console.error("Received unexpected WebSocket data type:", typeof event.data);
          return;
        }

        try {
          const chat = JSON.parse(text);
          // 💡 The message is received back from the server, 
          // including the one the user just sent.
          this.notifyObservers('received', chat.name, chat.msg); 
        } catch (e) {
          console.error("Received non-JSON message:", text);
        }
      };

      this.socket.onclose = (event) => {
        this.notifyObservers('system', 'websocket', 'disconnected');
        this.connected = false;
        setConnected(false); 
      };
      
      this.socket.onerror = (error) => {
        console.error('WebSocket Error:', error);
        this.notifyObservers('system', 'websocket', 'error');
        this.connected = false;
        setConnected(false); 
      };
    }

    // Send a message over the webSocket
    sendMessage(name, msg) {
      if (this.socket.readyState !== WebSocket.OPEN) {
          console.error("WebSocket is not OPEN. Current state:", this.socket.readyState);
          return; 
      }
      
      // We rely entirely on the message being broadcast back from the server for display.
      this.socket.send(JSON.stringify({ name, msg }));
    }

    addObserver(observer) {
      this.observers.push(observer);
    }

    notifyObservers(event, from, msg) {
      this.observers.forEach((h) => h({ event, from, msg }));
    }

    removeObserver(observer) {
      this.observers = this.observers.filter((o) => o !== observer);
    }
  }
  
  const chatClient = React.useMemo(() => new ChatClient(setIsConnected), [setIsConnected]);
    
  return (
    <div className='app-container'>
      <div className='chat-card'>
        <h1 className='chat-header'>
            Live Chatroom
        </h1>
        
        <div className='chat-content'>
          <Name updateName={setName} />
          <Message name={name} isConnected={isConnected} webSocket={chatClient} />
          <Conversation webSocket={chatClient} />
        </div>
        
        <div className="chat-status">
          Status: <span className={`status-text ${isConnected ? 'status-connected' : 'status-disconnected'}`}>
            {isConnected ? 'Connected' : 'Disconnected / Connecting...'}
          </span>
        </div>
      </div>
    </div>
  );
}

function Name({ updateName }) {
  return (
    <div className='input-wrapper'>
      <fieldset className='input-group'>
        <legend className='input-legend'>My Name</legend>
        <input 
          onChange={(e) => updateName(e.target.value)} 
          id='my-name' 
          type='text'
          placeholder='Enter your nickname'
          className='text-input'
        />
      </fieldset>
    </div>
  );
}

function Message({ name, isConnected, webSocket }) {
  const [message, setMessage] = React.useState('');

  function doneMessage(e) {
    if (e.key === 'Enter') {
      sendMsg();
    }
  }

  function sendMsg() {
    webSocket.sendMessage(name, message);
    setMessage('');
  }

  const disabled = name === '' || !isConnected;
  const buttonDisabled = disabled || !message;
  
  return (
    <div className='input-wrapper'>
      <fieldset className='input-group'>
        <legend className='input-legend'>Chat</legend>
        <input 
          disabled={disabled} 
          onKeyDown={(e) => doneMessage(e)} 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          type='text'
          placeholder={isConnected ? (name ? "Type your message..." : "Enter name first") : "Connecting..."}
          className='text-input' 
        />
        <button 
          disabled={buttonDisabled} 
          onClick={sendMsg}
          className={`send-button ${buttonDisabled ? 'disabled' : ''}`}
        >
          Send
        </button>
      </fieldset>
    </div>
  );
}

function Conversation({ webSocket }) {
  const [chats, setChats] = React.useState([]);
  React.useEffect(() => {
    if (webSocket) {
      const observer = (chat) => {
        setChats((prevMessages) => [...prevMessages, chat]);
      };
      webSocket.addObserver(observer);
      
      return () => webSocket.removeObserver(observer);
    }
  }, [webSocket]);

  const chatEndRef = React.useRef(null);

  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);
  
  const chatEls = chats.map((chat, index) => {
    let styleClass = 'chat-message';
    let nameClass = 'message-name';
    
    if (chat.event === 'system') {
      // System messages
      styleClass += ' system-message';
    } else if (chat.event === 'received') {
      // The name 'me' is a placeholder you need to fix on the client or server
      // for proper user distinction if you are running a real server.
      // Assuming 'me' is currently used to distinguish the sender's own message 
      // when it comes back from the server:
      if (chat.name === 'me') { 
          // Sent message (as received back from server)
          styleClass += ' sent-message'; 
          nameClass += ' hidden'; // Hide name for user's own sent messages
      } else {
          // Received message from another user
          styleClass += ' received-message';
      }
    }
    
    return (
      <div key={index} className={styleClass}>
        <span className={nameClass}>{chat.from}:</span> {chat.msg}
      </div>
    );
  });

  return (
    <div className='conversation-box'>
      {/* Reverse the chats array before mapping to ensure latest message is at the bottom */}
      {chatEls.reverse()} 
      <div ref={chatEndRef} /> {/* Scroll target */}
    </div>
  );
}