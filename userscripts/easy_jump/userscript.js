export default function() {
    const matches = document.querySelectorAll("a");
    matches.forEach((item) => {
        const st = item.href;
        if(st.includes("jump?url=")){
            item.href = decodeURIComponent(st.substring(st.indexOf("jump?url=")+9, st.lenght));
        }
    });
}
