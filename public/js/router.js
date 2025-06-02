/**
 * 📄 router.js
 * Dynamically loads tool-specific HTML and JS into the main container.
 * Ensures only the tool content changes, while the sidebar stays persistent.
 *
 * Expected folder structure:
 * - tools/merge.html, tools/split.html, etc.
 * - js/merge.js, js/split.js, etc.
 *
 * Used in index.html via <script src="js/router.js"></script>
 */

/**
 * Loads the selected tool's UI into the #tool-container.
 * @param {string} toolName - The tool's identifier, e.g. "merge", "split", "design".
 */
async function loadTool(toolName) {
    const container = document.getElementById('tool-container');
    // Display temporary message while loading
    container.innerHTML = 'Loading...';

    try {
        // 1. Fetch the HTML partial for the selected tool
        const response = await fetch(`tools/${toolName}.html`);
        const html = await response.text();

        // 2. Inject the HTML into the main content area
        container.innerHTML = html;

        // 3. Dynamically load the tool's JavaScript logic
        const script = document.createElement('script');
        script.src = `js/${toolName}.js`;
        script.type = `text/javascript`;
        document.body.appendChild(script);
    } catch (e) {
        container.innerHTML = `<p>Error loading tool: ${toolName}</p>`
    }
}