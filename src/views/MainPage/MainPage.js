import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Nav,
  Form,
  Button,
  Alert,
  Table,
} from "react-bootstrap";
import {
  obtenerTiposDocumento,
  obtenerClientes,
  obtenerFacturas,
  obtenerMetodosPago,
  obtenerProductos,
  agregarTipoDocumento,
  agregarCliente,
  agregarFactura,
  agregarMetodoPago,
  agregarProducto,
  agregarNotaAbono,
  obtenerNotasAbono,
} from "../../ultilidades/Conexion"; // Asegúrate de ajustar la ruta según la ubicación real de tu archivo Conexion.js
import styled from "styled-components";
import generadorPDf from "../../ultilidades/generadorPDF";

const DetalleHorizontal = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: flex-end;
  margin-bottom: 10px;

  .form-group {
    flex: 1;
    min-width: 150px;
  }
`;

const MainPage = () => {
  const [seccionVisible, setSeccionVisible] = useState("bienvenida");
  const [tipoDocumentos, setTipoDocumentos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [facturas, setFacturas] = useState([]);
  const [metodosPago, setMetodosPago] = useState([]);
  const [productos, setProductos] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [detallesNotaAbono, setDetallesNotaAbono] = useState([]);
  const [notasAbono, setNotasAbono] = useState([]);

  useEffect(() => {
    fetchTipoDocumentos();
    fetchClientes();
    fetchFacturas();
    fetchMetodosPago();
    fetchProductos();
    fetchNotasAbono();
  }, []);
  const fetchNotasAbono = async () => {
    const notasAbono = await obtenerNotasAbono();
    setNotasAbono(notasAbono);
  };
  const fetchTipoDocumentos = async () => {
    const tiposDocumento = await obtenerTiposDocumento();
    setTipoDocumentos(tiposDocumento);
  };

  const fetchClientes = async () => {
    const clientes = await obtenerClientes();
    setClientes(clientes);
  };

  const fetchFacturas = async () => {
    const facturas = await obtenerFacturas();
    setFacturas(facturas);
  };

  const fetchMetodosPago = async () => {
    const metodosPago = await obtenerMetodosPago();
    setMetodosPago(metodosPago);
  };

  const fetchProductos = async () => {
    const productos = await obtenerProductos();
    setProductos(productos);
  };

  const mostrarSeccion = (seccion) => {
    setSeccionVisible(seccion);
    setMensaje("");
  };

  const handleAddDetalle = () => {
    setDetallesNotaAbono([
      ...detallesNotaAbono,
      { producto_id: "", cantidad: "", precio_unitario: "", subtotal: "" },
    ]);
  };

  const handleChangeDetalle = (index, event) => {
    const { name, value } = event.target;
    const newDetalles = detallesNotaAbono.map((detalle, idx) => {
      if (idx === index) {
        let updatedDetalle = { ...detalle, [name]: value };

        // Si el campo modificado es producto_id, actualiza el precio_unitario
        if (name === "producto_id") {
          const productoSeleccionado = productos.find(
            (p) => p.producto_id === parseInt(value)
          );
          if (productoSeleccionado) {
            updatedDetalle.precio_unitario = productoSeleccionado.precio;
          }
        }

        // Calcula el subtotal
        if (updatedDetalle.cantidad && updatedDetalle.precio_unitario) {
          updatedDetalle.subtotal = (
            parseFloat(updatedDetalle.cantidad) *
            parseFloat(updatedDetalle.precio_unitario)
          ).toFixed(2);
        }

        return updatedDetalle;
      }
      return detalle;
    });
    setDetallesNotaAbono(newDetalles);
  };

  const handleRemoveDetalle = (index) => {
    const newDetalles = detallesNotaAbono.filter((_, idx) => idx !== index);
    setDetallesNotaAbono(newDetalles);
  };
  const handleGeneratePDF = (id) =>{
    generadorPDf(id);

  }

  const handleSubmit = async (event, tipo) => {
    event.preventDefault();
    const form = event.target;

    try {
      switch (tipo) {
        case "tipoDocumento":
          const nuevoTipoDocumento = { nombre: form.nombreTipoDocumento.value };
          await agregarTipoDocumento(nuevoTipoDocumento);
          fetchTipoDocumentos();
          setMensaje("Tipo de documento agregado con éxito.");
          break;

        case "cliente":
          const nuevoCliente = {
            nombre: form.nombreCliente.value,
            direccion: form.direccionCliente.value,
            telefono: form.telefonoCliente.value,
            email: form.emailCliente.value,
            tipo_documento_id: form.tipoDocumentoCliente.value,
          };
          await agregarCliente(nuevoCliente);
          fetchClientes();
          setMensaje("Cliente agregado con éxito.");
          break;

        case "factura":
          const nuevaFactura = {
            cliente_id: form.clienteFactura.value,
            total: form.totalFactura.value,
          };
          await agregarFactura(nuevaFactura);
          fetchFacturas();
          setMensaje("Factura agregada con éxito.");
          break;

        case "metodoPago":
          const nuevoMetodoPago = { nombre: form.nombreMetodoPago.value };
          await agregarMetodoPago(nuevoMetodoPago);
          fetchMetodosPago();
          setMensaje("Método de pago agregado con éxito.");
          break;

        case "producto":
          const nuevoProducto = {
            nombre: form.nombreProducto.value,
            descripcion: form.descripcionProducto.value,
            precio: form.precioProducto.value,
          };
          await agregarProducto(nuevoProducto);
          fetchProductos();
          setMensaje("Producto agregado con éxito.");
          break;

        case "notaAbono":
          const nuevaNotaAbono = {
            factura_id: form.facturaNotaAbono.value,
            metodo_pago_id: form.metodoPagoNotaAbono.value,
            estado: form.estadoNotaAbono.value,
            detalles: detallesNotaAbono,
          };

          await agregarNotaAbono(nuevaNotaAbono);
          setMensaje("Nota de abono agregada con éxito.");
          break;

        default:
          break;
      }
      form.reset();
    } catch (error) {
      setMensaje("Error al agregar datos.");
    }
  };

  return (
    <Container>
      <header className="my-4">
        <h1 className="text-center">Nota de abono</h1>
      </header>

      <Nav
        fill
        variant="tabs"
        defaultActiveKey="bienvenida"
        className="mb-4"
        onSelect={mostrarSeccion}
      >
        <Nav.Item>
          <Nav.Link eventKey="bienvenida">Inicio</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="tipoDocumento">Tipo de Documento</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="clientes">Clientes</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="factura">Factura</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="metodoPago">Método de Pago</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="productos">Productos</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="notaAbono">Nota de Abono</Nav.Link>
        </Nav.Item>
      </Nav>

      <main>
        {seccionVisible === "bienvenida" && (
          <section id="bienvenida" className="contenido">
            <h2>Bienvenido a Gestión de Inventario</h2>
            <p>
              Esta aplicación te permite gestionar tipos de documento, clientes,
              facturas, métodos de pago, productos y notas de abono. Utiliza el
              menú para comenzar.
            </p>
          </section>
        )}

        {seccionVisible === "tipoDocumento" && (
          <section id="tipoDocumento" className="contenido">
            <h2>Tipo de Documento</h2>
            <Form
              id="formTipoDocumento"
              onSubmit={(e) => handleSubmit(e, "tipoDocumento")}
            >
              <Form.Group controlId="nombreTipoDocumento">
                <Form.Label>Nombre</Form.Label>
                <Form.Control type="text" name="nombreTipoDocumento" required />
              </Form.Group>
              <Button type="submit" variant="primary">
                Agregar Tipo de Documento
              </Button>
            </Form>
            <Alert variant="info" className="mt-3">
              {mensaje}
            </Alert>
            <Table striped bordered hover className="mt-3">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                </tr>
              </thead>
              <tbody>
                {tipoDocumentos.map((doc) => (
                  <tr key={doc.tipo_documento_id}>
                    <td>{doc.tipo_documento_id}</td>
                    <td>{doc.nombre}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </section>
        )}

        {seccionVisible === "clientes" && (
          <section id="clientes" className="contenido">
            <h2>Clientes</h2>
            <Form id="formCliente" onSubmit={(e) => handleSubmit(e, "cliente")}>
              <Form.Group controlId="nombreCliente">
                <Form.Label>Nombre</Form.Label>
                <Form.Control type="text" name="nombreCliente" required />
              </Form.Group>
              <Form.Group controlId="direccionCliente">
                <Form.Label>Dirección</Form.Label>
                <Form.Control type="text" name="direccionCliente" required />
              </Form.Group>
              <Form.Group controlId="telefonoCliente">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control type="text" name="telefonoCliente" required />
              </Form.Group>
              <Form.Group controlId="emailCliente">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="emailCliente" required />
              </Form.Group>
              <Form.Group controlId="tipoDocumentoCliente">
                <Form.Label>Tipo de Documento</Form.Label>
                <Form.Control as="select" name="tipoDocumentoCliente" required>
                  <option value="">Seleccionar...</option>
                  {tipoDocumentos.map((doc) => (
                    <option
                      key={doc.tipo_documento_id}
                      value={doc.tipo_documento_id}
                    >
                      {doc.nombre}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Button type="submit" variant="primary">
                Agregar Cliente
              </Button>
            </Form>
            <Alert variant="info" className="mt-3">
              {mensaje}
            </Alert>
            <Table striped bordered hover className="mt-3">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Dirección</th>
                  <th>Teléfono</th>
                  <th>Email</th>
                  <th>Tipo de Documento</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((cliente) => (
                  <tr key={cliente.cliente_id}>
                    <td>{cliente.cliente_id}</td>
                    <td>{cliente.nombre}</td>
                    <td>{cliente.direccion}</td>
                    <td>{cliente.telefono}</td>
                    <td>{cliente.email}</td>
                    <td>{cliente.tipo_documento_id}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </section>
        )}

        {seccionVisible === "factura" && (
          <section id="factura" className="contenido">
            <h2>Factura</h2>
            <Form id="formFactura" onSubmit={(e) => handleSubmit(e, "factura")}>
              <Form.Group controlId="clienteFactura">
                <Form.Label>Cliente</Form.Label>
                <Form.Control as="select" name="clienteFactura" required>
                  <option value="">Seleccionar...</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.cliente_id} value={cliente.cliente_id}>
                      {cliente.nombre}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="totalFactura">
                <Form.Label>Total</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="totalFactura"
                  required
                />
              </Form.Group>
              <Button type="submit" variant="primary">
                Agregar Factura
              </Button>
            </Form>
            <Alert variant="info" className="mt-3">
              {mensaje}
            </Alert>
            <Table striped bordered hover className="mt-3">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {facturas.map((factura) => (
                  <tr key={factura.factura_id}>
                    <td>{factura.factura_id}</td>
                    <td>{factura.cliente_id}</td>
                    <td>{factura.total}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </section>
        )}

        {seccionVisible === "metodoPago" && (
          <section id="metodoPago" className="contenido">
            <h2>Método de Pago</h2>
            <Form
              id="formMetodoPago"
              onSubmit={(e) => handleSubmit(e, "metodoPago")}
            >
              <Form.Group controlId="nombreMetodoPago">
                <Form.Label>Nombre</Form.Label>
                <Form.Control type="text" name="nombreMetodoPago" required />
              </Form.Group>
              <Button type="submit" variant="primary">
                Agregar Método de Pago
              </Button>
            </Form>
            <Alert variant="info" className="mt-3">
              {mensaje}
            </Alert>
            <Table striped bordered hover className="mt-3">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                </tr>
              </thead>
              <tbody>
                {metodosPago.map((metodo) => (
                  <tr key={metodo.metodo_id}>
                    <td>{metodo.metodo_id}</td>
                    <td>{metodo.nombre}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </section>
        )}

        {seccionVisible === "productos" && (
          <section id="productos" className="contenido">
            <h2>Productos</h2>
            <Form
              id="formProducto"
              onSubmit={(e) => handleSubmit(e, "producto")}
            >
              <Form.Group controlId="nombreProducto">
                <Form.Label>Nombre</Form.Label>
                <Form.Control type="text" name="nombreProducto" required />
              </Form.Group>
              <Form.Group controlId="descripcionProducto">
                <Form.Label>Descripción</Form.Label>
                <Form.Control type="text" name="descripcionProducto" required />
              </Form.Group>
              <Form.Group controlId="precioProducto">
                <Form.Label>Precio</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="precioProducto"
                  required
                />
              </Form.Group>
              <Button type="submit" variant="primary">
                Agregar Producto
              </Button>
            </Form>
            <Alert variant="info" className="mt-3">
              {mensaje}
            </Alert>
            <Table striped bordered hover className="mt-3">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Precio</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => (
                  <tr key={producto.producto_id}>
                    <td>{producto.producto_id}</td>
                    <td>{producto.nombre}</td>
                    <td>{producto.descripcion}</td>
                    <td>{producto.precio}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </section>
        )}

{seccionVisible === "notaAbono" && (
  <section id="notaAbono" className="contenido">
    <h2>Nota de Abono</h2>
    <Form
      id="formNotaAbono"
      onSubmit={(e) => handleSubmit(e, "notaAbono")}
    >
      <Form.Group controlId="facturaNotaAbono">
        <Form.Label>Factura</Form.Label>
        <Form.Control as="select" name="facturaNotaAbono" required>
          <option value="">Seleccionar...</option>
          {facturas.map((factura) => (
            <option key={factura.factura_id} value={factura.factura_id}>
              {factura.factura_id}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="metodoPagoNotaAbono">
        <Form.Label>Método de Pago</Form.Label>
        <Form.Control as="select" name="metodoPagoNotaAbono" required>
          <option value="">Seleccionar...</option>
          {metodosPago.map((metodo) => (
            <option key={metodo.metodo_id} value={metodo.metodo_id}>
              {metodo.nombre}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="estadoNotaAbono">
        <Form.Label>Estado</Form.Label>
        <Form.Control as="select" name="estadoNotaAbono" required>
          <option value="">Seleccionar...</option>
          <option value="0">Anulado</option>
          <option value="1">Cancelado</option>
          <option value="2">Pendiente</option>
        </Form.Control>
      </Form.Group>

      <h3>Detalles de Nota de Abono</h3>
      <Button
        variant="secondary"
        onClick={handleAddDetalle}
        className="mb-3"
      >
        Agregar Detalle
      </Button>

      {detallesNotaAbono.map((detalle, index) => (
        <DetalleHorizontal key={index}>
          <Form.Group controlId={`producto_id_${index}`}>
            <Form.Label>Producto</Form.Label>
            <Form.Control
              as="select"
              name="producto_id"
              value={detalle.producto_id}
              onChange={(e) => handleChangeDetalle(index, e)}
              required
            >
              <option value="">Seleccionar...</option>
              {productos.map((producto) => (
                <option
                  key={producto.producto_id}
                  value={producto.producto_id}
                >
                  {producto.nombre}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId={`cantidad_${index}`}>
            <Form.Label>Cantidad</Form.Label>
            <Form.Control
              type="number"
              name="cantidad"
              value={detalle.cantidad}
              onChange={(e) => handleChangeDetalle(index, e)}
              required
            />
          </Form.Group>
          <Form.Group controlId={`precio_unitario_${index}`}>
            <Form.Label>Precio Unitario</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              name="precio_unitario"
              value={detalle.precio_unitario}
              onChange={(e) => handleChangeDetalle(index, e)}
              readOnly
            />
          </Form.Group>
          <Form.Group controlId={`subtotal_${index}`}>
            <Form.Label>Subtotal</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              name="subtotal"
              value={detalle.subtotal}
              readOnly
            />
          </Form.Group>
          <Button
            variant="danger"
            onClick={() => handleRemoveDetalle(index)}
          >
            Eliminar
          </Button>
        </DetalleHorizontal>
      ))}

      <Button type="submit" variant="primary">
        Agregar Nota de Abono
      </Button>
    </Form>
    <Alert variant="info" className="mt-3">
      {mensaje}
    </Alert>

    {/* Tabla para mostrar datos de notas de abono */}
    <Table striped bordered hover className="mt-4">
      <thead>
        <tr>
          <th>Nota de Abono ID</th>
          <th>Cliente</th>
          <th>Fecha</th>
          <th>Método de Pago</th>
          <th>Total</th>
          <th>Estado</th>
          <th>Opciones</th> {/* Nueva columna para botones */}
        </tr>
      </thead>
      <tbody>
        {notasAbono.map((nota) => (
          <tr key={nota.nota_abono_id}>
            <td>{nota.nota_abono_id}</td>
            <td>{nota.cliente_nombre}</td>
            <td>{nota.fecha}</td>
            <td>{nota.metodopago_nombre}</td>
            <td>{nota.total}</td>
            <td>
              {nota.estado === 0
                ? "Anulado"
                : nota.estado === 1
                ? "Cancelado"
                : "Pendiente"}
            </td>
            <td>
              <Button
                variant="primary"
                onClick={() => handleGeneratePDF(nota.nota_abono_id)}
              >
                Generar PDF
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  </section>
)}

      </main>
    </Container>
  );
};

export default MainPage;
