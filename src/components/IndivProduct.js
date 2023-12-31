
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fs } from '../Config/Config';
import Swal from 'sweetalert2';

export default function IndivProduct({ individualProduct, addToCart, user }) {
    const navigate = useNavigate();
    const [nombreVendedor, setNombreVendedor] = useState('');

    const handleVendedorClick = () => {
        if (individualProduct.addedBy) {
            navigate(`/perfil-publico/${individualProduct.addedBy}`);
        }
    };

    //obtener nombre del vendedor

    useEffect(() => {
        if (individualProduct.addedBy) {
            fs.collection('users')
                .doc(individualProduct.addedBy)
                .get()
                .then((doc) => {
                    if (doc.exists) {
                        const nombreVendedor = doc.data().Nombre;
                        setNombreVendedor(nombreVendedor);
                    } else {
                        Swal.fire({ icon: 'error', title: 'Oops...', text: 'No se encontró al vendedor' });
                    }
                })
                .catch((error) => {
                    Swal.fire({ icon: 'error', title: 'Oops...', text: 'Error al obtener datos del vendedor' });
                });
        }
    }, [individualProduct.addedBy]);


    //verificar si el usuario es vendedor
    const vendedor = user && user.Rol === 'Vendedor';

    //agregar productos al carrito
    const handleCarrito = () => {
        if (!vendedor) {
            addToCart(individualProduct);
        } else {
            Swal.fire({
                icon: 'info',
                title: 'Oops...',
                text: 'Vendedores no pueden agregar productos al carrito.',
            });
        }
    };

//verificar si el producto esta disponible stock

    const [stockDisponible, setStockDisponible] = useState(true);

    useEffect(() => {
       
        const cantidadNumerica = parseInt(individualProduct.cantidad, 10);
        if (cantidadNumerica === 0 || isNaN(cantidadNumerica)) {        //si la cantidad es 0 o no es un numero, el stock no esta disponible
            setStockDisponible(false); 
        } else {
            setStockDisponible(true);
        }
    }, [individualProduct.cantidad]);

    return (
        <div className='product'>
            <div className='product-img'>
                <img src={individualProduct.image} alt="product-img" />
            </div>

            <div className='product-text title'>{individualProduct.title}</div>
            <div className='product-text description'>{individualProduct.description}</div>
            <div className='product-text price'>${individualProduct.price}</div>
    {/* Si no es vendedor y el stock disponible es true entonces se renderiza el boton de carrito. Si es vendedor el boton no se renderiza. */}
            {!vendedor && stockDisponible && (
                <div className='btn btn-danger btn-md cart-btn' onClick={handleCarrito}>
                    Añadir al carrito
                </div>
            )}
            {!vendedor && !stockDisponible && (
                <div className='btn btn-secondary btn-md cart-btn' disabled>
                    Fuera de stock!
                </div>
            )}
            <br />
            {nombreVendedor && (
                <div className='product-text vendedor-name' onClick={handleVendedorClick} style={{ cursor: 'pointer' }}>
                    Vendedor: {nombreVendedor}
                </div>
            )}
        </div>
    );
}
