document.querySelector(".login-status button").addEventListener("click", () => {
    browser.tabs.create({
        url: "https://www.notebooksbilliger.de/kundenkonto/anmelden",
    });
    window.close();
});

document.getElementById("login-check").addEventListener("change", e => {
    browser.storage.sync.set({"check": e.target.checked});
    if (e.target.checked) {
        browser.browserAction.setIcon({ "path": "/icons/nbbuy.png"});
    } else {
        browser.browserAction.setIcon({ "path": "/icons/nbnobuy.png"});
    }
});

document.addEventListener("DOMContentLoaded", async e => {
    let res = await browser.storage.sync.get("check");
    document.getElementById("login-check").checked = res.check || false;
    let lres = await browser.storage.local.get("loggedIn");
    let logged = lres.loggedIn || false;
    if (logged) {
        document.querySelector(".login-status").classList.add("logged-in");
        document.getElementById("status").innerText = "Logged In";
    }

    let q = (await loggedIn()) == 2;
    if (q != logged && q) {
        document.querySelector(".login-status").classList.add("logged-in");
        document.getElementById("status").innerText = "Logged In";
    } else if (q != logged && !q) {
        document.querySelector(".login-status").classList.remove("logged-in");
        document.getElementById("status").innerText = "Not Logged In";
    }
});

document.getElementById("add-2-cart").addEventListener("click", e => {
    handleClick(() => {
        document.getElementById("continue").innerHTML = "⭕";
    });
});

document.getElementById("checkout").addEventListener("click", createKasseTab);