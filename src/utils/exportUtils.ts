import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: unknown) => jsPDF;
  }
}

export interface ExportData {
  headers: string[];
  rows: (string | number)[][];
  filename: string;
  title: string;
}

export const exportToPDF = (data: ExportData) => {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(18);
  doc.text(data.title, 14, 22);

  // Add timestamp
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 32);

  // Add table using autoTable
  autoTable(doc, {
    head: [data.headers],
    body: data.rows,
    startY: 40,
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [66, 139, 202],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
  });

  // Save the PDF
  doc.save(`${data.filename}.pdf`);
};

export const exportToExcel = (data: ExportData) => {
  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([data.headers, ...data.rows]);

  // Set column widths
  const colWidths = data.headers.map(() => ({ wch: 15 }));
  ws['!cols'] = colWidths;

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Data');

  // Save the Excel file
  XLSX.writeFile(wb, `${data.filename}.xlsx`);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};