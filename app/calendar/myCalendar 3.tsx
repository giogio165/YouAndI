'use client'

import React, { useEffect, useState } from 'react'
import PlanPopup from './planPopup'
import SetPopup from './setPopup'
import { ref, onValue, remove, getDatabase, off, set } from 'firebase/database'
import app from '@/firebase'
import { auth } from '../../firebase'

interface CalendarProps {
  initialYear: number
  initialMonth: number
}

export interface PlanContent {
  id: string
  title: string
  startDate: string
  endDate: string
  memo: string
}
export const MyCalendar = ({ initialYear, initialMonth }: CalendarProps) => {
  const [year, setYear] = useState(initialYear)
  const [month, setMonth] = useState(initialMonth)

  const [selectedDay, setSelectedDay] = useState('')
  const [plans, setPlans] = useState<PlanContent[]>([])
  const [isPopupOpen, setPopupOpen] = useState(false)
  const [isSetPopupOpen, setSetPopupOpen] = useState(false)
  const [editPlan, setEditPlan] = useState<PlanContent | null>(null)
  const [setPopupPlan, setSetPopupPlan] = useState<PlanContent | null>(null)

  const user = auth.currentUser
  const userId = user?.uid
  const database = getDatabase(app)

  //일정 받아오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const databaseRef = ref(database, `events/${userId}`)
        onValue(databaseRef, (snapshot) => {
          const data = snapshot.val()
          if (data) {
            const plansArray: PlanContent[] = Object.values(data)
            setPlans(plansArray)
          } else {
            setPlans([])
          }
        })
      } catch (error) {
        console.error('Error fetching plans from Firebase:', error)
      }
    }

    fetchData()
    return () => {
      const databaseRef = ref(database, `events/${userId}`)
      off(databaseRef)
    }
  }, [userId, database])

  //캘린더 생성
  const generateCalendar = (year: number, month: number) => {
    const lastDay = new Date(year, month + 1, 0)
    const days: number[] = []
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(i)
    }
    return days
  }

  const daysInMonth = generateCalendar(year, month)

  const goToPreviousMonth = () => {
    if (month === 0) {
      setYear(year - 1)
      setMonth(11)
    } else {
      setMonth(month - 1)
    }
  }
  const goToNextMonth = () => {
    if (month === 11) {
      setYear(year + 1)
      setMonth(0)
    } else {
      setMonth(month + 1)
    }
  }
  //알정 삭제
  const onDelete = () => {
    if (setPopupPlan) {
      const planId = setPopupPlan.id
      const databaseRef = ref(getDatabase(app), `events/${userId}/${planId}`)

      remove(databaseRef)
        .then(() => console.log('Plan deleted from Firebase Realtime Database'))
        .catch((error) =>
          console.error(
            'Error deleting plan from Firebase Realtime Database:',
            error,
          ),
        )
      closePopup()
    }
  }

  const openPopup = (day: string) => {
    setEditPlan(null)
    setSelectedDay(day)
    setPopupOpen(!isPopupOpen)
  }

  const openSetPopup = (plan: PlanContent) => {
    setSelectedDay(selectedDay)
    setSetPopupPlan(plan)
    setSetPopupOpen(!isSetPopupOpen)
  }
  const closePopup = () => {
    setSelectedDay('')
    setPopupOpen(false)
    setSetPopupOpen(false)
  }

  //일정 수정
  const handleEditSavePlan = (newPlan: PlanContent) => {
    const databaseRef = ref(getDatabase(app), `events/${userId}/${newPlan.id}`)
    set(databaseRef, newPlan)
      .then(() =>
        console.log('Plan edited and saved in Firebase Realtime Database'),
      )
      .catch((error) =>
        console.error(
          'Error editing and saving plan in Firebase Realtime Database:',
          error,
        ),
      )

    setPlans((prevPlans) =>
      prevPlans.map((plan) => (plan.id === setPopupPlan?.id ? newPlan : plan)),
    )
    closePopup()
  }

  const handleSave = (newEvent: PlanContent) => {
    addEventToDatabase(newEvent)
    closePopup()
  }

  const addEventToDatabase = (newEvent: PlanContent) => {
    if (user) {
      const eventsRef = ref(database, `events/${userId}/${newEvent.id}`)
      set(eventsRef, newEvent)
    } else {
      console.error('User is not authenticated.')
    }
  }

  return (
    <div className="MyCalendar">
      <div className="calendar-button">
        <button onClick={goToPreviousMonth}>Previous</button>
        <div className="calendar-yearmonth">{`${year}-${month + 1}`}</div>
        <button onClick={goToNextMonth}>Next</button>
      </div>
      <div className="day-labels">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <div key={index}>{day}</div>
        ))}
      </div>
      <div className="calendar">
        {daysInMonth.map((day, index) => {
          const currentDay = `${year}-${String(month + 1).padStart(
            2,
            '0',
          )}-${String(day).padStart(2, '0')}`
          const planForDay =
            plans &&
            plans.filter(
              (plan: PlanContent) =>
                plan.startDate <= currentDay && plan.endDate >= currentDay,
            )

          return (
            <div key={index} className="calendar-cells">
              <div className="cells-days" onClick={() => openPopup(currentDay)}>
                {day}
              </div>
              {planForDay &&
                planForDay.map((plan: PlanContent, subIndex) => (
                  <div
                    className="cells-title"
                    key={subIndex}
                    onClick={() => openSetPopup(plan)}
                  >
                    ▪️{plan.title}
                  </div>
                ))}
            </div>
          )
        })}
      </div>
      {isPopupOpen && (
        <div className="calendar-popup">
          <PlanPopup
            onClose={closePopup}
            handleSave={handleSave}
            selectedDay={selectedDay}
            plan={editPlan}
          />
        </div>
      )}
      {isSetPopupOpen && setPopupPlan && (
        <div className="calendar-popup">
          <SetPopup
            onClose={closePopup}
            onDelete={onDelete}
            plan={setPopupPlan}
            onSave={handleEditSavePlan}
          />
        </div>
      )}
      <style jsx>{`
        .MyCalendar {
          width: 100%;
          height: 100%;
        }
        .calendar-button {
          display: flex;
          justify-content: space-between;
          width: 100%;
          margin: 10px 0 10px 0;
        }
        .calendar-yearmonth {
          font-weight: 700;
        }

        .calendar-button button {
          border: none;
          background-color: #f7f7f7;
          font-weight: 600;
        }
        .day-labels {
          width: 100%;
          display: flex;
          justify-content: space-around;
          background-color: #f0f0f0;
          font-weight: bold;
          padding: 8px 0 8px 0;
        }

        .calendar {
          display: grid;
          width: 100%;
          height: 80%;

          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
        }

        .calendar-cells {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-end;
          padding: 10px;
          border: 1px solid #ccc;
          background-color: #fff;
          height: 100px;
        }

        .cells-title {
          margin-top: 10px;
          font-size: 12px;
        }

        .cells-days {
        }

        .calendar-popup {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
        }
      `}</style>
    </div>
  )
}

export default MyCalendar
