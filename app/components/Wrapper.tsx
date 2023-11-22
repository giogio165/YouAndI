'use client'

import Link from 'next/link'

import { AiFillHome } from 'react-icons/ai'
import { BiPhotoAlbum } from 'react-icons/bi'
import { AiOutlineSchedule } from 'react-icons/ai'
import { AiOutlineMessage } from 'react-icons/ai'
import { AiOutlineSetting } from 'react-icons/ai'

interface Props {
  children: React.ReactNode
}

export default function Wrapper({ children }: Props) {
  return (
    <>
      <div className="container">
        <aside className="sidebar">
          <ul className="sidebar-icons">
            <Link href={'/history'} style={{ textDecoration: 'none' }}>
              <div className="sidebar-icon">
                <BiPhotoAlbum color="#eeb9be" size="50" />
                <span>앨범</span>
              </div>
            </Link>

            <Link href={'/calendar'} style={{ textDecoration: 'none' }}>
              <div className="sidebar-icon">
                <AiOutlineSchedule
                  className="sidebar-icon"
                  color="#eeb9be"
                  size="50"
                />
                <span>캘린더</span>
              </div>
            </Link>

            <Link href={'/'} style={{ textDecoration: 'none' }}>
              <div className="sidebar-icon">
                <AiFillHome
                  className="sidebar-icon"
                  color="#eeb9be"
                  size="50"
                />
                <span>홈</span>
              </div>
            </Link>

            <Link href={'/chat'} style={{ textDecoration: 'none' }}>
              <div className="sidebar-icon">
                <AiOutlineMessage
                  className="sidebar-icon"
                  color="#eeb9be"
                  size="50"
                />
                <span>채팅</span>
              </div>
            </Link>

            <Link href={'/setting'} style={{ textDecoration: 'none' }}>
              <div className="sidebar-icon">
                <AiOutlineSetting
                  className="sidebar-icon"
                  color="#eeb9be"
                  size="50"
                />
                <span>환경설정</span>
              </div>
            </Link>
          </ul>
        </aside>

        <main className="content">{children}</main>
      </div>

      <style jsx global>{`
        body {
          min-height: 100vh;
        }

        .container {
          display: flex;
          height: calc(100vh - 100px);
        }

        .sidebar {
          width: 150px;
          background-color: #f7f7f7;
          display: flex;
          overflow: auto;
        }

        .sidebar-icons {
          width: 100%;
          margin: 15vh 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
        }

        .sidebar-icon {
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
        }

        .sidebar-icon span {
          margin: 10px 0;
          color: #eeb9be;
          font-weight: 700;
        }

        .content {
          flex-grow: 1;
          padding: 10px;
          overflow: auto;
        }

        @media screen and (max-width: 525px) {
          .container {
            flex-direction: column-reverse;
          }
          .sidebar {
            width: 100%;
            height: 130px;
          }

          .sidebar-icons {
            flex-direction: row;
            margin: 0;
            justify-content: space-around;
          }

          .sidebar-icons {
            flex-direction: row;
            margin: 0;
            justify-content: space-around;
          }

          .sidebar-icon span {
            margin: 5px 0;
          }
        }
      `}</style>
    </>
  )
}
