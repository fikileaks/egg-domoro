import { RouterProvider } from 'react-router-dom'
import route from '../../routes/Routing.jsx'

function App() {
  return (
    <>
      <RouterProvider router={route}></RouterProvider>
    </>
  )
}

export default App
