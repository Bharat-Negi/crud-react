import { ToastContainer } from 'react-toastify';
import EmployeeCurd from './components/EmployeeCurd';
import './style.css'
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <ToastContainer />      
      <EmployeeCurd />
      <Toaster position="top-center" />
    </>
  )
}

export default App
