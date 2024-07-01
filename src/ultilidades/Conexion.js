import axios from 'axios';

const apiUrl = 'http://localhost:3008';

// Clientes
export const agregarCliente = async (cliente) => {
    const response = await axios.post(`${apiUrl}/clientes`, cliente, {
        headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
};

export const obtenerClientes = async () => {
    const response = await axios.get(`${apiUrl}/clientes`);
    return response.data;
};

export const obtenerClientePorId = async (id) => {
    const response = await axios.get(`${apiUrl}/clientes/${id}`);
    return response.data;
};

export const actualizarCliente = async (id, cliente) => {
    const response = await axios.put(`${apiUrl}/clientes/${id}`, cliente, {
        headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
};

export const eliminarCliente = async (id) => {
    const response = await axios.delete(`${apiUrl}/clientes/${id}`);
    return response.data;
};

// Productos
export const agregarProducto = async (producto) => {
    const response = await axios.post(`${apiUrl}/productos`, producto, {
        headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
};

export const obtenerProductos = async () => {
    const response = await axios.get(`${apiUrl}/productos`);
    return response.data;
};

export const obtenerProductoPorId = async (id) => {
    const response = await axios.get(`${apiUrl}/productos/${id}`);
    return response.data;
};

export const actualizarProducto = async (id, producto) => {
    const response = await axios.put(`${apiUrl}/productos/${id}`, producto, {
        headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
};

export const eliminarProducto = async (id) => {
    const response = await axios.delete(`${apiUrl}/productos/${id}`);
    return response.data;
};

// Métodos de Pago
export const agregarMetodoPago = async (metodo) => {
    const response = await axios.post(`${apiUrl}/metodos_pago`, metodo, {
        headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
};

export const obtenerMetodosPago = async () => {
    const response = await axios.get(`${apiUrl}/metodos_pago`);
    return response.data;
};

export const obtenerMetodoPagoPorId = async (id) => {
    const response = await axios.get(`${apiUrl}/metodos_pago/${id}`);
    return response.data;
};

export const actualizarMetodoPago = async (id, metodo) => {
    const response = await axios.put(`${apiUrl}/metodos_pago/${id}`, metodo, {
        headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
};

export const eliminarMetodoPago = async (id) => {
    const response = await axios.delete(`${apiUrl}/metodos_pago/${id}`);
    return response.data;
};

// Facturas
export const agregarFactura = async (factura) => {
    const response = await axios.post(`${apiUrl}/facturas`, factura, {
        headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
};

export const obtenerFacturas = async () => {
    const response = await axios.get(`${apiUrl}/facturas`);
    return response.data;
};

export const obtenerFacturaPorId = async (id) => {
    const response = await axios.get(`${apiUrl}/facturas/${id}`);
    return response.data;
};

export const actualizarFactura = async (id, factura) => {
    const response = await axios.put(`${apiUrl}/facturas/${id}`, factura, {
        headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
};

export const eliminarFactura = async (id) => {
    const response = await axios.delete(`${apiUrl}/facturas/${id}`);
    return response.data;
};

// Notas de Abono
export const agregarNotaAbono = async (notaAbono) => {
    const response = await axios.post(`${apiUrl}/notas_abono`, notaAbono, {
        headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
};

export const obtenerNotasAbono = async () => {
    const response = await axios.get(`${apiUrl}/notas_abono`);
    return response.data;
};

export const obtenerNotaAbonoPorId = async (id) => {
    const response = await axios.get(`${apiUrl}/notas_abono/${id}`);
    return response.data;
};

export const actualizarNotaAbono = async (id, notaAbono) => {
    const response = await axios.put(`${apiUrl}/notas_abono/${id}`, notaAbono, {
        headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
};

export const eliminarNotaAbono = async (id) => {
    const response = await axios.delete(`${apiUrl}/notas_abono/${id}`);
    return response.data;
};

// Detalles de Notas de Abono
export const agregarDetalleNotaAbono = async (detalle) => {
    const response = await axios.post(`${apiUrl}/detalles_nota_abono`, detalle, {
        headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
};



export const obtenerDetalleNotaAbonoPorId = async (id) => {
    const response = await axios.get(`${apiUrl}/detalles_nota_abono/${id}`);
    return response.data;
};

export const actualizarDetalleNotaAbono = async (id, detalle) => {
    const response = await axios.put(`${apiUrl}/detalles_nota_abono/${id}`, detalle, {
        headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
};

export const eliminarDetalleNotaAbono = async (id) => {
    const response = await axios.delete(`${apiUrl}/detalles_nota_abono/${id}`);
    return response.data;
};

// Tipos de Documento
export const agregarTipoDocumento = async (tipoDocumento) => {
    console.log(tipoDocumento);
    const response = await axios.post(`${apiUrl}/tipo_documento`, tipoDocumento, {
        headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
};

export const obtenerTiposDocumento = async () => {
    const response = await axios.get(`${apiUrl}/tipo_documento`);
    return response.data;
};

export const obtenerTipoDocumentoPorId = async (id) => {
    const response = await axios.get(`${apiUrl}/tipo_documento/${id}`);
    return response.data;
};

export const actualizarTipoDocumento = async (id, tipoDocumento) => {
    const response = await axios.put(`${apiUrl}/tipo_documento/${id}`, tipoDocumento, {
        headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
};

export const eliminarTipoDocumento = async (id) => {
    const response = await axios.delete(`${apiUrl}/tipo_documento/${id}`);
    return response.data;
};
