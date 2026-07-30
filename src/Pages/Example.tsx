// import React, {useState} from 'react'

// const Example = () => {
//     const [formData, setFormData] = useState({
//         lastname: '',
//         firstname: '',
//         language: ''
//     })

//     const [isModalOpen, setIsModalOpen] = useState(false)

//     const [studentData, setStudentData] = useState([
//         { lastname: 'Lawal', firstname: 'Abdulrahman', language: 'Javascript'},
//         { lastname: 'Ogundare', firstname: 'Khalid', language: 'Javascript'},
//         { lastname: 'Oluwakayode', firstname: 'Promise', language: 'Python'},
//         { lastname: 'Dahunsi', firstname: 'Amina', language: 'C++'},
//         { lastname: 'Raji', firstname: 'Sulaimon', language: 'Javascript'},
//     ])

//     const addStudent = () => {
//         setStudentData(studentData.push(formData))
//         console.log(studentData)
//     }

//     // const name = 'solomon'
//     // const saveData = (e) => {
//     //     e.preventDefault();
//     //     localStorage.setItem('cars', name)
//     // }
//     // console.log(localStorage.getItem('cars'))

//   return (
//     <div className='flex flex-col items-center justify-center p-10'>
//         {/* <form action="submit" onSubmit={saveData} className='flex flex-col gap-4 w-[300px]'>
//             <input type="text" placeholder='Name of the car' className='border p-2'
//                 onChange={(e) => setFormData({...formData, name: e.target.value})} />
//             <input type="text" placeholder='Color of the car' className='border p-2'
//                 onChange={(e) => setFormData({...formData, color: e.target.value})} />
//             <input type="number" placeholder='Quantity of the car' className='border p-2'
//                 onChange={(e) => setFormData({...formData, quantity: e.target.value})}/>

//             <button type='submit' className='bg-blue-600'>Save</button>
//         </form> */}
//         <div className='flex items-center justify-center p-10'>
//             {studentData.map((student, index) => (
//                 <div key={index} className='bg-green-400 flex flex-col p-2 gap-2 justify-center border  items-center ' >
//                     <div className='w-20 h-20 rounded-full bg-black text-white flex items-center justify-center text-xl font-bold'>
//                         {student.firstname.split('')[0]}{student.lastname.split("")[0]}
//                     </div>
//                     <div className='bg-red-300 w-full p-2'>
//                         <p>Fullname:</p>
//                         <p className='text-xs'>{student.firstname + ' ' + student.lastname}</p>
//                     </div>
//                     <div className='bg-purple-300 w-full p-2'>
//                         <p>Language:</p>
//                         <p className='text-xs'>{student.language}</p>
//                     </div>
//                 </div>
//             ))}
//         </div>
        
//         <div>
//             <button className='bg-green-500 px-10 py-2 text-white' onClick={() => setIsModalOpen(true)}>Add Student</button>
//         </div>

//         {isModalOpen && (
//             <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#00000099] px-[10%]'>
//                 <form action="submit" className='p-10 bg-white space-y-4 '>
//                     <input onChange={(e) => setFormData({...formData, lastname: e.target.value})} className='p-2 border rounded-lg w-full' type="text" placeholder='Last Name'/>
//                     <input onChange={(e) => setFormData({...formData, firstname: e.target.value})} className='p-2 border rounded-lg w-full' type="text" placeholder='First Name'/>
//                     <input onChange={(e) => setFormData({...formData, language: e.target.value})} className='p-2 border rounded-lg w-full' type="text" placeholder='Language'/>
//                     <button className='bg-green-500 px-6 py-2 text-white' onClick={addStudent}>Add Student</button>
//                 </form>
//             </div>
//         )}
//     </div>
//   )
// }

// export default Example


const Example = () => {
    const students = [
        { lastname: 'Lawal', firstname: 'Abdulrahman', language: 'Javascript'},
        { lastname: 'Ogundare', firstname: 'Khalid', language: 'Javascript'},
        { lastname: 'Oluwakayode', firstname: 'Promise', language: 'Python'},
        { lastname: 'Dahunsi', firstname: 'Amina', language: 'C++'},
        { lastname: 'Raji', firstname: 'Sulaimon', language: 'Javascript'},
    ]

    // ES6 array methods - Filter, indexOf, some, includes, sort, spread operator,
    // push, pop, slice, splice, unshift, shift, reverse, sort, concat, join, map, filter, reduce, every
    
    // students.map((student, index) => console.log(`${student.firstname} ${student.lastname}`))
  return (
    <div>
        {students.map((student, index) => (
            <p key={index}>{student.firstname} {student.lastname} - {student.language}</p>
        ))}
    </div>
  )
}

export default Example