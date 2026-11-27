// RooRide admin demonstration. All records are fictional.
// This session check is for navigation only, NOT real security.
if (sessionStorage.getItem("roorideAdminDemo") !== "yes") {
    window.location.replace("admin-login.html");
}

// Sample data. Later, replace these arrays with database/API records.
const users = [
    {id:"U01", name:"Ayesha Khan", role:"Rider", status:"Active"},
    {id:"U02", name:"Bilal Ahmad", role:"Rider", status:"Active"},
    {id:"U03", name:"Sara Malik", role:"Rider", status:"Active"},
    {id:"D01", name:"Ahmed Ali", role:"Driver", status:"Active"},
    {id:"D02", name:"Hassan Raza", role:"Driver", status:"Active"},
    {id:"D03", name:"Usman Malik", role:"Driver", status:"Active"}
];
const drivers = [
    {id:"D01", name:"Ahmed Ali", vehicle:"Honda City", seats:4, status:"Pending", vehicleStatus:"Pending", remarks:"—"},
    {id:"D02", name:"Hassan Raza", vehicle:"Toyota Corolla", seats:4, status:"Pending", vehicleStatus:"Pending", remarks:"—"},
    {id:"D03", name:"Usman Malik", vehicle:"Suzuki Alto", seats:3, status:"Verified", vehicleStatus:"Verified", remarks:"Sample review completed"}
];
const rides = [
    {id:"R01", route:"Satellite Town → GIFT", driver:"D03", date:"2026-11-25", time:"08:00", seats:3, occupied:2, status:"Completed", distance:10, efficiency:15, recurring:"Mon–Fri"},
    {id:"R02", route:"Model Town → GIFT", driver:"D03", date:"2026-11-26", time:"08:30", seats:3, occupied:1, status:"Completed", distance:12, efficiency:15, recurring:"None"},
    {id:"R03", route:"Satellite Town → GIFT", driver:"D03", date:"2026-11-28", time:"08:00", seats:3, occupied:1, status:"Published", distance:10, efficiency:15, recurring:"Mon–Fri"},
    {id:"R04", route:"GIFT → Model Town", driver:"D03", date:"2026-11-29", time:"15:00", seats:3, occupied:0, status:"Published", distance:12, efficiency:15, recurring:"None"}
];
const bookings = [
    {id:"B01", ride:"R01", rider:"U01", fare:150, payment:"Cash", status:"Completed"},
    {id:"B02", ride:"R01", rider:"U02", fare:150, payment:"Cash", status:"Completed"},
    {id:"B03", ride:"R02", rider:"U03", fare:180, payment:"Cash", status:"Completed"},
    {id:"B04", ride:"R03", rider:"U01", fare:150, payment:"Cash", status:"Confirmed"}
];
const communities = [
    {id:"C01", name:"Ayesha Khan", university:"GIFT University", department:"Computer Science", status:"Pending"},
    {id:"C02", name:"Bilal Ahmad", university:"GIFT University", department:"Management Sciences", status:"Approved"}
];
const complaints = [
    {id:"P01", type:"Pickup issue", user:"U01", detail:"Meeting point was unclear.", status:"Open", remarks:"—"},
    {id:"P02", type:"Community feedback", user:"U02", detail:"Add more afternoon return rides.", status:"Open", remarks:"—"}
];
const audit = [];
let page = "overview";
let reportStart = "";
let reportEnd = "";
let reportRoute = "";
const byId = id => document.getElementById(id);
const titles = {overview:"Overview", users:"Users", drivers:"Drivers & vehicles", verification:"Verification", rides:"Rides", bookings:"Bookings", campus:"CampusConnect", green:"GreenImpact", rewards:"EcoRewards", complaints:"Complaints & feedback", reports:"Analytics & reports"};

