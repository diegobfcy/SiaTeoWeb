import jsPDF from "jspdf";
import "jspdf-autotable";
import { obtenerDetalleNotaAbonoPorId } from "../ultilidades/Conexion";

const generadorPDf = async (notaAbonoId, fileName) => {
  try {
    const response = await obtenerDetalleNotaAbonoPorId(notaAbonoId);
    console.log(response)
    const notaAbono = response[0];
    // Crear un documento PDF
    const pdf = new jsPDF();

    // Configurar título centrado
    pdf.setFontSize(18);
    pdf.text("Nota de Abono", pdf.internal.pageSize.getWidth() / 2, 22, { align: "center", decoration: "underline" });

    // Configurar datos de cliente, fecha de nota de abono y factura
    const fechaNotaAbono = new Date(notaAbono.fecha_nota_abono).toLocaleDateString();
    pdf.setFontSize(12);
    pdf.text(`Cliente: ${notaAbono.nombre_cliente}`, 14, 32);
    pdf.text(`Dirección: ${notaAbono.direccion_cliente}`, 14, 42);
    pdf.text(`Fecha de Nota de Abono: ${fechaNotaAbono}`, 14, 52);
    pdf.text(`Factura ID: ${notaAbono.factura_id}`, 14, 62);
    pdf.text(`Fecha de Emisión de Factura: ${new Date(notaAbono.factura_fecha_emision).toLocaleDateString()}`, 14, 72);
    pdf.text(`Método de Pago: ${notaAbono.metodo_pago}`, 14, 82);

    // Configurar tabla de detalles de nota de abono usando jspdf-autotable
    const columns = ["Producto", "Cantidad", "Precio Unitario", "Subtotal"];
    const rows = notaAbono.detalle.map(detalle => [
      detalle.producto_nombre,
      detalle.producto_cantidad,
      formatCurrency(detalle.producto_precio_unitario), // Aplicar formato de moneda a precio unitario
      formatCurrency(detalle.subtotal) // Aplicar formato de moneda a subtotal
    ]);

    pdf.autoTable({
      startY: 100,
      head: [columns],
      body: rows,
      theme: "grid",
      styles: {
        cellPadding: 2,
        fontSize: 10,
      },
    });

    // Configurar total
    const totalRows = [["Total", formatCurrency(notaAbono.total)]];

    pdf.autoTable({
      startY: pdf.lastAutoTable.finalY + 10,
      body: totalRows,
      theme: "grid",
      styles: {
        cellPadding: 2,
        fontSize: 10,
        fontStyle: "bold",
      },
    });

    // Guardar el PDF con el nombre especificado
    pdf.save(`${fileName}.pdf`);
  } catch (error) {
    console.error("Error al generar el PDF de Nota de Abono:", error);
  }
};

// Función para formatear montos como moneda peruana (Soles)
const formatCurrency = (value) => {
  return `S/ ${parseInt(value).toFixed(2)}`; // Asumiendo que value es un número
};

export default generadorPDf;
