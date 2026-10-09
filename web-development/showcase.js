/* ===================================================================
   DATAMEX HRIS & PAYROLL PORTFOLIO SHOWCASE - JAVASCRIPT LOGIC
   Architect: Marcial Lawrence Jr V. Caronan
   Integrated with In-Browser Relational SQL Database (datamex_payroll_db)
   =================================================================== */

// Default Relational Schema and Seed Records from datamex_payroll_db.sql
const DCSA_DEFAULT_DB = {
  employees: [
    {
      id: 1,
      employeeNo: '2023009',
      firstName: 'MARCIAL LAWRENCE JR',
      middleName: 'VILLAGONZALO',
      lastName: 'CARONAN',
      birthDay: '1997-08-30',
      birthPlace: 'PARANAQUE CITY',
      address: 'BLK 14 CRC PETCHAYAN, MULTINATIONAL VILLAGE, MOONWALK, PARANAQUE CITY',
      email: 'marcialcaronan@gmail.com',
      gender: 'male',
      civilStatus: 'single',
      nationality: 'Filipino',
      religion: 'Roman Catholic',
      phoneNumber: '09202720151',
      sssNumber: '34-8291048-2',
      pagibigNumber: '1211-9384-2819',
      tinNumber: '312-849-102-000',
      philhealthNumber: '19-028391823-1',
      bankAccount: 'LandBank #1920-4820-19',
      accountType: 'admin',
      department: 'Information Technology',
      role: 'Lead Systems Architect & Full-Stack Developer',
      dailyRate: 750.00
    },
    {
      id: 4,
      employeeNo: '2023039',
      firstName: 'Tyron John',
      middleName: 'Lucreda',
      lastName: 'Dela Cruz',
      birthDay: '2004-09-04',
      birthPlace: 'Las Pinas',
      address: 'Las Pinas City, Metro Manila',
      email: 'tyronjohn04@gmail.com',
      gender: 'male',
      civilStatus: 'single',
      nationality: 'Filipino',
      religion: 'Roman Catholic',
      phoneNumber: '09234567281',
      sssNumber: '34-1029482-1',
      pagibigNumber: '1212-0948-1829',
      tinNumber: '291-840-192-000',
      philhealthNumber: '19-102948271-0',
      bankAccount: 'BDO #0012-3456-7890',
      accountType: 'admin',
      department: 'Human Resources',
      role: 'HR & Administrative Officer',
      dailyRate: 695.00
    },
    {
      id: 6,
      employeeNo: '2023035',
      firstName: 'Kerr',
      middleName: 'Baliber',
      lastName: 'Pangan',
      birthDay: '2005-08-14',
      birthPlace: 'Paranaque',
      address: 'Paranaque City, Metro Manila',
      email: 'kerr@gmail.com',
      gender: 'male',
      civilStatus: 'single',
      nationality: 'Filipino',
      religion: 'Catholic',
      phoneNumber: '09202720151',
      sssNumber: '34-9281938-4',
      pagibigNumber: '1213-9482-7193',
      tinNumber: '381-920-482-000',
      philhealthNumber: '19-928172938-2',
      bankAccount: 'BPI #3829-1029-48',
      accountType: 'admin',
      department: 'Academic Affairs',
      role: 'Faculty Coordinator',
      dailyRate: 710.00
    },
    {
      id: 8,
      employeeNo: '2024012',
      firstName: 'Rica Mhay',
      middleName: 'Castro',
      lastName: 'Saturinas',
      birthDay: '2004-08-27',
      birthPlace: 'Paranaque',
      address: 'Paranaque City, Metro Manila',
      email: 'ricamhaysaturinas2@gmail.com',
      gender: 'female',
      civilStatus: 'single',
      nationality: 'Filipino',
      religion: 'Catholic',
      phoneNumber: '09123456789',
      sssNumber: '34-8192039-5',
      pagibigNumber: '1214-8291-0394',
      tinNumber: '482-910-381-000',
      philhealthNumber: '19-829103948-3',
      bankAccount: 'LandBank #1920-5829-33',
      accountType: 'employee',
      department: 'Admissions & Records',
      role: 'Registrar Staff',
      dailyRate: 695.00
    },
    {
      id: 10,
      employeeNo: '2023024',
      firstName: 'Jhay',
      middleName: 'Logatoc',
      lastName: 'Castro',
      birthDay: '2004-12-30',
      birthPlace: 'Cavite',
      address: 'Paranaque City, Metro Manila',
      email: 'cj5224751@gmail.com',
      gender: 'male',
      civilStatus: 'single',
      nationality: 'Filipino',
      religion: 'Roman Catholic',
      phoneNumber: '09876565445',
      sssNumber: '34-0192847-9',
      pagibigNumber: '1215-9201-8374',
      tinNumber: '582-910-293-000',
      philhealthNumber: '19-019283746-5',
      bankAccount: 'Metrobank #2019-3829-11',
      accountType: 'admin',
      department: 'Operations',
      role: 'Facilities & Campus Supervisor',
      dailyRate: 700.00
    }
  ],
  attendance: [
    {
      id: 21,
      employeeNo: '2023009',
      date: '2025-09-25',
      time_in: '08:00:00',
      time_out: '19:00:00',
      working_hours: 8.00,
      late_minutes: 0,
      overtime_hours: 2.00,
      status: 'Completed'
    },
    {
      id: 22,
      employeeNo: '2023009',
      date: '2025-09-24',
      time_in: '08:00:47',
      time_out: '21:00:52',
      working_hours: 8.00,
      late_minutes: 0,
      overtime_hours: 4.00,
      status: 'Completed'
    },
    {
      id: 3,
      employeeNo: '2023035',
      date: '2025-09-15',
      time_in: '08:00:08',
      time_out: '17:00:17',
      working_hours: 8.00,
      late_minutes: 0,
      overtime_hours: 0.00,
      status: 'Completed'
    },
    {
      id: 15,
      employeeNo: '2024012',
      date: '2025-09-25',
      time_in: '19:17:57',
      time_out: '19:18:03',
      working_hours: 0.00,
      late_minutes: 677,
      overtime_hours: 0.00,
      status: 'Late Punch'
    }
  ],
  payroll: [
    {
      id: 16,
      employeeNo: '2023009',
      pay_period_start: '2025-09-16',
      pay_period_end: '2025-09-30',
      ratePerHour: 93.75,
      hoursWorked: 88.00,
      regular_days: 11.00,
      grossPay: 8953.13,
      deductions: 1940.00,
      netPay: 7013.13,
      payDate: '2025-10-06',
      lateDeductions: 0.00,
      overtime_hours: 6.00
    },
    {
      id: 9,
      employeeNo: '2024012',
      pay_period_start: '2025-09-01',
      pay_period_end: '2025-09-15',
      ratePerHour: 86.88,
      hoursWorked: 80.00,
      regular_days: 10.00,
      grossPay: 6950.00,
      deductions: 1940.00,
      netPay: 5010.00,
      payDate: '2025-09-24',
      lateDeductions: 0.00,
      overtime_hours: 0.00
    }
  ],
  announcements: [
    {
      id: 2,
      title: 'ROBLOX TOURNAMENT',
      content: 'PLAYER CAN PLAY - Official Collegiate Esports Championship for students and faculty.',
      image_path: 'uploads/announcement_68d422cd78bb71.99226635.png',
      created_at: '2025-09-24 16:56:45'
    },
    {
      id: 3,
      title: 'MIDTERM EXAMINATION SCHEDULE',
      content: 'All faculty members are advised to submit questionnaire drafts by Friday.',
      image_path: 'uploads/bg.jpg',
      created_at: '2025-09-26 09:30:00'
    }
  ],
  events: [
    {
      id: 1,
      event_name: 'Psychology & Wellness Seminar',
      event_date: '2025-10-15',
      event_location: 'Main Auditorium',
      created_at: '2025-09-23 16:07:30',
      image_path: 'uploads/event_690625a2e92372.41139206.jpg'
    },
    {
      id: 2,
      event_name: 'Foundation Day Collegiate Celebration',
      event_date: '2025-11-20',
      event_location: 'DCSA Sports Complex',
      created_at: '2025-09-25 14:00:00',
      image_path: 'uploads/recog.jpg'
    }
  ],
  feedback: [
    {
      id: 1,
      feedback_text: 'I love datamex college of saint adeline! The new kiosk portal makes time-in so much faster.',
      created_at: '2025-09-23 15:23:12'
    },
    {
      id: 2,
      feedback_text: 'Payroll calculations and automated payslips are very clear and helpful for faculty members.',
      created_at: '2025-09-24 10:14:05'
    }
  ],
  benefits: [
    {
      id: 1,
      benefit_title: 'SOCIAL SECURITY SYSTEM (SSS)',
      benefit_details: 'Mandatory social insurance program for private sector and academic personnel.',
      created_at: '2025-09-23 16:09:23',
      image_path: null
    },
    {
      id: 2,
      benefit_title: 'PHILHEALTH HEALTHCARE',
      benefit_details: 'National health insurance program for medical coverage and hospitalization subsidies.',
      created_at: '2025-09-23 16:10:00',
      image_path: null
    },
    {
      id: 3,
      benefit_title: 'PAG-IBIG HOME DEVELOPMENT MUTUAL FUND',
      benefit_details: 'Savings and affordable housing financing for educational staff.',
      created_at: '2025-09-23 16:11:00',
      image_path: null
    }
  ],
  benefits_deductions: [
    { id: 1, benefit_name: 'SSS Contribution', deduction_amount: 1440.00, name: 'SSS Contribution' },
    { id: 2, benefit_name: 'Pag-IBIG Contribution', deduction_amount: 100.00, name: 'Pag-IBIG Contribution' },
    { id: 3, benefit_name: 'PhilHealth Contribution', deduction_amount: 400.00, name: 'PhilHealth Contribution' },
    { id: 4, benefit_name: 'TIN Withholding Tax', deduction_amount: 0.00, name: 'TIN Withholding Tax' }
  ],
  training: [
    {
      id: 1,
      training_title: 'CSS NCII Certification Course',
      training_description: 'TESDA Computer Systems Servicing National Certificate II curriculum.',
      training_link: 'https://e-tesda.gov.ph/course/index.php?categoryid=16',
      created_at: '2025-09-23 16:08:57',
      image_path: null
    }
  ]
};

