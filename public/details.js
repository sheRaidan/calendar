// ---------- view particular day ----------
var popup = document.getElementById('view');
var heading = document.getElementById('date');
var thisMonth = document.getElementById("month").innerHTML;

function view(date){
    if (date%10 == 1 && date != 11){
        heading.innerHTML = `${thisMonth} ${date}st`;
    }else if (date%10 == 2 && date != 12){
        heading.innerHTML = `${thisMonth} ${date}nd`;
    }else if (date%10 == 3 && date != 13){
        heading.innerHTML = `${thisMonth} ${date}rd`;
    }else{
        heading.innerHTML = `${thisMonth} ${date}th`;
    }

    // console.log(heading.innerHTML);
    popup.classList.remove("hide");
}

// ---------- view particular activity ----------