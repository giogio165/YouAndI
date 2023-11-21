import React, { useEffect, useState } from 'react'
import AlbumPopup from './popup'
import { Comment } from './comment'

import {
  getDatabase,
  ref as databaseRef,
  remove,
  onValue,
} from 'firebase/database'

export interface ContentType {
  contentId: string
  type: string
  name: string
  downloadURL: string
  userId: string
}

export interface AlbumProps {
  contents: ContentType[]
  setContents: (prevContents: ContentType[]) => void
}

const Album: React.FC<AlbumProps> = ({ contents, setContents }) => {
  const [contentClicked, setContentClicked] = useState(false)
  const [clickedContentIndex, setClickedContentIndex] = useState<number>(0)
  //각 콘텐츠 별 댓글 저장
  const [comments, setComments] = useState<{ [index: number]: Comment[] }>({})

  const contentClickHandler = (index: number) => {
    setContentClicked(!contentClicked)
    setClickedContentIndex(index)
  }

  return (
    <div className="Album">
      <div className="album-grid">
        {contents.length > 0 &&
          contents.map((content, index) => (
            <div key={index} className="content-item">
              {content.type.startsWith('image/') ||
              content.type.startsWith('video/') ? (
                <div
                  className="media-container"
                  onClick={() => contentClickHandler(index)}
                >
                  {content.type.startsWith('image/') ? (
                    <img src={content.downloadURL} alt={`Image ${index}`} />
                  ) : content.type.startsWith('video/') ? (
                    <video controls src={content.downloadURL} />
                  ) : null}
                </div>
              ) : null}
            </div>
          ))}
      </div>
      {contentClicked && (
        <div className="content-popup">
          <AlbumPopup
            setContents={setContents}
            setContentClicked={setContentClicked}
            contents={contents[clickedContentIndex]}
            comments={comments[clickedContentIndex] || []}
            setComments={(newComments) =>
              setComments({
                ...comments,
                [clickedContentIndex]: newComments,
              })
            }
          />
        </div>
      )}
      <style jsx>{`
        .Album {
        }

        .album-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }

        .media-container {
          max-height: 200px;
          max-width: 200px;
          overflow: hidden;
          position: relative;
        }

        .media-container img,
        .media-container video {
          width: 100%;
          height: 100%;
        }
        .content-item {
        }

        .content-popup {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.7);
          z-index: 1000;
        }
      `}</style>
    </div>
  )
}

export default Album
