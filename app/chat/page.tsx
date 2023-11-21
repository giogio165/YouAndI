'use client'

import Wrapper from '../components/Wrapper'
import ChatMessage from './message'

import { useCallback, useEffect, useState } from 'react'

import app from '../../firebase'
import { auth } from '../../firebase'
import { getDatabase, onValue, push, ref } from 'firebase/database'
import { ContentType } from '../history/album'

export type ChatType = {
  id: string
  sender: string
  createdAt: string
  content: string
}

//4. 채팅화면
export default function Chat() {
  const [chatMessages, setChatMessages] = useState<ChatType[]>([])
  const [inputMessage, setInputMessage] = useState('')

  const database = getDatabase(app)

  const user = auth.currentUser
  const userId = user?.uid

  const addMessage = async (
    sender: string,
    content: string,
    createdAt: string,
  ) => {
    const chatRef = ref(database, `chatMessages/${userId}`)
    try {
      await push(chatRef, {
        sender,
        content,
        createdAt,
      })
      getChatMessages(setChatMessages)
      setInputMessage('')
    } catch (e) {
      console.error('Error adding message: ', e)
    }
  }
  const getChatMessages = (callback: (messages: ChatType[]) => void) => {
    const chatRef = ref(database, `chatMessages/${userId}`)
    onValue(chatRef, (snapshot) => {
      const messages: ChatType[] = []
      snapshot.forEach((childSnapshot) => {
        messages.push({ id: childSnapshot.key, ...childSnapshot.val() })
      })
      callback(messages)
    })
  }

  useEffect(() => {
    getChatMessages(setChatMessages)
  }, [])

  const handleChatChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputMessage(e.target.value)
    },
    [],
  )
  const handleSubmit = () => {
    const sender = '2'
    const createdAt = new Date().toLocaleTimeString()
    addMessage(sender, inputMessage, createdAt)
  }

  return (
    <Wrapper>
      <div className="chatting">
        <div className="chatting-wrapper">
          {chatMessages.map((chat) => (
            <ChatMessage key={chat.id} chat={chat}></ChatMessage>
          ))}
        </div>

        <div className="chatting-input">
          <input
            className="chatting-input__text"
            placeholder="메시지를 입력해주세요!"
            onChange={handleChatChange}
            value={inputMessage}
          />
          <div className="send-chat-wrapper">
            <img src="send-chat.svg" alt="submit_btn" onClick={handleSubmit} />
          </div>
        </div>
      </div>
      <style jsx>{`
        .chatting {
          width: 90%;
          height: 75vh;
          padding: 30px 40px;
          display: flex;
          flex-direction: column;
          flex-wrap: nowrap;
          justify-content: space-between;
        }

        .chatting-wrapper {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .chatting-input {
          position: sticky;
          height: 25px;
          top: 85vh;
          background-color: #ecedf1;
          padding: 10px 20px;
          border-radius: 20px;
          font-size: 14px;

          display: flex;
          align-items: center;
          gap: 20px;
        }

        .chatting-input img {
          width: 20px;
        }

        .input-file__label {
          cursor: pointer;
        }

        .chatting-input__text {
          width: calc(100% - 40px);
          height: fit-content;
          border: none;
          background-color: transparent;
          overflow: auto;
          resize: none;
        }

        .chatting-input__text:hover,
        .chatting-input__text:focus {
          outline: none;
        }

        .send-chat-wrapper {
          width: 15px;
          height: 15px;
          background-color: #df5b7b;
          padding: 5px;
          border-radius: 45px;
        }

        .send-chat-wrapper img {
          width: 15px;
        }

        @media screen and (max-width: 525px) {
          .chatting {
            height: 60vh;
          }
        }
      `}</style>
    </Wrapper>
  )
}
