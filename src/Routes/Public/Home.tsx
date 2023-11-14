//Imports
import SectionHome from "../../Sections/SectionHome";
import Destaques from "../../Sections/Destaques";

//Components
import Cart from "./Components/Carrinho";

const Home = () => {
    return (
        <div id="Home">
            <Cart />
            <SectionHome />
            <Destaques />
        </div>
    );
};

export default Home;