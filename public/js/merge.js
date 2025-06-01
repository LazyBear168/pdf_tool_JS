document.getElementById('mergeBtn').addEventListener('click', async () => {
  const files = document.getElementById('mergeFiles').files;
  if (!files.length) return alert("Please select files.");

  const { PDFDocument } = PDFLib;
  const mergedPdf = await PDFDocument.create();

  for (let file of files) {
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    pages.forEach(p => mergedPdf.addPage(p));
  }

  const mergedBytes = await mergedPdf.save();
  const blob = new Blob([mergedBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = "merged.pdf";
  a.click();
});
