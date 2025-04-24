import { createBrowserRouter } from 'react-router-dom'
import Home from '../pages/home/Home'
import NotFound from '../pages/not-found/NotFound'

const route = createBrowserRouter(
  [
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ],
  {
    basename: '/egg-domoro', // Tambahkan basename sesuai dengan base di vite.config
  }
)

export default route
