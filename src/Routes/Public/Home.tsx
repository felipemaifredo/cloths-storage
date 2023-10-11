//Imports
import SectionHome from "../../Sections/SectionHome";
import Destaques from "../../Sections/Destaques";

//Components
import Carrinho from "./Components/Carrinho";

const Home = () => {
    return (
        <div id="Home">
            <Carrinho />
            <SectionHome />
            <Destaques />
        </div>
    );
};

export default Home;