
document.addEventListener('DOMContentLoaded', function() {
   
    if (document.getElementById('registro-form')) {
        setupRegistrationForm();
        setupFormValidation();
    }
    
    if (document.getElementById('pais-select')) {
        loadFlightSchedules();
        setupCountryFilter();
    }
    
    if (document.querySelectorAll('.reservar-button').length > 0) {
        setupBookingSystem();
    }
    
    setupInteractiveEffects();
});


function loadFlightSchedules() {
    const flightData = {
        mexico: [
            { flight: 'AV 701', destination: 'Cancún', departure: '08:00', arrival: '11:30', status: 'A tiempo' },
            { flight: 'AV 702', destination: 'Ciudad de México', departure: '10:15', arrival: '13:45', status: 'A tiempo' },
            { flight: 'AV 705', destination: 'Guadalajara', departure: '14:30', arrival: '18:00', status: 'Retrasado' }
        ],
        usa: [
            { flight: 'AV 710', destination: 'Nueva York', departure: '07:45', arrival: '15:30', status: 'A tiempo' },
            { flight: 'AV 715', destination: 'Los Ángeles', departure: '09:20', arrival: '17:10', status: 'A tiempo' },
            { flight: 'AV 718', destination: 'Miami', departure: '11:00', arrival: '14:45', status: 'Cancelado' }
        ],
        francia: [
            { flight: 'AV 721', destination: 'París', departure: '06:30', arrival: '14:45', status: 'A tiempo' },
            { flight: 'AV 722', destination: 'Niza', departure: '08:15', arrival: '16:30', status: 'A tiempo' }
        ],
        japon: [
            { flight: 'AV 731', destination: 'Tokio', departure: '10:00', arrival: '06:00 (+1 día)', status: 'A tiempo' },
            { flight: 'AV 735', destination: 'Osaka', departure: '12:30', arrival: '08:30 (+1 día)', status: 'A tiempo' }
        ]
    };

    localStorage.setItem('flightData', JSON.stringify(flightData));
}



function setupRegistrationForm() {
    const registrationForm = document.getElementById('registro-form');
    
    registrationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        
   
        const user = {
            name,
            email,
            discount: true,
            discountCode: 'WELCOME20'
        };
        
        localStorage.setItem('currentUser', JSON.stringify(user));
        
       
        Swal.fire({
            title: '¡Registro exitoso!',
            html: `Gracias ${name}, tu código de descuento es: <strong>${user.discountCode}</strong>`,
            icon: 'success',
            confirmButtonText: 'Genial'
        });
        
      
        registrationForm.reset();
    });
}


function setupCountryFilter() {
    const countrySelect = document.getElementById('pais-select');
    const scheduleTable = document.getElementById('tabla-horarios');
    
    countrySelect.addEventListener('change', function() {
        const selectedCountry = this.value;
        const flightData = JSON.parse(localStorage.getItem('flightData'));
        
        if (!selectedCountry) {
            scheduleTable.innerHTML = '<tr><td colspan="5">Selecciona un país para ver los horarios</td></tr>';
            return;
        }
        
        const flights = flightData[selectedCountry];
        let tableContent = '';
        
        flights.forEach(flight => {
           
            let statusClass = '';
            if (flight.status === 'Retrasado') statusClass = 'status-delayed';
            if (flight.status === 'Cancelado') statusClass = 'status-cancelled';
            
            tableContent += `
                <tr>
                    <td>${flight.flight}</td>
                    <td>${flight.destination}</td>
                    <td>${flight.departure}</td>
                    <td>${flight.arrival}</td>
                    <td class="${statusClass}">${flight.status}</td>
                </tr>
            `;
        });
        
        scheduleTable.innerHTML = tableContent;
    });
}


function setupBookingSystem() {
    const bookingButtons = document.querySelectorAll('.reservar-button');
    
    bookingButtons.forEach(button => {
        button.addEventListener('click', function() {
            const flightClass = this.closest('.clase-card').querySelector('h3').textContent;
            let discountMessage = '';
            
            
            if (flightClass === 'Familiar') {
                discountMessage = '<br><strong>15% de descuento aplicado</strong>';
            }
            
           
            const user = JSON.parse(localStorage.getItem('currentUser'));
            if (user && user.discount) {
                discountMessage += `<br>Código de usuario: ${user.discountCode}`;
            }
            
            Swal.fire({
                title: `Reserva en clase ${flightClass}`,
                html: `Has seleccionado vuelo en clase ${flightClass}.${discountMessage}`,
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Confirmar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire(
                        '¡Reserva confirmada!',
                        'Recibirás un correo con los detalles.',
                        'success'
                    );
                }
            });
        });
    });
}


function setupInteractiveEffects() {

    document.querySelectorAll('.clase-card, .destino').forEach(el => {
        el.classList.add('animated');
    });
  
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.clase-card, .destino');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
   
    document.querySelectorAll('.clase-card, .destino').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
    });
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); 
}


function setupFormValidation() {
    const emailInput = document.getElementById('email');
    
    emailInput.addEventListener('blur', function() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(this.value)) {
            this.style.borderColor = 'red';
            Swal.fire({
                title: 'Correo inválido',
                text: 'Por favor ingresa un correo electrónico válido',
                icon: 'error'
            });
        } else {
            this.style.borderColor = '#ddd';
        }
    });
}


function loadSweetAlert() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
    document.head.appendChild(script);
}

loadSweetAlert();