import { useState } from 'react';
import { auth } from '../../Configs/FirebaseConfig';
import { useSignInWithEmailAndPassword} from 'react-firebase-hooks/auth'
import { useNavigate } from 'react-router-dom';

//Assets
import { BiLogIn } from 'react-icons/bi';

const Login = () => {
    document.title = 'Cloths Storage | ADM';
    const navigate = useNavigate();
    const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
    const [ loginData, setLoginData ] = useState({
        email: '',
        pass: '',
    })

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
            <h1>Aqui é a Login</h1>
            <form onSubmit={handleSignIn}>
                <p>Faça seu Login</p>
                <input type='text' name='email' id='email' placeholder='Email' onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} value={loginData.email} />
                <input type='password' name='password' id='password' placeholder='Senha' onChange={(e) => setLoginData({ ...loginData, pass: e.target.value })} value={loginData.pass} />
            <button className='button' type='submit'> Entrar <BiLogIn /> </button>
      </form>
        </div>
    );
};

export default Login;