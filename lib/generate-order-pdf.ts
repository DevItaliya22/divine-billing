import jsPDF from "jspdf";

type OrderData = {
  orderNumber: string;
  orderDate: string;
  partyName: string;
  designName: string;
  designImageUrl?: string;
  frame: number;
  notes: string | null;
  fabric: string[];
  fabricColor: string[];
  dori: string[];
  fiveMmSeq: string[];
  threeMmSeq: string[];
  fourMmBeats: string[];
  threeMmBeats: string[];
  twoPointFiveMmBeats: string[];
};

export async function generateOrderPDF(order: OrderData): Promise<void> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 20;

  // Title
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("DIVINE TRENDS", pageWidth / 2, yPos, { align: "center" });
  yPos += 15;

  // Line separator
  doc.setLineWidth(0.5);
  doc.line(20, yPos, pageWidth - 20, yPos);
  yPos += 15;

  // Order details section
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Order Number:", 20, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(order.orderNumber, 70, yPos);

  doc.setFont("helvetica", "bold");
  doc.text("Date:", pageWidth / 2, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(
    new Date(order.orderDate).toLocaleDateString(),
    pageWidth / 2 + 20,
    yPos
  );
  yPos += 10;

  doc.setFont("helvetica", "bold");
  doc.text("Party:", 20, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(order.partyName, 70, yPos);

  doc.setFont("helvetica", "bold");
  doc.text("Frame:", pageWidth / 2, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(order.frame.toString(), pageWidth / 2 + 25, yPos);
  yPos += 15;

  // Design section
  doc.setFont("helvetica", "bold");
  doc.text("Design:", 20, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(order.designName, 70, yPos);
  yPos += 10;

  // Design image
  if (order.designImageUrl) {
    try {
      const imgData = await fetchImageAsBase64(order.designImageUrl);
      if (imgData) {
        const imgWidth = 60;
        const imgHeight = 60;
        doc.addImage(imgData, "JPEG", 20, yPos, imgWidth, imgHeight);
        yPos += imgHeight + 10;
      }
    } catch (err) {
      console.error("Failed to load image:", err);
      yPos += 5;
    }
  }

  // Notes
  if (order.notes) {
    doc.setFont("helvetica", "bold");
    doc.text("Notes:", 20, yPos);
    yPos += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const splitNotes = doc.splitTextToSize(order.notes, pageWidth - 40);
    doc.text(splitNotes, 20, yPos);
    yPos += splitNotes.length * 5 + 10;
    doc.setFontSize(12);
  }

  // Line separator
  doc.setLineWidth(0.3);
  doc.line(20, yPos, pageWidth - 20, yPos);
  yPos += 10;

  // Materials section
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Materials", 20, yPos);
  yPos += 10;
  doc.setFontSize(11);

  // Helper function to add material section
  const addMaterialSection = (title: string, items: string[]) => {
    if (items.length === 0) return;

    // Check if we need a new page
    if (yPos > 260) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.text(`${title}:`, 20, yPos);
    doc.setFont("helvetica", "normal");
    const itemsText = items.join(", ");
    const splitText = doc.splitTextToSize(itemsText, pageWidth - 80);
    doc.text(splitText, 70, yPos);
    yPos += Math.max(splitText.length * 6, 8);
  };

  addMaterialSection("Fabrics", order.fabric);
  addMaterialSection("Fabric Colors", order.fabricColor);
  addMaterialSection("Dori", order.dori);
  addMaterialSection("5mm Sequins", order.fiveMmSeq);
  addMaterialSection("3mm Sequins", order.threeMmSeq);
  addMaterialSection("4mm Beats", order.fourMmBeats);
  addMaterialSection("3mm Beats", order.threeMmBeats);
  addMaterialSection("2.5mm Beats", order.twoPointFiveMmBeats);

  // Save PDF
  doc.save(`Order-${order.orderNumber}.pdf`);
}

async function fetchImageAsBase64(url: string): Promise<string | null> {
  try {
    // Fetch image through our API to avoid CORS
    const response = await fetch(
      `/api/proxy-image?url=${encodeURIComponent(url)}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch image");
    }
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.error("Error fetching image:", err);
    // Fallback: try direct fetch
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch {
      return null;
    }
  }
}
