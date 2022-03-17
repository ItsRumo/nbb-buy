async function initStorage() {
    let stor = await browser.storage.sync.get(["check", "every", "to", "from", "days"]);
    if (!stor.check) {
        stor.check = false;
    }
    if (!stor.every) {
        stor.every = 11;
    }
    if (!stor.days) {
        stor.days = [1,2,3,4,5];
    }
    if (!stor.from) {
        stor.from = {hour: 8, minute: 0};
    } else {
        if (!stor.from.hour) {
            stor.from.hour = 8;
        }
        if (!stor.from.minute) {
            stor.from.minute = 0;
        }
    }
    if (!stor.to) {
        stor.to = {hour: 18, minute: 0};
    } else {
        if (!stor.to.hour) {
            stor.to.hour = 18;
        }
        if (!stor.to.minute) {
            stor.to.minute = 0;
        }
    }

    browser.storage.sync.set(stor);
}

initStorage()

browser.browserAction.onClicked.addListener(globalGo);
browser.notifications.onClicked.addListener(() => {
    browser.tabs.create({
        url: "https://www.notebooksbilliger.de/kundenkonto/anmelden",
    });
});

async function globalGo(tab, clickData) {
    if (clickData.button == 1) {
        if (globalGo.stage % 2 == 0) {
            handleClick(null);
        } else {
            createKasseTab();
        }
        globalGo.stage = (globalGo.stage + 1) % 2
    }
    //  else {
    //     handleClick(tab);
    // }
}

globalGo.stage = 0;

function setIcon() {
    let obj = browser.storage.sync.get("check");
    obj.then(res => {
        if (res.check) {
            browser.browserAction.setIcon({ "path": "/icons/nbbuy.png"});
        } else {
            browser.browserAction.setIcon({ "path": "/icons/nbnobuy.png"});
        }
    });

}

setIcon();
checkLoggedIn();
setInterval(checkLoggedIn, 60 * 1000);