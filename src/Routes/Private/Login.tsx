import { useState } from 'react';
import { auth } from '../../Configs/FirebaseConfig';
import { useSignInWithEmailAndPassword} from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import './Styles/login.style.css';
//Assets
import { BiLogIn } from 'react-icons/bi';
import { AiFillLock } from "react-icons/ai";
import { FaUserAlt } from "react-icons/fa";

import OIP from '../../Assets/Logos/OIP.jpg'

const Login = () => {
    document.title = 'Cloths Storage | ADM';
    const navigate = useNavigate();
    const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
    const [ loginData, setLoginData ] = useState({
        email: '',
        pass: '',
    });

    function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (emailIsValid(loginData.email) && passwordIsValid(loginData.pass)) {
          signInWithEmailAndPassword(loginData.email, loginData.pass).then((user) => {
            if (user) { 
              navigate('/adm/admhome');
            } else {
              setLoginData({ email: '', pass: '', });
              alert('Login falhou. Verifique suas credenciais.');
            }
          });
        };
    };

      // Função de validação de e-mail
    function emailIsValid(email: string) {
        if (!email) {
            alert('Prencha o email')
            return
        }
        return true;
    };

    function passwordIsValid(password: string) {
        if (!password) {
            alert('Prencha a senha')
            return
        }
        return true;
    };

    return (
      <div id="Login">
        <form onSubmit={handleSignIn}>
          <img src={OIP} alt='logo' />
          <h1>Login</h1>
          <label className='label-input'>
            <FaUserAlt />
            <input type='text' name='email' id='email' onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} value={loginData.email} />
            <span className={ loginData.email && 'span-ok' }>Email</span>
          </label>
          <label className='label-input'>
            <AiFillLock />
            <input type='password' name='password' id='password' onChange={(e) => setLoginData({ ...loginData, pass: e.target.value })} value={loginData.pass} />
            <span className={ loginData.pass && 'span-ok' }>Senha</span>
          </label>
          <button className='button' type='submit'> Login <BiLogIn /> </button>
        </form>
      </div>
    );
};

export default Login;