'use client'
import Wrapper from './components/Wrapper'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { auth, database } from '../firebase'
import { ref, onValue } from 'firebase/database'

export interface UserInfo {
  createdAt: number
  diaryNm: string
  email: string
  phoneNumber1: string
  phoneNumber2: string
}

//1. 홈화면
export default function Home() {
  const router = useRouter()
  const [userData, setUserData] = useState<UserInfo>()
  const [notifications, setNotifications] = useState<Array<string>>([])
  const signupDate = userData?.createdAt

  const calculateDay = (signupDate: number | undefined) => {
    if (signupDate) {
      const todayDate = new Date().getTime()
      const differenceInMs = todayDate - signupDate
      const differenceInDays = Math.floor(
        differenceInMs / (1000 * 60 * 60 * 24),
      )
      return differenceInDays
    }
    return null
  }

  const goToAlbum = () => {
    router.push('/history')
  }

  const goToCalender = () => {
    router.push('/calendar')
  }
  const dDay = calculateDay(signupDate)

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push('/sign-in')
      } else {
        const userRef = ref(database, `users/${user.uid}`)
        onValue(userRef, (snapshot) => {
          setUserData(snapshot.val())
        })

        const eventsRef = ref(database, `events/${user.uid}`)
        onValue(eventsRef, (snapshot) => {
          const newEventContainer = snapshot.val()
          if (newEventContainer) {
            Object.keys(newEventContainer).forEach((eventId) => {
              const event = newEventContainer[eventId]
              const title = event.title || 'Untitled Event'
              const newNotification = {
                type: 'calendar',
                title: `새 일정이 추가됐습니다 :${title}`,
              }
              setNotifications((prevNotifications) => [
                ...prevNotifications,
                newNotification,
              ])
            })
          }
        })

        const albumRef = ref(database, `contents/${user.uid}`)
        onValue(albumRef, (snapshot) => {
          const newAlbumContainer = snapshot.val()
          if (newAlbumContainer) {
            Object.keys(newAlbumContainer).forEach((eventId) => {
              const event = newAlbumContainer[eventId]
              const type = event.type || 'Undefined Event'
              const notification = {
                type: 'album',
                content: type.startsWith('image/')
                  ? '앨범에 사진이 추가됐습니다.'
                  : '앨범에 동영상이 추가됐습니다.',
              }
              setNotifications((preNotifications) => [
                ...preNotifications,
                notification,
              ])
            })
          }
        })
      }
    })

    return () => {
      unsubscribeAuth()
    }
  }, [router])

  return (
    <Wrapper>
      <div className="direction-changer">
        <header className="home-header"></header>

        {/* main */}
        <main className="home-main">
          {/* 프로필 사진 & Link */}
          <div className="home-main__profile">
            <div className="home-main__image-wrapper">
              <img
                src="https://mblogthumb-phinf.pstatic.net/MjAyMjAxMDdfMjUg/MDAxNjQxNTQxMTU0NjQ5.wJF87eSDcrEaj-Q1qFAn6EXBYDn5Ky-96vd8JkcQjw4g.P09T_flYvkP8ornyd1eZgT2w938smesRrZBdwKTPc-cg.JPEG.41minit/1641533871473.jpg?type=w800"
                alt="상대방의 프로필 사진"
              />
            </div>
            <div className="home-main__counter-wrapper">
              <div className="home-main__counter-title">만난지</div>
              <div>
                <span style={{ color: '#DF5B7B', fontWeight: '600' }}>
                  {dDay}
                </span>
                <span className="home-main__counter-counting">일 째</span>
              </div>
            </div>
            <div className="home-main__image-wrapper">
              <img
                src="https://post-phinf.pstatic.net/MjAyMjExMTdfMTk2/MDAxNjY4NjUwMjc5NDg3.eJQEdOpjRAniq4HQmFKfiQu3IfM6I2lia-TovWEzr1Ig.L9eqGwRs9gzkBxfWk3-AU3rvk1z5haAv093Isfvvr24g.JPEG/8d45fd407a3344b9b7457538ec64e0f8.jpg?type=w1200"
                alt="사용자의 프로필 사진"
              />
            </div>
          </div>

          {/* 새로운 활동 알림 */}
          <div className="home-main__alarm-wrapper">
            {notifications.map((notification, index) => (
              <div key={index} className="home-main__notification-item">
                <div className="home-main__alarm-item">
                  {/* 캘린더 */}
                  <div
                    onClick={goToCalender}
                    className="home-main__alarm-item--read"
                  >
                    {notification.title}
                  </div>
                  <div
                    onClick={goToAlbum}
                    className="home-main__alarm-item--read"
                  >
                    {notification.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      <style jsx>{`
        .direction-changer {
          display: flex;
          flex-direction: column;
          width: 100%;
          gap: 70px;
        }

        // header
        .home-header {
          width: 100%;
          height: 35px;
          font-size: small;

          display: flex;
          flex-direction: row;
          justify-content: end;
          align-items: center;
          gap: 5px;
        }

        .icon-wrapper {
          width: 45px;
          height: 25px;
          background: #fbdbe0;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 20px;
          cursor: pointer;
          margin-right: 10px;
          box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
        }

        .icon-wrapper a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .icon-wrapper img {
          width: 35%;
        }

        // main
        .home-main {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 80px;
          margin-bottom: 30px;
        }

        .home-main__profile {
          display: flex;
          align-items: center;
          gap: 50px;
        }

        .home-main__profile img {
          width: 100px;
        }

        .home-main__image-wrapper {
          width: 100px;
          height: 100px;
          overflow: hidden;
          border-radius: 50%;
        }

        .home-main__counter-wrapper {
          display: flex;
          flex-direction: column;
          justify-contents: center;
          align-items: center;
          gap: 5px;
        }

        .home-main__counter-title {
          font-size: small;
        }

        .home-main__alarm-wrapper {
          display: flex;
          align-items: center;
          flex-direction: column;
          gap: 20px;
        }

        .home-main__alarm-item {
          width: fit-content;
          background-color: #eeb9be;
          padding: 20px;
          border-radius: 20px;
        }

        .home-main__alarm-item--read {
          color: black;
        }

        {/* .home-main__alarm-item--new {
          background-color: #df5b7b;
        } */}
      `}</style>
    </Wrapper>
  )
}
