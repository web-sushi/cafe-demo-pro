// Optional: highlight active nav link automatically (if you want)
(function () {
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href === path) a.classList.add("active");
    if (path === "" && href === "index.html") a.classList.add("active");
  });
})();

const hamburger = document.querySelector(".hamburger");
const mobileMenu = document.querySelector(".mobile-menu");

if (hamburger && mobileMenu) {
  hamburger.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", isOpen);
  });

  // Optional: auto-close when clicking a link
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      hamburger.setAttribute("aria-expanded", false);
    });
  });
}

// ============================================
// PREMIUM RESERVATION SYSTEM
// ============================================

(function() {
  // Only run on visit page
  const reservationForm = document.getElementById('reservationForm');
  if (!reservationForm) return;

  // Elements
  const dateInput = document.getElementById('reservationDate');
  const dateStatus = document.getElementById('dateStatus');
  const timeStep = document.getElementById('timeStep');
  const timeSlots = document.getElementById('timeSlots');
  const guestsStep = document.getElementById('guestsStep');
  const contactStep = document.getElementById('contactStep');
  const submitSection = document.getElementById('submitSection');
  const reservationSuccess = document.getElementById('reservationSuccess');
  const newReservationBtn = document.getElementById('newReservation');
  const guestCountInput = document.getElementById('guestCount');
  const decreaseGuests = document.getElementById('decreaseGuests');
  const increaseGuests = document.getElementById('increaseGuests');

  // Set minimum date to today
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  dateInput.min = tomorrow.toISOString().split('T')[0];

  // Mock availability data (for demo purposes)
  const mockAvailability = {
    // Fully booked dates
    fullyBooked: ['2024-12-25', '2024-12-31'],
    // Limited availability dates
    limited: ['2024-12-24', '2024-12-30'],
    // Time slots with availability
    timeSlots: [
      { time: '09:00', available: true },
      { time: '09:30', available: true },
      { time: '10:00', available: true },
      { time: '10:30', available: true, limited: true },
      { time: '11:00', available: true },
      { time: '11:30', available: true },
      { time: '12:00', available: true, limited: true },
      { time: '12:30', available: false }, // Booked
      { time: '13:00', available: true },
      { time: '13:30', available: true },
      { time: '14:00', available: true },
      { time: '14:30', available: false }, // Booked
      { time: '15:00', available: true },
      { time: '15:30', available: true },
      { time: '16:00', available: true },
      { time: '16:30', available: true },
      { time: '17:00', available: true },
      { time: '17:30', available: false }, // Booked
    ]
  };

  let selectedDate = null;
  let selectedTime = null;

  // Date selection handler
  dateInput.addEventListener('change', function() {
    selectedDate = this.value;
    selectedTime = null;
    
    if (!selectedDate) {
      hideStep(timeStep);
      hideStep(guestsStep);
      hideStep(contactStep);
      hideStep(submitSection);
      dateStatus.classList.remove('show');
      return;
    }

    // Check date availability
    checkDateAvailability(selectedDate);
    
    // Show time selection
    showStep(timeStep);
    generateTimeSlots();
    hideStep(guestsStep);
    hideStep(contactStep);
    hideStep(submitSection);
  });

  function checkDateAvailability(date) {
    dateStatus.classList.add('show');
    
    if (mockAvailability.fullyBooked.includes(date)) {
      dateStatus.className = 'date-status show unavailable';
      dateStatus.textContent = 'Fully booked on this date. Please select another date.';
      dateInput.setCustomValidity('This date is fully booked');
      hideStep(timeStep);
    } else if (mockAvailability.limited.includes(date)) {
      dateStatus.className = 'date-status show limited';
      dateStatus.textContent = 'Limited availability on this date. Book soon!';
      dateInput.setCustomValidity('');
    } else {
      dateStatus.className = 'date-status show available';
      dateStatus.textContent = 'Available';
      dateInput.setCustomValidity('');
    }
  }

  function generateTimeSlots() {
    timeSlots.innerHTML = '';
    
    mockAvailability.timeSlots.forEach(slot => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'time-slot';
      button.textContent = slot.time;
      
      if (!slot.available) {
        button.classList.add('booked');
        button.disabled = true;
      } else if (slot.limited) {
        button.classList.add('limited');
      }
      
      if (slot.available) {
        button.addEventListener('click', function() {
          // Remove previous selection
          timeSlots.querySelectorAll('.time-slot').forEach(btn => {
            btn.classList.remove('selected');
          });
          
          // Select this time
          this.classList.add('selected');
          selectedTime = slot.time;
          
          // Show next step
          showStep(guestsStep);
          hideStep(contactStep);
          hideStep(submitSection);
        });
      }
      
      timeSlots.appendChild(button);
    });
  }

  // Guest count controls
  decreaseGuests.addEventListener('click', function() {
    const current = parseInt(guestCountInput.value);
    if (current > 1) {
      guestCountInput.value = current - 1;
      updateGuestButtons();
    }
  });

  increaseGuests.addEventListener('click', function() {
    const current = parseInt(guestCountInput.value);
    if (current < 8) {
      guestCountInput.value = current + 1;
      updateGuestButtons();
    }
  });

  function updateGuestButtons() {
    const current = parseInt(guestCountInput.value);
    decreaseGuests.disabled = current <= 1;
    increaseGuests.disabled = current >= 8;
    
    // Show contact step when guests are selected
    if (current >= 1) {
      showStep(contactStep);
      showStep(submitSection);
    }
  }

  // Initialize guest buttons
  updateGuestButtons();

  // Form submission
  reservationForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate form
    if (!selectedDate || !selectedTime || !guestCountInput.value) {
      alert('Please complete all reservation steps.');
      return;
    }

    // Mock submission (no backend yet)
    console.log('Reservation submitted:', {
      date: selectedDate,
      time: selectedTime,
      guests: guestCountInput.value,
      name: document.getElementById('reservationName').value,
      email: document.getElementById('reservationEmail').value,
      phone: document.getElementById('reservationPhone').value,
      notes: document.getElementById('reservationNotes').value
    });

    // Show success message
    reservationForm.style.display = 'none';
    reservationSuccess.style.display = 'block';
    
    // Scroll to success message
    reservationSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  // New reservation button
  if (newReservationBtn) {
    newReservationBtn.addEventListener('click', function() {
      // Reset form
      reservationForm.reset();
      reservationForm.style.display = 'block';
      reservationSuccess.style.display = 'none';
      
      // Reset state
      selectedDate = null;
      selectedTime = null;
      guestCountInput.value = 2;
      updateGuestButtons();
      
      // Hide all steps
      hideStep(timeStep);
      hideStep(guestsStep);
      hideStep(contactStep);
      hideStep(submitSection);
      dateStatus.classList.remove('show');
      
      // Clear time slot selections
      timeSlots.querySelectorAll('.time-slot').forEach(btn => {
        btn.classList.remove('selected');
      });
      
      // Scroll to top
      document.getElementById('reservation').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Helper functions
  function showStep(step) {
    if (step) {
      step.style.display = 'block';
      setTimeout(() => {
        step.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }

  function hideStep(step) {
    if (step) {
      step.style.display = 'none';
    }
  }
})();
