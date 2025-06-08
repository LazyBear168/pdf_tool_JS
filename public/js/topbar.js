// File name: topbar.js
//Author: sunny
// Loading the top bar menu layout and the function of button <<, >> when the screen shrinkage.

const sharedMenus = [
    {
        label: "⚙️",
        aria:"settings Menu",
        id: "settingsMenu",
        items: ["Client mode", "Dark mode"]
    },
    {
        label: "Reader",
        aria: "PDF Reader Menu",
        id: "readerMenu",
        items: ["Import PDF", "Background", "Text"]
    },
    {
        label: "Editor",
        aria: "PDF Editor Menu",
        id: "editorMenu",
        items: ["Merge PDF", "Split PDF"]
    },
    {
        label: "Convert",
        aria: "PDF Convert Menu",
        id: "convertMenu",
        items: ["PDF to Word", "PDF to EPUB"]
    }
];

fetch("partials/navbar.html")
.then(response => response.text())
.then(data => { 
    document.getElementById("navbar-container").innerHTML = data;
    renderMenu(".desktop-nav .menu-container");
    renderMenu(".mobile-nav .menu-container", true);
    initTopBar();
})
.catch(error => {
    console.error("Failed to load navbar", error);
});

function renderMenu(containSelector, isMobile = false) {
    const container = document.querySelector(containSelector);
    if (!container) return;

    const ul = document.createElement("ul");
    sharedMenus.forEach((menu, index) => {
        const li = document.createElement("li");
        li.className = "dropdown";

        const button = document.createElement("button");
        const foldClass = isMobile ? "" : (index < 2 ? "foldableL" : "foldableR");
        button.className = `dropBtn ${foldClass}`;
        button.innerText = isMobile ? menu.label : ((index>0) ? `PDF ${menu.label}` : menu.label);
        button.setAttribute("aria-haspopup", "true");
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-controls", isMobile ? `mobile-${menu.id}` : menu.id);
        button.setAttribute("aria-label", menu.aria);

        const ulSub = document.createElement("ul");
        ulSub.className = "dropdown-content";
        ulSub.id = isMobile ? `mobile-${menu.id}` : menu.id;

        menu.items.forEach(item => {
            const subLi = document.createElement("li");
            const subBtn = document.createElement("button");
            subBtn.type = "button";
            subBtn.textContent = item;
            subLi.appendChild(subBtn);
            ulSub.appendChild(subLi);
        });
        li.appendChild(button);
        li.appendChild(ulSub);
        ul.appendChild(li);
    });
    container.appendChild(ul);
}

function initTopBar(){
    const leftBtn = document.getElementById("left-button");
    const rightBtn = document.getElementById("right-button");
    const topBar = document.querySelector(".topBarWrapper");

    // Toggle menu visibility for small screen buttons << >>
    rightBtn?.addEventListener("click", () => {
        topBar.classList.add("expanded");
    });

    leftBtn?.addEventListener("click", () => {
        topBar.classList.remove("expanded");
    });

     // Dropdown behavior
    const dropdownButtons = document.querySelectorAll(".dropBtn");

    dropdownButtons.forEach(button => {
        const menuId = button.getAttribute("aria-controls");
        const menu = document.getElementById(menuId);

        // Click toggles dropdown and aria-expanded
        button.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();

            const isOpen = menu.classList.contains("show");

            closeAllDropdowns();

            if (!isOpen) {
                menu.classList.add("show");
                button.setAttribute("aria-expanded", "true");
            }else {
                // Optional: allow re-click to close
                menu.classList.remove("show");
                button.setAttribute("aria-expanded", "false");
            }
        });

        // Keyboard: toggle menu on Enter or Space
        button.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            button.click(); // Triggers same logic as click
        }
        });
    });
    
    // Hover behavior: only switch if a menu is already open
    document.querySelectorAll(".dropdown").forEach(item => {
        item.addEventListener("mouseenter", function () {
            const activeDropdown = document.querySelector(".dropdown-content.show");
            if (!activeDropdown) return;

            const newDropdown = this.querySelector(".dropdown-content");
            if (newDropdown && newDropdown !== activeDropdown) {
                closeAllDropdowns();
                newDropdown.classList.add("show");

                const btn = this.querySelector(".dropBtn");
                if (btn) btn.setAttribute("aria-expanded", "true");
            }
        });
    });
    
    // Click anywhere else to close dropdowns
    document.addEventListener("click", () => {
        closeAllDropdowns();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeAllDropdowns();
        }
    });

}

function closeAllDropdowns() {
    document.querySelectorAll(".dropdown-content").forEach(menu =>
        menu.classList.remove("show")
    );
    document.querySelectorAll(".dropBtn").forEach(button =>
        button.setAttribute("aria-expanded", "false")
    );
}