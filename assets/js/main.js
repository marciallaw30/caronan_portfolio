/* ===================================================================
   BSIT Professional Portfolio — Marcial Lawrence Jr V. Caronan
   Main JavaScript: Navigation, Filter, Dynamic Modals, Toast
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Navbar Scroll Style Update
  const navbar = document.querySelector('.custom-navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 2. Active Link on Scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    const scrollPosition = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 110;
      const sectionId = current.getAttribute('id');
      
      if (scrollPosition > sectionTop && scrollPosition <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  window.addEventListener('scroll', updateActiveNav);

  // 3. Animated Progress Bars on Scroll
  const progressBars = document.querySelectorAll('.skill-progress-fill');
  let hasAnimated = false;

  function handleProgressAnimation() {
    const skillsSection = document.getElementById('skills');
    if (!skillsSection) return;

    const rect = skillsSection.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.85 && !hasAnimated) {
      progressBars.forEach(bar => {
        const targetWidth = bar.getAttribute('data-width') || '80%';
        bar.style.width = targetWidth;
      });
      hasAnimated = true;
    }
  }
  window.addEventListener('scroll', handleProgressAnimation);
  handleProgressAnimation();

  // 4. Skills Category Filtering
  const filterButtons = document.querySelectorAll('.skill-category-pill');
  const skillCards = document.querySelectorAll('.skill-card-item');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const selectedCategory = btn.getAttribute('data-category');
      skillCards.forEach(card => {
        if (selectedCategory === 'all' || card.getAttribute('data-category') === selectedCategory) {
          card.style.display = 'block';
          setTimeout(() => { card.style.opacity = '1'; }, 10);
        } else {
          card.style.opacity = '0';
          card.style.display = 'none';
        }
      });
    });
  });

  // 5. Complete 5-Projects Data Store for Modals
  const projectDatabase = {
    'oracle-ai': {
      title: 'Oracle AI (Spiritual AI Chatbot)',
      category: 'AI Integration & Web Development',
      overview: 'A specialized, front-end artificial intelligence chatbot designed to act as a mystical "Oracle". It uses prompt engineering and the Google Gemini API to provide spiritual interpretations for dreams, astrology, tarot, and numerology, formatting responses dynamically with a "cosmic" persona.',
      features: [
        'Real-time integration with Google Gemini 3.6 Flash Large Language Model',
        'Advanced system prompting and context window management for multi-turn conversations',
        'Custom markdown parsing for rendering "Google AI Overview" style featured snippets',
        'Stateful UI with typing indicators, interactive suggestion chips, and responsive design'
      ],
      tech: ['Google Gemini API', 'JavaScript (ES6+)', 'HTML5 / CSS3', 'RESTful Fetch', 'JSON'],
      erd: 'Serverless architecture. Data flows directly from the client browser to Google Generative Language API via HTTPS POST requests, retaining conversation context in local memory.'
    },
    'ecommerce': {
      title: 'E-Commerce Web Application (Flagship Enterprise)',
      category: 'Full-Stack Web & E-Commerce Engineering',
      overview: 'A full-featured digital marketplace engineering project designed for end-to-end commerce operations. Built with a focus on transactional integrity, the system integrates secure online payment gateway APIs, real-time order and delivery status tracking, direct customer-owner messaging channels, real-time dynamic inventory management with stock replenishment alerts, and an executive administration dashboard.',
      features: [
        'Secure multi-tier role authentication (Customer, Store Owner, System Administrator)',
        'Payment Gateway integration with webhook transaction verification & cryptographic signature validation',
        'Real-time order lifecycle & dispatch tracking (Placed -> Processing -> Dispatched -> Delivered)',
        'Dynamic inventory subtraction with race condition prevention using atomic database transactions',
        'Customer-to-Store communication portal for order inquiries and RMA support',
        'Executive Analytics Dashboard tracking daily revenue, best-selling SKUs, and inventory turnover'
      ],
      tech: ['PHP 8.2', 'MySQL / MariaDB', 'JavaScript (ES6+)', 'Bootstrap 5', 'REST API', 'JSON Web Tokens', 'Bcrypt'],
      erd: 'Normalized to 3NF: `users`, `products`, `inventory_batches`, `orders`, `order_items`, `payments`, `messages`, and `audit_logs`.'
    },
    'employee-mgmt': {
      title: 'DATAMEX College HRIS & Automated Payroll Portal',
      category: 'Enterprise Web & Operations Engineering',
      overview: 'A full-scale human resource information and payroll automation system engineered for Datamex College of Saint Adeline. Features a biometric touchscreen kiosk for barcode/ID check-ins, automated 15-day salary calculation with Philippine statutory deduction compliance (SSS, PhilHealth, Pag-IBIG), automated digital PDF payslips via FPDF, employee feedback channels, and campus bulletin board.',
      features: [
        'Biometric Kiosk Time-Clock portal with Asia/Manila PST timestamps & tardy calculation',
        '15-day payroll computation engine compliant with NCR daily minimum wage rules',
        'Philippine statutory deduction engine (SSS, PhilHealth, Pag-IBIG, and Tax)',
        'FPDF integration for automated official digital PDF payslip voucher generation',
        'Role-Based Access Control (Admin vs Employee) with Bcrypt password encryption',
        'Campus-wide announcement bulletin board with image upload management'
      ],
      tech: ['PHP 8.2', 'MySQL / MariaDB (3NF)', 'JavaScript (ES6)', 'FPDF Library', 'Bootstrap 5', 'Bcrypt Security'],
      erd: 'Normalized 3NF relational database across `employees`, `attendance`, `payroll`, `benefits`, `benefits_deductions`, `announcements`, `events`, and `feedback`.'
    },
    'iot-soil': {
      title: 'IoT Automated Soil Moisture Monitoring System',
      category: 'IoT Hardware Engineering & Automation',
      overview: 'Smart agricultural sensor system utilizing Arduino microcontrollers and capacitive soil moisture probes. Programmed to continuously sample moisture thresholds in cultivating soil, triggering an audible buzzer and visual alarm whenever hydration levels drop below required agricultural setpoints.',
      features: [
        'Continuous analog soil moisture sampling with calibration routines',
        'Real-time threshold logic triggering piezo buzzer alarm upon critical dryness',
        'LED status indicator array (Green: Optimal, Yellow: Moderate, Red: Critical Dryness)',
        'Serial data telemetry logging for soil moisture degradation over time'
      ],
      tech: ['Arduino C/C++', 'Microcontroller Hardware', 'Capacitive Moisture Probes', 'Piezo Audio Alarm', 'Circuitry'],
      erd: 'Telemetry logged into local data array with moisture percentage, timestamp, and alarm actuation status.'
    },
    'music-video': {
      title: 'Multimedia Music Video Web Application',
      category: 'Creative Frontend & Media Web Engineering',
      overview: 'An interactive streaming and curation web application featuring custom media playback controllers, playlist categorization, responsive video grid layouts, and dynamic theme switching designed with fluid user experience principles.',
      features: [
        'Custom HTML5 audio/video playback controls with scrubbers, volume memory, and full-screen modes',
        'Filterable music video catalog organized by genre, artist, and release period',
        'User playlist creation and local storage state persistence',
        'Responsive multimedia layout optimized for desktop, tablet, and mobile displays'
      ],
      tech: ['JavaScript (ES6)', 'HTML5 Media API', 'Vanilla CSS3', 'Bootstrap 5', 'LocalStorage'],
      erd: 'Client-side media catalog schema with JSON metadata for video streams, durations, and artist credentials.'
    },
    'loan-app': {
      title: 'Loan Tracking Mobile App with Web Administrator Dashboard',
      category: 'Mobile Application & Cloud Web Administration',
      overview: 'Dual-tier financial tracking application featuring a mobile-responsive borrower client paired with a centralized web management panel. Enables clients to submit loan applications and review amortization schedules while allowing administrators to approve loans, monitor disbursements, and track repayment statuses.',
      features: [
        'Borrower portal for loan application submission and monthly amortization calculation',
        'Administrative dashboard for loan approval, risk assessment, and disbursement ledger',
        'Automated payment balance countdown and delinquency alert triggers',
        'Role-based permission gating ensuring borrowers only access their individual financial records'
      ],
      tech: ['JavaScript', 'PHP Backend', 'MySQL', 'RESTful API', 'Responsive Mobile-First UI'],
      erd: 'Secure relational tables: `loan_applicants`, `loan_types`, `applications`, `amortization_schedules`, `payments`, and `ledger_entries`.'
    }
  };

  const projectModal = document.getElementById('projectModal');
  if (projectModal) {
    projectModal.addEventListener('show.bs.modal', function (event) {
      const triggerBtn = event.relatedTarget;
      const projectId = triggerBtn.getAttribute('data-project-id');
      const data = projectDatabase[projectId];

      if (data) {
        document.getElementById('modalTitle').textContent = data.title;
        document.getElementById('modalCategory').textContent = data.category;
        document.getElementById('modalOverview').textContent = data.overview;
        document.getElementById('modalErd').textContent = data.erd;

        const featureContainer = document.getElementById('modalFeatures');
        featureContainer.innerHTML = '';
        data.features.forEach(feat => {
          const li = document.createElement('li');
          li.className = 'mb-2 text-light';
          li.innerHTML = `<i class="bi bi-check-circle-fill text-info me-2"></i>${feat}`;
          featureContainer.appendChild(li);
        });

        const techContainer = document.getElementById('modalTech');
        techContainer.innerHTML = '';
        data.tech.forEach(t => {
          const span = document.createElement('span');
          span.className = 'skill-badge me-1 mb-1';
          span.textContent = t;
          techContainer.appendChild(span);
        });
      }
    });
  }

  // 6. Contact Form Transmission & Toast Notification
  const contactForm = document.getElementById('contactForm');
  const toastElement = document.getElementById('contactToast');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Transmitting...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        contactForm.reset();

        if (toastElement && window.bootstrap) {
          const toast = new bootstrap.Toast(toastElement);
          toast.show();
        } else {
          alert('Message sent successfully! Thank you for contacting Marcial Lawrence Jr V. Caronan.');
        }
      }, 700);
    });
  }

  // 7. Glowing IT Cybernetic Network Node Animation
  function initCyberNetwork() {
    const canvas = document.getElementById('cyberNetworkCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Responsive node count based on screen size
    const nodeCount = Math.min(Math.floor((width * height) / 28000), 50);
    const nodes = [];
    const maxDistance = 150;

    // Mouse tracking for subtle glow interaction
    const mouse = { x: null, y: null, radius: 180 };
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    class NetworkNode {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1.5;
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.02 + Math.random() * 0.03;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        this.pulse += this.pulseSpeed;
      }

      draw() {
        const glowRadius = this.radius + Math.sin(this.pulse) * 1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#c084fc';
        ctx.shadowColor = '#a855f7';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    for (let i = 0; i < nodeCount; i++) {
      nodes.push(new NetworkNode());
    }

    // Packet data transmission simulation
    const packets = [];
    function spawnPacket() {
      if (nodes.length < 2 || packets.length > 8) return;
      const startIdx = Math.floor(Math.random() * nodes.length);
      const start = nodes[startIdx];
      for (let j = 0; j < nodes.length; j++) {
        if (startIdx === j) continue;
        const target = nodes[j];
        const dist = Math.hypot(start.x - target.x, start.y - target.y);
        if (dist < maxDistance) {
          packets.push({
            x: start.x,
            y: start.y,
            targetNode: target,
            progress: 0,
            speed: 0.015 + Math.random() * 0.015,
          });
          break;
        }
      }
    }
    setInterval(spawnPacket, 650);

    let animationFrameId;
    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Update & Draw connections
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].update();
        nodes[i].draw();

        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.28;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Mouse interaction link
        if (mouse.x !== null) {
          const mDist = Math.hypot(nodes[i].x - mouse.x, nodes[i].y - mouse.y);
          if (mDist < mouse.radius) {
            const mAlpha = (1 - mDist / mouse.radius) * 0.45;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(192, 132, 252, ${mAlpha})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      }

      // Draw data packets traveling along lines
      for (let p = packets.length - 1; p >= 0; p--) {
        const pkt = packets[p];
        pkt.progress += pkt.speed;

        if (pkt.progress >= 1) {
          packets.splice(p, 1);
          continue;
        }

        const curX = pkt.x + (pkt.targetNode.x - pkt.x) * pkt.progress;
        const curY = pkt.y + (pkt.targetNode.y - pkt.y) * pkt.progress;

        ctx.beginPath();
        ctx.arc(curX, curY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#e879f9';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        animate();
      }
    });
  }

  initCyberNetwork();
});

// Helper: Resume Print Trigger
function printResumeDocument() {
  window.print();
}
