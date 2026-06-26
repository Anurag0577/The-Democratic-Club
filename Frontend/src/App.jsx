// import { Signup } from './pages/Signup.jsx'
import { Login } from './pages/Login.jsx'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router';
import { Signup } from './pages/Signup.jsx';
import NotFoundPage from './components/NotFound.jsx';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { Homepage } from './components/Homepage.jsx';
import { AuthModel } from './components/AuthModel.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { Toaster } from 'sonner'


// ✅ Move this OUTSIDE the App component
const client = new QueryClient();

function RootLayout(){

  return(
    <>
      <AuthModel/>
      <Outlet/>
    </>
  )
}

function App() {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout/>,
      children: [
        {
          path: '/login',
          element: <Login/>
        },
        {
          path: '/signup',
          element: <Signup/>
        },
        {
          path: '/',
          element: <Homepage/>
        },
        {
          path: '/dashboard',
          element: <Dashboard/>
        },
        {
          path: '*',
          element: <NotFoundPage/>
        }
      ]
    }
  ])

  return (
    <>

      <QueryClientProvider client={client} >
        <RouterProvider router={router} />
      </QueryClientProvider>
    <Toaster 
      position="bottom-left" 
      richColors
      toastOptions={{
        style: {
          background: '#1f2937',
          border: "1px solid #374151",
          color: '#fff'
        }
      }}
    /> 
    </>
  )
}

export default App