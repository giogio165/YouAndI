'use client'

import Wrapper from '../components/Wrapper'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { auth, database } from '../../firebase'
import { ref, onValue, remove } from 'firebase/database'
import { UserInfo } from '../page'
import DeleteConfirmation from './DeleteConfirmation'

//환경설정/프로필 화면
export default function Setting() {
  const router = useRouter()
  const [userData, setUserData] = useState<UserInfo>()
  const [showConfirmation, setShowConfirmation] = useState(false)
  console.log('삭제', showConfirmation)

  const diaryNm = userData ? userData.diaryNm : ''

  const diaryCreatedDate = userData ? userData.createdAt : ''
  const date = diaryCreatedDate ? new Date(diaryCreatedDate) : undefined
  const calDate = date?.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const handleDeleteUserData = () => {
    setShowConfirmation(true)
  }

  const handleCancelDeletion = () => {
    setShowConfirmation(false)
  }

  const handleConfirmDeletion = () => {
    const user = auth.currentUser

    if (user) {
      const userId = user.uid
      const userRef = ref(database, `users/${userId}`)

      remove(userRef)
        .then(() => {
          console.log('User data deleted successfully')
        })
        .catch((error) => {
          console.error('Error deleting user data:', error.message)
        })
    }
  }

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push('/sign-in')
      } else {
        const userRef = ref(database, `users/${user.uid}`)
        onValue(userRef, (snapshot) => {
          setUserData(snapshot.val())
        })
      }
    })

    return () => {
      unsubscribeAuth()
    }
  }, [router])

  return (
    <>
      <Wrapper>
        <div>
          <div className="setting-list">
            <div className="setting-item title">
              <div>기록장 이름</div>
              <div className="user-title">
                <div>{diaryNm}</div>
                <button>수정</button>
              </div>
            </div>

            <div className="setting-item start-date">
              <div>기록장 생성일</div>
              <div>{calDate}</div>
            </div>

            <div className="setting-item secession">
              <div>파트너와 헤어지기</div>
              <div onClick={handleDeleteUserData} style={{ cursor: 'pointer' }}>
                (데이터 영구삭제)
              </div>
            </div>
          </div>
          {showConfirmation && (
            <DeleteConfirmation
              onCancel={handleCancelDeletion}
              onConfirm={handleConfirmDeletion}
            />
          )}
        </div>
      </Wrapper>

      <style jsx>{`
        .setting-list {
          width: 100%;
        }

        .setting-item {
          background: #f7f7f7;
          margin: 20px;
          padding: 20px;
        }

        .title,
        .start-date {
          display: flex;
          justify-content: space-between;
        }

        .user-title {
          display: flex;
          align-items: center;
        }

        .user-title button {
          margin-left: 10px;
          cursor: pointer;
        }

        .secession {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          cursor: pointer;
        }
      `}</style>
    </>
  )
}
