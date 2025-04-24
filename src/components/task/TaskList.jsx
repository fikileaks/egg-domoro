import React, { useState } from 'react'
import style from './TaskList.module.scss'
import iconedit from '../../../dist/icons/edit.svg'
import iconclose from '../../../dist/icons/close.svg'
import iconcheck from '../../../dist/icons/check.svg'

const TaskList = ({ tasks, deleteTask, editTask, saveEditedTask, checkTask }) => {
  return (
    <>
      {tasks.map((task) => (
        <>
          {task.isEditing ? (
            <EditTaskForm task={task} saveEditedTask={saveEditedTask} editTask={editTask} />
          ) : (
            <div key={task.id} className={style.list}>
              <div className={`${style.list_title} ${task.isCompleted ? style.completed : ''}`}>{task.task}</div>
              <button onClick={() => editTask(task.id)} className={style.list_edit}>
                <img src={iconedit} alt="edit" />
              </button>
              <div className={style.list_execute}>
                <button onClick={() => deleteTask(task.id)} className={style.list_close}>
                  <img src={iconclose} alt="close" />
                </button>
                <button onClick={() => checkTask(task.id)} className={style.list_done}>
                  <img src={iconcheck} alt="check" />
                </button>
              </div>
            </div>
          )}
        </>
      ))}
    </>
  )
}

const EditTaskForm = ({ task, saveEditedTask, editTask }) => {
  const [editedValue, setEditedValue] = useState(task.task)

  const handleSubmit = (e) => {
    e.preventDefault()
    saveEditedTask(task.id, editedValue)
  }

  const handleCancelEdit = () => {
    editTask(task.id)
  }

  return (
    <>
      <form id="edit-form" onSubmit={handleSubmit} className={style.formlist}>
        <input type="text" value={editedValue} onChange={(e) => setEditedValue(e.target.value)} className={style.formlist_input} />
      </form>

      <div className={style.button}>
        <button type="button" onClick={handleCancelEdit} className={style.button_cancel}>
          CANCEL
        </button>
        {editedValue.trim() === '' ? (
          <button type="submit" form="edit-form" className={style.button_save_disabled} disabled>
            SAVE
          </button>
        ) : (
          <button type="submit" form="edit-form" className={style.button_save}>
            SAVE
          </button>
        )}
      </div>
    </>
  )
}

export default TaskList
