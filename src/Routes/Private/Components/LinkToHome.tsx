import { Link } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import './LinkToHome.style.css';

const LinkToHome = () => {
    return(
        <Link to={'/adm/admhome'} id="link-to-home"> <AiFillHome/> Home </Link>
    );
};

export default LinkToHome;