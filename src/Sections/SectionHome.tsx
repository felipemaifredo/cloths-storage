//Imports
import './Styles/SectionHome.style.css';

//Assets
import bgImage from '../Assets/Images/AgShine.png';

const SectionHome = () => {
    return (
        <div id="SectionHome" style={{ backgroundImage: `url(${bgImage})` }}>
            <h1 className='title'>Made For Confort</h1>
            <h2 className='sub-title'>Explore our breezy summer collection now</h2>
        </div>
    );
};

export default SectionHome;