'use client'

import { ChatType } from './page'

type ChatProps = {
  chat: ChatType
}

function ChatMessage({ chat }: ChatProps) {
  const { sender, content, createdAt, sameTime } = chat
  return (
    <div>
      <div
        className={
          sender === '1' ? 'chat-wrapper' : 'chat-wrapper chat-wrapper__reverse'
        }
      >
        <div
          className={
            sender === '1' ? 'message send-message' : 'message receive-message'
          }
        >
          {content}
        </div>
        {sameTime === 1 && <div className="chat-time">{createdAt}</div>}
      </div>

      <style jsx>{`
        .chat-wrapper {
          display: flex;
          align-items: end;
          flex-direction: row;
          gap: 4px;
        }
        .chat-wrapper__reverse {
          flex-direction: row-reverse;
        }

        .message {
          padding: 10px 16px;
          border-radius: 20px;
          font-size: 14px;
          max-width: 450px;
          line-height: normal;
        }

        .send-message {
          background-color: #ecedf1;
          text-align: right;
        }

        .receive-message {
          background-color: #fbdbe0;
          text-align: left;
        }

        .chat-time {
          font-size: 12px;
          padding-bottom: 2px;
        }
      `}</style>
    </div>
  )
}

export default ChatMessage