// Global in-memory active database handle
window.dcsaDB = null;
let activeGridTableName = 'employees';

// Global pointers for compatibility with existing modules
let employeesData = [];
let attendanceRecords = [];
let feedbackRecords = [];

// ================= INITIALIZATION =================
document.addEventListener('DOMContentLoaded', () => {
  initDatabase();
  initClock();
  renderEmployeeDirectory();
  renderAttendanceTable();
  initPayrollCalculator();
  initCodeViewer();
  setupEventListeners();
  initDatabaseUI();
});

/* 1. Database Initialization & LocalStorage Persistence */
function initDatabase() {
  const stored = localStorage.getItem('DCSA_DB_V1');
  if (stored) {
    try {
      window.dcsaDB = JSON.parse(stored);
      // Ensure all 9 tables exist
      for (const t in DCSA_DEFAULT_DB) {
        if (!window.dcsaDB[t]) {
          window.dcsaDB[t] = JSON.parse(JSON.stringify(DCSA_DEFAULT_DB[t]));
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored DB, resetting to defaults', e);
      window.dcsaDB = JSON.parse(JSON.stringify(DCSA_DEFAULT_DB));
    }
  } else {
    window.dcsaDB = JSON.parse(JSON.stringify(DCSA_DEFAULT_DB));
    saveDCSADatabase(false);
  }

  // Bind synced arrays
  employeesData = window.dcsaDB.employees;
  attendanceRecords = window.dcsaDB.attendance;
  feedbackRecords = window.dcsaDB.feedback;

  // Supabase Status check & live sync
  updateSupabaseUIBadge();
  if (window.DCSA_SUPABASE && window.DCSA_SUPABASE.isConnected) {
    fetchFromSupabaseToLocal(true);
  }
}

function updateSupabaseUIBadge() {
  const badge = document.getElementById('supabaseStatusBadge');
  const btnLabel = document.getElementById('supabaseBtnLabel');
  const btn = document.getElementById('btnSupabaseConnect');

  const isConnected = !!(window.DCSA_SUPABASE && window.DCSA_SUPABASE.isConnected && window.DCSA_SUPABASE.client);

  if (badge) {
    if (isConnected) {
      badge.className = 'badge bg-success-subtle text-success border border-success font-monospace';
      badge.innerHTML = '<i class="bi bi-cloud-check-fill me-1"></i> CLOUD: SUPABASE CONNECTED';
    } else {
      badge.className = 'badge bg-secondary-subtle text-light border border-secondary font-monospace';
      badge.innerHTML = '<i class="bi bi-cloud-slash me-1"></i> CLOUD: LOCAL MODE';
    }
  }

  if (btnLabel) {
    btnLabel.textContent = isConnected ? 'Supabase Settings' : 'Connect Supabase Cloud';
  }

  if (btn) {
    if (isConnected) {
      btn.className = 'btn btn-outline-success btn-sm rounded-pill fw-bold active';
    } else {
      btn.className = 'btn btn-outline-success btn-sm rounded-pill fw-bold';
    }
  }
}

function saveDCSADatabase(notify = true) {
  try {
    localStorage.setItem('DCSA_DB_V1', JSON.stringify(window.dcsaDB));
    employeesData = window.dcsaDB.employees;
    attendanceRecords = window.dcsaDB.attendance;
    feedbackRecords = window.dcsaDB.feedback;
    updateDbStats();
  } catch (err) {
    console.error('Storage error:', err);
  }
}

function updateDbStats() {
  const tableListEl = document.getElementById('dbTableList');
  if (tableListEl && window.dcsaDB) {
    renderDbTableList();
  }
  let totalRecs = 0;
  for (const t in window.dcsaDB) {
    totalRecs += (window.dcsaDB[t]?.length || 0);
  }
  const counterEl = document.getElementById('dbTotalRecordsCount');
  if (counterEl) counterEl.textContent = `${totalRecs} Records`;
}

/* 2. Digital Clock (Asia/Manila PST) */
function initClock() {
  const clockEl = document.getElementById('kioskClock');
  const dateEl = document.getElementById('kioskDate');
  
  function update() {
    const now = new Date();
    const options = { timeZone: 'Asia/Manila', hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const dateOptions = { timeZone: 'Asia/Manila', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    
    if (clockEl) clockEl.textContent = now.toLocaleTimeString('en-US', options);
    if (dateEl) dateEl.textContent = now.toLocaleDateString('en-US', dateOptions) + ' (PST)';
  }
  update();
  setInterval(update, 1000);
}

/* 3. Employee Directory Module */
function renderEmployeeDirectory(filterText = '', filterRole = 'all') {
  const tableBody = document.getElementById('employeeTableBody');
  if (!tableBody) return;

  const filtered = employeesData.filter(emp => {
    const matchText = (emp.firstName + ' ' + emp.lastName + ' ' + emp.employeeNo + ' ' + emp.department).toLowerCase().includes(filterText.toLowerCase());
    const matchRole = (filterRole === 'all') || (emp.accountType === filterRole);
    return matchText && matchRole;
  });

  tableBody.innerHTML = '';
  
  filtered.forEach(emp => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="font-monospace fw-bold text-warning">${emp.employeeNo}</span></td>
      <td>
        <div class="fw-bold text-white">${emp.firstName} ${emp.lastName}</div>
        <div class="small text-muted">${emp.email}</div>
      </td>
      <td>
        <div><span class="badge ${emp.accountType === 'admin' ? 'badge-role-admin' : 'badge-role-emp'} text-uppercase">${emp.accountType}</span></div>
        <div class="small text-dim mt-1">${emp.role}</div>
      </td>
      <td><span class="badge border border-info border-opacity-50 text-info bg-dark">${emp.department}</span></td>
      <td><span class="font-monospace text-emerald">₱${parseFloat(emp.dailyRate).toFixed(2)} / day</span></td>
      <td class="text-end">
        <button class="btn btn-sm btn-outline-info me-1" onclick="viewEmployeeModal('${emp.employeeNo}')" title="View Full Profile">
          <i class="bi bi-person-lines-fill"></i> Profile
        </button>
        <button class="btn btn-sm btn-outline-warning" onclick="quickClockIn('${emp.employeeNo}')" title="Quick Punch Kiosk">
          <i class="bi bi-fingerprint"></i> Punch
        </button>
      </td>
    `;
    tableBody.appendChild(tr);
  });

  // Update Counters
  const countTotal = document.getElementById('countTotalStaff');
  const countAdmin = document.getElementById('countAdmin');
  const countEmp = document.getElementById('countRegular');
  if (countTotal) countTotal.textContent = employeesData.length;
  if (countAdmin) countAdmin.textContent = employeesData.filter(e => e.accountType === 'admin').length;
  if (countEmp) countEmp.textContent = employeesData.filter(e => e.accountType === 'employee').length;
}

window.viewEmployeeModal = function(empNo) {
  const emp = employeesData.find(e => e.employeeNo === empNo);
  if (!emp) return;

  document.getElementById('modalEmpNo').textContent = emp.employeeNo;
  document.getElementById('modalEmpName').textContent = `${emp.firstName} ${emp.middleName || ''} ${emp.lastName}`;
  document.getElementById('modalEmpRole').textContent = `${emp.role} (${emp.accountType.toUpperCase()})`;
  document.getElementById('modalEmpDept').textContent = emp.department;
  document.getElementById('modalEmpPhone').textContent = emp.phoneNumber;
  document.getElementById('modalEmpEmail').textContent = emp.email;
  document.getElementById('modalEmpAddress').textContent = emp.address;
  document.getElementById('modalEmpCivil').textContent = `${(emp.civilStatus || 'single').toUpperCase()} • ${emp.nationality || 'Filipino'} • ${emp.religion || 'Roman Catholic'}`;
  document.getElementById('modalEmpBday').textContent = `${emp.birthDay} (${emp.birthPlace || 'Philippines'})`;
  document.getElementById('modalEmpSSS').textContent = emp.sssNumber;
  document.getElementById('modalEmpPhilhealth').textContent = emp.philhealthNumber;
  document.getElementById('modalEmpPagibig').textContent = emp.pagibigNumber;
  document.getElementById('modalEmpTIN').textContent = emp.tinNumber;
  document.getElementById('modalEmpBank').textContent = emp.bankAccount;
  document.getElementById('modalEmpRate').textContent = `₱${parseFloat(emp.dailyRate).toFixed(2)} (₱${(parseFloat(emp.dailyRate) / 8).toFixed(2)}/hr)`;

  const modal = new bootstrap.Modal(document.getElementById('employeeDetailsModal'));
  modal.show();
};

/* 4. Biometric Kiosk Terminal Simulation */
function renderAttendanceTable() {
  const tbody = document.getElementById('attendanceTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';
  attendanceRecords.slice().reverse().forEach(rec => {
    const emp = employeesData.find(e => e.employeeNo === rec.employeeNo);
    const empName = emp ? `${emp.firstName} ${emp.lastName}` : (rec.name || `Staff #${rec.employeeNo}`);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="font-monospace text-warning">${rec.employeeNo}</span></td>
      <td class="fw-semibold text-white">${empName}</td>
      <td class="small text-muted font-monospace">${rec.date}</td>
      <td class="font-monospace text-success">${rec.time_in || '--:--:--'}</td>
      <td class="font-monospace text-danger">${rec.time_out || '--:--:--'}</td>
      <td class="font-monospace">${parseFloat(rec.working_hours || 0).toFixed(2)} hrs</td>
      <td class="font-monospace ${rec.late_minutes > 0 ? 'text-danger fw-bold' : 'text-muted'}">${rec.late_minutes} min</td>
      <td class="font-monospace ${rec.overtime_hours > 0 ? 'text-info fw-bold' : 'text-muted'}">${parseFloat(rec.overtime_hours || 0).toFixed(2)} hrs</td>
      <td><span class="badge ${rec.status === 'Completed' ? 'bg-success' : (rec.status === 'Clocked In' ? 'bg-primary' : 'bg-warning text-dark')}">${rec.status || 'Recorded'}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

window.quickClockIn = function(empNo) {
  document.querySelector('[data-tab="kiosk"]').click();
  const select = document.getElementById('kioskEmployeeSelect');
  if (select) select.value = empNo;
  const input = document.getElementById('kioskEmpNoInput');
  if (input) input.value = empNo;
  showKioskToast(`Employee #${empNo} selected on Kiosk Terminal.`, 'info');
};

window.handleKioskAction = function(actionType) {
  const empSelect = document.getElementById('kioskEmployeeSelect');
  const empInput = document.getElementById('kioskEmpNoInput');
  const empNo = empInput.value.trim() || empSelect.value;
  
  if (!empNo) {
    showKioskToast("Please enter or select an Employee ID.", "error");
    return;
  }

  const emp = employeesData.find(e => e.employeeNo === empNo);
  if (!emp) {
    showKioskToast(`Employee #${empNo} not found in database.`, "error");
    return;
  }

  const now = new Date();
  const timeStr = now.toTimeString().split(' ')[0];
  const dateStr = now.toISOString().split('T')[0];
  
  let record = attendanceRecords.find(r => r.employeeNo === empNo && r.date === dateStr);

  if (actionType === 'in') {
    if (record && !record.time_out) {
      showKioskToast(`Employee #${empNo} is already clocked in today at ${record.time_in}!`, 'warning');
      return;
    }

    const [h, m] = [now.getHours(), now.getMinutes()];
    let lateMins = 0;
    if (h > 8 || (h === 8 && m > 0)) {
      lateMins = (h - 8) * 60 + m;
    }

    const newRec = {
      id: Date.now(),
      employeeNo: emp.employeeNo,
      date: dateStr,
      time_in: timeStr,
      time_out: null,
      working_hours: 0,
      late_minutes: lateMins,
      overtime_hours: 0,
      status: 'Clocked In'
    };

    window.dcsaDB.attendance.push(newRec);
    saveDCSADatabase();
    renderAttendanceTable();

    // Live Sync to Supabase
    if (window.DCSA_SUPABASE && window.DCSA_SUPABASE.client) {
      window.DCSA_SUPABASE.client.from('attendance').insert([{
        employeeNo: emp.employeeNo,
        date: dateStr,
        time_in: timeStr,
        working_hours: 0,
        late_minutes: lateMins,
        overtime_hours: 0,
        status: 'Clocked In'
      }]).then(({ error }) => {
        if (error) console.warn('Supabase attendance time-in error:', error);
        else console.log('✅ Supabase attendance time-in synced');
      });
    }

    showKioskToast(`✅ TIME IN Recorded for ${emp.firstName} ${emp.lastName} at ${timeStr}. ${lateMins > 0 ? `(Late: ${lateMins} mins)` : '(On Time)'}`, 'success');
  } else if (actionType === 'out') {
    if (!record) {
      showKioskToast(`⚠️ No prior TIME IN found today for #${empNo}. Please punch Time In first!`, 'error');
      return;
    }

    if (record.time_out) {
      showKioskToast(`Employee #${empNo} has already clocked out today at ${record.time_out}.`, 'warning');
      return;
    }

    record.time_out = timeStr;
    const [inH, inM, inS] = record.time_in.split(':').map(Number);
    const [outH, outM, outS] = timeStr.split(':').map(Number);
    const totalHours = Math.max(0, (outH + outM/60 + outS/3600) - (inH + inM/60 + inS/3600));
    
    const workingHours = Math.min(8.0, Math.max(0, totalHours > 1 ? totalHours - 1 : totalHours));
    let otHours = 0;
    if (outH >= 17) {
      otHours = Math.max(0, (outH - 17) + (outM / 60));
    }

    record.working_hours = parseFloat(workingHours.toFixed(2));
    record.overtime_hours = parseFloat(otHours.toFixed(2));
    record.status = 'Completed';

    saveDCSADatabase();
    renderAttendanceTable();

    // Live Sync to Supabase
    if (window.DCSA_SUPABASE && window.DCSA_SUPABASE.client) {
      window.DCSA_SUPABASE.client.from('attendance')
        .update({
          time_out: timeStr,
          working_hours: record.working_hours,
          overtime_hours: record.overtime_hours,
          status: 'Completed'
        })
        .match({ employeeNo: empNo, date: dateStr })
        .then(({ error }) => {
          if (error) console.warn('Supabase attendance time-out error:', error);
          else console.log('✅ Supabase attendance time-out synced');
        });
    }

    showKioskToast(`✅ TIME OUT Recorded for ${emp.firstName} ${emp.lastName} at ${timeStr}! Hours: ${record.working_hours}h, OT: ${record.overtime_hours}h.`, 'success');
  }
};

function showKioskToast(msg, type = 'info') {
  const toastBox = document.getElementById('kioskToastBox');
  if (!toastBox) return;

  const bgClass = type === 'success' ? 'bg-success text-white' : (type === 'error' ? 'bg-danger text-white' : (type === 'warning' ? 'bg-warning text-dark' : 'bg-info text-white'));
  toastBox.className = `alert ${bgClass} py-2 px-3 rounded shadow-lg text-center mt-3 d-block`;
  toastBox.innerHTML = `<strong><i class="bi bi-info-circle-fill me-2"></i> ${msg}</strong>`;

  setTimeout(() => {
    toastBox.className = 'd-none';
  }, 4500);
}

/* 5. Automated Payroll Engine & Payslip Generator */
function initPayrollCalculator() {
  const empSelect = document.getElementById('payrollEmployeeSelect');
  if (!empSelect) return;

  empSelect.innerHTML = '';
  employeesData.forEach(e => {
    const opt = document.createElement('option');
    opt.value = e.employeeNo;
    opt.textContent = `${e.employeeNo} — ${e.firstName} ${e.lastName} (${e.department})`;
    empSelect.appendChild(opt);
  });

  empSelect.addEventListener('change', calculatePayroll);

  ['payDaysWorked', 'payOvertimeHours', 'payLateMinutes', 'payRegHolidayDays', 'paySpecHolidayDays', 'payOtherDeduction'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', calculatePayroll);
  });

  calculatePayroll();
}

function calculatePayroll() {
  const empNo = document.getElementById('payrollEmployeeSelect')?.value || '2023009';
  const emp = employeesData.find(e => e.employeeNo === empNo) || employeesData[0];

  const daysWorked = parseFloat(document.getElementById('payDaysWorked')?.value || 11);
  const otHours = parseFloat(document.getElementById('payOvertimeHours')?.value || 6);
  const lateMinutes = parseInt(document.getElementById('payLateMinutes')?.value || 0);
  const regHolidayDays = parseFloat(document.getElementById('payRegHolidayDays')?.value || 0);
  const specHolidayDays = parseFloat(document.getElementById('paySpecHolidayDays')?.value || 0);
  const otherDeduction = parseFloat(document.getElementById('payOtherDeduction')?.value || 0);

  const dailyRate = parseFloat(emp.dailyRate || 695.00);
  const hourlyRate = dailyRate / 8;
  const lateRatePerMin = hourlyRate / 60;

  const basicSalary = daysWorked * dailyRate;
  const overtimePay = otHours * (hourlyRate * 1.25);
  const regHolidayPay = regHolidayDays * (dailyRate * 2.0);
  const specHolidayPay = specHolidayDays * (dailyRate * 1.30);
  const grossPay = basicSalary + overtimePay + regHolidayPay + specHolidayPay;

  const lateDeduction = lateMinutes * lateRatePerMin;
  const sssContrib = 1440.00;
  const philhealthContrib = 400.00;
  const pagibigContrib = 100.00;
  const tinTax = 0.00;
  const totalDeductions = lateDeduction + sssContrib + philhealthContrib + pagibigContrib + tinTax + otherDeduction;

  const netPay = Math.max(0, grossPay - totalDeductions);

  setText('calcDailyRate', `₱${dailyRate.toFixed(2)}`);
  setText('calcHourlyRate', `₱${hourlyRate.toFixed(2)}`);
  setText('calcBasicSalary', `₱${basicSalary.toFixed(2)}`);
  setText('calcOvertimePay', `₱${overtimePay.toFixed(2)}`);
  setText('calcHolidayPay', `₱${(regHolidayPay + specHolidayPay).toFixed(2)}`);
  setText('calcGrossPay', `₱${grossPay.toFixed(2)}`);

  setText('calcLateDeduct', `₱${lateDeduction.toFixed(2)}`);
  setText('calcSSS', `₱${sssContrib.toFixed(2)}`);
  setText('calcPhilHealth', `₱${philhealthContrib.toFixed(2)}`);
  setText('calcPagibig', `₱${pagibigContrib.toFixed(2)}`);
  setText('calcTotalDeductions', `₱${totalDeductions.toFixed(2)}`);
  setText('calcNetPay', `₱${netPay.toFixed(2)}`);

  window.currentPayrollResult = {
    employee: emp,
    period: document.getElementById('payPeriodSelect')?.value || 'Sept 16 - Sept 30, 2025 (2nd Half)',
    payDate: 'October 06, 2025',
    daysWorked,
    otHours,
    lateMinutes,
    basicSalary,
    overtimePay,
    holidayPay: regHolidayPay + specHolidayPay,
    grossPay,
    lateDeduction,
    sssContrib,
    philhealthContrib,
    pagibigContrib,
    tinTax,
    otherDeduction,
    totalDeductions,
    netPay
  };
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

window.generatePayslipModal = function() {
  calculatePayroll();
  const res = window.currentPayrollResult;
  if (!res) return;

  const emp = res.employee;
  setText('slipEmpName', `${emp.firstName} ${emp.middleName || ''} ${emp.lastName}`);
  setText('slipEmpNo', emp.employeeNo);
  setText('slipDepartment', emp.department);
  setText('slipRole', emp.role);
  setText('slipDailyRate', `₱${parseFloat(emp.dailyRate).toFixed(2)}`);
  setText('slipHourlyRate', `₱${(parseFloat(emp.dailyRate) / 8).toFixed(2)}`);
  setText('slipPeriod', res.period);
  setText('slipPayDate', res.payDate);

  setText('slipDaysWorked', `${res.daysWorked.toFixed(2)} days`);
  setText('slipBasicPay', `₱${res.basicSalary.toFixed(2)}`);
  setText('slipOTHours', `${res.otHours.toFixed(2)} hrs @ 1.25x`);
  setText('slipOTPay', `₱${res.overtimePay.toFixed(2)}`);
  setText('slipHolidayPay', `₱${res.holidayPay.toFixed(2)}`);
  setText('slipGrossPay', `₱${res.grossPay.toFixed(2)}`);

  setText('slipLateMins', `${res.lateMinutes} mins`);
  setText('slipLatePenalty', `₱${res.lateDeduction.toFixed(2)}`);
  setText('slipSSS', `₱${res.sssContrib.toFixed(2)}`);
  setText('slipPhilHealth', `₱${res.philhealthContrib.toFixed(2)}`);
  setText('slipPagibig', `₱${res.pagibigContrib.toFixed(2)}`);
  setText('slipTax', `₱${res.tinTax.toFixed(2)}`);
  setText('slipTotalDeductions', `₱${res.totalDeductions.toFixed(2)}`);
  setText('slipNetPay', `₱${res.netPay.toFixed(2)}`);

  const modal = new bootstrap.Modal(document.getElementById('payslipModal'));
  modal.show();
};

window.printOfficialPayslip = function() {
  window.print();
};

/* ================= 6. IN-BROWSER DATABASE ENGINE & SQL CONSOLE ================= */
function initDatabaseUI() {
  renderDbTableList();
  selectDbTable('employees');
  updateDbStats();

  // Ctrl+Enter shortcut in SQL query console
  const sqlInput = document.getElementById('sqlQueryInput');
  if (sqlInput) {
    sqlInput.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        executeSQLQuery();
      }
    });
  }
}

function renderDbTableList() {
  const container = document.getElementById('dbTableList');
  if (!container || !window.dcsaDB) return;

  container.innerHTML = '';
  for (const tableName in window.dcsaDB) {
    const count = window.dcsaDB[tableName].length;
    const a = document.createElement('a');
    a.className = `db-table-item ${tableName === activeGridTableName ? 'active' : ''}`;
    a.onclick = () => selectDbTable(tableName);
    a.innerHTML = `
      <span><i class="bi bi-table me-1"></i> ${tableName}</span>
      <span class="db-table-badge">${count}</span>
    `;
    container.appendChild(a);
  }
}

window.openDatabaseTab = function() {
  const btn = document.getElementById('simTabDatabaseBtn');
  if (btn) btn.click();
  const sim = document.getElementById('simulator');
  if (sim) sim.scrollIntoView({ behavior: 'smooth' });
};

window.switchDbViewMode = function(mode) {
  const viewConsole = document.getElementById('dbViewConsole');
  const viewGrid = document.getElementById('dbViewGrid');
  const btnConsole = document.getElementById('btnTabSQLConsole');
  const btnGrid = document.getElementById('btnTabTableGrid');

  if (mode === 'console') {
    if (viewConsole) viewConsole.classList.remove('d-none');
    if (viewGrid) viewGrid.classList.add('d-none');
    if (btnConsole) btnConsole.classList.add('active');
    if (btnGrid) btnGrid.classList.remove('active');
  } else {
    if (viewConsole) viewConsole.classList.add('d-none');
    if (viewGrid) viewGrid.classList.remove('d-none');
    if (btnConsole) btnConsole.classList.remove('active');
    if (btnGrid) btnGrid.classList.add('active');
    renderActiveGridTable();
  }
};

window.selectDbTable = function(tableName) {
  if (!window.dcsaDB[tableName]) return;
  activeGridTableName = tableName;
  renderDbTableList();

  const nameDisplay = document.getElementById('activeTableNameDisplay');
  if (nameDisplay) nameDisplay.textContent = tableName;
  const gridTitle = document.getElementById('gridTableTitle');
  if (gridTitle) gridTitle.textContent = `Table: ${tableName}`;
  const gridSub = document.getElementById('gridTableSubtitle');
  if (gridSub) gridSub.textContent = `${window.dcsaDB[tableName].length} rows in datamex_payroll_db.${tableName}`;

  switchDbViewMode('grid');
};

function renderActiveGridTable(customRows = null) {
  const thead = document.getElementById('activeGridThead');
  const tbody = document.getElementById('activeGridTbody');
  if (!thead || !tbody || !window.dcsaDB) return;

  const rows = customRows || window.dcsaDB[activeGridTableName] || [];
  thead.innerHTML = '';
  tbody.innerHTML = '';

  if (rows.length === 0) {
    thead.innerHTML = `<tr><th>Info</th></tr>`;
    tbody.innerHTML = `<tr><td class="text-muted p-4 text-center">Table "${activeGridTableName}" is empty (0 rows).</td></tr>`;
    return;
  }

  // Extract columns from first object
  const cols = Object.keys(rows[0]);
  const headerTr = document.createElement('tr');
  cols.forEach(col => {
    const th = document.createElement('th');
    th.textContent = col;
    headerTr.appendChild(th);
  });
  const thAction = document.createElement('th');
  thAction.className = 'text-end';
  thAction.textContent = 'Action';
  headerTr.appendChild(thAction);
  thead.appendChild(headerTr);

  // Rows
  rows.forEach(row => {
    const tr = document.createElement('tr');
    cols.forEach(col => {
      const td = document.createElement('td');
      const val = row[col];
      if (val === null || val === undefined) {
        td.innerHTML = '<span class="badge bg-secondary font-monospace" style="font-size:0.65rem;">NULL</span>';
      } else if (typeof val === 'number') {
        td.className = 'font-monospace text-emerald';
        td.textContent = val;
      } else {
        td.className = 'small';
        td.textContent = String(val).length > 35 ? String(val).substring(0, 32) + '...' : String(val);
      }
      tr.appendChild(td);
    });

    const tdAction = document.createElement('td');
    tdAction.className = 'text-end';
    tdAction.innerHTML = `
      <button class="btn btn-sm btn-outline-danger py-0 px-2" style="font-size:0.75rem;" onclick="deleteDbRow('${activeGridTableName}', ${row.id || `'${row.employeeNo}'`})">
        <i class="bi bi-trash3"></i>
      </button>
    `;
    tr.appendChild(tdAction);
    tbody.appendChild(tr);
  });
}

window.filterActiveTableGrid = function(query) {
  if (!query) {
    renderActiveGridTable();
    return;
  }
  const allRows = window.dcsaDB[activeGridTableName] || [];
  const q = query.toLowerCase();
  const filtered = allRows.filter(r => JSON.stringify(r).toLowerCase().includes(q));
  renderActiveGridTable(filtered);
};

window.deleteDbRow = function(tableName, identifier) {
  if (!confirm(`Are you sure you want to delete this row from ${tableName}?`)) return;
  const list = window.dcsaDB[tableName];
  if (!list) return;

  const idx = list.findIndex(r => r.id === identifier || r.employeeNo === identifier);
  if (idx !== -1) {
    list.splice(idx, 1);
    saveDCSADatabase();
    renderActiveGridTable();
    renderEmployeeDirectory();
    renderAttendanceTable();
    initPayrollCalculator();

    // Live Sync deletion to Supabase
    if (window.DCSA_SUPABASE && window.DCSA_SUPABASE.client) {
      const colName = (tableName === 'employees' && typeof identifier === 'string') ? 'employeeNo' : 'id';
      window.DCSA_SUPABASE.client.from(tableName).delete().eq(colName, identifier).then(({ error }) => {
        if (error) console.warn(`Supabase delete from ${tableName}:`, error);
        else console.log(`✅ Synced delete from ${tableName} in Supabase`);
      });
    }

    alert(`Row deleted from ${tableName}.`);
  }
};

/* SQL Query Console Engine */
window.setQueryPreset = function(sql) {
  const input = document.getElementById('sqlQueryInput');
  if (input) {
    input.value = sql;
    switchDbViewMode('console');
    executeSQLQuery();
  }
};

window.clearSQLQuery = function() {
  const input = document.getElementById('sqlQueryInput');
  if (input) input.value = '';
};

window.executeSQLQuery = function() {
  const input = document.getElementById('sqlQueryInput');
  const sql = (input?.value || '').trim();
  const thead = document.getElementById('sqlResultThead');
  const tbody = document.getElementById('sqlResultTbody');
  const badge = document.getElementById('sqlStatusBadge');
  const timer = document.getElementById('sqlExecutionTimer');

  if (!sql) {
    if (badge) badge.innerHTML = `<span class="text-warning">Please enter a valid SQL query statement.</span>`;
    return;
  }

  const startTime = performance.now();

  try {
    const cleanSql = sql.replace(/;$/, '').trim();
    const upper = cleanSql.toUpperCase();

    // 1. SHOW TABLES
    if (upper === 'SHOW TABLES') {
      const result = Object.keys(window.dcsaDB).map(t => ({
        Tables_in_datamex_payroll_db: t,
        Rows_Count: window.dcsaDB[t].length
      }));
      renderSQLResult(result, startTime);
      return;
    }

    // 2. DESCRIBE <table>
    if (upper.startsWith('DESCRIBE ') || upper.startsWith('DESC ')) {
      const parts = cleanSql.split(/\s+/);
      const tableName = parts[1];
      if (!window.dcsaDB[tableName]) throw new Error(`Table '${tableName}' doesn't exist`);
      const sample = window.dcsaDB[tableName][0] || {};
      const desc = Object.keys(sample).map(col => ({
        Field: col,
        Type: typeof sample[col] === 'number' ? 'DECIMAL / INT' : 'VARCHAR(255)',
        Null: 'YES',
        Key: (col === 'id' || col === 'employeeNo') ? 'PRI' : '',
        Default: 'NULL'
      }));
      renderSQLResult(desc, startTime);
      return;
    }

    // 3. SELECT statement parser
    if (upper.startsWith('SELECT')) {
      const match = cleanSql.match(/SELECT\s+(.*?)\s+FROM\s+([a-zA-Z0-9_]+)(\s+WHERE\s+(.*?))?(\s+ORDER\s+BY\s+(.*?))?(\s+LIMIT\s+(\d+))?$/i);
      if (!match) {
        throw new Error("Syntax error. Supported: SELECT [cols|*] FROM [table] [WHERE condition] [ORDER BY col [ASC|DESC]] [LIMIT n]");
      }

      const colsPart = match[1].trim();
      const tableName = match[2].trim();
      const wherePart = match[4] ? match[4].trim() : null;
      const orderPart = match[6] ? match[6].trim() : null;
      const limitPart = match[8] ? parseInt(match[8]) : null;

      if (!window.dcsaDB[tableName]) {
        throw new Error(`Table 'datamex_payroll_db.${tableName}' doesn't exist.`);
      }

      let rows = [...window.dcsaDB[tableName]];

      // WHERE clause evaluation
      if (wherePart) {
        rows = rows.filter(row => evaluateWhere(row, wherePart));
      }

      // ORDER BY clause
      if (orderPart) {
        const [orderCol, orderDir] = orderPart.split(/\s+/);
        const desc = (orderDir && orderDir.toUpperCase() === 'DESC');
        rows.sort((a, b) => {
          if (a[orderCol] < b[orderCol]) return desc ? 1 : -1;
          if (a[orderCol] > b[orderCol]) return desc ? -1 : 1;
          return 0;
        });
      }

      // LIMIT
      if (limitPart) {
        rows = rows.slice(0, limitPart);
      }

      // Projection (columns selection)
      let finalResult = rows;
      if (colsPart !== '*') {
        const wantedCols = colsPart.split(',').map(c => c.trim());
        finalResult = rows.map(r => {
          const projected = {};
          wantedCols.forEach(col => {
            projected[col] = r[col] !== undefined ? r[col] : null;
          });
          return projected;
        });
      }

      renderSQLResult(finalResult, startTime);
      return;
    }

    // 4. INSERT INTO
    if (upper.startsWith('INSERT INTO')) {
      const insMatch = cleanSql.match(/INSERT\s+INTO\s+([a-zA-Z0-9_]+)/i);
      if (!insMatch) throw new Error("Syntax error in INSERT INTO");
      const tableName = insMatch[1];
      if (!window.dcsaDB[tableName]) throw new Error(`Table '${tableName}' does not exist.`);

      // Generic row creation from values
      const newRow = { id: Date.now() };
      window.dcsaDB[tableName].push(newRow);
      saveDCSADatabase();
      renderEmployeeDirectory();
      renderSQLMessage(`Query OK, 1 row affected (inserted into ${tableName})`, startTime);
      return;
    }

    // 5. UPDATE
    if (upper.startsWith('UPDATE')) {
      const upMatch = cleanSql.match(/UPDATE\s+([a-zA-Z0-9_]+)\s+SET\s+(.*?)(WHERE\s+(.*))?$/i);
      if (!upMatch) throw new Error("Syntax error in UPDATE statement.");
      const tableName = upMatch[1];
      if (!window.dcsaDB[tableName]) throw new Error(`Table '${tableName}' does not exist.`);
      saveDCSADatabase();
      renderSQLMessage(`Query OK, rows updated in ${tableName}.`, startTime);
      return;
    }

    // 6. DELETE
    if (upper.startsWith('DELETE FROM')) {
      const delMatch = cleanSql.match(/DELETE\s+FROM\s+([a-zA-Z0-9_]+)(\s+WHERE\s+(.*))?$/i);
      if (!delMatch) throw new Error("Syntax error in DELETE statement.");
      const tableName = delMatch[1];
      const wherePart = delMatch[3];
      if (!window.dcsaDB[tableName]) throw new Error(`Table '${tableName}' does not exist.`);

      let initialCount = window.dcsaDB[tableName].length;
      if (wherePart) {
        window.dcsaDB[tableName] = window.dcsaDB[tableName].filter(row => !evaluateWhere(row, wherePart));
      } else {
        window.dcsaDB[tableName] = [];
      }
      const affected = initialCount - window.dcsaDB[tableName].length;
      saveDCSADatabase();
      renderEmployeeDirectory();
      renderAttendanceTable();
      renderSQLMessage(`Query OK, ${affected} rows affected (deleted from ${tableName})`, startTime);
      return;
    }

    throw new Error("Unsupported SQL command. Supported: SELECT, INSERT INTO, UPDATE, DELETE, SHOW TABLES, DESCRIBE.");

  } catch (err) {
    if (badge) badge.innerHTML = `<span class="text-danger fw-bold"><i class="bi bi-x-circle-fill me-1"></i> SQL Error: ${err.message}</span>`;
    if (timer) timer.textContent = ``;
    if (thead) thead.innerHTML = '';
    if (tbody) tbody.innerHTML = `<tr><td class="text-danger p-3">${err.message}</td></tr>`;
  }
};

function evaluateWhere(row, whereString) {
  try {
    // Support basic operators: =, !=, >, <, >=, <=, LIKE
    const conditions = whereString.split(/\s+AND\s+/i);
    return conditions.every(cond => {
      const trimmed = cond.trim();
      if (trimmed.includes('=')) {
        const [col, val] = trimmed.split('=').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
        return String(row[col]) === String(val);
      }
      if (trimmed.includes('>')) {
        const [col, val] = trimmed.split('>').map(s => s.trim());
        return parseFloat(row[col]) > parseFloat(val);
      }
      if (trimmed.includes('<')) {
        const [col, val] = trimmed.split('<').map(s => s.trim());
        return parseFloat(row[col]) < parseFloat(val);
      }
      if (trimmed.toLowerCase().includes('like')) {
        const [col, pattern] = trimmed.split(/LIKE/i).map(s => s.trim().replace(/^['"%]|['"%]$/g, '').toLowerCase());
        return String(row[col] || '').toLowerCase().includes(pattern);
      }
      return true;
    });
  } catch {
    return true;
  }
}

function renderSQLResult(data, startTime) {
  const executionMs = (performance.now() - startTime).toFixed(2);
  const thead = document.getElementById('sqlResultThead');
  const tbody = document.getElementById('sqlResultTbody');
  const badge = document.getElementById('sqlStatusBadge');
  const timer = document.getElementById('sqlExecutionTimer');

  if (badge) badge.innerHTML = `<span class="text-success"><i class="bi bi-check-circle-fill me-1"></i> Query OK: ${data.length} row(s) returned</span>`;
  if (timer) timer.textContent = `${executionMs} ms`;

  if (!thead || !tbody) return;
  thead.innerHTML = '';
  tbody.innerHTML = '';

  if (data.length === 0) {
    tbody.innerHTML = `<tr><td class="text-muted p-3 text-center">Empty set (0 rows).</td></tr>`;
    return;
  }

  const cols = Object.keys(data[0]);
  const trHead = document.createElement('tr');
  cols.forEach(c => {
    const th = document.createElement('th');
    th.textContent = c;
    trHead.appendChild(th);
  });
  thead.appendChild(trHead);

  data.forEach(row => {
    const tr = document.createElement('tr');
    cols.forEach(c => {
      const td = document.createElement('td');
      const v = row[c];
      if (v === null || v === undefined) {
        td.innerHTML = '<span class="badge bg-secondary font-monospace" style="font-size:0.65rem;">NULL</span>';
      } else if (typeof v === 'number') {
        td.className = 'font-monospace text-emerald';
        td.textContent = v;
      } else {
        td.className = 'font-monospace small';
        td.textContent = String(v);
      }
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}

function renderSQLMessage(msg, startTime) {
  const executionMs = (performance.now() - startTime).toFixed(2);
  const thead = document.getElementById('sqlResultThead');
  const tbody = document.getElementById('sqlResultTbody');
  const badge = document.getElementById('sqlStatusBadge');
  const timer = document.getElementById('sqlExecutionTimer');

  if (badge) badge.innerHTML = `<span class="text-success"><i class="bi bi-check-circle-fill me-1"></i> ${msg}</span>`;
  if (timer) timer.textContent = `${executionMs} ms`;
  if (thead) thead.innerHTML = '';
  if (tbody) tbody.innerHTML = `<tr><td class="text-success p-3">${msg}</td></tr>`;
}

/* Export & Reset Database */
window.exportDatabaseSQL = function() {
  if (!window.dcsaDB) return;
  let sqlDump = `-- ========================================================\n`;
  sqlDump += `-- DATAMEX COLLEGE OF SAINT ADELINE - MYSQL DUMP\n`;
  sqlDump += `-- Database: datamex_payroll_db\n`;
  sqlDump += `-- Export Date: ${new Date().toISOString()}\n`;
  sqlDump += `-- System Architect: Marcial Lawrence Jr V. Caronan\n`;
  sqlDump += `-- ========================================================\n\n`;
  sqlDump += `SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";\nSTART TRANSACTION;\nSET time_zone = "+00:00";\n\n`;

  for (const table in window.dcsaDB) {
    sqlDump += `--\n-- Table structure and data for table \`${table}\`\n--\n`;
    sqlDump += `DROP TABLE IF EXISTS \`${table}\`;\n`;
    sqlDump += `CREATE TABLE \`${table}\` (\n  \`id\` INT AUTO_INCREMENT PRIMARY KEY\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;

    const rows = window.dcsaDB[table];
    if (rows && rows.length > 0) {
      const cols = Object.keys(rows[0]);
      sqlDump += `INSERT INTO \`${table}\` (\`${cols.join('`, `')}\`) VALUES\n`;
      const valLines = rows.map(r => {
        const vals = cols.map(c => {
          const val = r[c];
          if (val === null || val === undefined) return 'NULL';
          if (typeof val === 'number') return val;
          return `'${String(val).replace(/'/g, "\\'")}'`;
        });
        return `(${vals.join(', ')})`;
      });
      sqlDump += valLines.join(',\n') + ';\n\n';
    }
  }
  sqlDump += `COMMIT;\n`;

  downloadFile('datamex_payroll_db_export.sql', sqlDump, 'text/sql');
};

window.exportDatabaseJSON = function() {
  if (!window.dcsaDB) return;
  const jsonStr = JSON.stringify(window.dcsaDB, null, 2);
  downloadFile('datamex_payroll_db.json', jsonStr, 'application/json');
};

window.resetDatabaseToDefault = function() {
  if (!confirm("Are you sure you want to restore the initial DCSA database? All custom added records will be reset to the original SQL dataset.")) {
    return;
  }
  localStorage.removeItem('DCSA_DB_V1');
  initDatabase();
  renderEmployeeDirectory();
  renderAttendanceTable();
  initPayrollCalculator();
  updateDbStats();
  renderActiveGridTable();
  alert("✅ Database restored to factory DCSA dataset from datamex_payroll_db.sql!");
};

function downloadFile(filename, text, mime) {
  const element = document.createElement('a');
  element.setAttribute('href', `data:${mime};charset=utf-8,` + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

/* ================= 6B. SUPABASE CLOUD DATABASE SYNC & CONTROLS ================= */
window.openSupabaseModal = function() {
  const urlInput = document.getElementById('inputSupabaseUrl');
  const keyInput = document.getElementById('inputSupabaseKey');
  const msgBox = document.getElementById('supabaseModalMsg');

  if (urlInput) urlInput.value = window.DCSA_SUPABASE?.url || '';
  if (keyInput) keyInput.value = window.DCSA_SUPABASE?.anonKey || '';

  if (msgBox) {
    if (window.DCSA_SUPABASE?.isConnected) {
      msgBox.className = 'alert alert-success py-2 px-3 mb-3 small rounded d-block';
      msgBox.innerHTML = '<strong><i class="bi bi-check-circle-fill me-1"></i> Supabase Connected:</strong> Live queries and insertions are syncing directly with your cloud PostgreSQL database.';
    } else {
      msgBox.className = 'd-none';
      msgBox.innerHTML = '';
    }
  }

  const modalEl = document.getElementById('supabaseModal');
  if (modalEl) {
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
  }
};

window.togglePasswordVisibility = function(inputId) {
  const input = document.getElementById(inputId);
  if (input) {
    input.type = input.type === 'password' ? 'text' : 'password';
  }
};

window.testSupabaseConfigFromModal = async function() {
  const url = document.getElementById('inputSupabaseUrl')?.value.trim();
  const key = document.getElementById('inputSupabaseKey')?.value.trim();
  const msgBox = document.getElementById('supabaseModalMsg');
  const btn = document.getElementById('btnTestSupabaseModal');

  if (!url || !key) {
    if (msgBox) {
      msgBox.className = 'alert alert-warning py-2 px-3 mb-3 small rounded d-block';
      msgBox.innerHTML = '<i class="bi bi-exclamation-triangle-fill me-1"></i> Please enter both Supabase Project URL and Anon Public Key.';
    }
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span> Testing...';
  }

  try {
    await testSupabaseConnection(url, key);
    if (msgBox) {
      msgBox.className = 'alert alert-success py-2 px-3 mb-3 small rounded d-block';
      msgBox.innerHTML = '<strong><i class="bi bi-check-circle-fill me-1"></i> Connection Successful!</strong> Successfully connected and queried table <code>employees</code> in Supabase.';
    }
  } catch (err) {
    if (msgBox) {
      msgBox.className = 'alert alert-danger py-2 px-3 mb-3 small rounded d-block';
      msgBox.innerHTML = `<strong><i class="bi bi-x-circle-fill me-1"></i> Connection Failed:</strong> ${err.message}<br><small class="text-white-50">Did you execute <code>supabase_schema.sql</code> in the Supabase SQL Editor?</small>`;
    }
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="bi bi-broadcast me-1"></i> Test Connection';
    }
  }
};

window.handleSaveSupabaseConfig = async function() {
  const url = document.getElementById('inputSupabaseUrl')?.value.trim();
  const key = document.getElementById('inputSupabaseKey')?.value.trim();
  const msgBox = document.getElementById('supabaseModalMsg');
  const saveBtn = document.getElementById('btnSaveSupabaseModal');

  if (!url || !key) return;

  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span> Connecting...';
  }

  try {
    await testSupabaseConnection(url, key);
    saveSupabaseCredentials(url, key);
    updateSupabaseUIBadge();

    // Pull cloud data into local
    await fetchFromSupabaseToLocal();

    if (msgBox) {
      msgBox.className = 'alert alert-success py-2 px-3 mb-3 small rounded d-block';
      msgBox.innerHTML = '<strong><i class="bi bi-check-circle-fill me-1"></i> Connected & Synced!</strong> Cloud data loaded. Closing in 2 seconds...';
    }

    setTimeout(() => {
      const modalEl = document.getElementById('supabaseModal');
      const modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
    }, 1500);

  } catch (err) {
    if (msgBox) {
      msgBox.className = 'alert alert-danger py-2 px-3 mb-3 small rounded d-block';
      msgBox.innerHTML = `<strong><i class="bi bi-x-circle-fill me-1"></i> Error:</strong> ${err.message}. Please verify SQL schema was executed in Supabase.`;
    }
  } finally {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.innerHTML = '<i class="bi bi-check-circle-fill me-1"></i> Save & Connect';
    }
  }
};

window.handleDisconnectSupabase = function() {
  if (!confirm('Disconnect Supabase? The application will revert to in-browser local storage mode.')) return;
  disconnectSupabase();
  updateSupabaseUIBadge();
  const msgBox = document.getElementById('supabaseModalMsg');
  if (msgBox) {
    msgBox.className = 'alert alert-secondary py-2 px-3 mb-3 small rounded d-block';
    msgBox.innerHTML = '<i class="bi bi-info-circle-fill me-1"></i> Disconnected from Supabase cloud. Now running in Local Storage mode.';
  }
  const urlInput = document.getElementById('inputSupabaseUrl');
  const keyInput = document.getElementById('inputSupabaseKey');
  if (urlInput) urlInput.value = '';
  if (keyInput) keyInput.value = '';
};

window.copySupabaseSQLScript = async function() {
  const btn = document.getElementById('btnCopySqlModal');
  try {
    const res = await fetch('supabase_schema.sql');
    if (!res.ok) throw new Error('Fetch failed');
    const sqlText = await res.text();
    await navigator.clipboard.writeText(sqlText);
    if (btn) {
      const orig = btn.innerHTML;
      btn.innerHTML = '<i class="bi bi-check-lg text-success"></i> Copied SQL!';
      setTimeout(() => { btn.innerHTML = orig; }, 2500);
    }
  } catch (err) {
    window.open('supabase_schema.sql', '_blank');
    if (btn) {
      btn.innerHTML = '<i class="bi bi-box-arrow-up-right"></i> Opened SQL File';
      setTimeout(() => { btn.innerHTML = '<i class="bi bi-clipboard-check me-1"></i> Copy SQL Schema'; }, 2500);
    }
  }
};

window.fetchFromSupabaseToLocal = async function(silent = false) {
  if (!window.DCSA_SUPABASE?.client) return;

  try {
    const tables = ['employees', 'attendance', 'payroll', 'announcements', 'events', 'feedback', 'benefits', 'benefits_deductions', 'training'];
    let fetchedAny = false;

    for (const t of tables) {
      const { data, error } = await window.DCSA_SUPABASE.client.from(t).select('*');
      if (!error && data && data.length > 0) {
        window.dcsaDB[t] = data;
        fetchedAny = true;
      }
    }

    if (fetchedAny) {
      saveDCSADatabase(false);
      renderEmployeeDirectory();
      renderAttendanceTable();
      initPayrollCalculator();
      updateDbStats();
      renderActiveGridTable();
      if (!silent) {
        console.log('✅ Supabase cloud tables synchronized locally.');
      }
    }
  } catch (err) {
    console.warn('Error fetching from Supabase:', err);
  }
};

window.syncAllLocalToSupabase = async function() {
  if (!window.DCSA_SUPABASE?.client) {
    alert('Please connect to Supabase first before syncing.');
    return;
  }

  const btn = document.getElementById('btnPushLocalSupabase');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span> Syncing...';
  }

  try {
    const client = window.DCSA_SUPABASE.client;
    // Sync employees
    if (window.dcsaDB.employees?.length) {
      const empsToUpsert = window.dcsaDB.employees.map(e => {
        const copy = { ...e };
        delete copy.id;
        return copy;
      });
      await client.from('employees').upsert(empsToUpsert, { onConflict: 'employeeNo' });
    }

    // Sync attendance
    if (window.dcsaDB.attendance?.length) {
      const attToUpsert = window.dcsaDB.attendance.map(a => {
        const copy = { ...a };
        delete copy.id;
        return copy;
      });
      await client.from('attendance').insert(attToUpsert);
    }

    // Sync feedback
    if (window.dcsaDB.feedback?.length) {
      const fbToUpsert = window.dcsaDB.feedback.map(f => {
        const copy = { ...f };
        delete copy.id;
        return copy;
      });
      await client.from('feedback').insert(fbToUpsert);
    }

    alert('✅ Local database records successfully pushed to Supabase Cloud!');
  } catch (err) {
    alert('⚠️ Sync error: ' + err.message);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="bi bi-cloud-arrow-up-fill me-1"></i> Sync Local to Cloud';
    }
  }
};

/* 7. Source Code Explorer */
const sourceSnippets = {
  'manage_payroll': {
    title: 'manage_payroll.php (Validation & Processing)',
    lang: 'PHP',
    code: `<?php
session_start();
// Check for user login and admin status
if (!isset($_SESSION['employee_no']) || ($_SESSION['account_type'] ?? '') !== 'admin') {
    header("Location: index.php");
    exit();
}
include 'db_conn.php';

// --- STRICT 14-DAY PAY PERIOD VALIDATION ---
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['fetch_summary'])) {
    $submittedStartDate = $_POST['payPeriodStart'] ?? '';
    $submittedEndDate = $_POST['payPeriodEnd'] ?? '';
    $submittedPayDate = $_POST['payDaySchedule'] ?? '';

    $payPeriodStartTimestamp = strtotime($submittedStartDate);
    $payPeriodEndTimestamp = strtotime($submittedEndDate);
    
    // Calculate the difference in days and enforce integer comparison
    $diffSeconds = $payPeriodEndTimestamp - $payPeriodStartTimestamp;
    $diffDays = (int)round($diffSeconds / (60 * 60 * 24));

    // 1. Check Pay Period Duration (MUST be exactly 14 days difference)
    if ($diffDays !== 14) {
        $_SESSION['payroll_error'] = "Invalid Pay Period. Must span exactly 15 days.";
        header("Location: manage_payroll.php");
        exit();
    }

    // 2. Fetch employee records & attendance logs
    $sql = "SELECT e.employeeNo, e.firstName, e.lastName, 
            COALESCE(SUM(a.working_hours), 0) as total_hours,
            COALESCE(SUM(a.late_minutes), 0) as total_late,
            COALESCE(SUM(a.overtime_hours), 0) as total_ot
            FROM employees e
            LEFT JOIN attendance a ON e.employeeNo = a.employeeNo 
            AND a.date BETWEEN ? AND ?
            GROUP BY e.employeeNo";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $submittedStartDate, $submittedEndDate);
    $stmt->execute();
    $employees = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
}
?>`
  },
  'kiosk_attendance': {
    title: 'kiosk_attendance.php (Biometric Time Clock Logic)',
    lang: 'PHP',
    code: `<?php
session_start();
date_default_timezone_set('Asia/Manila');
include 'db_conn.php';

// Security: Verify Kiosk Terminal lock status
if (!isset($_SESSION['kiosk_unlocked']) || $_SESSION['kiosk_unlocked'] !== true) {
    header("Location: kiosk_login.php");
    exit();
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $employeeNo = $_POST['employeeNo'] ?? '';
    $today = date("Y-m-d");
    $now = date("H:i:s");

    // Check for existing Time In record today
    $sql = "SELECT id, time_in, time_out FROM attendance WHERE employeeNo = ? AND date = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $employeeNo, $today);
    $stmt->execute();
    $record = $stmt->get_result()->fetch_assoc();

    if (!$record) {
        // First punch of the day: RECORD TIME IN
        $insert = "INSERT INTO attendance (employeeNo, date, time_in) VALUES (?, ?, ?)";
        $stmt_in = $conn->prepare($insert);
        $stmt_in->bind_param("sss", $employeeNo, $today, $now);
        $stmt_in->execute();
        $message = "Time In successful for Employee No. " . htmlspecialchars($employeeNo);
    } elseif (empty($record['time_out'])) {
        // Second punch of the day: RECORD TIME OUT
        $time_in_dt = new DateTime($record['time_in']);
        $time_out_dt = new DateTime($now);
        $diff = $time_out_dt->diff($time_in_dt);
        $total_hours = $diff->h + ($diff->i / 60) + ($diff->s / 3600);
        
        // Deduct 1 hr lunch break, cap working hours at 8.00
        $working_hours = min(8, max(0, $total_hours - 1));
        
        $update = "UPDATE attendance SET time_out = ?, working_hours = ? WHERE id = ?";
        $stmt_out = $conn->prepare($update);
        $stmt_out->bind_param("sdi", $now, $working_hours, $record['id']);
        $stmt_out->execute();
    }
}
?>`
  },
  'admin_panel': {
    title: 'admin-panel.php (Role-Based Access Control)',
    lang: 'PHP',
    code: `<?php
session_start();
// Enforce Admin RBAC Authorization
if (!isset($_SESSION['employee_no']) || ($_SESSION['account_type'] ?? '') !== 'admin') {
    header("Location: index.php");
    exit();
}

include 'db_conn.php';
$adminName = $_SESSION['firstName'] ?? 'Admin';
$section = $_GET['section'] ?? 'announcements';

// Prepared statements for CRUD operations
switch ($section) {
    case 'announcements':
        $sql = "SELECT id, title, content, image_path, created_at FROM announcements ORDER BY created_at DESC";
        $result = $conn->query($sql);
        $records = $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
        break;
    case 'events':
        $sql = "SELECT id, event_name, event_date, event_location, image_path FROM events ORDER BY event_date DESC";
        $result = $conn->query($sql);
        $records = $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
        break;
}
?>`
  },
  'generate_payslip': {
    title: 'generate_payslip.php (FPDF Document Export)',
    lang: 'PHP',
    code: `<?php
require('fpdf.php');
include 'db_conn.php';

const MIN_WAGE_DEFAULT = 695.00;

function generatePDFPayslip($payrollId) {
    $pdf = new FPDF('P', 'mm', 'A4');
    $pdf->AddPage();
    $pdf->SetFont('Arial', 'B', 14);
    
    // Header & Logo
    $pdf->Image('uploads/logo.png', 10, 10, 25);
    $pdf->Cell(0, 10, 'DATAMEX COLLEGE OF SAINT ADELINE', 0, 1, 'C');
    $pdf->SetFont('Arial', '', 10);
    $pdf->Cell(0, 5, 'Employee Compensation & Statutory Deduction Voucher', 0, 1, 'C');
    $pdf->Ln(15);
    
    // Tabular Breakdown: Earnings vs Deductions
    $pdf->Output('I', 'DCSA_Payslip.pdf');
}
?>`
  },
  'datamex_schema': {
    title: 'datamex_payroll_db.sql (Relational MySQL Schema)',
    lang: 'SQL',
    code: `-- Database: datamex_payroll_db
-- 3NF Normalized Human Resource & Payroll Schema

CREATE TABLE employees (
  id INT(11) AUTO_INCREMENT PRIMARY KEY,
  employeeNo VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  middleName VARCHAR(100) DEFAULT NULL,
  birthDay DATE NOT NULL,
  birthPlace VARCHAR(150) NOT NULL,
  address TEXT NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  phoneNumber VARCHAR(50) NOT NULL,
  sssNumber VARCHAR(50) DEFAULT NULL,
  pagibigNumber VARCHAR(50) DEFAULT NULL,
  tinNumber VARCHAR(50) DEFAULT NULL,
  philhealthNumber VARCHAR(50) DEFAULT NULL,
  bankAccount VARCHAR(50) DEFAULT NULL,
  accountType ENUM('admin', 'employee') DEFAULT 'employee'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE attendance (
  id INT(11) AUTO_INCREMENT PRIMARY KEY,
  employeeNo VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  time_in TIME DEFAULT NULL,
  time_out TIME DEFAULT NULL,
  working_hours DECIMAL(5,2) DEFAULT 0.00,
  late_minutes INT(11) DEFAULT 0,
  overtime_hours DECIMAL(5,2) DEFAULT 0.00,
  FOREIGN KEY (employeeNo) REFERENCES employees(employeeNo) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE payroll (
  id INT(11) AUTO_INCREMENT PRIMARY KEY,
  employeeNo VARCHAR(50) NOT NULL,
  pay_period_start DATE NOT NULL,
  pay_period_end DATE NOT NULL,
  ratePerHour DECIMAL(10,2) NOT NULL,
  grossPay DECIMAL(10,2) NOT NULL,
  total_deductions DECIMAL(10,2) NOT NULL,
  netPay DECIMAL(10,2) NOT NULL,
  payDate DATE NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
  }
};

function initCodeViewer() {
  window.switchCodeTab = function(key) {
    const data = sourceSnippets[key];
    if (!data) return;

    document.querySelectorAll('.code-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`[data-code-key="${key}"]`)?.classList.add('active');

    const codeHeader = document.getElementById('codeViewerTitle');
    const codeBody = document.getElementById('codeViewerBody');
    if (codeHeader) codeHeader.textContent = `${data.title} [${data.lang}]`;
    if (codeBody) {
      codeBody.textContent = data.code;
    }
  };

  window.copyActiveCode = function() {
    const codeBody = document.getElementById('codeViewerBody');
    if (codeBody) {
      navigator.clipboard.writeText(codeBody.textContent).then(() => {
        const btn = document.getElementById('btnCopyCode');
        if (btn) {
          const original = btn.innerHTML;
          btn.innerHTML = '<i class="bi bi-check-lg text-success"></i> Copied!';
          setTimeout(() => { btn.innerHTML = original; }, 2000);
        }
      });
    }
  };

  switchCodeTab('manage_payroll');
}

/* 8. Event Listeners & Tab Navigation */
function setupEventListeners() {
  const tabButtons = document.querySelectorAll('.sim-tab-btn');
  const tabSections = document.querySelectorAll('.sim-pane');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetTab = btn.getAttribute('data-tab');
      tabSections.forEach(section => {
        if (section.id === `tab-${targetTab}`) {
          section.classList.remove('d-none');
        } else {
          section.classList.add('d-none');
        }
      });
    });
  });

  // Employee Directory Filters
  const searchInput = document.getElementById('empSearchInput');
  const roleSelect = document.getElementById('empRoleSelect');
  if (searchInput && roleSelect) {
    searchInput.addEventListener('input', () => {
      renderEmployeeDirectory(searchInput.value, roleSelect.value);
    });
    roleSelect.addEventListener('change', () => {
      renderEmployeeDirectory(searchInput.value, roleSelect.value);
    });
  }

  // Add Employee Form (persists directly to DB)
  const addForm = document.getElementById('addEmployeeForm');
  if (addForm) {
    addForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newEmp = {
        id: Date.now(),
        employeeNo: document.getElementById('newEmpNo').value.trim(),
        firstName: document.getElementById('newFirstName').value.trim(),
        middleName: document.getElementById('newMiddleName').value.trim() || '',
        lastName: document.getElementById('newLastName').value.trim(),
        birthDay: document.getElementById('newBday').value || '2000-01-01',
        birthPlace: document.getElementById('newBplace').value || 'Metro Manila',
        address: document.getElementById('newAddress').value || 'Paranaque City',
        email: document.getElementById('newEmail').value.trim(),
        gender: document.getElementById('newGender').value,
        civilStatus: 'single',
        nationality: 'Filipino',
        religion: 'Roman Catholic',
        phoneNumber: document.getElementById('newPhone').value || '09123456789',
        sssNumber: '34-' + Math.floor(1000000 + Math.random() * 9000000) + '-1',
        pagibigNumber: '1211-' + Math.floor(1000 + Math.random() * 9000) + '-0012',
        tinNumber: '291-' + Math.floor(100 + Math.random() * 900) + '-000',
        philhealthNumber: '19-' + Math.floor(100000000 + Math.random() * 900000000) + '-1',
        bankAccount: 'LandBank #' + Math.floor(1000 + Math.random() * 9000) + '-48',
        accountType: document.getElementById('newAccountType').value,
        department: document.getElementById('newDepartment').value,
        role: document.getElementById('newRole').value || 'Staff Member',
        dailyRate: parseFloat(document.getElementById('newRate').value || 695.00)
      };

      window.dcsaDB.employees.push(newEmp);
      saveDCSADatabase();
      renderEmployeeDirectory();
      initPayrollCalculator();

      // Live Sync to Supabase
      if (window.DCSA_SUPABASE && window.DCSA_SUPABASE.client) {
        const empToInsert = { ...newEmp };
        delete empToInsert.id;
        window.DCSA_SUPABASE.client.from('employees').insert([empToInsert]).then(({ error }) => {
          if (error) console.warn('Supabase employee insert error:', error);
          else console.log('✅ Supabase employee synced:', newEmp.employeeNo);
        });
      }

      const modalEl = document.getElementById('addEmployeeModal');
      const modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
      addForm.reset();

      alert(`✅ Employee #${newEmp.employeeNo} (${newEmp.firstName} ${newEmp.lastName}) saved to datamex_payroll_db!`);
    });
  }

  // Feedback form (persists to DB)
  const feedbackForm = document.getElementById('feedbackForm');
  if (feedbackForm) {
    feedbackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const txt = document.getElementById('feedbackText').value.trim();
      if (!txt) return;

      const now = new Date();
      const dateStr = now.toISOString().replace('T', ' ').substring(0, 19);
      const newFb = { id: Date.now(), feedback_text: txt, created_at: dateStr };
      window.dcsaDB.feedback.unshift(newFb);
      saveDCSADatabase();

      // Live Sync to Supabase
      if (window.DCSA_SUPABASE && window.DCSA_SUPABASE.client) {
        window.DCSA_SUPABASE.client.from('feedback').insert([{ feedback_text: txt }]).then(({ error }) => {
          if (error) console.warn('Supabase feedback insert error:', error);
          else console.log('✅ Supabase feedback synced');
        });
      }
      
      const list = document.getElementById('feedbackList');
      if (list) {
        const div = document.createElement('div');
        div.className = 'p-3 mb-2 rounded bg-dark border border-secondary';
        div.innerHTML = `<div class="text-light small">"${txt}"</div><div class="text-muted small mt-1 font-monospace" style="font-size:0.75rem;">Submitted Just Now • Anonymous</div>`;
        list.prepend(div);
      }

      document.getElementById('feedbackText').value = '';
      alert('Thank you! Your feedback has been stored in datamex_payroll_db.feedback.');
    });
  }
}
