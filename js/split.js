document.getElementById('splitBtn').addEventListener('click', async () => {
  const file = document.getElementById('splitFile').files[0];
  const splitAt = parseInt(document.getElementById('splitAt').value);
  if (!file || isNaN(splitAt)) return alert("Select a file and enter a valid page number.");

  const { PDFDocument } = PDFLib;
  const bytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(bytes);
  const totalPages = pdf.getPageCount();

  if (splitAt >= totalPages) return alert("Split page exceeds total page count.");

  const doc1 = await PDFDocument.create();
  const doc2 = await PDFDocument.create();

  const part1Pages = await doc1.copyPages(pdf, [...Array(splitAt).keys()]);
  const part2Pages = await doc2.copyPages(pdf, [...Array(totalPages - splitAt).keys()].map(i => i + splitAt));

  part1Pages.forEach(p => doc1.addPage(p));
  part2Pages.forEach(p => doc2.addPage(p));

  const blob1 = new Blob([await doc1.save()], { type: 'application/pdf' });
  const blob2 = new Blob([await doc2.save()], { type: 'application/pdf' });

  const a1 = document.createElement('a');
  a1.href = URL.createObjectURL(blob1);
  a1.download = "part1.pdf";
  a1.click();

  const a2 = document.createElement('a');
  a2.href = URL.createObjectURL(blob2);
  a2.download = "part2.pdf";
  a2.click();
});
