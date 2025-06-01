async function loadTool(toolName) {
    const container = document.getElementById('tool-container');
    container.innerHTML = 'Loading...';

    try {
        const response = await fetch(`tools/${toolName}.html`);
        const html = await response.text();
        container.innerHTML = html;

        // Dynamically load the JS for that tool
        const script = document.createElement('script');
        script.src = `js/${toolName}.js`;
        script.type = `text/javascript`;
        document.body.appendChild(script);
    } catch (e) {
        container.innerHTML = `<p>Error loading tool: ${toolName}</p>`
    }
}