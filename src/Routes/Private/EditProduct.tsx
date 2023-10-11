//Imports
import './Styles/editproduct.style.css';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import firebase from 'firebase/compat/app';
import firebaseConfig from '../../Configs/FirebaseConfig';
import { getStorage, ref, deleteObject } from 'firebase/storage';

import LinkTo from './Components/LinkTo';

//Assets
import { BiLogoProductHunt } from "react-icons/bi";
import { AiFillPlusCircle } from "react-icons/ai";
import { AiOutlineEyeInvisible } from 'react-icons/ai';
import { AiOutlineEye } from 'react-icons/ai';
import { AiOutlineStar } from 'react-icons/ai';
import { PiArrowLineRightFill } from 'react-icons/pi';
import { PiArrowLineLeftFill } from 'react-icons/pi';

//Configs
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const EditProduct = () => {
    const { id } = useParams();

    const [formData, setFormData] = useState({
        active: false,
        destaque: false,
        category: '',
        name: '',
        corDestaque: '',
        descrip: '',
        price: '',
        sizes: [],
        colors: [],
        imagem: '',
        imagem2: '',
        isfliped: false,
        position: '',
    });

    const [newImage1, setNewImage1] = useState( null as File | null );
    const [newImage2, setNewImage2] = useState( null as File | null );

    useEffect(() => {
        // Buscar os dados do documento existente
        const fetchProductData = async () => {
          try {
            const docRef = db.collection('products').doc(id);
            const doc = await docRef.get();
            if (doc.exists) {
                const productData = doc.data();
                if (productData) {
                    setFormData({
                        ...productData,
                        active: productData.active,
                        destaque: productData.destaque,
                        category: productData.category,
                        name: productData.name,
                        corDestaque: productData.corDestaque,
                        descrip: productData.descrip,
                        price: productData.price,
                        sizes: productData.sizes,
                        colors: productData.colors,
                        imagem: productData.img,
                        imagem2: productData.img2,
                        isfliped: productData.isFliped,
                        position: productData.position
                    });
                } else {
                    alert('Produto não encontrado!');
                    return
                }
            } else {
              alert('Produto não encontrado!');
              return
            }
          } catch (error) {
            alert(`Erro ao buscar os dados: ${error}`);
            return
          }
        };
        fetchProductData();
    }, [id]);

    const sizeFields = [
        {size: 'P'},
        {size: 'M'},
        {size: 'G'},
        {size: 'GG'},
    ];

    const colorFilds = [
        {cor: 'Azul'},
        {cor: 'Amarelo'},
        {cor: 'Verde'},
        {cor: 'Vermelho'},
    ];

    const inputFields = [
        { type: "text", placeholder: "Nome", value: formData.name, name: "name" },
        { type: "text", placeholder: "Cor de Destaque", value: formData.corDestaque, name: "corDestaque" },
        { type: "text", placeholder: "Descrição", value: formData.descrip, name: "descrip" },
        { type: "text", placeholder: "Preço", value: formData.price, name: "price" }
    ];

    const categoriesFilds = [
        {name: 'Conjunto'},
        {name: 'Camisas'},
        {name: 'Macacões', value: 'Macacoes'}
    ];

    const renderColors = ({cor, key} : any) => {
        return (
            <label className="label-color-checkbox" key={key}>
                <input type="checkbox" name={cor} className="input-Color-checkbox" 
                    onChange={(e) => { 
                        setFormData((prevFormData) => ({ 
                            ...prevFormData, colors: { ...prevFormData.colors, [e.target.name]: e.target.checked, }, 
                        })); 
                    }}
                />                        
                {cor}
            </label>  
        )
    };

    const renderSizes = ({sizeOPT, key} : any) => {
        return(
            <label className="label-size-checkbox" key={key}>
                <input type="checkbox" name={sizeOPT} className="input-size-checkbox"
                    onChange={(e) => { 
                        setFormData((prevFormData) => ({ 
                            ...prevFormData, sizes: { ...prevFormData.sizes, [e.target.name]: e.target.checked, }, 
                        })); 
                    }}
                />                        
                {sizeOPT}
            </label>  
        )
    };
  
    const renderInputs = ({type, placeholder, value, name, key} : any) => {
        return (
            <input key={key} type={type} placeholder={placeholder} value={value} onChange={(e) => setFormData({ ...formData,  [name]: e.target.value })} />
        )
    };

    const renderCategories = ({name, value} : any) => {
        return (
            <option value={value || name}>{name}</option>
        )
    };

    const handleImagem1Selecionada = (e: React.FormEvent<HTMLInputElement>) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
            setNewImage1(file);
        };
    };

    const handleImagem2Selecionada = (e: React.FormEvent<HTMLInputElement>) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
            setNewImage2(file);
        };
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const docRef = db.collection('products').doc(id);
            await docRef.update({
                active: formData.active,
                destaque: formData.destaque,
                category: formData.category,
                name: formData.name,
                corDestaque: formData.corDestaque,
                descrip: formData.descrip,
                price: formData.price,
                sizes: formData.sizes,
                colors: formData.colors,
                isFliped: formData.isfliped,
                position: parseInt(formData.position),
            }).then( () => {
                try {
                    if (newImage1) {
                      const storage = getStorage();
                      const imagemRef = ref(storage, formData.imagem);
                      // Excluir imagem do Storage
                      deleteObject(imagemRef);
                    }
                    if (newImage2) {
                        const storage = getStorage();
                        const imagemRef = ref(storage, formData.imagem2);
                        // Excluir imagem do Storage
                        deleteObject(imagemRef);
                    }
                  } catch (error) {
                    alert(`Erro ao alterar imagem: ${error}`)
                    return
                  }
              }).then( ()=> {
                if (newImage1) {
                  const storageRef = firebase.storage().ref();
                  const nomeArquivo = new Date().getTime() + '-' + newImage1.name;
                  const uploadTask = storageRef.child(nomeArquivo).put(newImage1);
                  uploadTask.on( 
                    'state_changed', null, (error) => {
                      alert(`Erro; ${error}`);
                    }, () => {
                      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                        try {
                          // Atualizar o documento com a URL da imagem
                          docRef.update({ img: downloadURL })
                          setFormData({ ...formData, imagem: downloadURL });
                        } catch(error) {
                          alert(`Erro ao atualizar o documento com a URL da imagem 1: ${error}`);
                          return
                        };
                      });
                    }
                  );
                }
                if (newImage2) {
                    const storageRef = firebase.storage().ref();
                    const nomeArquivo = new Date().getTime() + '-' + newImage2.name;
                    const uploadTask = storageRef.child(nomeArquivo).put(newImage2);
                    uploadTask.on( 
                      'state_changed', null, (error) => {
                        alert(`Erro; ${error}`);
                      }, () => {
                        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                          try {
                            // Atualizar o documento com a URL da imagem
                            docRef.update({ img2: downloadURL })
                            setFormData({ ...formData, imagem2: downloadURL });
                          } catch(error) {
                            alert(`Erro ao atualizar o documento com a URL da imagem 2: ${error}`);
                            return
                          };
                        });
                      }
                    );
                  }
              }).then( () => {
                setNewImage1(null)
                setNewImage2(null)
                alert('Produto Atualizado!')
              })
        } catch (error) {
            alert(`Erro ao Atualizar o produto: ${error}`);
        }
    };

    return(
        <div id="editproduct">
            {LinkTo("/adm/admproducts", "Produtos", <BiLogoProductHunt />)}
            <form id='form-edit-product' onSubmit={handleSubmit}>
                <h2>Editar produto: <br></br>{id}</h2>
                {inputFields.map((inputField, index) => (
                    <> {renderInputs({ type: inputField.type, placeholder: inputField.placeholder, value: inputField.value, name: inputField.name, key: index })} </>
                ))}
                <select id='categorias' name='categorias' value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} >
                    <option value='1'>-- Categoria --</option>
                    {categoriesFilds.map((categoriesFild, index) =>(
                        <> {renderCategories({ name: categoriesFild.name, value: categoriesFild.value })} </>
                    ))}
                </select>
                <div className="sizes-container">
                    <p>Tamanhos:</p>
                    {sizeFields.map((sizeField, index) => (
                        <> {renderSizes({ sizeOPT: sizeField.size, key: index })} </>
                    ))}
                </div>
                <div className="colors-container">
                    <p>Cores:</p>
                    {colorFilds.map((colorFild, index) => (
                        <> {renderColors({ cor: colorFild.cor, key: index })} </>
                    ))}
                </div>
                <div className='images-btns'>
                    { formData.imagem &&  <a href={formData.imagem} target='_blanck'> Ver Imagem 1 </a> }
                    { formData.imagem2 &&  <a href={formData.imagem2} target='_blanck'> Ver Imagem 2 </a> }
                </div>
                <label id='label-file-add'>
                    <span id='label-file-text'> { newImage1 ? 'Nova Imagem 1 selecionada' : 'Nova Imagem 1 não selecionada' } </span>
                    <input type='file' id='input-file-add' onChange={handleImagem1Selecionada} />
                </label>
                <label id='label-file-add'>
                    <span id='label-file-text'> { newImage2 ? 'Nova Imagem 2 selecionada' : 'Nova Imagem 2 não selecionada' } </span>
                    <input type='file' id='input-file-add' onChange={handleImagem2Selecionada} />
                </label>
                <div className='buttons-container'>
                    <label className= {formData.active ?  'active-on-edit' : 'active-off-edit' }>
                        {formData.active ?  <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                        <input type='checkbox' checked={formData.active} onChange={(e) => setFormData({...formData, active: e.target.checked })} />
                    </label>
                    <label className={formData.destaque ? 'destaque-on-edit' : 'destaque-off-edit'}>
                        <AiOutlineStar />
                        <input type='checkbox' checked={formData.destaque} onChange={(e) => setFormData({...formData, destaque: e.target.checked })} />
                    </label>
                    <label className={formData.isfliped ? 'isfliped-on-edit' : 'isfliped-off-edit'}>
                        { formData.isfliped ? <PiArrowLineLeftFill /> : <PiArrowLineRightFill /> }
                        <input type='checkbox' checked={formData.isfliped} onChange={(e) => setFormData({...formData, isfliped: e.target.checked })} />
                    </label>
                    <input type='number' className='position-input' min={0} value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} />
                    <button type="submit" > <AiFillPlusCircle /> Editar </button>
                </div>
            </form>
        </div>
    );
};

export default EditProduct;