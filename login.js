async function checkLoggedIn() {
    let stor = await browser.storage.sync.get(["check", "every", "to", "from", "days"]);
    let lstor = await browser.storage.local.get(["timeout", "check"])
    let last = lstor.timeout;
    let timestamp = 0;
    if (last) {
        timestamp = last.timestamp;
    }
    let d = new Date();
    let ds = d.getHours() * 60 + d.getMinutes();
    let nts = d.getTime();
    const afterTo = stor.to.hour * 60 + stor.to.minute < ds,
            beforeFrom = stor.from.hour * 60 + stor.from.minute > ds,
            tooSoon = nts - timestamp < stor.every * 60 * 1000 * 0.99,
            notToday = !stor.days.includes(d.getDay());
    if (!lstor.check || tooSoon || beforeFrom || afterTo || notToday) {
        return;
    } else {
        timestamp = nts;
        let l = await loggedIn();
        if (l == 1) {
            browser.notifications.create("nbbuy-login", {
                type: "basic",
                message: "You are currently not logged in.",
                title: "Create user session!",
                iconUrl: browser.runtime.getURL("icons/nbbuy.png")
            });
        }
    }
    browser.storage.local.set({timeout: {
            timestamp: nts,
            ran: new Date(nts).toString()
        }
    });
}

async function loggedIn() {
    let ret = 0;
    try {
        let res = await fetch("https://www.notebooksbilliger.de/kundenkonto", {
            credentials: "same-origin",
            redirect: "follow",
            cache: "reload"
        });
        ret = res.redirected ? 1 : 2;
    } catch (error) {
        // ret = 0;
    }
    browser.storage.local.set({loggedIn: ret == 2});
    return ret;
}