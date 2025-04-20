/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react'
import style from './home.module.scss'
import { useRef } from 'react'
import { useEffect } from 'react'

const Home = () => {
  const eggmodoroMode = {
    modeTimer: 1 * 60,
    modeShortBreak: 2 * 60,
    modeLongBreak: 1 * 60,
  }
  const [timeLeft, setTimeLeft] = useState(eggmodoroMode.modeTimer)
  const [timerMode, setTimerMode] = useState(Object.keys(eggmodoroMode)[0])
  const [isActive, setIsActive] = useState(false)

  const [progress, setProgress] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    setTimeLeft(eggmodoroMode[timerMode])
    // setProgress(0)
    setIsActive(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }, [timerMode])

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return {
      minutes: String(mins).padStart(2, '0'),
      seconds: String(secs).padStart(2, '0'),
    }
  }

  const startCountDown = () => {
    if (isActive) {
      clearInterval(timerRef.current)
      setIsActive(false)
    } else {
      setIsActive(true)

      const totalTime = eggmodoroMode[timerMode]

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current)
            setIsActive(false)
            setProgress(100)
            return 0
          }

          const elapsed = totalTime - prev + 1
          const progressPercent = (elapsed / totalTime) * 100
          setProgress(progressPercent)

          return prev - 1
        })
      }, 1000)
    }
  }

  const changeTimerType = (mode) => {
    if (timerMode !== mode) {
      setTimerMode(mode)
    }
  }

  const time = formatTime(timeLeft)

  const progressBarStyle = {
    width: `${Math.ceil(progress)}%`,
    transition: 'width 0.5s',
  }

  const getCountdownText = () => {
    if (timerMode === Object.keys(eggmodoroMode)[0]) {
      return 'IN FOCUS'
    } else if (timerMode === Object.keys(eggmodoroMode)[1]) {
      return 'SHORT BREAK'
    } else {
      return 'LONG BREAK'
    }
  }

  return (
    <main className={style.Home}>
      <section className={style.Configuration}>CONFIG</section>

      <section className={style.MainBox}>
        <div className={style.Countdown}>
          <div className={style.Countdown_Box}>
            <div className={style.Countdown_Box_Number}>
              <div>{time.minutes}</div>
            </div>
            <div className={style.Countdown_Box_Divider}>
              <div>:</div>
            </div>
            <div className={style.Countdown_Box_Number}>
              <div>{time.seconds}</div>
            </div>
          </div>

          <div className={style.Countdown_Text}>
            <div>{getCountdownText()}</div>
          </div>
        </div>

        <div className={style.ProgressBar}>
          <div style={progressBarStyle}></div>
        </div>
        <div className={style.ButtonBox}>
          <button onClick={() => changeTimerType('modeTimer')}>TIMER</button>
          <button onClick={() => changeTimerType('modeShortBreak')}>SHORT BREAK</button>
          <button onClick={() => changeTimerType('modeLongBreak')}>LONG BREAK</button>
        </div>
        <button className={style.ButtonMain} onClick={startCountDown}>
          {isActive ? 'PAUSE' : 'START'}
        </button>
      </section>

      {/* Section Note */}
      <section className={style.MainBox}>
        <div className={style.Header}>
          <div className={style.Header_Title}>Task</div>
          <div className={style.Header_Icon}></div>
        </div>
        <div className={style.Notes}>
          <div className={style.Notes_Note}>
            <span>Tulisan Disini Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod, reiciendis!</span>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div className={style.Notes_Note}>Button Main</div>
          <div className={style.Notes_Note}>Button Main</div>
          <div className={style.Notes_Note}>Button Main</div>
        </div>
      </section>
    </main>
  )
}

export default Home
