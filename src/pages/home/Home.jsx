/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react'
import style from './home.module.scss'
import { useRef } from 'react'
import { useEffect } from 'react'
import TaskWrapper from '../../components/task/TaskWrapper'

const Home = () => {
  const defaultModesInMinutes = {
    modeTimer: 25,
    modeShortBreak: 5,
    modeLongBreak: 15,
  }

  const loadFromLocalStorage = () => {
    const savedTimes = localStorage.getItem('SAVED_TIME_DATA')
    return savedTimes ? JSON.parse(savedTimes) : defaultModesInMinutes
  }

  const initializeTimes = () => {
    const timesInMinutes = loadFromLocalStorage()
    return {
      modeTimer: timesInMinutes.modeTimer * 60,
      modeShortBreak: timesInMinutes.modeShortBreak * 60,
      modeLongBreak: timesInMinutes.modeLongBreak * 60,
    }
  }

  const [timeLeft, setTimeLeft] = useState(0)
  const [timerMode, setTimerMode] = useState(Object.keys(defaultModesInMinutes)[0])
  const [isActive, setIsActive] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const [customTimes, setCustomTimes] = useState(initializeTimes())

  const timerRef = useRef(null)

  useEffect(() => {
    setTimeLeft(customTimes[timerMode])
  }, [])

  useEffect(() => {
    setTimeLeft(customTimes[timerMode])
    setProgress(0)
    setIsActive(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }, [timerMode, customTimes])

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const timesInMinutes = {
      modeTimer: customTimes.modeTimer / 60,
      modeShortBreak: customTimes.modeShortBreak / 60,
      modeLongBreak: customTimes.modeLongBreak / 60,
    }
    localStorage.setItem('SAVED_TIME_DATA', JSON.stringify(timesInMinutes))
  }, [customTimes])

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

      const totalTime = customTimes[timerMode]

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

  const handleTimeChange = (mode, minutes) => {
    const clampedMinutes = Math.min(99, Math.max(1, minutes || 1))
    const seconds = clampedMinutes * 60
    setCustomTimes((prev) => ({
      ...prev,
      [mode]: seconds,
    }))
  }

  const saveSettings = () => {
    setShowSettings(false)
    setTimeLeft(customTimes[timerMode])
    setProgress(0)
    setIsActive(false)
    clearInterval(timerRef.current)
  }

  const resetToDefault = () => {
    const defaultTimes = {
      modeTimer: defaultModesInMinutes.modeTimer * 60,
      modeShortBreak: defaultModesInMinutes.modeShortBreak * 60,
      modeLongBreak: defaultModesInMinutes.modeLongBreak * 60,
    }
    setCustomTimes(defaultTimes)
    setShowSettings(false)
    localStorage.removeItem('eggmodoroTimes')
  }

  const time = formatTime(timeLeft)

  const progressBarStyle = {
    width: `${Math.ceil(progress)}%`,
    transition: 'width 0.5s',
  }

  const getCountdownText = () => {
    if (timerMode === 'modeTimer') {
      return 'FOCUS TIME'
    } else if (timerMode === 'modeShortBreak') {
      return 'CHILL TIME'
    } else {
      return 'FULL REST'
    }
  }

  return (
    <>
      <main className={`${style.home} ${style[timerMode]}`}>
        <section className={style.setting}>
          <button className={style.setting_button} onClick={() => setShowSettings(!showSettings)}>
            {showSettings ? 'CLOSE SETTINGS' : 'TIMER SETTINGS'}
          </button>
          <div className={`${style.setting_popup} ${showSettings ? style.active : ''}`}>
            <div className={style.setting_box}>
              <div className={style.setting_items}>
                <div className={style.setting_item}>
                  <div className={style.setting_title}>EGGDOMORO</div>
                  <div className={style.setting_input}>
                    <input type="number" min="1" max="99" value={Math.floor(customTimes.modeTimer / 60)} onChange={(e) => handleTimeChange('modeTimer', e.target.valueAsNumber)} />
                  </div>
                </div>
                <div className={style.setting_item}>
                  <div className={style.setting_title}>SHORT BREAK</div>
                  <div className={style.setting_input}>
                    <input type="number" min="1" max="99" value={Math.floor(customTimes.modeShortBreak / 60)} onChange={(e) => handleTimeChange('modeShortBreak', e.target.valueAsNumber)} />
                  </div>
                </div>
                <div className={style.setting_item}>
                  <div className={style.setting_title}>LONG BREAK</div>
                  <div className={style.setting_input}>
                    <input type="number" min="1" max="99" value={Math.floor(customTimes.modeLongBreak / 60)} onChange={(e) => handleTimeChange('modeLongBreak', e.target.valueAsNumber)} />
                  </div>
                </div>
              </div>
              <div className={style.setting_action}>
                <button onClick={saveSettings} className={style.setting_save}>
                  SAVE
                </button>
                <button onClick={resetToDefault} className={style.setting_reset}>
                  RESET DEFAULTS
                </button>
              </div>
            </div>
          </div>
        </section>
        <div className={style.wrapper}>
          <img className={style.egg} src={timerMode === 'modeTimer' ? '/egg/Focus.svg' : timerMode === 'modeShortBreak' ? '/egg/ShortBreak.svg' : '/egg/LongBreak.svg'} alt="egg" />
          <section className={`${style.mainbox} ${style[timerMode]}`}>
            <div className={style.countdown}>
              <div className={style.countdown_box}>
                <div className={style.countdown_box_number}>
                  <div>{time.minutes}</div>
                </div>
                <div className={style.countdown_box_divider}>
                  <div>:</div>
                </div>
                <div className={style.countdown_box_number}>
                  <div>{time.seconds}</div>
                </div>
              </div>
              <div className={style.countdown_text}>
                <div>{getCountdownText()}</div>
              </div>
            </div>
            <div className={`${style.progressbar} ${isActive ? style.visible : ''}`}>
              <div style={progressBarStyle}></div>
            </div>
            <div className={style.buttonbox}>
              <button className={`${style.buttonbox_button} ${timerMode === 'modeTimer' ? style.active : ''}`} onClick={() => changeTimerType('modeTimer')}>
                TIMER
              </button>
              <button className={`${style.buttonbox_button} ${timerMode === 'modeShortBreak' ? style.active : ''}`} onClick={() => changeTimerType('modeShortBreak')}>
                SHORT BREAK
              </button>
              <button className={`${style.buttonbox_button} ${timerMode === 'modeLongBreak' ? style.active : ''}`} onClick={() => changeTimerType('modeLongBreak')}>
                LONG BREAK
              </button>
            </div>
            <button className={`${style.buttonmain} ${!isActive ? style.active : ''}`} onClick={startCountDown}>
              {isActive ? 'PAUSE' : 'START'}
            </button>
          </section>
        </div>
        <section className={style.mainbox}>
          <TaskWrapper />
        </section>
      </main>
      <div className={`${style.floatingtext} ${style[timerMode]}`}>
        <div className={style.floatingtext_box}>
          {Array(10)
            .fill(getCountdownText())
            .map((item, index) => (
              <div className={style.floatingtext_text} key={index}>
                {item}
              </div>
            ))}
        </div>
        <div className={style.floatingtext_box}>
          {Array(10)
            .fill(getCountdownText())
            .map((item, index) => (
              <div className={style.floatingtext_text} key={index}>
                {item}
              </div>
            ))}
        </div>
      </div>
    </>
  )
}

export default Home
