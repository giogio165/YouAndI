import React, { useEffect, useState } from 'react'
import CommentRecord from './record'

import app from '../../firebase'
import {
  getDatabase,
  ref as databaseRef,
  push,
  set,
  onValue,
  remove,
} from 'firebase/database'
import { auth } from '../../firebase'

interface AlbumCommentProps {
  comments: Comment[]
  setComments: (comments: Comment[]) => void
  contents: {
    contentId: string
    type: string
    name: string
    downloadURL: string
  }
}

export interface Comment {
  comment_id: string
  member_id: string
  content_id: string
  text: string
  timestamp: string
}

const AlbumComment: React.FC<AlbumCommentProps> = ({
  comments,
  setComments,
  contents,
}) => {
  const [comment, setComment] = useState('')

  const database = getDatabase(app)

  const user = auth.currentUser
  const userId = user?.uid

  //댓글 가져오기
  useEffect(() => {
    if (contents) {
      const selectedImageCommentsRef = databaseRef(
        database,
        `comments/${contents.contentId}`,
      )

      const unsubscribeComments = onValue(
        selectedImageCommentsRef,
        (snapshot) => {
          const data = snapshot.val()
          if (data) {
            const commentsArray: Comment[] = Object.values(data)
            setComments(commentsArray)
          } else {
            setComments([])
          }
        },
        {
          onlyOnce: true,
        },
      )

      return () => unsubscribeComments()
    }
  }, [database, contents])

  const handleCommentChange = (e: {
    target: { value: React.SetStateAction<string> }
  }) => {
    setComment(e.target.value)
  }
  //댓글추가서브밋
  const handleSubmit = () => {
    const newComment: Comment = {
      content_id: contents.contentId,
      member_id: userId || '',
      text: comment,
      timestamp: new Date().toLocaleString(),
      comment_id: '',
    }
    setComments([...comments, newComment])
    addComment(newComment)
    setComment('')
  }

  //댓글추가
  const addComment = (newComment: Comment) => {
    const commentsRef = databaseRef(database, `comments/${contents.contentId}`)
    const newCommentRef = push(commentsRef)
    const commentId = newCommentRef.key
    const commentWithId = { ...newComment, comment_id: commentId }
    set(newCommentRef, commentWithId)
  }

  //댓글삭제
  const handleCommentDelete = async (commentIndex: number) => {
    try {
      const commentIdToDelete = comments[commentIndex]?.comment_id

      if (commentIdToDelete) {
        const commentRef = databaseRef(
          database,
          `comments/${contents.contentId}/${commentIdToDelete}`,
        )
        await remove(commentRef)

        const updatedComments = comments.filter(
          (_, index) => index !== commentIndex,
        )
        setComments(updatedComments)
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }

  return (
    <div className="AlbumComment">
      <div className="comment-container">
        <div className="comment-record-component">
          <CommentRecord
            comments={comments}
            setComments={setComments}
            onDelete={handleCommentDelete}
          />
        </div>
        <div className="record-writing-box">
          <textarea
            className="comment-record-textarea"
            placeholder="댓글 달기"
            value={comment}
            onChange={handleCommentChange}
          />
          <button
            className="writing-box-btn
          "
            onClick={handleSubmit}
          >
            ⬆
          </button>
        </div>
      </div>
      <style jsx>{`
        .AlbumComment {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .comment-container {
          width: 100%;
          height: 70%;
          background-color: white;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .comment-record-component {
          width: 80%;
          height: 80%;
          overflow: scroll;
        }
        .record-writing-box {
          display: flex;
          width: 80%;
          height: 8%;
          align-items: center;
          justify-content: center;
          background-color: #ecedf1;
          border-radius: 30px;
        }
        .writing-box-btn {
          width: 30px;
          height: 30px;
          border-radius: 50px;
          border: none;
          color: white;
          background-color: #de5a7b;
        }
        .comment-record-textarea {
          border: none;
          width: 85%;
          height: 100%;
          line-height: 30px;
          height: 30px;
          background-color: transparent;
        }
      `}</style>
    </div>
  )
}

export default AlbumComment
