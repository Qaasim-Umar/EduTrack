import React from 'react'
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <>
            <div>Home</div>

            <div className=''>
                welcome
            </div>

            <div>Get started</div>

            <p><Link to="/SuperSignUp">Sign up as super admin</Link></p>

            <Link to="/TeacherLogin">Log in</Link>






        </>

    )
}

export default Home