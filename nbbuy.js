const nbb_regex = /\bhttps?:\/\/(?:www\.)notebooksbilliger\.de\/[^\/]*\+(\d+)\b/;

browser.browserAction.onClicked.addListener(globalGo);
browser.pageAction.onClicked.addListener(handleClick);
browser.notifications.onClicked.addListener(() => {
    browser.tabs.create({
        url: "https://www.notebooksbilliger.de/kundenkonto/anmelden",
    });
});

async function globalGo(tab, clickData) {
    if (clickData.button == 1) {
        createKasseTab();
    } else {
        handleClick(tab);
    }
}

async function handleClick(tab, callback=null) {
    const raw_cb = await navigator.clipboard.readText();
    const match = nbb_regex.exec(tab.url) || nbb_regex.exec(raw_cb);
    if (!match) {
        return false;
    }
    const [url, pid] = match;
    console.log(url, pid);
    let req = new XMLHttpRequest();
    req.open("POST", `${url}/action/add_product`, true);
    if (callback) {
        req.onreadystatechange = function() {
            if (this.readyState === XMLHttpRequest.HEADERS_RECEIVED && this.status === 200) {
                callback();
            }
        };
    }
    req.send(null);
    return true;
}

async function createKasseTab() {
    browser.tabs.create({url: "https://www.notebooksbilliger.de/kasse"}).then(
        kasse => {
            browser.tabs.executeScript(kasse.id, {
                file: "semiautocheckout.js",
                runAt: "document_end"
            });
        });
}

async function checkLoggedIn() {
    try {
        await fetch("https://www.notebooksbilliger.de/kundenkonto", {
            credentials: "same-origin",
            redirect: "error",
            cache: "reload"
        });
    } catch (error) {
        browser.notifications.create("nbbuy-login", {
            type: "basic",
            message: "You are currently not logged in.",
            title: "Create user session!",
            iconUrl: browser.runtime.getURL("icons/nbbuy.png")
        });
    }
}

checkLoggedIn();
let loginchecker = setInterval(checkLoggedIn, 11 * 60 * 1000);