import React, { useEffect, useState } from 'react'
import { Comment } from './comment'

interface CommentRecordProps {
  comments: Comment[]
  setComments: (comments: Comment[]) => void
  onDelete: (index: number) => void
}

const CommentRecord: React.FC<CommentRecordProps> = ({
  comments,
  onDelete,
}) => {
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
  //코멘트 지우기 확인 메시지
  const deleteHandler = (index: number) => {
    setDeleteIndex(index)
  }
  //코멘트 지우기
  const deleteComment = () => {
    if (deleteIndex !== null) {
      onDelete(deleteIndex)
      setDeleteIndex(null)
    }
  }
  console.log('인덱스', deleteIndex)
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (
        deleteIndex !== null &&
        e.target instanceof Element &&
        !e.target.classList.contains('comment-record-delete-btn')
      ) {
        setDeleteIndex(null)
      }
    }
    document.addEventListener('click', handleDocumentClick)
    return () => {
      document.removeEventListener('click', handleDocumentClick)
    }
  }, [deleteIndex, onDelete])

  return (
    <div className="records">
      {comments.map((comment, index) => (
        <div className="comment-records" key={index}>
          <div className="comment-record-con">
            <div className="comment-record-text">{comment.text}</div>
            <div className="comment-record-timestamp">{comment.timestamp}</div>
          </div>
          <button
            className="comment-record-delete-btn"
            onClick={() => {
              deleteHandler(index)
            }}
          >
            :
          </button>
          {deleteIndex === index && (
            <div className="delete-btn-comment" onClick={deleteComment}>
              삭제
            </div>
          )}
        </div>
      ))}
      <style jsx>
        {`
          .record {
            width: 100%;
            height: 100%;
          }
          .comment-records {
            width: 100%;
            display: flex;
            justify-content: space-between;
            margin: 20px 0 20px 0;
          }
          .comment-record-con {
            position: relative;
            display: flex;
            flex-direction: column;
            color: black;
          }
          .comment-record-text {
            font-size: 15px;
            margin-bottom: 10px;
          }
          .comment-record-timestamp {
            font-size: 10px;
          }
          .comment-record-delete-btn {
            border: none;
            background-color: transparent;
            font-size: 15px;
            color: black;
          }
          .delete-btn-comment {
            position: absolute;
            right: 25px;
            color: black;
            border: none;
            font-size: 12px;
          }
        `}
      </style>
    </div>
  )
}

export default CommentRecord
