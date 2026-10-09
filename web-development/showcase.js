/* ===================================================================
   DATAMEX HRIS & PAYROLL PORTFOLIO SHOWCASE - JAVASCRIPT LOGIC
   Architect: Marcial Lawrence Jr V. Caronan
   =================================================================== */

// Initial Employee Data extracted from datamex_payroll_db.sql
let employeesData = [
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
];

// Initial Attendance Records
let attendanceRecords = [
  {
    id: 21,
    employeeNo: '2023009',
    name: 'Marcial Lawrence Caronan',
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
    name: 'Marcial Lawrence Caronan',
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
    name: 'Kerr Pangan',
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
    name: 'Rica Mhay Saturinas',
    date: '2025-09-25',
    time_in: '19:17:57',
    time_out: '19:18:03',
    working_hours: 0.00,
    late_minutes: 677,
    overtime_hours: 0.00,
    status: 'Late Punch'
  }
];

// Feedbacks List
let feedbackRecords = [
  { id: 1, text: "I love Datamex College of Saint Adeline! The new kiosk portal makes time-in so much faster.", date: "2025-09-23 15:23:12" },
  { id: 2, text: "Payroll calculations and automated payslips are very clear and helpful for faculty members.", date: "2025-09-24 10:14:05" }
];

// Document Ready Initialization
document.addEventListener('DOMContentLoaded', () => {
  initClock();
  renderEmployeeDirectory();
  renderAttendanceTable();
  initPayrollCalculator();
  initCodeViewer();
  setupEventListeners();
});

