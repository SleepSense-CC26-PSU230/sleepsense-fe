import React from 'react';
import '../styles/chat.css';

// ── Safe time formatter ───────────────────────────────────────
function formatTimeSafe(timestamp) {
  if (!timestamp) return null;
  const d = new Date(timestamp);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

// ── Simple Markdown → JSX parser ─────────────────────────────
function parseMarkdown(text) {
  if (!text) return null;
  const lines = text.split('\n');
  const elements = [];
  let keyIdx = 0;

  lines.forEach((line) => {
    const key = keyIdx++;
    if (line.trim() === '') { elements.push(<div key={key} style={{ height: 6 }} />); return; }
    if (/^#{1,3}\s/.test(line)) {
      const content = line.replace(/^#{1,3}\s+/, '');
      elements.push(<p key={key} style={{ fontWeight: 700, marginBottom: 2 }}>{inlineFormat(content)}</p>);
      return;
    }
    if (/^[\-\*]\s/.test(line)) {
      const content = line.replace(/^[\-\*]\s+/, '');
      elements.push(
        <div key={key} style={{ display: 'flex', gap: 6, marginBottom: 2 }}>
          <span style={{ flexShrink: 0 }}>•</span><span>{inlineFormat(content)}</span>
        </div>
      );
      return;
    }
    if (/^\d+\.\s/.test(line)) {
      const num = line.match(/^(\d+)\./)[1];
      const content = line.replace(/^\d+\.\s+/, '');
      elements.push(
        <div key={key} style={{ display: 'flex', gap: 6, marginBottom: 2 }}>
          <span style={{ flexShrink: 0, fontWeight: 600 }}>{num}.</span><span>{inlineFormat(content)}</span>
        </div>
      );
      return;
    }
    elements.push(<p key={key} style={{ marginBottom: 2 }}>{inlineFormat(line)}</p>);
  });

  return elements;
}

function inlineFormat(text) {
  const parts = [];
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
  let last = 0; let match; let idx = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(<span key={idx++}>{text.slice(last, match.index)}</span>);
    if (match[0].startsWith('**')) parts.push(<strong key={idx++}>{match[2]}</strong>);
    else if (match[0].startsWith('*')) parts.push(<em key={idx++}>{match[3]}</em>);
    else if (match[0].startsWith('`')) parts.push(
      <code key={idx++} style={{ background: 'rgba(0,0,0,0.1)', borderRadius: 3, padding: '0 4px', fontFamily: 'monospace', fontSize: '0.9em' }}>{match[4]}</code>
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(<span key={idx++}>{text.slice(last)}</span>);
  return parts.length > 0 ? parts : text;
}

export default function ChatBubble({ message, isUser }) {
  const timeStr = formatTimeSafe(message.timestamp);

  return (
    <div className={`chat-bubble-wrapper ${isUser ? 'user' : 'assistant'}`}>
      <div className={`chat-bubble ${isUser ? 'user' : 'assistant'}`}
        style={{ lineHeight: 1.6, fontSize: '0.88rem' }}>
        {isUser ? message.content : parseMarkdown(message.content)}
      </div>
      {timeStr && (
        <span className="chat-bubble-time">{timeStr}</span>
      )}
    </div>
  );
}
