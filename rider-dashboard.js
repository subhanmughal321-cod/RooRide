// RooRide frontend demonstration. Arrays below stand in for future MySQL tables.
// All changes are in memory only. Never enter real personal information here.
const $ = id => document.getElementById(id);
function dateAfter(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
}
const today = dateAfter(0);
const rides = [
    {id:1,from:'Satellite Town',to:'GIFT University',driver:'Ahmed Khan',vehicle:'Suzuki Cultus',rating:4.8,verified:true,seats:3,fare:150,km:12,date:today,time:'08:00',ac:true,campus:'GIFT University',instant:true,pickup:'Satellite Town main market'},
    {id:2,from:'Satellite Town',to:'GIFT University',driver:'Ali Raza',vehicle:'Honda City',rating:4.7,verified:true,seats:2,fare:180,km:12,date:today,time:'08:30',ac:true,campus:'GIFT University',instant:false,pickup:'Satellite Town public bus stop'},
    {id:3,from:'Model Town',to:'Peoples Colony',driver:'Usman Malik',vehicle:'Toyota Corolla',rating:4.9,verified:true,seats:4,fare:500,km:8,date:today,time:'10:00',ac:true,campus:'',instant:true,pickup:'Model Town main road'},
    {id:4,from:'Gujranwala',to:'City Tour',driver:'Hassan Shah',vehicle:'Honda City',rating:4.6,verified:true,seats:3,fare:5000,km:30,date:today,time:'11:00',ac:true,campus:'',instant:false,pickup:'Public meeting point'},
    {id:5,from:'Satellite Town',to:'Master City',driver:'Bilal Ahmed',vehicle:'Suzuki Wagon R',rating:4.8,verified:true,seats:2,fare:999,km:14,date:today,time:'13:30',ac:false,campus:'',instant:true,pickup:'Satellite Town main market'},
    {id:6,from:'Model Town',to:'Satellite Town',driver:'Ahmed Khan',vehicle:'Suzuki Cultus',rating:4.8,verified:true,seats:2,fare:500,km:9,date:today,time:'15:00',ac:true,campus:'',instant:true,pickup:'Model Town public stop'},
    {id:7,from:'GIFT University',to:'Satellite Town',driver:'Ali Raza',vehicle:'Honda City',rating:4.7,verified:true,seats:0,fare:150,km:12,date:today,time:'16:00',ac:true,campus:'GIFT University',instant:true,pickup:'University main gate'},
    {id:8,from:'DC Colony',to:'GIFT University',driver:'Zain Ali',vehicle:'Suzuki Alto',rating:4.5,verified:true,seats:3,fare:200,km:16,date:today,time:'09:00',ac:false,campus:'GIFT University',instant:false,pickup:'DC Colony public stop'}
];
// Tomorrow's offers have independent seat counts and IDs.
for (let i=0;i<8;i++) rides.push({...rides[i],id:rides[i].id+10,date:dateAfter(1)});
let bookings = [
    {id:1001,rideId:11,status:'Confirmed',seats:1,fare:150,payment:'Cash',normalCost:300,pin:'4821'},
    {id:1002,rideId:1,status:'Completed',seats:1,fare:150,payment:'Cash',normalCost:300,completedDate:dateAfter(-3),review:null},
    {id:1003,rideId:3,status:'Completed',seats:1,fare:500,payment:'Cash',normalCost:650,completedDate:dateAfter(-12),review:{rating:5,text:'Comfortable trip.'}}
];
rides.find(r=>r.id===11).seats--;
let nextBooking = 1004;
let notifications = [{text:'Welcome to RooRide! Your demo account is ready.',read:false},{text:'Booking RR-1001 is confirmed for tomorrow.',read:false}];
let waitlist = [], savedRoutes = [{from:'Satellite Town',to:'GIFT University'}], schedules = [], contacts = [], reports = [], messages = [], groups = [], demands = [], feedback = [];
let campusMembership = '';
let normalTripCost = 300;
let selectedRide = null, selectedSeats = 1;
let currentPage = 'overview';
const locations = ['GIFT University','Satellite Town','Peoples Colony','Model Town','DC Colony','Wapda Town','Citi Housing','Garden Town','Civil Lines','Gulshan Iqbal','Rahwali','Kangniwala','Chand Da Qila','Sialkot Bypass','Khiali','Nowshera Virkan','Kamoke','Eminabad','Gujranwala','City Tour','Master City'];
// Escape user-entered text before including it in HTML.
function safe(value) { return String(value ?? '').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function money(n) { return 'Rs. ' + Number(n).toLocaleString('en-PK',{maximumFractionDigits:2}); }
function empty(text) { return '<p class="empty">'+safe(text)+'</p>'; }
function action(label, name, id, kind='secondary') { return `<button type="button" class="${kind}" data-action="${name}" data-id="${id}">${safe(label)}</button>`; }
function route(r) { return `<p class="route">${safe(r.from)} <span>→</span> ${safe(r.to)}</p>`; }
function record(title, text, buttons='') { return `<div class="record"><h3>${safe(title)}</h3><p>${safe(text)}</p>${buttons?'<div class="ride-actions">'+buttons+'</div>':''}</div>`; }
function stat(icon,label,value,foot='') { return `<article class="stat"><span class="stat-icon" aria-hidden="true">${icon}</span><small>${safe(label)}</small><strong>${safe(value)}</strong><p>${safe(foot)}</p></article>`; }
function notify(text) { notifications.unshift({text,read:false}); renderNotifications(); }
function notice(text) { $('notice').textContent=text; $('notice').hidden=false; }
function getRide(id) { return rides.find(r=>r.id===Number(id)); }
function getBooking(id) { return bookings.find(b=>b.id===Number(id)); }
function go(page) {
    const section=$(page);
    if (!section || !section.classList.contains('page')) return;
    currentPage=page;
    document.querySelectorAll('.page').forEach(s=>s.hidden=s.id!==page);
    document.querySelectorAll('.nav-button').forEach(b=>{b.classList.toggle('active',b.dataset.page===page);if(b.dataset.page===page)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
    $('page-title').textContent=document.querySelector(`.nav-button[data-page="${page}"]`).textContent.trim().replace(/^[^A-Za-z]+/,'');
    const dot=document.createElement('span'); dot.textContent='.'; $('page-title').appendChild(dot);
    $('sidebar').classList.remove('open'); $('mobile-menu').setAttribute('aria-expanded','false');
    $('notice').hidden=true; renderAll(); window.scrollTo(0,0); $('page-title').focus({preventScroll:true});
}
function rideCard(r, reason='') {
    const already=bookings.some(b=>b.rideId===r.id && ['Confirmed','Pending approval','Active'].includes(b.status));
    const seats=Number($('passengers').value);
    const button=already?'<span class="tag">Already booked</span>':r.seats>=seats?action(r.instant?'Book ride':'Request booking','book',r.id,'primary'):action('Join waiting list','wait',r.id,'primary');
    return `<article class="ride-card">${route(r)}<p class="ride-meta">${safe(r.date)} · ${safe(r.time)} · ${r.km} km</p><h3>${safe(r.driver)} <span class="tag">★ ${r.rating}</span></h3><p class="ride-meta">${safe(r.vehicle)} · ${r.ac?'AC available':'No AC'}</p><span class="tag">${r.verified?'Driver & vehicle verified (demo)':'Unverified'}</span><span class="tag ${r.seats===0?'pending':''}">${r.seats} seats left</span><p class="ride-meta">Pickup: ${safe(r.pickup)}</p>${reason?'<p class="info">'+safe(reason)+'</p>':''}<div class="card-bottom"><div><span class="fare">${money(r.fare)}</span><small class="muted"> / seat</small></div><div class="ride-actions">${action('Details','details',r.id)}${button}</div></div></article>`;
}
function minutes(time) { const parts=time.split(':'); return Number(parts[0])*60+Number(parts[1]); }
function searchRides() {
    const from=$('from').value,to=$('to').value,date=$('date').value,time=$('time').value,maxFare=Number($('max-fare').value),comfort=$('comfort').value,campus=$('campus-filter').value,flex=$('flexible').checked;
    if(from && from===to){$('results').innerHTML=empty('Choose different departure and destination locations.');$('result-count').textContent='0 results';return;}
    const matches=rides.filter(r=>(!from||r.from===from)&&(!to||r.to===to)&&(!date||r.date===date)&&(!time||(flex?Math.abs(minutes(r.time)-minutes(time))<=60:minutes(r.time)>=minutes(time)))&&(!maxFare||r.fare<=maxFare)&&(!comfort||r.ac)&&(!campus||r.campus===campus));
    // Keep insufficient-seat rides visible for waitlist, but put available offers first.
    matches.sort((a,b)=>Number(b.seats>=Number($('passengers').value))-Number(a.seats>=Number($('passengers').value))||a.date.localeCompare(b.date)||a.time.localeCompare(b.time));
    $('result-count').textContent=matches.length+' sample offer(s)';
    $('results').innerHTML=matches.map(r=>rideCard(r)).join('')||empty('No matching sample rides. Try today or tomorrow, change filters, or post a route request in Connect.');
}
function recommended() {
    const choices=rides.filter(r=>r.seats>=Number($('passengers').value)&&!bookings.some(b=>b.rideId===r.id&&['Confirmed','Pending approval','Active'].includes(b.status)));
    const score=r=> (savedRoutes.some(s=>s.from.toLowerCase()===r.from.toLowerCase()&&s.to.toLowerCase()===r.to.toLowerCase())?5:0)+(campusMembership&&r.campus===campusMembership?2:0)+(bookings.some(b=>b.rideId===r.id&&b.status==='Completed')?1:0);
    return choices.sort((a,b)=>score(b)-score(a)||a.fare-b.fare||a.date.localeCompare(b.date));
}
function reason(r) {return savedRoutes.some(s=>s.from.toLowerCase()===r.from.toLowerCase()&&s.to.toLowerCase()===r.to.toLowerCase())?'Matches a saved route and has available seats.':'Available seats and a relatively affordable sample fare.';}
function renderSmart(){const list=recommended();$('smart-list').innerHTML=list.slice(0,6).map(r=>rideCard(r,reason(r))).join('')||empty('No recommendations available.');$('overview-match').innerHTML=list.length?rideCard(list[0],reason(list[0])):empty('No recommendations.');}
function completed(period='all') {return bookings.filter(b=>b.status==='Completed'&&(period==='all'||b.completedDate>=dateAfter(-Number(period))));}
function totals(list) {let km=0,saving=0;for(const b of list){km+=getRide(b.rideId).km;saving+=b.normalCost-b.fare*b.seats;}return{km,saving,co2:km*.2,fuel:km/12,points:list.length*20,count:list.length};}
function renderStats(){const t=totals(completed());$('overview-stats').innerHTML=stat('▤','Completed rides',t.count,'Completed bookings')+stat('₨','Estimated money saved',money(t.saving),'Against normal cost')+stat('♧','Estimated CO₂ saved',t.co2.toFixed(1)+' kg','Separate-car baseline')+stat('☆','Eco points',t.points,'Virtual rewards');const next=bookings.filter(b=>['Confirmed','Active','Pending approval'].includes(b.status)).sort((a,b)=>getRide(a.rideId).date.localeCompare(getRide(b.rideId).date)||getRide(a.rideId).time.localeCompare(getRide(b.rideId).time))[0];$('upcoming').innerHTML=next?bookingCard(next):empty('No upcoming bookings. Find your next ride!');}
// A deterministic four-digit PIN for each sample booking; real PINs need server generation and expiry.
function demoPin(id) { return String(3000 + id % 7000); }
function statusTag(status){return `<span class="tag ${status==='Cancelled'?'cancelled':status==='Pending approval'?'pending':''}">${safe(status)}</span>`;}
function bookingCard(b){const r=getRide(b.rideId);let buttons=action('Details','booking-details',b.id);if(['Confirmed','Pending approval'].includes(b.status))buttons+=action('Cancel','cancel',b.id);if(b.status==='Pending approval')buttons+=action('Simulate approval','approve',b.id);if(b.status==='Confirmed')buttons+=action('Simulate arrival / start','start',b.id);if(b.status==='Active')buttons+=action('Simulate completion','complete',b.id,'primary')+action('Trip details','trip',b.id);if(b.status==='Completed'&&!b.review)buttons+=action('Rate driver','review',b.id);if(b.status==='Cancelled')buttons+=action('Find alternatives','alternative',b.id);return `<article class="record">${statusTag(b.status)}<p class="muted">RR-${b.id}</p>${route(r)}<p>${safe(r.driver)} · ${safe(b.completedDate||r.date)} · ${safe(r.time)}</p><p>${b.seats} passenger(s) · ${money(b.fare*b.seats)} · ${safe(b.payment)}</p>${b.review?'<p>Rating: '+b.review.rating+'/5 · '+safe(b.review.text)+'</p>':''}${b.cancelReason?'<p>Reason: '+safe(b.cancelReason)+'</p>':''}<div class="ride-actions">${buttons}</div></article>`;}
function renderBookings(){const status=$('booking-filter').value;$('booking-list').innerHTML=bookings.filter(b=>!status||b.status===status).slice().reverse().map(bookingCard).join('')||empty('No bookings in this category.');$('waiting-list').innerHTML=waitlist.map((w,i)=>{const r=getRide(w.rideId);return record(r.from+' → '+r.to,w.seats+' seat(s) · '+r.date+' · '+(r.seats>=w.seats?'Seats available now':'Waiting for seats'),(r.seats>=w.seats?action('Book now','wait-book',i,'primary'):'')+action('Leave list','leave-wait',i));}).join('')||empty('You have no waiting-list requests.');}
function renderNotifications(){$('notification-count').textContent=notifications.filter(n=>!n.read).length;$('notification-list').innerHTML=notifications.map(n=>record(n.read?'Read':'New notification',n.text)).join('')||empty('No notifications.');}
function renderImpact(){const list=completed($('impact-period').value),t=totals(list);$('green-stats').innerHTML=stat('♧','Estimated CO₂',t.co2.toFixed(1)+' kg')+stat('◈','Estimated fuel',t.fuel.toFixed(1)+' L')+stat('↗','Potential trips avoided',t.count)+stat('↔','Shared distance',t.km+' km');$('impact-list').innerHTML=list.map(b=>{const r=getRide(b.rideId);return record(r.from+' → '+r.to,b.completedDate+' · '+(r.km*.2).toFixed(1)+' kg estimated CO₂');}).join('')||empty('No completed rides for this period.');}
function renderRewards(){const t=totals(completed());$('reward-stats').innerHTML=stat('☆','Points balance',t.points)+stat('✓','Completed rides',t.count)+stat('◇','Badge',t.count>=5?'Green Commuter':t.count>=1?'First Journey':'Not earned')+stat('↗','Next milestone',Math.max(0,5-t.count)+' rides');$('reward-history').innerHTML=completed().map(b=>record('RR-'+b.id,'+20 points · '+b.completedDate)).join('')||empty('Complete a ride to earn points.');$('leaderboard').hidden=!$('leaderboard-opt').checked;$('leaderboard').innerHTML=[{name:'Demo commuter A',points:160},{name:'Demo commuter B',points:100},{name:'You',points:t.points}].sort((a,b)=>b.points-a.points).map((r,i)=>record((i+1)+'. '+r.name,r.points+' points')).join('');}
function renderReceipts(){$('receipt-list').innerHTML=bookings.filter(b=>['Confirmed','Active','Completed'].includes(b.status)).map(b=>record('Receipt RR-'+b.id,money(b.fare*b.seats)+' · '+b.payment+' · '+b.status,action('View receipt','receipt',b.id))).join('')||empty('No receipts yet.');}
function renderCampus(){$('campus-status').textContent=campusMembership?'Membership requested: '+campusMembership+' — pending demo admin approval.':'No membership requested.';$('campus-partners').innerHTML=rides.filter(r=>r.id<10&&r.campus).slice(0,3).map(r=>record(r.driver,r.campus+' · '+r.from+' · '+r.time,action('View ride','details',r.id))).join('');}
function renderCommute(){$('saved-routes').innerHTML=savedRoutes.map((s,i)=>record(s.from+' → '+s.to,'Saved route',action('Find ride','saved-search',i)+action('Return ride','return-search',i)+action('Remove','remove-route',i))).join('')||empty('No saved routes.');$('commute-list').innerHTML=schedules.map((s,i)=>record(s.day+' · '+s.destination,s.outbound+' outbound / '+s.returnTime+' return',action('Remove','remove-schedule',i))).join('')||empty('No commute schedule.');}
function renderSafety(){const active=bookings.filter(b=>['Confirmed','Active'].includes(b.status));$('safety-ride').innerHTML=active.map(b=>record('RR-'+b.id+' · '+b.status,'Pickup PIN: '+(b.status==='Active'?'Used in demo':b.pin),action('View trip details','trip',b.id)+(b.status==='Active'?action('Simulate SOS','sos',b.id):''))).join('')||empty('No confirmed or active bookings.');$('contact-list').innerHTML=contacts.map((c,i)=>record(c.name,c.phone+' · '+c.relationship,action('Remove','remove-contact',i))).join('')||empty('No trusted contacts added.');$('report-list').innerHTML=reports.map(r=>record(r.category+' · '+r.booking,r.description+' — Pending (demo)')).join('')||empty('No submitted reports.');const previous=$('report-booking').value;$('report-booking').innerHTML='<option value="General">General / no booking</option>'+bookings.map(b=>`<option>RR-${b.id}</option>`).join('');if([...$('report-booking').options].some(o=>o.value===previous))$('report-booking').value=previous;}
function renderConnect(){$('message-list').innerHTML=messages.map(m=>record('To '+m.driver,m.message+' · Local demo')).join('')||empty('No messages.');$('group-list').innerHTML=groups.map((g,i)=>record(g.name,'Private demo group · '+(g.invite?'Invitation draft: '+g.invite:'No invite yet'),action('Leave group','leave-group',i))).join('')||empty('No groups.');$('demand-list').innerHTML=demands.map(d=>record(d.from+' → '+d.to,d.time+' · Posted locally')).join('')||empty('No requests.');$('feedback-list').innerHTML=feedback.map(f=>record('Feedback draft',f.feedback)).join('')||empty('No feedback yet.');}
function renderAll(){renderStats();searchRides();renderBookings();renderNotifications();renderSmart();renderCampus();renderImpact();renderReceipts();renderRewards();renderCommute();renderSafety();renderConnect();}
function setLocation(id,value){const select=$(id);if(value&&!Array.from(select.options).some(o=>o.value===value)){const o=document.createElement('option');o.value=value;o.textContent=value;select.appendChild(o);}select.value=value||'';}
function openBooking(id, seats=Number($('passengers').value)){const r=getRide(id);if(!r||r.seats<seats||!r.verified){notice('This ride cannot be booked. Try the waiting list or another ride.');return;}if(bookings.some(b=>b.rideId===r.id&&['Confirmed','Pending approval','Active'].includes(b.status))){notice('You already have a booking for this ride.');return;}selectedRide=r;selectedSeats=seats;$('booking-summary').innerHTML=route(r)+`<p>${safe(r.date)} · ${safe(r.time)} · ${safe(r.driver)}</p><p>Fare per seat: ${money(r.fare)} × ${seats} seat(s)</p><p class="fare">Total: ${money(r.fare*seats)}</p><p class="muted">${r.instant?'Instant confirmation':'Requires driver approval (simulated)'}</p>`;$('booking-form').elements.normalCost.value=normalTripCost;$('confirm-booking').textContent=r.instant?'Confirm booking':'Request booking';$('booking-dialog').showModal();}
function detail(title,html){$('detail-title').textContent=title;$('detail-content').innerHTML=html;$('detail-dialog').showModal();}
function bookingDetails(b){const r=getRide(b.rideId);return route(r)+`<p>Booking: RR-${b.id} · ${safe(b.status)}</p><p>Driver: ${safe(r.driver)} · ★ ${r.rating}</p><p>Vehicle: ${safe(r.vehicle)} · ${r.verified?'Verified (demo)':'Unverified'}</p><p>Pickup: ${safe(r.pickup)}</p><p>${safe(r.date)} · ${safe(r.time)} · ${b.seats} seat(s)</p><p>Total: ${money(b.fare*b.seats)} · ${safe(b.payment)}</p>${b.status==='Confirmed'?'<p>Demo pickup PIN: '+b.pin+'</p>':''}`;}
function seatReleased(r){for(const w of waitlist)if(w.rideId===r.id&&r.seats>=w.seats&&!w.notified){w.notified=true;notify('Seats are available for your waiting-list ride: '+r.from+' → '+r.to+'.');}}
function formData(form){return Object.fromEntries(new FormData(form).entries());}
function handleForm(id,callback){$(id).addEventListener('submit',e=>{e.preventDefault();callback(formData(e.currentTarget),e.currentTarget);});}
// Navigation and actions use one click listener instead of repeating handlers.
document.addEventListener('click',e=>{
    const button=e.target.closest('button');if(!button)return;
    if(button.hasAttribute('data-close')){button.closest('dialog').close();return;}
    if(button.dataset.page||button.dataset.go){go(button.dataset.page||button.dataset.go);return;}
    const a=button.dataset.action,id=Number(button.dataset.id);if(!a)return;
    const r=getRide(id),b=getBooking(id);
    if(a==='book'){openBooking(id);return;}
    if(a==='details'){detail('Ride and driver details',route(r)+`<p>${safe(r.driver)} · ★ ${r.rating}</p><p>${safe(r.vehicle)} · ${r.verified?'Verified driver and vehicle (demo)':'Unverified'}</p><p>${safe(r.date)} · ${safe(r.time)} · ${r.seats} seats</p><p>Public pickup: ${safe(r.pickup)}</p><p>Estimated fare: ${money(r.fare)} per seat</p><p>${r.ac?'Air conditioning available':'No air conditioning'}</p>`);return;}
    if(a==='wait'){const seats=Number($('passengers').value);if(waitlist.some(w=>w.rideId===id)){notice('You are already on this waiting list.');return;}waitlist.push({rideId:id,seats,notified:false});notify('Joined waiting list for '+r.from+' → '+r.to+'.');notice('Waiting-list request added.');}
    else if(a==='leave-wait'){waitlist.splice(id,1);notice('Removed from waiting list.');}
    else if(a==='wait-book'){openBooking(waitlist[id].rideId,waitlist[id].seats);return;}
    else if(a==='booking-details'||a==='receipt'||a==='trip'){detail(a==='receipt'?'Demo receipt':a==='trip'?'Shareable trip details (demo)':'Booking details',bookingDetails(b)+(a==='receipt'?'<p class="info">Payment status: not processed. This is a sample receipt only.</p>':a==='trip'?'<p class="info">No live GPS or location sharing. You may copy the displayed sample trip details manually.</p>':''));return;}
    else if(a==='cancel'&&['Confirmed','Pending approval'].includes(b.status)){detail('Cancel booking',`<form id="cancel-form"><label>Cancellation reason<textarea name="reason" required maxlength="200"></textarea></label><button class="primary">Confirm cancellation</button></form>`);handleForm('cancel-form',d=>{b.status='Cancelled';b.cancelReason=d.reason;const ride=getRide(b.rideId);ride.seats+=b.seats;seatReleased(ride);notify('Booking RR-'+b.id+' cancelled.');$('detail-dialog').close();notice('Booking cancelled and seats released.');renderAll();});return;}
    else if(a==='approve'&&b.status==='Pending approval'){b.status='Confirmed';b.pin=demoPin(b.id);notify('Demo driver approved RR-'+b.id+'.');notice('Demo approval complete.');}
    else if(a==='start'&&b.status==='Confirmed'){detail('Simulate driver arrival and boarding',`<p class="info">Simulated driver action, not actual tracking. Demo PIN: ${b.pin}</p><form id="pin-form"><label>Pickup PIN<input name="pin" required inputmode="numeric" maxlength="4"></label><p id="pin-error" role="status"></p><button class="primary">Verify and start demo ride</button></form>`);handleForm('pin-form',d=>{if(d.pin!==b.pin){$('pin-error').textContent='Incorrect demo PIN.';return;}b.status='Active';b.pin=null;notify('Driver arrival and pickup simulated for RR-'+b.id+'.');$('detail-dialog').close();notice('Ride started in demo mode.');renderAll();});return;}
    else if(a==='complete'&&b.status==='Active'){b.status='Completed';b.completedDate=today;notify('Ride RR-'+b.id+' completed. 20 demo eco points earned.');notice('Ride completed. Estimated savings and points updated.');}
    else if(a==='review'&&b.status==='Completed'&&!b.review){detail('Rate your driver','<form id="review-form"><label>Rating<select name="rating"><option>5</option><option>4</option><option>3</option><option>2</option><option>1</option></select></label><label>Review<textarea name="text" maxlength="300" placeholder="Optional review"></textarea></label><button class="primary">Submit review</button></form>');handleForm('review-form',d=>{b.review={rating:Number(d.rating),text:d.text};$('detail-dialog').close();notice('Review added to sample booking.');renderAll();});return;}
    else if(a==='alternative'){const ride=getRide(b.rideId);$('search-form').reset();setLocation('from',ride.from);setLocation('to',ride.to);go('search');return;}
    else if(a==='saved-search'||a==='return-search'){const s=savedRoutes[id];$('search-form').reset();setLocation('from',a==='saved-search'?s.from:s.to);setLocation('to',a==='saved-search'?s.to:s.from);go('search');return;}
    else if(a==='remove-route')savedRoutes.splice(id,1);
    else if(a==='remove-schedule')schedules.splice(id,1);
    else if(a==='remove-contact')contacts.splice(id,1);
    else if(a==='leave-group')groups.splice(id,1);
    else if(a==='sos'){detail('SOS demonstration','<p class="info">No emergency alert has been sent. This static project cannot contact emergency services or trusted contacts. If you are in danger, use your phone to contact local emergency services directly.</p>');return;}
    renderAll();
});
handleForm('booking-form',(d,form)=>{if(!selectedRide||selectedRide.seats<selectedSeats)return;const r=selectedRide;if(bookings.some(b=>b.rideId===r.id&&['Confirmed','Pending approval','Active'].includes(b.status)))return;const status=r.instant?'Confirmed':'Pending approval';const b={id:nextBooking++,rideId:r.id,status,seats:selectedSeats,fare:r.fare,payment:d.payment,normalCost:Number(d.normalCost),pin:r.instant?demoPin(nextBooking-1):null};bookings.push(b);r.seats-=selectedSeats;waitlist=waitlist.filter(w=>w.rideId!==r.id);notify('Booking RR-'+b.id+' · '+status+'.');$('booking-dialog').close();selectedRide=null;form.reset();go('bookings');notice('Demo booking RR-'+b.id+' created. '+status+'.');});
$('search-form').addEventListener('submit',e=>{e.preventDefault();searchRides();});$('search-form').addEventListener('reset',()=>setTimeout(searchRides,0));$('passengers').addEventListener('change',searchRides);$('booking-filter').addEventListener('change',renderBookings);$('impact-period').addEventListener('change',renderImpact);$('leaderboard-opt').addEventListener('change',renderRewards);$('mark-read').addEventListener('click',()=>{notifications.forEach(n=>n.read=true);renderNotifications();});
$('mobile-menu').addEventListener('click',()=>{const open=$('sidebar').classList.toggle('open');$('mobile-menu').setAttribute('aria-expanded',String(open));});
handleForm('campus-form',d=>{campusMembership=d.university;notify('Campus membership requested (demo).');renderAll();notice('Membership request recorded locally.');});
handleForm('savings-form',d=>{const share=(Number(d.distance)/Number(d.efficiency)*Number(d.fuel)+Number(d.toll))/Number(d.people);$('savings-result').textContent='Estimated fare contribution: '+money(share)+' per person. Estimated difference against normal cost: '+money(Number(d.normal)-share)+'.';});
handleForm('route-form',(d,f)=>{if(d.from.trim().toLowerCase()===d.to.trim().toLowerCase()){notice('Pickup and destination must be different.');return;}savedRoutes.push({from:d.from.trim(),to:d.to.trim()});f.reset();renderAll();notice('Route saved.');});
handleForm('commute-form',(d,f)=>{schedules.push(d);f.reset();renderCommute();notice('Weekly commute added.');});
handleForm('contact-form',(d,f)=>{contacts.push(d);f.reset();renderSafety();notice('Demo emergency contact added.');});
handleForm('report-form',(d,f)=>{reports.push(d);f.reset();renderSafety();notice('Report recorded locally, not sent to admin.');});
handleForm('message-form',(d,f)=>{messages.push(d);f.reset();renderConnect();notice('Demo message added.');});
handleForm('group-form',(d,f)=>{groups.push(d);f.reset();renderConnect();notice('Private group draft created locally.');});
handleForm('demand-form',(d,f)=>{if(d.from.trim().toLowerCase()===d.to.trim().toLowerCase()){notice('Choose different locations.');return;}demands.push(d);f.reset();renderConnect();notice('Ride demand request recorded locally.');});
handleForm('feedback-form',(d,f)=>{feedback.push(d);f.reset();renderConnect();notice('Feedback recorded locally.');});
handleForm('profile-form',d=>{normalTripCost=Number(d.cost||0);$('welcome-text').textContent='Welcome back, '+d.name+'! Find a ride, save money and make every kilometre count.';notice('Demo profile updated for this page session.');});
// Preserve the homepage search criteria after successful sample login.
for(const loc of locations){for(const id of ['from','to']){const option=document.createElement('option');option.value=loc;option.textContent=loc;$(id).appendChild(option);}}
for(const name of [...new Set(rides.map(r=>r.driver))]){const o=document.createElement('option');o.value=name;o.textContent=name;$('message-driver').appendChild(o);}
$('date').min=today;
const query=new URLSearchParams(location.search);
if(query.get('from'))setLocation('from',query.get('from'));
if(query.get('to'))setLocation('to',query.get('to'));
if(query.get('date'))$('date').value=query.get('date');
if(['1','2','3','4'].includes(query.get('passengers')))$('passengers').value=query.get('passengers');
renderAll();
if(query.get('intent')==='booking'||query.has('from')||query.has('to'))go('search');
