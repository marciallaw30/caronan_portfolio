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
      title: 'Oracle AI: Spiritual Intelligence & Metaphysical Companion',
      category: 'AI Integration, Authentication & Fintech Token Economy',
      overview: 'A front-end artificial intelligence companion powered by Google Gemini and engineered with a dual-tier credit economy. Features mandatory Gmail authentication, 5 free daily insights that automatically regenerate every 24 hours, and an integrated PayMongo Philippines payment gateway (GCash, Maya, Cards) for purchasing extra Cosmic Insight Tokens.',
      features: [
        'Real-time integration with Google Gemini Generative AI for spiritual interpretations, tarot, astrology, and numerology',
        'Mandatory Google Gmail (@gmail.com) authentication and validation system with local session persistence',
        'Dynamic 24-hour regeneration engine providing 5 free daily insights with live countdown timer display',
        'Integrated PayMongo Test API (pk_test_wfW6N69auD5WdUXDq7dRQVam) supporting GCash, Maya, and Visa/Mastercard test transactions',
        'Tiered Cosmic Token Store (₱49 for 10 tokens, ₱99 for 30 tokens, ₱249 for 100 tokens) with instant wallet crediting',
        'Custom markdown parsing for rendering "Google AI Overview" spiritual featured snippets and suggested chips'
      ],
      tech: ['Google Gemini API', 'PayMongo API', 'JavaScript (ES6+)', 'Bootstrap 5', 'HTML5 / CSS3', 'LocalStorage'],
      erd: 'Serverless client-side architecture integrating Google Generative Language REST API, PayMongo test gateway endpoints, and localized user account/token state schema (`oracle_users_db`).'
    },
    'ecommerce': {
      title: 'TarotKnight Crystal Art: E-Commerce Web Application',
      category: 'E-Business, Fintech & Logistics Integration',
      overview: 'An academic e-commerce web platform developed for Datamex College of Saint Adeline (In Partial Fulfillment in E-Business under Faculty Adviser Mr. Randy Villanueva). Engineered by Lead Marcial Lawrence Jr V. Caronan and team, the platform combines handcrafted wire-wrapped crystal jewelry retail with real-time spiritual reading appointments, instant PayMongo API gateway verification, and nationwide J&T Express parcel logistics tracking.',
      features: [
        'Artisan Product Catalog featuring 44 handcrafted crystal items with instant search, category filtering, and modal detail views',
        'Instant PayMongo payment gateway integration (GCash, Maya, Visa/Mastercard) eliminating manual screenshot receipt checking',
        'Interactive J&T Express parcel logistics tracker with simulated waybills and milestone checkpoints',
        'Spiritual reading appointment booking calendar with real-time time-slot conflict prevention and client confirmation',
        'Client-side responsive shopping cart drawer with live subtotal, shipping fee calculation, and order placement',
        'Integrated AI Spiritual Consultation Guide Bot powered by domain knowledge matching',
        'Administrative Control Center modal monitoring gross settled revenue, order count, and real-time inventory ledger'
      ],
      tech: ['JavaScript (ES6+)', 'Bootstrap 5.3', 'PayMongo API', 'J&T Express Logistics API', 'HTML5 / CSS3', 'HTML5 LocalStorage', 'Cinzel & Outfit Fonts'],
      erd: 'Client-server e-commerce architecture managing `CRYSTAL_PRODUCTS` (44 SKUs), `simulatedOrders` (Waybills & Timelines), `SPIRITUAL_SERVICES` (Appointments), and `cart` session storage.'
    },
    'mythic-gambit': {
      title: 'Mythic Gambit: Tactical High-Fantasy Chess RPG',
      category: 'Game Systems Engineering, Strategy Mechanics & GDD Architecture',
      overview: 'A visionary 3D turn-based tactical strategy game blueprint engineered by Lead Author Marcial Lawrence Jr V. Caronan and the BSIT development cohort at Datamex College of Saint Adeline (Submitted to Ms. Jeanniel T. Ilago). Bridges the classical 8x8 movement logic of chess with real-time planar terrain transformations, cinematic manifestation combat executions, 15 distinct mythical civilizations, and apocalyptic Queen Signature Ultimates.',
      features: [
        'Complete Game Design Document (GDD • 44.6 MB Microsoft Word) detailing narrative lore, systems design, 42 concept artworks, wireframes, and production timelines',
        'The Manifestation Combat System: Capture events initiate 3D kingdom-specific cinematic combat sequences powered by elemental and cultural magic',
        'Dynamic Planar Board & Terrains: Advancing units permanently convert tiles into elemental domains (Heat Haze, Root-Bound, Tidal Flow, Static Charge, Permafrost)',
        'Extensive 15-Kingdom Elemental Hierarchy: Maps traditional chess pieces into unique thematic manifestations with customized emotional catalysts and passive traits',
        'Queen Signature Ultimates: Dramatic post-checkmate apocalyptic cinematics (Lava Torrent, Thorn Surge, Crushing Deluge, The Vortex, Subterranean Abyss)',
        'Quarterly Ranked Esports Ladder: 5-tier competitive progression (Bronze, Silver, Gold, Platinum, Mythic) governed by Victory Stars, seasonal rollback, and live-ops meta-balancing',
        'Interactive Web Showcase Hub: Fully responsive browser-based GDD codex with filterable kingdom roster and playable 8x8 planar board simulator'
      ],
      tech: ['Game Design Architecture', 'Turn-Based Strategy Systems', 'Unity / Unreal Engine 5 Pipelines', 'PBR Shader Graph', 'FMOD / Wwise Audio', 'Competitive Matchmaking Netcode'],
      erd: 'Game State Matrix: `TacticalGrid` (8x8 Coordinates a1-h8), `ActiveFaction` (15 Kingdoms), `PieceManifestation` (King to Pawn), `TileTerrainState` (Neutral vs Elemental), and `RankedMMR` (5 Tiers).'
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
    'data-analysis': {
      title: 'Computer Shop Data Analysis & Revenue Optimization (Original Excel)',
      category: 'Data Analytics, Statistical Modeling & Operations Engineering',
      overview: 'Official hands-on examination project for Datamex College of Saint Adeline (4th Year BSIT Set A) authored by Marcial Lawrence Jr V. Caronan. Analyzes 50 customer transactions across internet hours, printing output, scanning, and gaming revenue using statistical parameters, demographic cross-tabulations, and Pearson correlation analysis.',
      features: [
        'Complete 12-task analytical investigation extracted from the original 4A_Marcial Lawrence Jr V. Caronan.xlsx workbook',
        'Pearson Correlation Analysis (r = 0.7556) mathematically confirming that internet station usage directly drives upsells across printing and retail sales',
        'Demographic Customer Segmentation proving that students represent 76% of all patrons (38 of 50 customers) and drive ₱7,370 in revenue',
        'Weekly Sales Breakdown isolating Sunday & Monday as peak volume days (₱1,500 each) and Wednesday as the lowest trough (₱1,215)',
        'Service Output Volume Analysis revealing Printing Pages as the #1 volume driver with 415 output pages',
        'Direct download link to the original authentic graded Excel workbook (.xlsx, 54.7 KB) with full formula integrity',
        'Interactive live web dashboard with Chart.js trend visualizations, filterable 50-record explorer, and evidence-based recommendations'
      ],
      tech: ['MS Excel (Formulas & Data Analysis Toolpak)', 'Pearson Correlation (r = 0.7556)', 'JavaScript (ES6)', 'Chart.js', 'Bootstrap 5.3', 'Data Wrangling'],
      erd: 'Multi-sheet workbook schema: `Submission_Info`, `Data_Dictionary` (11 variables), `Raw_Data` (50 transactions), `Exam_Tasks` (Tasks 1–11), and `Recommendations` (Task 12).'
    },
    'iot-soil': {
      title: 'Arduino: Soil Moisture Sensor for Plants Modified w/ Speaker',
      category: 'Embedded Systems & IoT Hardware Engineering',
      overview: 'An embedded microcontroller project developed at Datamex College of Saint Adeline (BSIT OOP & Discrete Structures). Employs an Arduino Uno R3, capacitive/resistive soil moisture sensor, and modified PWM speaker to provide real-time audio and visual telemetry for precision plant hydration monitoring.',
      features: [
        'Dynamic floating-point ratio math: moistureRatio = currentMoistureLevel / maximumMoistureLevel',
        'Acoustic PWM buzzer alert: 1000Hz tone triggered exclusively when soil is dry (<= 10%), with complete silence (noTone) for moderate and saturated hydration',
        'Diffused LED status array: Green LED (Pin D1, >30% moisture) & Red LED (Pin D3, <=30% moisture) protected by 10kΩ resistors',
        'Continuous 10Hz sampling loop with 9600 baud UART Serial Monitor telemetry logging for laboratory debugging',
        'Empirical test validation across dry, moderate, and saturated soil environments with recorded video demo'
      ],
      tech: ['Arduino Uno R3', 'C++ Embedded Firmware', 'Soil Moisture Sensor (A0)', 'PWM Speaker (D5)', 'Breadboard Prototyping', '10kΩ Resistors'],
      erd: 'Pinout Map: Analog In A0 (Moisture Probe), Digital Out D1 (Green LED), Digital Out D3 (Red LED), Digital Out D5 PWM (Speaker Audio), 5V & Common GND.'
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

  // ===================================================================
  // 7. Glow-In-The-Dark World Map & Global Country Interconnectivity
  // ===================================================================
  function initWorldMapNetwork() {
    const canvas = document.getElementById('cyberNetworkCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse tracking for tactical crosshair & interactive node inspection
    const mouse = { x: null, y: null, targetX: null, targetY: null };
    window.addEventListener('mousemove', (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
      mouse.targetX = null;
      mouse.targetY = null;
    });

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      calculateNodePositions();
    });

    // Equirectangular projection mapping geographic coords to canvas screen
    function project(lon, lat) {
      const mapWidth = width * 0.94;
      const mapHeight = height * 0.86;
      const offsetX = (width - mapWidth) / 2;
      const offsetY = (height - mapHeight) / 2 + 15;

      const x = offsetX + ((lon + 180) / 360) * mapWidth;
      const y = offsetY + ((85 - lat) / 170) * mapHeight;
      return { x, y };
    }

    // Authentic High-Tech Continent Outlines (Polygons in [lon, lat])
    const continents = [
      // North America
      [
        [-168, 65], [-162, 70], [-140, 70], [-125, 70], [-100, 70], [-80, 68], [-65, 60],
        [-60, 50], [-64, 45], [-70, 42], [-76, 35], [-80, 26], [-82, 23], [-88, 30],
        [-97, 26], [-97, 20], [-90, 20], [-87, 16], [-83, 9], [-77, 8], [-80, 8],
        [-85, 12], [-92, 15], [-105, 20], [-110, 24], [-115, 30], [-122, 37], [-124, 48],
        [-130, 54], [-140, 60], [-150, 60], [-160, 58], [-168, 65]
      ],
      // Greenland
      [
        [-45, 60], [-35, 65], [-20, 70], [-18, 77], [-25, 82], [-40, 83], [-55, 82],
        [-60, 77], [-50, 70], [-45, 60]
      ],
      // South America
      [
        [-77, 8], [-72, 11], [-60, 10], [-50, 0], [-35, -5], [-35, -9], [-39, -15],
        [-42, -22], [-48, -28], [-53, -33], [-65, -42], [-66, -55], [-74, -53], [-75, -45],
        [-72, -37], [-71, -30], [-76, -15], [-81, -5], [-80, 1], [-77, 8]
      ],
      // Europe
      [
        [-9, 36], [-9, 43], [-1, 46], [-5, 48], [2, 51], [8, 54], [9, 57], [13, 55],
        [10, 60], [14, 65], [19, 70], [28, 71], [32, 69], [40, 65], [45, 60], [40, 55],
        [30, 50], [30, 45], [26, 40], [23, 38], [15, 40], [12, 44], [4, 43], [3, 42],
        [-3, 36], [-9, 36]
      ],
      // UK & Ireland
      [
        [-5, 50], [-1, 51], [1, 52], [0, 54], [-2, 58], [-5, 58], [-5, 54], [-5, 50]
      ],
      // Africa
      [
        [-6, 36], [10, 37], [25, 32], [32, 31], [34, 27], [43, 13], [51, 12], [45, 5],
        [40, -4], [39, -11], [35, -20], [32, -28], [28, -32], [20, -35], [18, -34],
        [15, -28], [12, -17], [10, -5], [9, 4], [2, 6], [-8, 4], [-15, 11], [-17, 15],
        [-17, 21], [-13, 28], [-6, 36]
      ],
      // Madagascar
      [
        [44, -13], [50, -15], [49, -20], [47, -25], [44, -25], [44, -13]
      ],
      // Asia
      [
        [26, 40], [35, 37], [40, 31], [50, 30], [55, 25], [60, 25], [68, 24], [72, 19],
        [80, 13], [80, 8], [85, 17], [90, 22], [98, 16], [103, 10], [104, 1], [108, 15],
        [118, 24], [122, 30], [122, 37], [129, 42], [132, 43], [140, 48], [143, 53],
        [156, 51], [162, 56], [170, 60], [180, 65], [170, 68], [140, 73], [110, 77],
        [80, 73], [60, 70], [50, 65], [45, 60]
      ],
      // Japan
      [
        [130, 31], [132, 33], [136, 35], [140, 36], [141, 41], [142, 45], [145, 44],
        [141, 39], [136, 34], [130, 31]
      ],
      // Philippines (High-Fidelity Island Groups)
      [
        [120, 18.5], [122, 18.2], [122.5, 16.5], [124, 14], [122, 13.5], [120.5, 14.5],
        [119.8, 16], [120, 18.5]
      ],
      [
        [122, 11.5], [124.5, 12], [125, 10.5], [122.5, 10], [122, 11.5]
      ],
      [
        [122, 8], [124, 8.5], [126, 9], [126.5, 6.5], [125, 5.5], [122, 6.5], [122, 8]
      ],
      // Indonesia & Malaysia
      [
        [95, 5], [98, 3], [103, -1], [106, -5], [103, -3], [98, 1], [95, 5]
      ],
      [
        [109, 1], [112, 4], [117, 4], [119, 2], [117, -2], [113, -3], [110, -2], [109, 1]
      ],
      [
        [105, -6], [110, -7], [114, -8], [114, -8.5], [108, -7.5], [105, -6]
      ],
      // Australia
      [
        [114, -22], [118, -35], [135, -35], [138, -38], [147, -38], [153, -28], [150, -22],
        [142, -11], [136, -12], [130, -13], [124, -16], [114, -22]
      ],
      // New Zealand
      [
        [173, -35], [177, -37], [178, -39], [175, -41], [173, -40], [173, -35]
      ],
      [
        [174, -41], [170, -43], [167, -46], [170, -46], [174, -41]
      ]
    ];

    // Global Country Nodes (Tech Hubs & Data Gateways)
    const countries = [
      { id: 'PH', code: 'PH-MNL', name: 'Philippines (Manila HQ)', lon: 120.98, lat: 14.60, isHQ: true },
      { id: 'JP', code: 'JP-TYO', name: 'Japan (Tokyo)', lon: 139.77, lat: 35.68 },
      { id: 'SG', code: 'SG-SIN', name: 'Singapore', lon: 103.82, lat: 1.35 },
      { id: 'KR', code: 'KR-SEL', name: 'South Korea (Seoul)', lon: 126.98, lat: 37.57 },
      { id: 'AU', code: 'AU-SYD', name: 'Australia (Sydney)', lon: 151.21, lat: -33.87 },
      { id: 'IN', code: 'IN-BOM', name: 'India (Mumbai)', lon: 72.88, lat: 19.08 },
      { id: 'AE', code: 'AE-DXB', name: 'UAE (Dubai)', lon: 55.27, lat: 25.20 },
      { id: 'DE', code: 'DE-FRA', name: 'Germany (Frankfurt)', lon: 8.68, lat: 50.11 },
      { id: 'UK', code: 'UK-LON', name: 'United Kingdom (London)', lon: -0.13, lat: 51.51 },
      { id: 'FR', code: 'FR-PAR', name: 'France (Paris)', lon: 2.35, lat: 48.86 },
      { id: 'US-NY', code: 'US-NYC', name: 'USA (New York)', lon: -74.01, lat: 40.71 },
      { id: 'US-SF', code: 'US-SFO', name: 'USA (Silicon Valley)', lon: -122.42, lat: 37.77 },
      { id: 'CA', code: 'CA-TOR', name: 'Canada (Toronto)', lon: -79.38, lat: 43.65 },
      { id: 'BR', code: 'BR-SAO', name: 'Brazil (São Paulo)', lon: -46.63, lat: -23.55 },
      { id: 'ZA', code: 'ZA-CPT', name: 'South Africa (Cape Town)', lon: 18.42, lat: -33.92 },
      { id: 'ID', code: 'ID-JKT', name: 'Indonesia (Jakarta)', lon: 106.85, lat: -6.21 }
    ];

    // Transcontinental Interconnectivity Optic Routes
    const routePairs = [
      ['PH', 'JP'],
      ['PH', 'SG'],
      ['PH', 'AU'],
      ['PH', 'US-SF'], // Trans-Pacific Primary Trunk
      ['JP', 'KR'],
      ['JP', 'US-SF'],
      ['SG', 'ID'],
      ['SG', 'IN'],
      ['SG', 'AU'],
      ['IN', 'AE'],
      ['AE', 'DE'],
      ['DE', 'UK'],
      ['FR', 'UK'],
      ['UK', 'US-NY'], // Trans-Atlantic Primary Trunk
      ['US-NY', 'US-SF'],
      ['US-NY', 'CA'],
      ['US-NY', 'BR'],
      ['UK', 'ZA']
    ];

    const nodeMap = {};
    countries.forEach(c => {
      c.ripples = [];
      c.pulse = Math.random() * Math.PI * 2;
      nodeMap[c.id] = c;
    });

    let activeRoutes = [];
    function calculateNodePositions() {
      countries.forEach(c => {
        const pt = project(c.lon, c.lat);
        c.x = pt.x;
        c.y = pt.y;
      });

      activeRoutes = routePairs.map(([aId, bId]) => {
        const a = nodeMap[aId];
        const b = nodeMap[bId];
        return { a, b };
      });
    }
    calculateNodePositions();

    // Data Photon Packets traveling between countries
    const packets = [];
    const maxPackets = 16;
    function spawnPacket() {
      if (packets.length >= maxPackets || activeRoutes.length === 0) return;
      const route = activeRoutes[Math.floor(Math.random() * activeRoutes.length)];
      // 50% forward, 50% backward transmission
      const forward = Math.random() > 0.5;
      const start = forward ? route.a : route.b;
      const end = forward ? route.b : route.a;

      packets.push({
        start,
        end,
        progress: 0,
        speed: 0.0035 + Math.random() * 0.0045,
        color: Math.random() > 0.4 ? '#00f0ff' : '#c084fc',
        trailLength: 0.06
      });
    }
    setInterval(spawnPacket, 400);

    // Landmass internal phosphor dots (Matrix Grid)
    const landDots = [];
    function generateLandDots() {
      landDots.length = 0;
      // Sampling coordinates across key landmass boxes
      const landSamples = [
        // NA
        [-120, 45], [-110, 40], [-100, 35], [-90, 38], [-80, 42], [-115, 52], [-100, 55], [-90, 50],
        // SA
        [-60, -5], [-50, -10], [-45, -20], [-60, -25], [-65, -35], [-70, -15],
        // EU
        [5, 48], [15, 50], [25, 55], [10, 58], [0, 45], [15, 42],
        // AF
        [15, 20], [25, 25], [20, 10], [25, 0], [20, -15], [25, -28], [30, -5],
        // AS
        [45, 30], [55, 32], [75, 25], [80, 20], [105, 30], [115, 35], [100, 20], [80, 50], [100, 55], [120, 50],
        // AU
        [125, -25], [135, -28], [140, -32], [145, -22],
        // PH & SE Asia
        [102, 14], [105, 10], [121, 15], [124, 8]
      ];

      landSamples.forEach(([lon, lat]) => {
        const pt = project(lon, lat);
        landDots.push({
          x: pt.x,
          y: pt.y,
          pulse: Math.random() * Math.PI * 2,
          speed: 0.02 + Math.random() * 0.03
        });
      });
    }
    generateLandDots();

    // Quadratic Bezier evaluation point
    function getBezierPoint(p0, p1, p2, t) {
      const inv = 1 - t;
      return {
        x: inv * inv * p0.x + 2 * inv * t * p1.x + t * t * p2.x,
        y: inv * inv * p0.y + 2 * inv * t * p1.y + t * t * p2.y
      };
    }

    // Bezier control point arched toward atmosphere
    function getControlPoint(p0, p2) {
      const mx = (p0.x + p2.x) / 2;
      const my = (p0.y + p2.y) / 2;
      const dist = Math.hypot(p2.x - p0.x, p2.y - p0.y);
      const bow = Math.min(100, Math.max(30, dist * 0.22));
      return { x: mx, y: my - bow };
    }

    let hoveredNode = null;
    let animationFrameId;

    function renderWorldMap() {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      if (mouse.targetX !== null) {
        mouse.x += (mouse.targetX - mouse.x) * 0.1;
        mouse.y += (mouse.targetY - mouse.y) * 0.1;
      } else {
        mouse.x = null;
        mouse.y = null;
      }

      // 1. Draw Lat/Long Geodetic Telemetry Grid
      ctx.save();
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = 'rgba(0, 210, 255, 0.07)';
      ctx.setLineDash([4, 6]);

      // Parallels (Equator, Tropics, Poles)
      const lats = [-60, -30, 0, 30, 60];
      lats.forEach(lat => {
        const p1 = project(-180, lat);
        const p2 = project(180, lat);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });

      // Meridians
      const lons = [-120, -60, 0, 60, 120];
      lons.forEach(lon => {
        const p1 = project(lon, 75);
        const p2 = project(lon, -65);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });
      ctx.setLineDash([]);
      ctx.restore();

      // 2. Draw Glow-in-the-Dark Continent Outlines
      continents.forEach(poly => {
        if (!poly.length) return;

        // Path creation
        ctx.beginPath();
        const start = project(poly[0][0], poly[0][1]);
        ctx.moveTo(start.x, start.y);
        for (let i = 1; i < poly.length; i++) {
          const pt = project(poly[i][0], poly[i][1]);
          ctx.lineTo(pt.x, pt.y);
        }
        ctx.closePath();

        // Dark translucent cyber fill
        ctx.fillStyle = 'rgba(12, 6, 28, 0.55)';
        ctx.fill();

        // Outer glow stroke
        ctx.save();
        ctx.strokeStyle = 'rgba(0, 210, 255, 0.45)';
        ctx.lineWidth = 1.4;
        ctx.shadowColor = '#00d2ff';
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.restore();

        // Inner bright accent stroke
        ctx.save();
        ctx.strokeStyle = 'rgba(192, 132, 252, 0.35)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
        ctx.restore();
      });

      // 3. Draw Landmass Phosphor Tech Dots
      landDots.forEach(dot => {
        dot.pulse += dot.speed;
        const alpha = 0.15 + (Math.sin(dot.pulse) + 1) * 0.15;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 210, 255, ${alpha})`;
        ctx.fill();
      });

      // Check mouse hovering over country nodes
      hoveredNode = null;
      if (mouse.x !== null) {
        for (let c of countries) {
          const d = Math.hypot(c.x - mouse.x, c.y - mouse.y);
          if (d < 38) {
            hoveredNode = c;
            break;
          }
        }
      }

      // 4. Draw Interconnecting Light Arcs (Optic Carrier Cables)
      activeRoutes.forEach(r => {
        const p0 = { x: r.a.x, y: r.a.y };
        const p2 = { x: r.b.x, y: r.b.y };
        const p1 = getControlPoint(p0, p2);

        const isHovered = hoveredNode && (hoveredNode.id === r.a.id || hoveredNode.id === r.b.id);

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.quadraticCurveTo(p1.x, p1.y, p2.x, p2.y);

        if (isHovered) {
          ctx.strokeStyle = 'rgba(0, 240, 255, 0.85)';
          ctx.lineWidth = 2.2;
          ctx.shadowColor = '#00f0ff';
          ctx.shadowBlur = 16;
        } else {
          ctx.strokeStyle = 'rgba(168, 85, 247, 0.22)';
          ctx.lineWidth = 1.1;
        }
        ctx.stroke();
        ctx.restore();
      });

      // 5. Draw Streaming Data Photon Packets Along Arcs
      for (let i = packets.length - 1; i >= 0; i--) {
        const pkt = packets[i];
        pkt.progress += pkt.speed;

        if (pkt.progress >= 1) {
          // Trigger sonar ripple at destination
          pkt.end.ripples.push({ r: 2, maxR: 24, alpha: 0.85 });
          packets.splice(i, 1);
          continue;
        }

        const p0 = { x: pkt.start.x, y: pkt.start.y };
        const p2 = { x: pkt.end.x, y: pkt.end.y };
        const p1 = getControlPoint(p0, p2);

        const cur = getBezierPoint(p0, p1, p2, pkt.progress);
        const trailT = Math.max(0, pkt.progress - pkt.trailLength);
        const trail = getBezierPoint(p0, p1, p2, trailT);

        // Packet comet trail
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(trail.x, trail.y);
        ctx.lineTo(cur.x, cur.y);
        ctx.strokeStyle = pkt.color;
        ctx.lineWidth = 2;
        ctx.shadowColor = pkt.color;
        ctx.shadowBlur = 10;
        ctx.stroke();

        // Packet glowing head
        ctx.beginPath();
        ctx.arc(cur.x, cur.y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.restore();
      }

      // 6. Draw Country Nodes & Telemetry Beacons
      countries.forEach(c => {
        c.pulse += 0.035;

        // Draw Expanding Sonar Ripples
        for (let rIdx = c.ripples.length - 1; rIdx >= 0; rIdx--) {
          const rip = c.ripples[rIdx];
          rip.r += 0.45;
          rip.alpha -= 0.02;

          if (rip.alpha <= 0) {
            c.ripples.splice(rIdx, 1);
            continue;
          }

          ctx.save();
          ctx.beginPath();
          ctx.arc(c.x, c.y, rip.r, 0, Math.PI * 2);
          ctx.strokeStyle = c.isHQ ? `rgba(245, 158, 11, ${rip.alpha})` : `rgba(0, 210, 255, ${rip.alpha})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
          ctx.restore();
        }

        // HQ Node Ambient Continuous Dual Rings (Manila, Philippines)
        if (c.isHQ) {
          const hqPulseR = 6 + (Math.sin(c.pulse) + 1) * 3;
          ctx.save();
          ctx.beginPath();
          ctx.arc(c.x, c.y, hqPulseR, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.7)';
          ctx.lineWidth = 1.5;
          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = 14;
          ctx.stroke();
          ctx.restore();
        }

        // Standard Node Glowing Halo
        const haloR = c.isHQ ? 3.5 : 2.5;
        ctx.save();
        ctx.beginPath();
        ctx.arc(c.x, c.y, haloR, 0, Math.PI * 2);
        ctx.fillStyle = c.isHQ ? '#f59e0b' : '#00d2ff';
        ctx.shadowColor = c.isHQ ? '#f59e0b' : '#c084fc';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.restore();

        // Node Label
        ctx.save();
        ctx.font = '9px "Fira Code", monospace';
        ctx.fillStyle = c.isHQ ? '#f59e0b' : 'rgba(203, 213, 225, 0.65)';
        ctx.fillText(c.code, c.x + 8, c.y + 3);
        ctx.restore();
      });

      // 7. Interactive Tactical HUD on Hovered Node
      if (hoveredNode) {
        ctx.save();
        const hudX = Math.min(width - 230, Math.max(20, hoveredNode.x + 15));
        const hudY = Math.min(height - 110, Math.max(20, hoveredNode.y - 65));

        // Targeting Crosshairs
        ctx.strokeStyle = '#00d2ff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(hoveredNode.x, hoveredNode.y, 14, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(hoveredNode.x - 20, hoveredNode.y);
        ctx.lineTo(hoveredNode.x + 20, hoveredNode.y);
        ctx.moveTo(hoveredNode.x, hoveredNode.y - 20);
        ctx.lineTo(hoveredNode.x, hoveredNode.y + 20);
        ctx.stroke();

        // Tactical HUD Panel
        ctx.fillStyle = 'rgba(8, 2, 18, 0.9)';
        ctx.strokeStyle = 'rgba(0, 210, 255, 0.6)';
        ctx.lineWidth = 1.2;
        ctx.shadowColor = '#00d2ff';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.roundRect(hudX, hudY, 210, 75, 8);
        ctx.fill();
        ctx.stroke();

        ctx.shadowBlur = 0;
        ctx.font = 'bold 10px "Fira Code", monospace';
        ctx.fillStyle = '#00d2ff';
        ctx.fillText(`NODE::${hoveredNode.code}`, hudX + 12, hudY + 20);

        ctx.font = '9px "Inter", sans-serif';
        ctx.fillStyle = '#f8fafc';
        ctx.fillText(hoveredNode.name, hudX + 12, hudY + 36);

        ctx.font = '9px "Fira Code", monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(`GEO: ${hoveredNode.lat.toFixed(2)}°N, ${hoveredNode.lon.toFixed(2)}°E`, hudX + 12, hudY + 50);
        ctx.fillStyle = '#10b981';
        ctx.fillText('STATUS: ONLINE // 10 Gbps MESH', hudX + 12, hudY + 64);
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(renderWorldMap);
    }

    renderWorldMap();

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        renderWorldMap();
      }
    });
  }

  // ===================================================================
  // 8. 3D Cylindrical Perspective Scroll Engine
  // ===================================================================
  function initCylinderScroll() {
    const sections = document.querySelectorAll('.cylinder-section');
    const toggleBtn = document.getElementById('cylinderToggleBtn');
    const statusDot = document.getElementById('cylinderStatusDot');
    const statusLabel = document.getElementById('cylinderStatusLabel');

    if (!sections.length) return;

    let isEnabled = localStorage.getItem('cylinder_scroll_enabled') !== 'false';

    function setCylinderState(active) {
      isEnabled = active;
      localStorage.setItem('cylinder_scroll_enabled', active ? 'true' : 'false');
      if (statusDot && statusLabel) {
        if (active) {
          statusDot.classList.remove('inactive');
          statusLabel.textContent = '3D CYLINDER :: ACTIVE';
        } else {
          statusDot.classList.add('inactive');
          statusLabel.textContent = '3D CYLINDER :: OFF';
        }
      }
      if (!active) {
        sections.forEach(sec => {
          sec.style.transform = '';
          sec.style.opacity = '1';
        });
      } else {
        updateCylinder();
      }
    }

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        setCylinderState(!isEnabled);
      });
    }

    let ticking = false;
    function onScroll() {
      if (!isEnabled) return;
      if (!ticking) {
        requestAnimationFrame(() => {
          updateCylinder();
          ticking = false;
        });
        ticking = true;
      }
    }

    function updateCylinder() {
      if (!isEnabled) return;
      const vh = window.innerHeight;
      const vCenter = vh / 2;

      sections.forEach(sec => {
        const rect = sec.getBoundingClientRect();
        // If out of view, keep in stable resting state
        if (rect.bottom < -100 || rect.top > vh + 100) {
          sec.style.transform = 'scale(0.985)';
          sec.style.opacity = '0.75';
          return;
        }

        const secCenter = rect.top + rect.height / 2;
        const dist = secCenter - vCenter;
        const normDist = dist / (vh * 0.75);
        const clamped = Math.max(-1, Math.min(1, normDist));

        // Safe cylindrical curvature that enhances 3D depth without causing vertical collisions
        const angleX = -clamped * 2.2;
        const scale = 1 - Math.abs(clamped) * 0.025;
        const opacity = 1 - Math.abs(clamped) * 0.15;

        sec.style.transform = `perspective(1200px) rotateX(${angleX.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
        sec.style.opacity = opacity.toFixed(2);
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
      if (isEnabled) updateCylinder();
    }, { passive: true });

    setCylinderState(isEnabled);
  }

  // Initialize Core Visual Engines
  initWorldMapNetwork();
  initCylinderScroll();
});

// Helper: Resume Print Trigger
function printResumeDocument() {
  window.print();
}
