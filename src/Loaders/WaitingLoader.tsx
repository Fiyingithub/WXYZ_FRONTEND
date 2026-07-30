import { useToast } from './ToastContext';

// import '../Styles/loader.css'
import '../Styles/loader2.css'

function WaitingLoader() {
  const { waitingLoader } = useToast()
  if (!waitingLoader) return null;  
  return (
    <div className='flex fixed top-0 left-0 items-center justify-center w-full h-[100vh] bg-[#ffffff33] z-50'>
      {/* <div className=' flex flex-col bg-primary p-6 rounded-full '>
      </div> */}
      <div className='loader '></div>
    </div>
  )
}

export default WaitingLoader