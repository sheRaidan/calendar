var months = [
    {"name": "January", "days": 31}, 
    {"name": "February", "days": 28}, // fix later
    {"name": "March", "days": 31}, 
    {"name": "April", "days": 30}, 
    {"name": "May", "days": 31}, 
    {"name": "June", "days": 30}, 
    {"name": "July", "days": 31}, 
    {"name": "August", "days": 31}, 
    {"name": "September", "days": 30}, 
    {"name": "October", "days": 31}, 
    {"name": "November", "days": 30}, 
    {"name": "December", "days": 31}
];

// ---------- get the current date ----------
var d = new Date();
var month = d.getMonth();
var dayNum = d.getDate();
var dayWeek = d.getDay()+35;

// console.log(dayWeek%7);

// use for testing vvv
// var dayNum = 17;

var days = [{"ofWeek": dayWeek%7, "ofMonth": dayNum}];

// ---------- add month to page ----------
var monthText = document.getElementById("month");
monthText.innerHTML = months[month].name;

// ---------- add calendar to page ----------
var table = document.getElementById("calendar");
var text = "<tr><th>S</th><th>M</th><th>T</th><th>W</th><th>T</th><th>F</th><th>S</th></tr><tr>";

// days before
var weekDay = dayWeek;
for (var i = dayNum-1; i > 0; i--){
    weekDay--;
    days.unshift({"ofWeek": weekDay%7, "ofMonth": i});
}

if (days[0].ofWeek > 0){
    weekDay = days[0].ofWeek;
    for (var i = weekDay; i > 0; i--){
        // text += `<td id="b${i}">0</td>`;
        days.unshift({"ofWeek": i, "ofMonth": 0});
    }
}

// days after
if (dayNum < months[month].days){
    weekDay = dayWeek+1;
    for (var i = dayNum+1; i <= months[month].days; i++){
        days.push({"ofWeek": weekDay%7, "ofMonth": i});
        weekDay++;
    }
}

// continuing into the next month
var checkEnd = 0;
while (weekDay%7 < 6){
    checkEnd++;
    days.push({"ofWeek": weekDay%7, "ofMonth": 0});
    weekDay++;
}

if (checkEnd > 0){
    // weekDay++;
    // console.log(weekDay%7);
    days.push({"ofWeek": weekDay%7, "ofMonth": 0});
}

days.forEach(date => {
    if (date.ofMonth == 0){
        text += `<td><div class="content otherMonth">${date.ofMonth}</div></td>`;
    }else if (date.ofMonth == dayNum){
        text += `<td onclick="view(${date.ofMonth})"><div class="content today">${date.ofMonth}</div></td>`;
    }else{
        text += `<td onclick="view(${date.ofMonth})"><div class="content">${date.ofMonth}</div></td>`;  
    }
    // console.log(date.ofWeek);
    if (date.ofWeek == 6){
        text += "</tr><tr>";
    }
});
text += "</tr>";

// paste
table.innerHTML = text;

// ---------- check if there are any activities ----------
var taskCount = document.querySelectorAll("li").length;

if (taskCount > 0){
    var noTasks = document.getElementById("noTasks");
    noTasks.style.display = "none";
    var tasks = document.getElementById("tasks");
    tasks.style.display = "block";
}