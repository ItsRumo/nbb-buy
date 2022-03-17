async function checkLoggedInLoop() {
    let stor = await browser.storage.sync.get(["check", "every", "to", "from", "days"]);
    let last = (await browser.storage.local.get("timeout")).timeout;
    let timestamp = 0;
    if (last) {
        timestamp = last.timestamp;
    }
    let d = new Date();
    let ds = d.getHours() * 60 + d.getMinutes();
    const afterTo = stor.to.hour * 60 + stor.to.minute < ds,
            beforeFrom = stor.from.hour * 60 + stor.from.minute > ds,
            tooSoon = d.getTime() - timestamp < stor.every * 60 * 1000,
            notToday = !stor.days.includes(d.getDay());
    if (!stor.check || beforeFrom || afterTo || tooSoon || notToday) {
    } else {
        if (!(await loggedIn())) {
            browser.notifications.create("nbbuy-login", {
                type: "basic",
                message: "You are currently not logged in.",
                title: "Create user session!",
                iconUrl: browser.runtime.getURL("icons/nbbuy.png")
            });
        }
    }
    let delay = Math.max(stor.every * 60 * 1000 - (d.getTime() - timestamp), 0);
    if (afterTo) {
        delay = (stor.from.hour * 60 + stor.from.minute) + 24 * 60 - ds; 
    }
    let id = setTimeout(checkLoggedInLoop, 60 * 1000);
    let nts = d.getTime();
    browser.storage.local.set({
        timeout: {
            timestamp: nts,
            id: id
        }
    });
}

async function loggedIn() {
    let ret = false;
    try {
        await fetch("https://www.notebooksbilliger.de/kundenkonto", {
            credentials: "same-origin",
            redirect: "error",
            cache: "reload"
        });
        ret = true;
    } catch (error) {
        console.log(error);
    }
    browser.storage.local.set({loggedIn: ret})
    return ret;
}

async function refreshLoop() {
    let last = (await browser.storage.local.get("timeout")).timeout;
    if (last) {
        clearTimeout(last.id);
    }
    checkLoggedInLoop();
}