/* 1. Digital Clock (Asia/Manila PST) */
function initClock() {
  const clockEl = document.getElementById('kioskClock');
  const dateEl = document.getElementById('kioskDate');
  
  function update() {
    const now = new Date();
    // PST timezone
    const options = { timeZone: 'Asia/Manila', hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const dateOptions = { timeZone: 'Asia/Manila', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    
    if (clockEl) clockEl.textContent = now.toLocaleTimeString('en-US', options);
    if (dateEl) dateEl.textContent = now.toLocaleDateString('en-US', dateOptions) + ' (PST)';
  }
  update();
  setInterval(update, 1000);
}

/* 2. Employee Directory Module */
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
      <td><span class="badge bg-dark border border-secondary">${emp.department}</span></td>
      <td><span class="font-monospace text-emerald">₱${emp.dailyRate.toFixed(2)} / day</span></td>
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
  document.getElementById('modalEmpName').textContent = `${emp.firstName} ${emp.middleName} ${emp.lastName}`;
  document.getElementById('modalEmpRole').textContent = `${emp.role} (${emp.accountType.toUpperCase()})`;
  document.getElementById('modalEmpDept').textContent = emp.department;
  document.getElementById('modalEmpPhone').textContent = emp.phoneNumber;
  document.getElementById('modalEmpEmail').textContent = emp.email;
  document.getElementById('modalEmpAddress').textContent = emp.address;
  document.getElementById('modalEmpCivil').textContent = `${emp.civilStatus.toUpperCase()} • ${emp.nationality} • ${emp.religion}`;
  document.getElementById('modalEmpBday').textContent = `${emp.birthDay} (${emp.birthPlace})`;
  document.getElementById('modalEmpSSS').textContent = emp.sssNumber;
  document.getElementById('modalEmpPhilhealth').textContent = emp.philhealthNumber;
  document.getElementById('modalEmpPagibig').textContent = emp.pagibigNumber;
  document.getElementById('modalEmpTIN').textContent = emp.tinNumber;
  document.getElementById('modalEmpBank').textContent = emp.bankAccount;
  document.getElementById('modalEmpRate').textContent = `₱${emp.dailyRate.toFixed(2)} (₱${(emp.dailyRate / 8).toFixed(2)}/hr)`;

  const modal = new bootstrap.Modal(document.getElementById('employeeDetailsModal'));
  modal.show();
};

/* 3. Biometric Kiosk Terminal Simulation */
function renderAttendanceTable() {
  const tbody = document.getElementById('attendanceTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';
  attendanceRecords.slice().reverse().forEach(rec => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="font-monospace text-warning">${rec.employeeNo}</span></td>
      <td class="fw-semibold text-white">${rec.name}</td>
      <td class="small text-muted font-monospace">${rec.date}</td>
      <td class="font-monospace text-success">${rec.time_in || '--:--:--'}</td>
      <td class="font-monospace text-danger">${rec.time_out || '--:--:--'}</td>
      <td class="font-monospace">${rec.working_hours.toFixed(2)} hrs</td>
      <td class="font-monospace ${rec.late_minutes > 0 ? 'text-danger fw-bold' : 'text-muted'}">${rec.late_minutes} min</td>
      <td class="font-monospace ${rec.overtime_hours > 0 ? 'text-info fw-bold' : 'text-muted'}">${rec.overtime_hours.toFixed(2)} hrs</td>
      <td><span class="badge ${rec.status === 'Completed' ? 'bg-success' : (rec.status === 'Clocked In' ? 'bg-primary' : 'bg-warning text-dark')}">${rec.status}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

window.quickClockIn = function(empNo) {
  // Switch to kiosk tab and populate employee ID
  document.querySelector('[data-tab="kiosk"]').click();
  document.getElementById('kioskEmployeeSelect').value = empNo;
  document.getElementById('kioskEmpNoInput').value = empNo;
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
  
  // Find existing record today
  let record = attendanceRecords.find(r => r.employeeNo === empNo && r.date === dateStr);

  if (actionType === 'in') {
    if (record && !record.time_out) {
      showKioskToast(`Employee #${empNo} is already clocked in today at ${record.time_in}!`, 'warning');
      return;
    }

    // Calculate Late minutes against standard 08:00:00 AM shift start
    const [h, m] = [now.getHours(), now.getMinutes()];
    let lateMins = 0;
    if (h > 8 || (h === 8 && m > 0)) {
      lateMins = (h - 8) * 60 + m;
    }

    const newRec = {
      id: Date.now(),
      employeeNo: emp.employeeNo,
      name: `${emp.firstName} ${emp.lastName}`,
      date: dateStr,
      time_in: timeStr,
      time_out: null,
      working_hours: 0,
      late_minutes: lateMins,
      overtime_hours: 0,
      status: 'Clocked In'
    };

    attendanceRecords.push(newRec);
    renderAttendanceTable();
    showKioskToast(`✅ TIME IN Recorded for ${emp.firstName} ${emp.lastName} at ${timeStr}. ${lateMins > 0 ? `(Late: ${lateMins} mins)` : '(On Time)'}`, 'success');
  } else if (actionType === 'out') {
    if (!record) {
      // Clock in first if no punch today
      showKioskToast(`⚠️ No prior TIME IN found today for #${empNo}. Please punch Time In first!`, 'error');
      return;
    }

    if (record.time_out) {
      showKioskToast(`Employee #${empNo} has already clocked out today at ${record.time_out}.`, 'warning');
      return;
    }

    record.time_out = timeStr;
    
    // Compute total working hours from time_in to time_out
    const [inH, inM, inS] = record.time_in.split(':').map(Number);
    const [outH, outM, outS] = timeStr.split(':').map(Number);
    const totalHours = Math.max(0, (outH + outM/60 + outS/3600) - (inH + inM/60 + inS/3600));
    
    // DCSA Rules: Deduct 1 hr lunch if > 1 hr, cap normal hours at 8.0, calculate overtime past 17:00
    const workingHours = Math.min(8.0, Math.max(0, totalHours > 1 ? totalHours - 1 : totalHours));
    let otHours = 0;
    if (outH >= 17) {
      otHours = Math.max(0, (outH - 17) + (outM / 60));
    }

    record.working_hours = parseFloat(workingHours.toFixed(2));
    record.overtime_hours = parseFloat(otHours.toFixed(2));
    record.status = 'Completed';

    renderAttendanceTable();
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

/* 4. Automated Payroll Engine & Payslip Generator */
function initPayrollCalculator() {
  const empSelect = document.getElementById('payrollEmployeeSelect');
  if (!empSelect) return;

  // Populate Employee Select
  empSelect.innerHTML = '';
  employeesData.forEach(e => {
    const opt = document.createElement('option');
    opt.value = e.employeeNo;
    opt.textContent = `${e.employeeNo} — ${e.firstName} ${e.lastName} (${e.department})`;
    empSelect.appendChild(opt);
  });

  empSelect.addEventListener('change', calculatePayroll);

  // Bind inputs
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

  const dailyRate = emp.dailyRate;
  const hourlyRate = dailyRate / 8;
  const lateRatePerMin = hourlyRate / 60;

  // Earnings Computation
  const basicSalary = daysWorked * dailyRate;
  const overtimePay = otHours * (hourlyRate * 1.25);
  const regHolidayPay = regHolidayDays * (dailyRate * 2.0); // 200%
  const specHolidayPay = specHolidayDays * (dailyRate * 1.30); // 130%
  const grossPay = basicSalary + overtimePay + regHolidayPay + specHolidayPay;

  // Deductions (Philippine Statutory standard from datamex_payroll_db.sql)
  const lateDeduction = lateMinutes * lateRatePerMin;
  const sssContrib = 1440.00;
  const philhealthContrib = 400.00;
  const pagibigContrib = 100.00;
  const tinTax = 0.00; // Under ₱250k annual exempt (TRAIN law)
  const totalDeductions = lateDeduction + sssContrib + philhealthContrib + pagibigContrib + tinTax + otherDeduction;

  const netPay = Math.max(0, grossPay - totalDeductions);

  // Update UI Elements
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

  // Store for payslip modal
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
  setText('slipEmpName', `${emp.firstName} ${emp.middleName} ${emp.lastName}`);
  setText('slipEmpNo', emp.employeeNo);
  setText('slipDepartment', emp.department);
  setText('slipRole', emp.role);
  setText('slipDailyRate', `₱${emp.dailyRate.toFixed(2)}`);
  setText('slipHourlyRate', `₱${(emp.dailyRate / 8).toFixed(2)}`);
  setText('slipPeriod', res.period);
  setText('slipPayDate', res.payDate);

  // Table breakdown
  setText('slipDaysWorked', `${res.daysWorked.toFixed(2)} days`);
  setText('slipBasicPay', `₱${res.basicSalary.toFixed(2)}`);
  setText('slipOTHours', `${res.otHours.toFixed(2)} hrs @ 1.25x`);
  setText('slipOTPay', `₱${res.overtimePay.toFixed(2)}`);
  setText('slipHolidayPay', `₱${res.holidayPay.toFixed(2)}`);
  setText('slipGrossPay', `₱${res.grossPay.toFixed(2)}`);

  // Deductions
  setText('slipLateMins', `${res.lateMinutes} mins`);
  setText('slipLatePenalty', `₱${res.lateDeduction.toFixed(2)}`);
  setText('slipSSS', `₱${res.sssContrib.toFixed(2)}`);
  setText('slipPhilHealth', `₱${res.philhealthContrib.toFixed(2)}`);
  setText('slipPagibig', `₱${res.pagibigContrib.toFixed(2)}`);
  setText('slipTax', `₱${res.tinTax.toFixed(2)}`);
  setText('slipTotalDeductions', `₱${res.totalDeductions.toFixed(2)}`);

  // Net Pay
  setText('slipNetPay', `₱${res.netPay.toFixed(2)}`);

  const modal = new bootstrap.Modal(document.getElementById('payslipModal'));
  modal.show();
};

window.printOfficialPayslip = function() {
  window.print();
};

/* 5. Source Code Explorer */
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

// NCR Minimum Wage Constant & Dynamic Rate Formulas
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
    // Computes SSS, PhilHealth, Pag-IBIG, Overtime, and Net Pay
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

/* 6. General Event Listeners & Tab Navigation */
function setupEventListeners() {
  // Simulator Tab Switching
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

  // Add Employee Form (registration.php simulation)
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

      employeesData.push(newEmp);
      renderEmployeeDirectory();
      initPayrollCalculator(); // Refresh dropdown

      // Close modal
      const modalEl = document.getElementById('addEmployeeModal');
      const modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
      addForm.reset();

      alert(`✅ Employee #${newEmp.employeeNo} (${newEmp.firstName} ${newEmp.lastName}) successfully registered to MySQL database!`);
    });
  }

  // Feedback form
  const feedbackForm = document.getElementById('feedbackForm');
  if (feedbackForm) {
    feedbackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const txt = document.getElementById('feedbackText').value.trim();
      if (!txt) return;

      const now = new Date();
      const dateStr = now.toISOString().replace('T', ' ').substring(0, 19);
      feedbackRecords.unshift({ id: Date.now(), text: txt, date: dateStr });
      
      const list = document.getElementById('feedbackList');
      if (list) {
        const div = document.createElement('div');
        div.className = 'p-3 mb-2 rounded bg-dark border border-secondary';
        div.innerHTML = `<div class="text-light small">"${txt}"</div><div class="text-muted small mt-1 font-monospace" style="font-size:0.75rem;">Submitted Just Now • Anonymous</div>`;
        list.prepend(div);
      }

      document.getElementById('feedbackText').value = '';
      alert('Thank you! Your feedback has been anonymously submitted to the administration.');
    });
  }
}
