const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.dashboard-section');
const menuOpen = document.getElementById('menuOpen');
const menuClose = document.getElementById('menuClose');
const sidebar = document.getElementById('sidebar');
const quickRideBtn = document.getElementById('quickRideBtn');
const rideForm = document.getElementById('rideForm');
const rideMessage = document.getElementById('rideMessage');
const ridesContainer = document.getElementById('ridesContainer');
const requestsContainer = document.getElementById('requestsContainer');
const todayScheduleList = document.getElementById('todayScheduleList');
const updatesList = document.getElementById('updatesList');

const rides = [
  {
    id: 1,
    from: 'Satellite Town',
    to: 'GIFT University',
    date: '2026-11-29',
    time: '08:00 AM',
    seats: 3,
    fare: 180,
    status: 'Upcoming'
  },
  {
    id: 2,
    from: 'Model Town',
    to: 'DC Colony',
    date: '2026-11-29',
    time: '05:00 PM',
    seats: 2,
    fare: 150,
    status: 'Upcoming'
  },
  {
    id: 3,
    from: 'Cantt',
    to: 'GIFT University',
    date: '2026-11-25',
    time: '08:15 AM',
    seats: 4,
    fare: 200,
    status: 'Completed'
  }
];

const bookingRequests = [
  {
    id: 1,
    name: 'Sarah Khan',
    route: 'Satellite Town → GIFT University',
    seats: 1,
    note: 'Need pickup near main gate.',
    status: 'Pending'
  },
  {
    id: 2,
    name: 'Usman Ali',
    route: 'Model Town → DC Colony',
    seats: 1,
    note: 'Will bring a small laptop bag.',
    status: 'Pending'
  }
];

const updates = [
  '1 new passenger requested your morning campus ride.',
  'Your vehicle document review is still pending.',
  'You earned 40 Eco Points from yesterday\'s ride.',
  'A recurring route suggestion has been added to CommutePlanner.'
];

function switchSection(sectionId) {
  navItems.forEach((item) => {
    item.classList.toggle('active', item.dataset.section === sectionId);
  });

  sections.forEach((section) => {
    section.classList.toggle('active', section.id === sectionId);
  });

  sidebar.classList.remove('show');
}

navItems.forEach((item) => {
  item.addEventListener('click', () => switchSection(item.dataset.section));
});

document.querySelectorAll('[data-go]').forEach((button) => {
  button.addEventListener('click', () => switchSection(button.dataset.go));
});

menuOpen.addEventListener('click', () => sidebar.classList.add('show'));
menuClose.addEventListener('click', () => sidebar.classList.remove('show'));
quickRideBtn.addEventListener('click', () => switchSection('publishRide'));

function renderTodaySchedule() {
  const todayList = rides.slice(0, 2).map((ride) => `
    <li>
      <strong>${ride.time}</strong> — ${ride.from} → ${ride.to}<br>
      <span>${ride.seats} seats · Rs. ${ride.fare} per seat · ${ride.status}</span>
    </li>
  `).join('');

  todayScheduleList.innerHTML = todayList;
}

function renderUpdates() {
  updatesList.innerHTML = updates.map((update) => `<li>${update}</li>`).join('');
}

function renderRides() {
  ridesContainer.innerHTML = rides.map((ride) => `
    <div class="simple-card fade-up">
      <h4>${ride.from} → ${ride.to}</h4>
      <p><strong>Date:</strong> ${ride.date}</p>
      <p><strong>Time:</strong> ${ride.time}</p>
      <p><strong>Seats:</strong> ${ride.seats}</p>
      <p><strong>Fare:</strong> Rs. ${ride.fare} per seat</p>
      <p><strong>Status:</strong> ${ride.status}</p>
    </div>
  `).join('');
}

function renderRequests() {
  if (bookingRequests.length === 0) {
    requestsContainer.innerHTML = '<div class="simple-card"><h4>No pending requests</h4><p>All requests have been handled.</p></div>';
    return;
  }

  requestsContainer.innerHTML = bookingRequests.map((request) => `
    <div class="request-card fade-up">
      <h4>${request.name}</h4>
      <p><strong>Route:</strong> ${request.route}</p>
      <p><strong>Seats:</strong> ${request.seats}</p>
      <p><strong>Note:</strong> ${request.note}</p>
      <p><strong>Status:</strong> ${request.status}</p>
      <div class="request-actions">
        <button class="accept-btn" onclick="handleRequest(${request.id}, 'Accepted')">Accept</button>
        <button class="reject-btn" onclick="handleRequest(${request.id}, 'Rejected')">Reject</button>
      </div>
    </div>
  `).join('');
}

window.handleRequest = function (requestId, action) {
  const requestIndex = bookingRequests.findIndex((request) => request.id === requestId);
  if (requestIndex !== -1) {
    const requestName = bookingRequests[requestIndex].name;
    bookingRequests.splice(requestIndex, 1);
    updates.unshift(`${requestName}'s request was ${action.toLowerCase()}.`);
    renderRequests();
    renderUpdates();
  }
};

rideForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const newRide = {
    id: rides.length + 1,
    from: document.getElementById('from').value,
    to: document.getElementById('to').value,
    date: document.getElementById('rideDate').value,
    time: document.getElementById('rideTime').value,
    seats: document.getElementById('seatCount').value,
    fare: document.getElementById('fare').value,
    status: 'Upcoming'
  };

  rides.unshift(newRide);
  rideMessage.textContent = 'Ride published successfully in demo mode.';
  updates.unshift(`New ride published: ${newRide.from} → ${newRide.to}.`);

  rideForm.reset();
  renderRides();
  renderUpdates();
  renderTodaySchedule();
  switchSection('myRides');
});

renderTodaySchedule();
renderUpdates();
renderRides();
renderRequests();
