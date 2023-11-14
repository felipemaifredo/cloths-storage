//Imports
import './Carrinho.style.css';
import { FiShoppingCart } from "react-icons/fi";
import { BsCartX } from "react-icons/bs";
import React,{ useState } from 'react';

const Carrinho = () => {
    const [cartOn, setCartOn] = useState(false);
    
    return (
        <div id='Carrinho'>
            <button onClick={() => (setCartOn(true))}> <FiShoppingCart /> </button>
            <div className={ cartOn ? 'container-cart cart-on' : 'container-cart cart-off'}>
                <button onClick={() => (setCartOn(false))}> <BsCartX/> </button>
            </div>
        </div>
    )
}

export default Carrinho;
