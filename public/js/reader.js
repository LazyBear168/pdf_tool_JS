/**
 * 📄 read.js
 * Loads and displays the first page of a PDF onto a canvas using PDF.js
 * Runs entirely in the browser — no upload to server.
 */
document.getElementById(`pdfFile`).addEventListener(`change`, async (e) => {
    const file = e.target.files[0]; // First selected file
    if (!file) return;

    const fileReader = new FileReader();

    fileReader.onload = async function () {
        // interprets binary data as an array of 8-bit (0–255) unsigned integers.
        const typedarray = new Uint8Array(this.result) 

        // Load the PDF into pdf.js
        const pdf = await pdfjsLib.getDocument(typedarray).promise; // waits until the PDF is fully loaded.

        const page = await pdf.getPage(1); // Load first page

        // Scale dynamically based on screen width
        const containerWidth = document.getElementById(`tool-container`).offsetWidth //container width at home page.
        const scale = containerWidth / page.getViewport({scale: 1}).width;

        const viewport = page.getViewport({ scale });
        const canvas = document.getElementById('pdfCanvas');
        const context = canvas.getContext('2d')

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        // tells PDF.js to start drawing the page.
        await page.render(renderContext).promise;
    }
    // load File
    fileReader.readAsArrayBuffer(file);
})
