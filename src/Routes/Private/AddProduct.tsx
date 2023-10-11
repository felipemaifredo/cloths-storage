//Imports
import './Styles/AddProduct.style.css';
import { AiFillPlusCircle } from "react-icons/ai";
import { BiLogoProductHunt } from "react-icons/bi";
import { useState } from "react";
import LinkTo from './Components/LinkTo';
import firebaseConfig from '../../Configs/FirebaseConfig';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

//Asets
import { PiArrowLineRightFill } from 'react-icons/pi';
import { PiArrowLineLeftFill } from 'react-icons/pi';

//Configs
firebase.initializeApp(firebaseConfig);

const AddProduct = () => {
    const [formData, setFormData] = useState({
        active: true,
        destaque: false,
        category: '',
        name: '',
        corDestaque: '' || '#fff',
        descrip: '',
        price: '',
        sizes: [],
        colors: [],
        imagem1: null as File | null,
        imagem2: null as File | null,
        isFliped: false,
        position: 1,
    });

    const categoriesFields = [
        {name: 'Conjunto'},
        {name: 'Camisas'},
        {name: 'Macacões', value: 'Macacoes'}
    ];

    const inputFields = [
        { type: "text", placeholder: "Nome", value: formData.name, name: "name" },
        { type: "text", placeholder: "Cor de Destaque", value: formData.corDestaque, name: "corDestaque" },
        { type: "text", placeholder: "Descrição", value: formData.descrip, name: "descrip" },
        { type: "text", placeholder: "Preço", value: formData.price, name: "price" }
    ];

    const sizeFields = [
        {size: 'P'},
        {size: 'M'},
        {size: 'G'},
        {size: 'GG'},
    ];

    const colorFields = [
        {cor: 'Azul'},
        {cor: 'Amarelo'},
        {cor: 'Verde'},
        {cor: 'Vermelho'},
    ];

    const renderColors = ({color, key} : any) => {
        return (
            <label className="label-color-checkbox" key={key}>
                <input type="checkbox" name={color} className="input-Color-checkbox"
                    onChange={(e) => { 
                        setFormData((prevFormData) => ({ 
                            ...prevFormData, colors: { ...prevFormData.colors, [e.target.name]: e.target.checked, }, 
                        })); 
                    }}
                />                        
                {color}
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
          setFormData({ ...formData, imagem1: file });
        } else {
          setFormData({ ...formData, imagem1: null });
        }
    };

    const handleImagem2Selecionada = (e: React.FormEvent<HTMLInputElement>) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          setFormData({ ...formData, imagem2: file });
        } else {
          setFormData({ ...formData, imagem2: null });
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if ( !formData.name || !formData.category || !formData.corDestaque || !formData.descrip || !formData.price || !formData.imagem1 || !formData.imagem2 ) {
            alert('Preencha todos os campos');
        } else {
            const productsCollection = firebase.firestore().collection('products');
            productsCollection.add({
                active: formData.active,
                destaque: formData.destaque,
                category: formData.category,
                name: formData.name,
                corDestaque: formData.corDestaque,
                descrip: formData.descrip,
                price: formData.price,
                sizes: formData.sizes,
                colors: formData.colors,
                isFliped: formData.isFliped,
                position: formData.position,

            }).then((docRef) => {
                let novoProdutoId = docRef.id;
                docRef.update({ id: novoProdutoId })
                //Upload Imagem
                if (formData.imagem1 && formData.imagem2) {
                    const storageRef = firebase.storage().ref();
                    const nomeArquivo = new Date().getTime() + '-' + formData.imagem1.name;
                    const nomeArquivo2 = '2_' + nomeArquivo;
                    const uploadTask = storageRef.child(nomeArquivo).put(formData.imagem1);
                    const uploadTask2 = storageRef.child(nomeArquivo2).put(formData.imagem2);

                    uploadTask.on( 
                        'state_changed', null, (error) => {
                          alert(`Erro; ${error}`);
                          cleanerForm();
                        }, () => {
                          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                            // Atualizar o documento com a URL da imagem
                            docRef.update({ img: downloadURL }).catch((error) => {
                              alert(`Erro ao atualizar o documento com a URL da imagem 1: ${error}`);
                            });
                          });
                        }
                      );
                      uploadTask2.on( 
                        'state_changed', null, (error) => {
                          alert(`Erro; ${error}`);
                          cleanerForm();
                        }, () => {
                          uploadTask2.snapshot.ref.getDownloadURL().then((downloadURL) => {
                            // Atualizar o documento com a URL da imagem
                            docRef.update({ img2: downloadURL }).catch((error) => {
                              alert(`Erro ao atualizar o documento com a URL da imagem 2: ${error}`);
                            });
                          });
                        }
                      );
                    alert(`Produto adicionado com ID: ${docRef.id}`);
                    cleanerForm();
                } else {
                    alert(`Produto adicionado com ID: ${docRef.id}, porém sem foto.`);
                    cleanerForm();
                }
            }).catch((error) => {
                alert(`Erro ao adicionar o produto: ${error}`);
                cleanerForm();
            });
        }
    };

    function cleanerForm() {
        setFormData({
            active: true,
            destaque: false,
            category: '',
            name: '',
            corDestaque: '',
            descrip: '',
            price: '',
            sizes: [],
            colors: [],
            imagem1: null as File | null,
            imagem2: null as File | null,
            isFliped: false,
            position: 1,
        });
    };

    return (
        <div id="AddProduct">
            {LinkTo("/adm/admproducts", "Produtos", <BiLogoProductHunt />)}
            <form onSubmit={handleSubmit}>
                <h2>Adicionar Produto</h2>
                {inputFields.map((inputField, index) => (
                    <> {renderInputs({ type: inputField.type, placeholder: inputField.placeholder, value: inputField.value, name: inputField.name, key: index })} </>
                ))}

                <select id='categorias' name='categorias' value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} >
                    <option value='1'>-- Categoria --</option>
                    {categoriesFields.map((categoriesFild, index) =>(
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
                    {colorFields.map((colorField, index) => (
                        <> {renderColors({ color: colorField.cor, key: index })} </>
                    ))}
                </div>
                <label id='label-file-add'>
                    <span id='label-file-text'> { formData.imagem1 ? 'Imagem 1 selecionada' : 'Imagem 1 não selecionada' } </span>
                    <input type='file' id='input-file-add' onChange={handleImagem1Selecionada} />
                </label>
                <label id='label-file-add'>
                    <span id='label-file-text'> { formData.imagem2 ? 'Imagem 2 selecionada' : 'Imagem 2 não selecionada' } </span>
                    <input type='file' id='input-file-add' onChange={handleImagem2Selecionada} />
                </label>
                <div className='buttons-container'>
                    <label className={formData.isFliped ? 'isfliped-on-edit' : 'isfliped-off-edit'}>
                        { formData.isFliped ? <PiArrowLineLeftFill /> : <PiArrowLineRightFill /> }
                        <input type='checkbox' checked={formData.isFliped} onChange={(e) => setFormData({...formData, isFliped: e.target.checked })} />
                    </label>
                    <input type='number' className='position-input' min={0} value={formData.position} onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) })} />
                    <button type="submit" > <AiFillPlusCircle /> Cadastrar </button>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;