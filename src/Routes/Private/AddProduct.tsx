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

//Configs
firebase.initializeApp(firebaseConfig);

const AddProduct = () => {
    const [formData, setFormData] = useState({
        active: true,
        destaque: false,
        category: '',
        name: '',
        colorDestaque: '',
        descrip: '',
        price: '',
        sizes: [],
        colors: [],
        imagem: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formData.name || !formData.category || !formData.colorDestaque || !formData.descrip || !formData.price || !formData.imagem ) {
            alert('Preencha todos os campos');
        } else {
            const productsCollection = firebase.firestore().collection('products');
            productsCollection.add({
                active: formData.active,
                destaque: formData.destaque,
                category: formData.category,
                name: formData.name,
                corDestaque: formData.colorDestaque,
                descrip: formData.descrip,
                price: formData.price,
                sizes: formData.sizes,
                color: formData.colors,
            }).then((docRef) => {
                let novoProdutoId = docRef.id;
                docRef.update({ id: novoProdutoId })
                //Upload Imagem
                if (formData.imagem) {
                    const storageRef = firebase.storage().ref();
                    const nomeArquivo = new Date().getTime() + '-' + formData.imagem.name;
                    const uploadTask = storageRef.child(nomeArquivo).put(formData.imagem);
                    uploadTask.on( 
                        'state_changed', null, (error) => {
                          alert(`Erro; ${error}`);
                          cleanerForm();
                        }, () => {
                          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                            // Atualizar o documento com a URL da imagem
                            docRef.update({ img: downloadURL }).then(() => {
                              alert(`Produto adicionado com ID: ${docRef.id}`);
                              cleanerForm();
                            }).catch((error) => {
                              alert(`Erro ao atualizar o documento com a URL da imagem: ${error}`);
                              cleanerForm();
                            });
                          });
                        }
                      );
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
            colorDestaque: '',
            descrip: '',
            price: '',
            sizes: [],
            colors: [],
            imagem: null as File | null,
        });
    }

    const handleImagemSelecionada = (e: React.FormEvent<HTMLInputElement>) => {
        const file = (e.target as HTMLInputElement).files?.[0]; // Cast the target to HTMLInputElement
        if (file) {
          setFormData({ ...formData, imagem: file });
        } else {
          setFormData({ ...formData, imagem: null });
        }
    };

    return (
        <div id="AddProduct">
            {LinkTo("/adm/admproducts", "Produtos", <BiLogoProductHunt />)}
            <form onSubmit={handleSubmit}>
                <h2>Adicionar Produto</h2>
                <input type='text' placeholder='Nome' value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                <input type='text' placeholder='Cor de Destaque' value={formData.colorDestaque} onChange={(e) => setFormData({ ...formData, colorDestaque: e.target.value })} />
                <input type='text' placeholder='Descrição' value={formData.descrip} onChange={(e) => setFormData({ ...formData, descrip: e.target.value })} />
                <input type='number' min={0} placeholder='Preço' value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                <select id='categorias' name='categorias' value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} >
                    <option value='1'>-- Categoria --</option>
                    <option>Conjunto</option>
                    <option>Camisas</option>
                </select>
                <div className="sizes-container">
                    <p>Tamanhos:</p>
                    <label className="label-size-checkbox">
                        <input type="checkbox" name='P' className="input-size-checkbox"
                            onChange={(e) => { 
                                let newSize = e.target.name; 
                                setFormData((prevFormData) => ({ 
                                    ...prevFormData, sizes: { ...prevFormData.sizes, [newSize]: e.target.checked, }, 
                                })); 
                            }}
                        />                        
                        P
                    </label>   
                    <label className="label-size-checkbox">
                        <input type="checkbox" name='M' className="input-size-checkbox"
                            onChange={(e) => { 
                                let newSize = e.target.name; 
                                setFormData((prevFormData) => ({ 
                                    ...prevFormData, sizes: { ...prevFormData.sizes, [newSize]: e.target.checked, }, 
                                })); 
                            }}
                        />                        
                        M
                    </label>  
                    <label className="label-size-checkbox">
                        <input type="checkbox" name='G' className="input-size-checkbox"
                            onChange={(e) => { 
                                let newSize = e.target.name; 
                                setFormData((prevFormData) => ({ 
                                    ...prevFormData, sizes: { ...prevFormData.sizes, [newSize]: e.target.checked, }, 
                                })); 
                            }}
                        />                        
                        G
                    </label>  
                    <label className="label-size-checkbox">
                        <input type="checkbox" name='GG' className="input-size-checkbox"
                            onChange={(e) => { 
                                let newSize = e.target.name; 
                                setFormData((prevFormData) => ({ 
                                    ...prevFormData, sizes: { ...prevFormData.sizes, [newSize]: e.target.checked, }, 
                                })); 
                            }}
                        />                        
                        GG
                    </label>
                </div>
                <div className="colors-container">
                    <p>Cores</p>
                    <label className="label-color-checkbox">
                        <input type="checkbox" name='Vermelho' className="input-Color-checkbox"
                            onChange={(e) => { 
                                let newColor = e.target.name; 
                                setFormData((prevFormData) => ({ 
                                    ...prevFormData, colors: { ...prevFormData.sizes, [newColor]: e.target.checked, }, 
                                })); 
                            }}
                        />                        
                        Vermelho
                    </label>  
                    <label className="label-color-checkbox">
                        <input type="checkbox" name='Azul' className="input-Color-checkbox" 
                            onChange={(e) => { 
                                let newColor = e.target.name; 
                                setFormData((prevFormData) => ({ 
                                    ...prevFormData, colors: { ...prevFormData.sizes, [newColor]: e.target.checked, }, 
                                })); 
                            }}
                        />                        
                        Azul
                    </label>  
                    <label className="label-color-checkbox">
                        <input type="checkbox" name='Verde' className="input-Color-checkbox" 
                            onChange={(e) => { 
                                let newColor = e.target.name; 
                                setFormData((prevFormData) => ({ 
                                    ...prevFormData, colors: { ...prevFormData.sizes, [newColor]: e.target.checked, }, 
                                })); 
                            }}
                        />                        
                        Verde
                    </label>  
                </div>
                <label id='label-file-add'>
                    <span id='label-file-text'> { formData.imagem ? 'Imagem selecionada' : 'Imagem não selecionada' } </span>
                    <input type='file' id='input-file-add' onChange={handleImagemSelecionada} />
                </label>
                <button type="submit" > <AiFillPlusCircle /> Cadastrar </button>
            </form>
        </div>
    );
};

export default AddProduct;