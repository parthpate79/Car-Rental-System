import React, { useEffect, useRef, useState } from 'react';
import { Button, Input } from 'antd';
import { CarOutlined, CloseOutlined, MessageOutlined, SendOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { answerQuestion, TOPICS } from '../utils/assistant';
const greeting = { role: 'bot', text: 'Hi, I’m your DriveEase rental guide. What would you like to know about your next trip?' };
export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([greeting]);
  const [input, setInput] = useState('');
  const inputRef = useRef(null), endRef = useRef(null), triggerRef = useRef(null);
  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);
  useEffect(() => { if (open) endRef.current?.scrollIntoView({ block: 'nearest' }); }, [messages, open]);
  const close = () => { setOpen(false); triggerRef.current?.focus(); };
  const send = (value = input) => {
    const text = value.trim().slice(0, 500);
    if (!text) return;
    setMessages(previous => [...previous.slice(-38), { role: 'user', text }, { role: 'bot', ...answerQuestion(text) }]);
    setInput('');
  };
  return <div className="chat-widget-container">
    {open && <section id="rental-assistant" role="dialog" aria-label="DriveEase rental guide" className="chat-panel chat-panel-open" onKeyDown={event => { if (event.key === 'Escape') close(); }}>
      <div className="chat-panel-header"><div className="chat-header-info"><div className="chat-header-avatar"><CarOutlined /></div><div><strong>DriveEase guide</strong><small>Automated help · No account access</small></div></div><Button className="chat-close-button" type="text" aria-label="Close rental guide" icon={<CloseOutlined />} onClick={close} /></div>
      <div className="chat-messages-area" role="log" aria-live="polite" aria-relevant="additions" aria-label="Conversation">
        {messages.map((message, index) => <div key={index} className={`chat-bubble-wrapper ${message.role}`}><div className="chat-bubble"><p>{message.text}</p>{message.href && <Link className="assistant-action" to={message.href} onClick={close}>{message.action} ↗</Link>}</div></div>)}<div ref={endRef} />
      </div>
      <div className="chat-quick-replies">{TOPICS.map(topic => <button className="chat-quick-reply-btn" key={topic.label} onClick={() => send(topic.label)}>{topic.label}</button>)}</div>
      <form className="chat-input-area" onSubmit={event => { event.preventDefault(); send(); }}><Input ref={inputRef} value={input} maxLength={500} aria-label="Your rental question" onChange={event => setInput(event.target.value)} placeholder="Ask about your rental…" className="chat-text-input" /><Button type="primary" htmlType="submit" aria-label="Send question" icon={<SendOutlined />} disabled={!input.trim()} /></form>
      <button className="assistant-reset" onClick={() => setMessages([greeting])}>Clear conversation</button>
    </section>}
    <button ref={triggerRef} className="chat-trigger-button" aria-expanded={open} aria-controls="rental-assistant" aria-label={open ? 'Close rental guide' : 'Open rental guide'} onClick={() => open ? close() : setOpen(true)}><MessageOutlined /><span className="chat-trigger-label">Rental help</span></button>
  </div>;
}
