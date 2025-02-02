import React from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();

    const handleSubmit =(e)=> {
        alert('Fome submmitted sccessfull');
        navigate("home");
    }
    return(
        <div>
            <h2>Land System Form</h2>
            <form onSubmit={handleSubmit}>
                <input 
                 type='text'
                 placeholder='username'
                />
                <input 
                 type='email'
                 placeholder='email'
                />
                <input type='submit'/>
            </form>
        </div>
    );
}

export default Login;