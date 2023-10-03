import { Link } from "react-router-dom";
import './LinkTo.style.css';

const LinkTo = (link: string, name: string, image: any) => {
    return(
        <Link to={link} id="Link-to"> {image} {name} </Link>
    );
};

export default LinkTo;