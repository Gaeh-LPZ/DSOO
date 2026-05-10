import html2pdf from "html2pdf.js";

export const downloadPDF = async (ticketNum: string) => {
  const element = document.getElementById("factura-preview");
  if (!element) return;

  await html2pdf()
    .from(element)
    .set({
      margin: 10,
      filename: `factura-${ticketNum}.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    })
    .save();
};