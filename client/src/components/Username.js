import React from 'react'
import { Link } from 'react-router-dom'
import avatar from '../assets/profile.png'
import { Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'  //access the data of the user form and validate the user data
import styles from '../styles/Username.module.css'
import { usernameValidate} from '../helper/validate'
export default function Username() {

  const formik = useFormik({
    //will save the data to this object from the form
    initialValues:{
      username:''
    },
    validate : usernameValidate,
    validateOnBlur : false,
    validateOnChange : false,
    onSubmit: async values =>{
      console.log(values)
    }
  })

  return (
    <div className="container mx-auto">

      <Toaster position='top-center' reverseOrder={false}></Toaster>
      <div className="flex justify-center items center h-screen">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Hello Again!</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              EXPLORE MORE BY CONNECTING WITH US
            </span>
          </div>
          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <img src={avatar} className={styles.profile_img} alt="avatar" />
            </div>
            <div className="textbook flex flex-col items-center gap-6">
              <input {...formik.getFieldProps('username')} className={styles.textbox} type="text" placeholder="Username" />
              <button className={styles.btn} type="submit">Lets go</button>
            </div>

            <div className="text-center py-4">
                <span className="text-gray-500">Not a Member <Link className='text-red-500' to="/register">Register now</Link></span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
