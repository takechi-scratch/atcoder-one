export default function main() {
    const rated =
        document.querySelector(".insert-participant-box strong > u").innerText === "Rated";

    if (rated) {
        // テキストを赤くする
        document.querySelector(".insert-participant-box strong").style.color = "red";
    } else {
        document.querySelector(".insert-participant-box strong").style.color = "gray";
    }
}
