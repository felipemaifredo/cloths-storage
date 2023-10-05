import { Link } from "react-router-dom";
import LinkToHome from "./Components/LinkToHome";
import './Styles/admproducts.style.css';
import { useState, useEffect } from 'react';
import 'firebase/compat/firestore';
import firebase from 'firebase/compat/app';
import firebaseConfig from "../../Configs/FirebaseConfig";
import { getStorage, ref, deleteObject } from 'firebase/storage';
import { DocumentData } from 'firebase/firestore'; // Certifique-se de importar o tipo correto do Firebase

//Assets
import { AiFillPlusCircle } from "react-icons/ai";
import { AiOutlineEyeInvisible } from 'react-icons/ai';
import { AiOutlineEye } from 'react-icons/ai';
import { AiOutlineClear } from 'react-icons/ai';
import { BiTrash } from 'react-icons/bi';
import { BsPencil } from 'react-icons/bs';
import { RiProductHuntLine } from 'react-icons/ri';
import { AiOutlineStar } from 'react-icons/ai';

//Configs
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const AdmProducts = () => {
    const [produtos, setProdutos] = useState<DocumentData[]>([]);

    useEffect(() => {
        // Função para consultar produtos no Firebase
        const consultarProdutos = async () => {
          try {
            const produtosRef = db.collection('products');
            const produtosSnapshot = await produtosRef.get();
            const produtosData = produtosSnapshot.docs.map((doc) => doc.data() as DocumentData);
            setProdutos(produtosData);
        } catch (error) {
            alert(`Erro ao consultar produtos: ${error}`);
          }
        };
    
        consultarProdutos();
      }, []);

       // Função para excluir um produto
    const excluirProduto = async (produtoId :string, imagemLink: string) => {
        const confirmarExclusao = window.confirm('Tem certeza de que deseja excluir este produto?');
        if (confirmarExclusao) {
        try {
            // Obter o nome do arquivo a partir do link da imagem
            const storage = getStorage();
            const imagemRef = ref(storage, imagemLink);
            // Excluir imagem do Storage
            await deleteObject(imagemRef);
            //Excluir produto
            await db.collection('products').doc(produtoId).delete();
            // Remover o item excluído da lista de produtos
            setProdutos(produtos.filter(produto => produto.id !== produtoId));
            alert('Produto excluído com sucesso!');
        } catch (error) {
            alert(`Erro ao excluir o produto: ${error}`);
        }
        }
    };

    return (
        <div id="AdmProducts">
            <Link to={'/adm/addproduct'} id="link-to-addproduct"> <AiFillPlusCircle/> Adicionar Produto </Link>
            <LinkToHome />
            {produtos.map((produto) => (
                <div className="card-product" key={produto.id} style={{backgroundColor: produto.corDestaque}}>
                    <div className="img-container"> 
                        {produto.destaque && <span className="destaque-icon"> <AiOutlineStar/> </span>}
                        <img src={produto.img} alt="Imagem" />
                    </div>
                    <div className="name-container"> 
                        <p>{produto.name}</p>
                    </div>
                    <div className="btns-container">
                        { produto.active ? 
                            <Link to={`/produto/${produto.id}`} target='_blank' > <AiOutlineEye /> </Link> 
                            : 
                            <span className='desactive'> <AiOutlineEyeInvisible /> </span> 
                        }
                        <Link to={`/adm/edit-product/${produto.id}`}> <BsPencil /> </Link>
                        <button onClick={() => excluirProduto(produto.id, produto.img)} > <BiTrash /> </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AdmProducts;