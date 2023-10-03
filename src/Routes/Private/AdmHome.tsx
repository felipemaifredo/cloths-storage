import { Link } from 'react-router-dom';
import './Styles/admhome.style.css';

//Assets
import { BiLogoProductHunt } from "react-icons/bi";

const AdmHome = () => {

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

        </div>
    );
};

export default AdmHome;