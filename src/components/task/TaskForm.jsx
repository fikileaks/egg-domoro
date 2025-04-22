import React, { useState } from 'react'
import style from './TaskForm.module.scss'

const TaskForm = ({ addTask }) => {
  const [value, setValue] = useState('')
  const [isAddNewTask, setIsAddNewTask] = useState(false)

  const handleSaveTask = (e) => {
    e.preventDefault()
    if (value) {
      addTask(value)
    }
    setValue('')
    setIsAddNewTask(false)
  }

  const handleCancelTask = () => {
    setValue('')
    setIsAddNewTask(false)
  }

  const handleNewTask = () => {
    setIsAddNewTask(true)
  }

  return (
    <>
      {isAddNewTask && (
        <form onSubmit={handleSaveTask} className={style.formlist}>
          <input className={style.formlist_input} type="text" value={value} onChange={(e) => setValue(e.target.value)} autoFocus />
          {/* BUTTON MUNCUL KETIKA KLIK ADD NEW TASAK */}
          <div className={style.button}>
            <button type="button" onClick={handleCancelTask} className={style.button_cancel}>
              CANCEL
            </button>
            <button type="submit" className={style.button_save}>
              SAVE
            </button>
          </div>
        </form>
      )}
      {/* Button task auto hide kalo task newnya true */}
      {!isAddNewTask && (
        <button onClick={handleNewTask} className={style.addtask}>
          ADD NEW TASK
        </button>
      )}
    </>
  )
}

export default TaskForm