// Create ordinary HTML elements without inserting user text as HTML.
function element(tag, text, className) {
    const el = document.createElement(tag);
    if (text !== undefined) el.textContent = text;
    if (className) el.className = className;
    return el;
}
function status(text) {
    let style = "status";
    if (["Pending", "Open", "Published", "Confirmed"].includes(text)) style += " pending";
    if (["Rejected", "Suspended", "Cancelled"].includes(text)) style += " inactive";
    return element("span", text, style);
}
function action(label, handler, reject = false) {
    const button = element("button", label, "action" + (reject ? " reject" : ""));
    button.type = "button";
    button.addEventListener("click", handler);
    return button;
}
function table(target, headers, rows) {
    target.replaceChildren();
    if (rows.length === 0) {
        target.append(element("p", "No matching records found.", "muted"));
        return;
    }
    const t = element("table");
    const head = t.createTHead().insertRow();
    for (const name of headers) head.append(element("th", name));
    const body = t.createTBody();
    for (const values of rows) {
        const row = body.insertRow();
        for (const value of values) {
            const cell = row.insertCell();
            if (value instanceof Node) cell.append(value);
            else cell.textContent = value;
        }
    }
    target.append(t);
}
function actions(...buttons) {
    const wrap = element("div");
    wrap.append(...buttons);
    return wrap;
}
function notify(text) {
    byId("notice").textContent = text + " (demo)";
    byId("notice").hidden = false;
}
function recordDecision(id, decision, reason) {
    audit.push({id, decision, reason, time:new Date().toLocaleString()});
}
function change(record, field, next, needsReason = false) {
    let reason = "Sample admin action";
    if (needsReason) {
        reason = prompt("Enter a reason for this decision (sample data only):");
        if (!reason || !reason.trim()) return;
        if ("remarks" in record) record.remarks = reason.trim();
    }
    record[field] = next;
    recordDecision(record.id, field + ": " + next, reason);
    render();
    notify(record.id + " updated to " + next + ".");
}
function filter(records) {
    const query = byId("search").value.trim().toLowerCase();
    return records.filter(record => Object.values(record).join(" ").toLowerCase().includes(query));
}
function name(id) {
    const user = users.find(u => u.id === id);
    return user ? user.name : id;
}
function cards(target, data, className) {
    target.replaceChildren();
    for (const [label, value] of data) {
        const card = element("div", undefined, className);
        if (className === "stat") card.append(element("p", label), element("strong", value));
        else card.append(element("strong", value), element("p", label));
        target.append(card);
    }
}
// Assumption: each passenger otherwise takes an equivalent separate car.
// Each completed ride is counted once. Factor 0.20 kg/km is illustrative.
function impact(list) {
    let co2 = 0, fuel = 0, trips = 0;
    for (const ride of list) {
        if (ride.status === "Completed") {
            co2 += ride.distance * ride.occupied * 0.20;
            fuel += ride.distance * ride.occupied / ride.efficiency;
            trips += ride.occupied;
        }
    }
    return {co2:co2.toFixed(1), fuel:fuel.toFixed(1), trips};
}
function overview() {
    cards(byId("stats"), [["Total riders", users.filter(u => u.role === "Rider").length], ["Total drivers", drivers.length], ["Total rides", rides.length], ["Pending driver approvals", drivers.filter(d => d.status === "Pending").length]], "stat");
    const result = impact(rides);
    cards(byId("impactStats"), [["Estimated CO₂ avoided", result.co2 + " kg"], ["Estimated fuel saved", result.fuel + " L"], ["Potential car trips avoided", result.trips]], "impact-item");
    table(byId("recentDrivers"), ["Driver", "Vehicle", "Status", "Action"], drivers.map(d => [d.name,d.vehicle,status(d.status),action("Review", () => openPage("verification"))]));
}
function showRecords(headers, rows) { table(byId("records"), headers, rows); }
function description(text) { byId("description").textContent = text; }
function render() {
    if (page === "overview") { overview(); return; }
    byId("extra").replaceChildren();
    byId("filters").hidden = ["green", "rewards", "reports"].includes(page);
    byId("sectionTitle").textContent = titles[page];
    if (page === "users") {
        description("Search accounts and demonstrate activation or suspension. No real accounts are affected.");
        showRecords(["ID","Name","Role","Status","Action"], filter(users).map(u => [u.id,u.name,u.role,status(u.status),action(u.status === "Active" ? "Suspend" : "Activate", () => change(u,"status",u.status === "Active" ? "Suspended" : "Active",true),u.status === "Active")]));
    } else if (page === "drivers") {
        description("Review driver and vehicle records. Verification uses the separate Verification section.");
        showRecords(["Driver","Vehicle","Seats","Driver status","Vehicle status","Action"], filter(drivers).map(d => [d.name,d.vehicle,d.seats,status(d.status),status(d.vehicleStatus),action("Review", () => openPage("verification"))]));
    } else if (page === "verification") {
        description("Review fictional applications. Document names are placeholders; no real CNIC or licence files are stored.");
        showRecords(["Driver","Vehicle","Documents","Driver status","Vehicle status","Actions","Remarks"], filter(drivers).map(d => [d.name,d.vehicle,"CNIC / licence / registration",status(d.status),status(d.vehicleStatus),actions(...(d.status === "Pending" ? [action("Approve driver",()=>change(d,"status","Verified",true)),action("Reject driver",()=>change(d,"status","Rejected",true),true)] : []),...(d.vehicleStatus === "Pending" ? [action("Verify vehicle",()=>change(d,"vehicleStatus","Verified",true)),action("Reject vehicle",()=>change(d,"vehicleStatus","Rejected",true),true)] : [])),d.remarks]));
        byId("extra").append(element("p","Decisions and timestamps appear under Analytics & reports."));
    } else if (page === "rides") {
        description("Monitor ride routes, schedules and passenger capacity. Cancelling an upcoming ride also cancels its confirmed bookings.");
        showRecords(["ID","Route","Date / time","Driver","Seats booked","Schedule","Status","Action"], filter(rides).map(r => [r.id,r.route,r.date+" "+r.time,name(r.driver),r.occupied+" / "+r.seats,r.recurring,status(r.status),r.status === "Published" ? action("Cancel ride",()=>cancelRide(r),true) : "—"]));
    } else if (page === "bookings") {
        description("Review reservations, fare contributions and payment methods. Cancel a confirmed demo booking to release its seat.");
        showRecords(["ID","Ride","Passenger","Fare","Payment","Status","Action"], filter(bookings).map(b => [b.id,b.ride,name(b.rider),"Rs. "+b.fare,b.payment,status(b.status),b.status === "Confirmed" ? action("Cancel booking",()=>cancelBooking(b),true) : "—"]));
    } else if (page === "campus") {
        description("Review student membership requests using fictional university records.");
        showRecords(["Request","Student","University","Department","Status","Action"], filter(communities).map(c => [c.id,c.name,c.university,c.department,status(c.status),c.status === "Pending" ? actions(action("Approve",()=>change(c,"status","Approved",true)),action("Reject",()=>change(c,"status","Rejected",true),true)) : "—"]));
    } else if (page === "green") {
        description("Estimated environmental savings from completed shared rides. Uses the illustrative separate-car baseline: 0.20 kg CO₂/km and each ride's sample fuel efficiency.");
        const total = impact(rides);
        showRecords(["Metric","Estimate"], [["CO₂ avoided",total.co2+" kg"],["Fuel saved",total.fuel+" L"],["Potential car trips avoided",total.trips]]);
        byId("extra").append(element("p","Actual savings depend on alternative travel modes, vehicle efficiency and pickup detours."));
    } else if (page === "rewards") {
        description("Demo rule: 10 eco points per passenger's completed booking. Points are calculated once per unique completed booking.");
        showRecords(["Passenger","Completed bookings","Eco points","Achievement"], users.filter(u=>u.role === "Rider").map(u => {
            const count = new Set(bookings.filter(b=>b.rider===u.id && b.status==="Completed").map(b=>b.id)).size;
            return [u.name,count,count*10,count>=1?"Green Starter":"—"];
        }));
    } else if (page === "complaints") {
        description("Review reported issues and community feedback. Private messages and emergency contact details are not displayed.");
        showRecords(["ID","Category","User","Description","Status","Action","Remarks"], filter(complaints).map(c => [c.id,c.type,name(c.user),c.detail,status(c.status),c.status === "Open" ? action("Resolve",()=>change(c,"status","Resolved",true)) : "—",c.remarks]));
    } else if (page === "reports") {
        renderReports();
    }
}
function cancelRide(ride) {
    const reason = prompt("Enter cancellation reason:");
    if (!reason || !reason.trim()) return;
    ride.status = "Cancelled";
    for (const b of bookings) if (b.ride === ride.id && b.status === "Confirmed") b.status = "Cancelled";
    ride.occupied = 0;
    recordDecision(ride.id,"Ride cancelled",reason);
    render(); notify("Ride and its confirmed bookings cancelled.");
}
function cancelBooking(booking) {
    const reason = prompt("Enter cancellation reason:");
    if (!reason || !reason.trim()) return;
    booking.status = "Cancelled";
    const ride = rides.find(r=>r.id===booking.ride);
    if (ride) ride.occupied = Math.max(0,ride.occupied-1);
    recordDecision(booking.id,"Booking cancelled",reason);
    render(); notify("Booking cancelled; seat released.");
}
function renderReports() {
    description("Filter sample ride records by date and route. SmartMatch and CommutePlanner use related route and schedule data later.");
    const form = element("div",undefined,"report-filter");
    for (const [labelText,type,value,update] of [["From","date",reportStart,v=>reportStart=v],["To","date",reportEnd,v=>reportEnd=v],["Route","search",reportRoute,v=>reportRoute=v]]) {
        const group = element("div"), label = element("label",labelText), input = element("input");
        input.type=type; input.value=value; input.addEventListener("change",()=>{update(input.value);render();});
        label.append(input); group.append(label); form.append(group);
    }
    byId("records").replaceChildren(form);
    const list = rides.filter(r=>(!reportStart||r.date>=reportStart)&&(!reportEnd||r.date<=reportEnd)&&r.route.toLowerCase().includes(reportRoute.toLowerCase()));
    const valid = list.filter(r=>r.status!=="Cancelled");
    const capacity = valid.reduce((sum,r)=>sum+r.seats,0);
    const occupied = valid.reduce((sum,r)=>sum+r.occupied,0);
    const impactData = impact(list);
    const routeCounts = {}, timeCounts = {};
    for (const r of list) { routeCounts[r.route]=(routeCounts[r.route]||0)+1; timeCounts[r.time]=(timeCounts[r.time]||0)+1; }
    const most = counts => Object.keys(counts).sort((a,b)=>counts[b]-counts[a]).join(", ") || "—";
    const summary = element("div",undefined,"table-wrap");
    table(summary,["Metric","Result"],[["Completed rides",list.filter(r=>r.status==="Completed").length],["Cancelled rides",list.filter(r=>r.status==="Cancelled").length],["Booking records",bookings.filter(b=>list.some(r=>r.id===b.ride)).length],["Cancelled bookings",bookings.filter(b=>b.status==="Cancelled"&&list.some(r=>r.id===b.ride)).length],["Seat occupancy (non-cancelled rides)",capacity?Math.round(occupied/capacity*100)+"%":"—"],["Routes (most frequent first)",most(routeCounts)],["Departure times (most frequent first)",most(timeCounts)],["Estimated CO₂ avoided",impactData.co2+" kg"]]);
    byId("records").append(summary);
    const log = element("div",undefined,"table-wrap");
    byId("extra").append(element("h2","Admin decision history"),log);
    table(log,["Record","Decision","Reason","Timestamp"],audit.map(a=>[a.id,a.decision,a.reason,a.time]));
}
// Replay the entrance effect only when the admin opens a section.
let animationTimer;
function animatePage() {
    const section = byId(page === "overview" ? "overview" : "management");
    clearTimeout(animationTimer);
    byId("overview").classList.remove("page-enter");
    byId("management").classList.remove("page-enter");
    void section.offsetWidth; // Restart the CSS animation.
    section.classList.add("page-enter");
    animationTimer = setTimeout(() => section.classList.remove("page-enter"), 900);
}
function openPage(next) {
    page=next; byId("search").value=""; byId("notice").hidden=true;
    byId("overview").hidden=page!=="overview";
    byId("management").hidden=page==="overview";
    byId("pageTitle").replaceChildren(document.createTextNode(titles[page]),element("span","."));
    for (const button of document.querySelectorAll(".nav-button")) {
        button.classList.toggle("active",button.dataset.page===page);
        if (button.dataset.page===page) button.setAttribute("aria-current","page");
        else button.removeAttribute("aria-current");
    }
    render();
    animatePage();
}
for (const button of document.querySelectorAll(".nav-button")) button.addEventListener("click",()=>openPage(button.dataset.page));
for (const button of document.querySelectorAll("[data-go]")) button.addEventListener("click",()=>openPage(button.dataset.go));
byId("search").addEventListener("input",render);
byId("logout").addEventListener("click",()=>{sessionStorage.removeItem("roorideAdminDemo");window.location.href="admin-login.html";});
openPage("overview");
