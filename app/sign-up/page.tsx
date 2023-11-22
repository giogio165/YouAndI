'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

// import DatePicker from 'react-datepicker'

import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, database } from '../../firebase'
import 'react-datepicker/dist/react-datepicker.css'
import { ref, set, serverTimestamp } from 'firebase/database'

//회원가입 화면
export default function SignUp() {
  const [step, setStep] = useState(3)

  //이메일, 비밀번호, 전화번호, 시작일, 다이어리 이름
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phoneNumber1, setPhoneNumber1] = useState('')
  const [phoneNumber2, setPhoneNumber2] = useState('')
  // const [startDate, setStartDate] = useState(new Date())
  const [diaryNm, setDiaryNm] = useState('유앤아이')

  //오류메시지 상태저장
  const [emailMessage, setEmailMessage] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [phoneNumber1Message, setPhoneNumber1Message] = useState('')
  const [phoneNumber2Message, setPhoneNumber2Message] = useState('')
  // const [diaryNmMessage, setDiaryNmMessage] = useState('')

  const router = useRouter()

  // 이메일 유효성 검사
  const onEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const emailRegex =
        /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/

      const emailCurrent = e.target.value
      setEmail(emailCurrent)

      if (!emailRegex.test(emailCurrent)) {
        setEmailMessage('이메일 형식이 틀렸습니다.')
      } else {
        setEmailMessage('')
      }
    },
    [],
  )

  // 비밀번호 유효성 검사
  const onPasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const passwordRegex =
        /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/
      const passwordCurrent = e.target.value
      setPassword(passwordCurrent)

      if (!passwordRegex.test(passwordCurrent)) {
        setPasswordMessage(
          '숫자+영문자+특수문자 조합으로 8자리 이상 입력해주세요!',
        )
      } else {
        setPasswordMessage('')
      }
    },
    [],
  )

  // 전화번호 유효성 검사
  const onPhoneNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, num: string) => {
      const phoneNuberRegex = /^010([0-9]{4})([0-9]{4})$/

      const phoneNumberCurrent = e.target.value

      if (num === 'num1') {
        setPhoneNumber1(phoneNumberCurrent)

        if (!phoneNuberRegex.test(phoneNumberCurrent)) {
          setPhoneNumber1Message('전화번호 형식을 확인해주세요')
        } else {
          setPhoneNumber1Message('')
        }
      }

      if (num === 'num2') {
        setPhoneNumber2(phoneNumberCurrent)

        if (!phoneNuberRegex.test(phoneNumberCurrent)) {
          setPhoneNumber2Message('전화번호 형식을 확인해주세요')
        } else {
          setPhoneNumber2Message('')
        }
      }
    },
    [],
  )

  // 다이어리 이름 변경
  const handleDiaryNmChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDiaryNm(e.target.value)
    },
    [],
  )

  const handleSubmit = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      )
      const user = userCredential.user

      const userData = {
        email,
        phoneNumber1,
        phoneNumber2,
        diaryNm,
        createdAt: serverTimestamp(),
      }

      const userRef = ref(database, 'users/' + user.uid)
      await set(userRef, userData)

      // // Create user-specific paths in your database
      // const userCalendarPath = `calendars/${user.uid}`
      // const userAlbumPath = `albums/${user.uid}`
      // // Store user-specific data in the database
      // await set(ref(database, userCalendarPath), {
      //   // User-specific calendar data
      //   // ...
      // })
      // await set(ref(database, userAlbumPath), {
      //   // User-specific album data
      //   // ...
      // })
      console.log('User registered:', user)
      router.push('/sign-in')
    } catch (error: any) {
      console.error('Error during registration:', error.message)
    }
  }

  return (
    <>
      <div className="sign-up">
        {step === 1 && (
          <div className="step step1">
            <p>1) 가입을 위한 정보를 입력해 주세요.</p>

            <div className="inputs">
              <input
                placeholder="이메일"
                value={email}
                onChange={onEmailChange}
              />
              {emailMessage && <p className="errorMessage">{emailMessage}</p>}
              <input
                placeholder="비밀번호"
                value={password}
                onChange={onPasswordChange}
              />
              {passwordMessage && (
                <p className="errorMessage">{passwordMessage}</p>
              )}
            </div>

            <button
              className="next-btn"
              onClick={() => setStep(2)}
              disabled={
                !email ||
                !password ||
                emailMessage !== '' ||
                passwordMessage !== ''
              }
            >
              다음 단계
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="step step2">
            <div className="inputs">
              <p>2) 본인과 상대방의 전화번호를 입력해 주세요.</p>
              <input
                placeholder="내 전화번호(11자리 '-' 없이 입력)"
                value={phoneNumber1}
                maxLength={11}
                onChange={(e) => onPhoneNumberChange(e, 'num1')}
              />
              {phoneNumber1Message && (
                <p className="errorMessage">{phoneNumber1Message}</p>
              )}
              <input
                placeholder="상대 전화번호"
                value={phoneNumber2}
                maxLength={11}
                onChange={(e) => onPhoneNumberChange(e, 'num2')}
              />
              {phoneNumber2Message && (
                <p className="errorMessage">{phoneNumber2Message}</p>
              )}
            </div>

            <button className="prev-btn" onClick={() => setStep(1)}>
              이전 단계
            </button>
            <button
              className="next-btn"
              onClick={() => setStep(3)}
              disabled={
                !phoneNumber1 ||
                !phoneNumber2 ||
                phoneNumber1Message !== '' ||
                phoneNumber2Message !== ''
              }
            >
              다음 단계
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="step step3">
            <p>3) 가입을 위한 정보를 입력해 주세요.</p>
            <div className="inputs">
              {/* <input placeholder="데이트 시작일" value={startDate} /> */}
              {/* <DatePicker
                dateFormat="yyyy.MM.dd"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
              /> */}
              <input
                placeholder="기록장 이름"
                value={diaryNm}
                onChange={handleDiaryNmChange}
              />
              {!diaryNm && (
                <p className="errorMessage">기록장 이름을 지어 주세요.</p>
              )}
            </div>

            <button className="prev-btn" onClick={() => setStep(2)}>
              이전 단계
            </button>

            <button
              className="sign-up-btn"
              onClick={handleSubmit}
              disabled={!diaryNm}
            >
              회원가입 완료
            </button>
          </div>
        )}
      </div>

      <style jsx global>{`
        .sign-up {
          width: 100%;
          height: calc(100vh - 100px);
          background: #f7f7f7;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .inputs {
          width: 500px;
          display: flex;
          flex-direction: column;
          margin-bottom: 50px;
        }

        .step p {
          display: block;
          margin-bottom: 30px;
          text-align: center;
        }

        .inputs input {
          width: 100%;
          border: none;
          background: none;
          outline: none;
          margin: 10px 0;
          padding-bottom: 10px;
          border-bottom: 1px solid #000;
        }

        .errorMessage {
          color: red;
          font-weight: 300;
        }

        .prev-btn,
        .next-btn,
        .sign-up-btn {
          border: none;
          width: 500px;
          height: 40px;
          display: block;
          background: #fff;
          border-radius: 5px;
          margin: 10px 0;
          cursor: pointer;
        }

        .prev-btn,
        .next-btn {
          background-color: transparent;
          border: 1px solid #ccc;
        }

        .sign-up-btn {
          background-color: #eeb9be;
          color: #fff;
        }

        .react-datepicker__input-container input {
          width: 500px;
        }

        @media screen and (max-width: 525px) {
          .inputs {
            width: 300px;
          }

          .prev-btn,
          .next-btn,
          .sign-up-btn {
            width: 300px;
          }

          .react-datepicker__input-container input {
            width: 300px;
          }
        }
      `}</style>
    </>
  )
}
