import React, { useEffect, useState } from 'react'
import TaskForm from './TaskForm'
import TaskList from './TaskList'

const TaskWrapper = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTask = localStorage.getItem('SAVED_TASK')
    return savedTask ? JSON.parse(savedTask) : []
  })

  useEffect(() => {
    localStorage.setItem('SAVED_TASK', JSON.stringify(tasks))
  }, [tasks])

  const addTask = (taskName) => {
    setTasks([...tasks, { id: Date.now(), task: taskName, isCompleted: false, isEditing: false }])
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const editTask = (id) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, isEditing: !task.isEditing } : task)))
    console.log(' EDIT TS CLICKED')
  }

  const saveEditedTask = (id, newTaskName) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, task: newTaskName, isEditing: false } : task)))
    console.log('SAVE CLICKED')
  }

  const checkTask = (id) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, isCompleted: !task.isCompleted } : task)))
  }

  return (
    <>
      <TaskList tasks={tasks} deleteTask={deleteTask} editTask={editTask} saveEditedTask={saveEditedTask} checkTask={checkTask}></TaskList>
      <TaskForm addTask={addTask}></TaskForm>
    </>
  )
}

export default TaskWrapper
