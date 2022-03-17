function saveOptions(e) {
    const daymapper = {"sun": 0, "mon": 1, "tue": 2, "wed": 3, "thu":4, "fri": 5, "sat": 6};
    let days = [];
    for (let l of document.querySelectorAll("#days input")) {
        if (l.checked) {
            days.push(daymapper[l.id]);
        }
    }

    let [fromH, fromM] = document.getElementById("from").value.split(":");
    fromH = Number.parseInt(fromH) || 8;
    fromM = Number.parseInt(fromM) || 0;
    let from = {hour: fromH, minute: fromM};

    let [toH, toM] = document.getElementById("to").value.split(":");
    toH = Number.parseInt(toH) || 18;
    toM = Number.parseInt(toM) || 0;
    let to = {hour: toH, minute: toM};

    browser.storage.sync.set({
        days: days,
        from: from,
        to: to,
        every: Number.parseInt(document.getElementById("every").value || 15),
        check: document.getElementById("check").checked
    });

    refreshLoop();
    e.preventDefault();
}

function restoreOptions(e) {
    const daymapper = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    let obj2TString = o => `${o.hour.toString().padStart(2, '0')}:${o.minute.toString().padStart(2, '0')}`;

    browser.storage.sync.get().then(res => {
        for (let d of res.days || [1, 2, 3, 4, 5]) {
            document.getElementById(daymapper[d]).checked = true;
        }

        document.getElementById("from").value = res.from ? obj2TString(res.from) : "08:00";
        document.getElementById("to").value = res.to ? obj2TString(res.to) : "18:00";
        document.getElementById("every").value = res.every || 11;
        document.getElementById("check").checked = res.check;
    });
}

document.getElementById("check").addEventListener("change", e => {
    if (e.target && e.target.checked) {
        browser.browserAction.setIcon({ "path": "/icons/nbbuy.png"});
    } else {
        browser.browserAction.setIcon({ "path": "/icons/nbnobuy.png"});
    }
});
document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("change", saveOptions);