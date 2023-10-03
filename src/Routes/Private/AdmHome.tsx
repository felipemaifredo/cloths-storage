import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import './Styles/admhome.style.css';

//Assets
import { BiLogoProductHunt } from "react-icons/bi";
import { FiLogOut } from 'react-icons/fi';

const AdmHome = () => {
    document.title = 'Clothes-Storage | ADM';
    const navigate = useNavigate();

    // Função para Logout
    const fazerLogout = () => {
        const auth = getAuth();
        signOut(auth).then(() => { 
            navigate('/adm/login');
        });
    };

    const createCardMenu = ({link, name}: any) => {
        return (
            <Link to={link} className='item-menu-adm'>
                <BiLogoProductHunt />
                <span>{name}</span>
            </Link>
        );
    };

    return (
        <div id="AdmHome">
            {createCardMenu({ link: '/adm/admproducts', name: 'Produtos' })}

            <button id='logout-button' onClick={fazerLogout}> Logout <FiLogOut /> </button>
        </div>
    );
};

export default AdmHome;