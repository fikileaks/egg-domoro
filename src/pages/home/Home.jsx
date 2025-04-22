/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react'
import style from './home.module.scss'
import { useRef } from 'react'
import { useEffect } from 'react'
import TaskWrapper from '../../components/task/TaskWrapper'

const Home = () => {
  // Default values in minutes (will be converted to seconds)
  const defaultModesInMinutes = {
    modeTimer: 1,
    modeShortBreak: 2,
    modeLongBreak: 1,
  }

  // Load from localStorage or use defaults
  const loadFromLocalStorage = () => {
    const savedTimes = localStorage.getItem('eggmodoroTimes')
    return savedTimes ? JSON.parse(savedTimes) : defaultModesInMinutes
  }

  // Convert minutes to seconds for internal use
  const initializeTimes = () => {
    const timesInMinutes = loadFromLocalStorage()
    return {
      modeTimer: timesInMinutes.modeTimer * 60,
      modeShortBreak: timesInMinutes.modeShortBreak * 60,
      modeLongBreak: timesInMinutes.modeLongBreak * 60,
    }
  }

  const [timeLeft, setTimeLeft] = useState(0) // Will be set in useEffect
  const [timerMode, setTimerMode] = useState(Object.keys(defaultModesInMinutes)[0])
  const [isActive, setIsActive] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const [customTimes, setCustomTimes] = useState(initializeTimes())

  const timerRef = useRef(null)

  // Initialize timeLeft when component mounts
  useEffect(() => {
    setTimeLeft(customTimes[timerMode])
  }, [])

  // Handle timer mode changes
  useEffect(() => {
    setTimeLeft(customTimes[timerMode])
    setProgress(0)
    setIsActive(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }, [timerMode, customTimes])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  // Save to localStorage whenever customTimes changes
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
    // Reset current timer
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
    <main className={style.Home}>
      <section className={style.Configuration}>
        <button className={style.SettingsButton} onClick={() => setShowSettings(!showSettings)}>
          {showSettings ? 'CLOSE SETTINGS' : 'TIMER SETTINGS'}
        </button>
        {showSettings && (
          <div className={style.SettingsPanel}>
            <div className={style.SettingItem}>
              <label>Focus Time (minutes):</label>
              <input type="number" min="1" max="99" value={Math.floor(customTimes.modeTimer / 60)} onChange={(e) => handleTimeChange('modeTimer', e.target.valueAsNumber)} />
            </div>

            <div className={style.SettingItem}>
              <label>Short Break (minutes):</label>
              <input type="number" min="1" max="99" value={Math.floor(customTimes.modeShortBreak / 60)} onChange={(e) => handleTimeChange('modeShortBreak', e.target.valueAsNumber)} />
            </div>

            <div className={style.SettingItem}>
              <label>Long Break (minutes):</label>
              <input type="number" min="1" max="99" value={Math.floor(customTimes.modeLongBreak / 60)} onChange={(e) => handleTimeChange('modeLongBreak', e.target.valueAsNumber)} />
            </div>

            <div className={style.SettingsActions}>
              <button onClick={saveSettings}>SAVE</button>
              <button onClick={resetToDefault}>RESET DEFAULTS</button>
            </div>
          </div>
        )}
      </section>
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
      <section className={style.MainBox}>
        <TaskWrapper />
      </section>
    </main>
  )
}

export default Home
