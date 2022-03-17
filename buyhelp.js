const nbb_regex = /\bhttps?:\/\/(?:www\.)notebooksbilliger\.de\/[^\/]*\+(\d+)\b/;

async function handleClick(callback=null) {
    const raw_cb = await navigator.clipboard.readText();
    const match = nbb_regex.exec(raw_cb);
    if (!match) {
        return false;
    }
    const [url, pid] = match;
    console.debug(url, pid);
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
                file: "/semiautocheckout.js",
                runAt: "document_end"
            });
        });
}