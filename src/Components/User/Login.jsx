import React, { useContext,  } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthContext } from '../../Authprovider/Authprovider';
import Sociallogin from '../Social/Sociallogin';

const Login = () => {
  const { Signin } = useContext(AuthContext)
  const usernavi = useNavigate();
  const handlesignin = (e) => {
   
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    // console.log(email, password)
    Signin(email, password)
      .then((result) => {
        const user = result.user
         console.log(user)
         usernavi("/")
      })
      .catch(error => {
        alert(error)
      })
  }
  return (
    <div className='flex justify-center'>
      <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
        <form onSubmit={handlesignin} className="card-body">
          <h2 className='font-semibold text-2xl text-center'>Login your account</h2>
          <fieldset className="fieldset">
            {/* Email */}
            <label className="label">Email</label>
            <input name='email' type="email" className="input" placeholder="Email" />
            {/* Password */}
            <label className="label">Password</label>
            <input name='password' type="password" className="input" placeholder="Password" />
            <div><Link to='/auth/passwordreset' className="link link-hover">Forgot password?</Link></div>
            <button type="submit" className="btn btn-neutral mt-4">Login</button>
            <Sociallogin />
            <p className='font-semibold text-center py-3'>Dont’t Have An Account ?<Link className='text-secondary' to='/auth/register'>Register</Link></p>
          </fieldset>
        </form>
      </div>
    </div>


  );
};

export default Login;