//Imports
import './Styles/Destaques.style.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import React,{ useState, useEffect } from 'react';
import firebaseConfig from '../Configs/FirebaseConfig';

//Configs
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const Destaques = () =>{
    type ProductType = {
        id: string;
        name: string;
        descrip: string;
        corDestaque: string;
        price: string;
        img: string;
        img2: string;
        colors: object[];
        sizes: object[];
        isFliped: boolean;
        position: number;
    };
    
    const [destaques, setDestaques] = useState<ProductType[]>([]);

    useEffect(() => {
        const buscarResultados = async () => {
          try {
            const querySnapshot = await db.collection('products')
              .where('destaque', '==', true)
              .where('active', '==', true)
              .limit(5) // Adicionando um limite de 5 itens
              .get();
            const destaquesResult = querySnapshot.docs.map(doc => ({ 
                id: doc.id,
                name: doc.data().name,
                descrip: doc.data().descrip,
                price: doc.data().price,
                corDestaque: doc.data().corDestaque,
                colors: doc.data().colors as object[],
                sizes: doc.data().sizes as object[], 
                img: doc.data().img,
                img2: doc.data().img2,
                isFliped: doc.data().isFliped,
                position: doc.data().position,
            }));
            destaquesResult.sort((a, b) => a.position - b.position); // Ordenar os resultados com base na propriedade "position"
            setDestaques(destaquesResult);
          } catch (error) {
            alert(`Erro ao buscar resultados: ${error}`);
          }
        };
        buscarResultados();
      }, []);

      const createDestaque = ({name, price, descrip, img, img2, corDestaque, isFliped} : any) => {
        return (
          <div className={isFliped ? 'container-destaq isfliped' : 'container-destaq'} style={{backgroundColor: corDestaque}}>
            <div className='box-info'>
              <div className='box-img'>
                <img src={img} alt={name} />
              </div>
              <p className='title-destaque'>{name}</p>
              <p className='descrio-destaq'>{descrip}</p>
              <div className='btn-box-destaque'>
                <p>R${price}</p>
              </div>
            </div>
            <img className='img2-destaque' src={img2} alt={name} />
          </div>
        );
      };

    return (
        <div id="Destaques">
            {destaques.map((destaque) => (
              <> {createDestaque({
                  name: destaque.name,
                  price: destaque.price,
                  descrip: destaque.descrip,
                  img: destaque.img,
                  img2: destaque.img2,
                  corDestaque: destaque.corDestaque,
                  isFliped: destaque.isFliped
                })} 
              </> 
            ))}
        </div>
    );
};

export default Destaques;