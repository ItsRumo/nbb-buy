function acceptAndScroll() {
    document.getElementById("conditions").checked = true;
    let submit = document.querySelector("button[type=\"submit\"]");
    submit.classList.add("active");
    submit.attributes.removeNamedItem("disabled");
    submit.scrollIntoView();
    submit.focus();
}
if (document.readyState === "loading") {
    document.addEventListener("readystatechange", () => {
        if (document.readyState === "interactive" || document.readyState === "complete") {
            acceptAndScroll();
        }
    });
} else {
    acceptAndScroll();
}