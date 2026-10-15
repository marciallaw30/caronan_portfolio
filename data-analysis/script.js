document.addEventListener('DOMContentLoaded', () => {
  try {
    // 1. Populate Header & Metadata
    if (typeof submissionInfo !== 'undefined') {
      const studentTag = document.getElementById('meta-student');
      const schoolTag = document.getElementById('meta-school');
      const examTag = document.getElementById('meta-exam');
      const dateTag = document.getElementById('meta-date');
      if (studentTag) studentTag.textContent = submissionInfo.student;
      if (schoolTag) schoolTag.textContent = submissionInfo.school;
      if (examTag) examTag.textContent = submissionInfo.exam;
      if (dateTag) dateTag.textContent = submissionInfo.date;
    }

    // 2. Populate KPIs
    if (typeof descriptiveStats !== 'undefined' && typeof studentVsNonStudent !== 'undefined') {
      const salesStat = descriptiveStats.find(s => s.metric === "Total Sales");
      const hrsStat = descriptiveStats.find(s => s.metric === "Internet Hours");
      const printStat = descriptiveStats.find(s => s.metric === "Printing Pages");
      const scanStat = descriptiveStats.find(s => s.metric === "Scanning Pages");

      const kpiTx = document.getElementById('kpi-total-transactions');
      const kpiRev = document.getElementById('kpi-total-revenue');
      const kpiAvg = document.getElementById('kpi-avg-sales');
      const kpiHrs = document.getElementById('kpi-avg-hours');
      const kpiPrint = document.getElementById('kpi-total-printing');
      const kpiScan = document.getElementById('kpi-total-scanning');
      const kpiStud = document.getElementById('kpi-student-share');
      const kpiCorrel = document.getElementById('kpi-correlation');

      if (kpiTx) kpiTx.textContent = rawData.length;
      if (kpiRev && salesStat) kpiRev.textContent = `₱${salesStat.total.toLocaleString()}`;
      if (kpiAvg && salesStat) kpiAvg.textContent = `₱${salesStat.mean.toFixed(2)}`;
      if (kpiHrs && hrsStat) kpiHrs.textContent = `${hrsStat.mean.toFixed(2)} hrs`;
      if (kpiPrint && printStat) kpiPrint.textContent = `${printStat.total.toLocaleString()} pgs`;
      if (kpiScan && scanStat) kpiScan.textContent = `${scanStat.total.toLocaleString()} pgs`;
      if (kpiStud) kpiStud.textContent = studentVsNonStudent[0].pctCustomers;
      if (kpiCorrel && typeof correlationInsight !== 'undefined') kpiCorrel.textContent = `r = ${correlationInsight.coefficient}`;
    }

    // 3. Populate Descriptive Statistics Table (Task 3 & 4)
    const descTbody = document.querySelector('#descStatsTable tbody');
    if (descTbody && typeof descriptiveStats !== 'undefined') {
      descTbody.innerHTML = '';
      descriptiveStats.forEach(st => {
        const tr = document.createElement('tr');
        const prefix = st.unit === '₱' ? '₱' : '';
        const suffix = st.unit !== '₱' ? ` ${st.unit}` : '';
        tr.innerHTML = `
          <td class="fw-bold text-white"><i class="bi bi-calculator text-success me-2"></i>${st.metric}</td>
          <td class="text-info fw-semibold">${prefix}${st.total.toLocaleString()}${suffix}</td>
          <td class="text-success fw-bold">${prefix}${st.mean.toFixed(2)}${suffix}</td>
          <td class="text-light">${prefix}${st.median.toFixed(2)}${suffix}</td>
          <td class="text-muted">${prefix}${st.min}${suffix}</td>
          <td class="text-warning fw-semibold">${prefix}${st.max}${suffix}</td>
        `;
        descTbody.appendChild(tr);
      });
    }

    // 4. Populate Student vs Non-Student Table (Task 5)
    const segTbody = document.querySelector('#segmentationTable tbody');
    if (segTbody && typeof studentVsNonStudent !== 'undefined') {
      segTbody.innerHTML = '';
      studentVsNonStudent.forEach(seg => {
        const isStudent = seg.category === 'Students';
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="fw-bold ${isStudent ? 'text-success' : 'text-light'}">
            <i class="bi ${isStudent ? 'bi-mortarboard-fill text-success' : 'bi-person-fill text-muted'} me-2"></i>${seg.category}
          </td>
          <td class="fw-bold text-center fs-6">${seg.customers}</td>
          <td class="fw-bold text-success text-center fs-6">₱${seg.totalSales.toLocaleString()}</td>
          <td class="fw-semibold text-center">₱${seg.avgSale.toFixed(2)}</td>
          <td class="text-center">${seg.internetHours}</td>
          <td class="text-center">${seg.printingPages}</td>
          <td class="text-center">${seg.scanningPages}</td>
          <td class="text-center"><span class="text-warning fw-bold">${seg.gaming}</span> (Gaming) / <span class="text-muted">${seg.nonGaming}</span></td>
          <td class="text-center">${seg.avgAge.toFixed(2)}</td>
        `;
        segTbody.appendChild(tr);
      });
    }

    // 5. Populate Day of Week Table (Task 6)
    const dowTbody = document.querySelector('#dayOfWeekTable tbody');
    if (dowTbody && typeof dayOfWeekSales !== 'undefined') {
      dowTbody.innerHTML = '';
      dayOfWeekSales.forEach(d => {
        const isPeak = d.status.includes('Peak');
        const isLow = d.status.includes('Trough');
        const badgeClass = isPeak ? 'bg-success' : (isLow ? 'bg-danger' : 'bg-secondary');
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="fw-bold text-white">${d.day}</td>
          <td class="fw-bold text-success">₱${d.revenue.toLocaleString()}</td>
          <td>${d.transactions}</td>
          <td><span class="badge ${badgeClass}">${d.status}</span></td>
          <td class="text-muted small">${d.note}</td>
        `;
        dowTbody.appendChild(tr);
      });
    }

    // 6. Populate Top 5 Transactions Table (Task 11 matching Excel Screenshot)
    const topTbody = document.querySelector('#topTxTable tbody');
    if (topTbody && typeof topTransactions !== 'undefined') {
      topTbody.innerHTML = '';
      topTransactions.forEach(t => {
        const tr = document.createElement('tr');
        const medal = t.rank === 1 ? '🥇' : (t.rank === 2 ? '🥈' : (t.rank === 3 ? '🥉' : ''));
        tr.innerHTML = `
          <td class="fw-bold">${medal} ${t.rank}</td>
          <td><span class="badge bg-dark border border-success text-success font-monospace fs-6 px-3 py-1">${t.id}</span></td>
          <td class="fw-bold text-success fs-5">₱${t.revenue}</td>
        `;
        topTbody.appendChild(tr);
      });
    }

    // 7. Populate Recommendations Cards (Task 12)
    const recContainer = document.getElementById('recommendationsContainer');
    if (recContainer && typeof evidenceRecommendations !== 'undefined') {
      recContainer.innerHTML = '';
      evidenceRecommendations.forEach(r => {
        const col = document.createElement('div');
        col.className = 'col-lg-6';
        col.innerHTML = `
          <div class="stat-card h-100 text-start p-4" style="border-left: 4px solid var(--accent-green);">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="fw-bold text-white mb-0">${r.pillar}</h5>
              <span class="badge bg-${r.color} text-uppercase px-3 py-1" style="font-size: 0.75rem;">${r.badge}</span>
            </div>
            <div class="p-3 rounded mb-3" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);">
              <div class="small fw-bold text-info mb-1"><i class="bi bi-search me-1"></i> Empirical Evidence:</div>
              <p class="small text-muted mb-0">${r.evidence}</p>
            </div>
            <div>
              <div class="small fw-bold text-success mb-1"><i class="bi bi-lightbulb-fill me-1"></i> Strategic Action:</div>
              <p class="text-light mb-0" style="line-height: 1.6;">${r.recommendation}</p>
            </div>
          </div>
        `;
        recContainer.appendChild(col);
      });
    }

    // 8. Populate Data Dictionary Table
    const dictTbody = document.querySelector('#dataDictTable tbody');
    if (dictTbody && typeof dataDictionary !== 'undefined') {
      dictTbody.innerHTML = '';
      dataDictionary.forEach(d => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="fw-bold text-info font-monospace">${d.variable}</td>
          <td><span class="badge bg-secondary">${d.type}</span></td>
          <td class="text-light">${d.description}</td>
        `;
        dictTbody.appendChild(tr);
      });
    }

    // 9. Populate Cleaning Methodology
    const cleanContainer = document.getElementById('cleaningStepsContainer');
    if (cleanContainer && typeof cleaningMethodology !== 'undefined') {
      cleanContainer.innerHTML = '';
      cleaningMethodology.forEach(c => {
        const div = document.createElement('div');
        div.className = 'col-md-4';
        div.innerHTML = `
          <div class="stat-card h-100 text-start p-3">
            <h6 class="fw-bold text-success mb-2">${c.step}</h6>
            <div class="badge bg-dark border border-secondary text-light mb-2 font-monospace">${c.method}</div>
            <p class="small text-muted mb-0">${c.description}</p>
          </div>
        `;
        cleanContainer.appendChild(div);
      });
    }

    // 10. Charts Configuration
    Chart.defaults.color = '#cbd5e1';
    Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.08)';
    Chart.defaults.font.family = 'Inter, sans-serif';

    // Chart 1: Sales Trend - Total Revenue by Day of Week (Line) - matches workbook Exam_Tasks chart 1
    const salesCtx = document.getElementById('salesChart');
    if (salesCtx && typeof dayOfWeekSales !== 'undefined') {
      new Chart(salesCtx, {
        type: 'line',
        data: {
          labels: dayOfWeekSales.map(d => d.day),
          datasets: [{
            label: 'Total Revenue',
            data: dayOfWeekSales.map(d => d.revenue),
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            borderWidth: 2.5,
            fill: true,
            tension: 0,
            pointBackgroundColor: '#10b981',
            pointRadius: 5,
            pointHoverRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: ctx => ` ₱${ctx.raw.toLocaleString()} (${dayOfWeekSales[ctx.dataIndex].status})`
              }
            }
          },
          scales: {
            y: { beginAtZero: false, min: 1000, max: 1600, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { callback: v => `₱${v}` } },
            x: { grid: { display: false } }
          }
        }
      });
    }

    // Task 10: Pearson Correlation Scatter Plot (Internet Hours vs Sales)
    const correlCtx = document.getElementById('correlationChart');
    if (correlCtx) {
      new Chart(correlCtx, {
        type: 'scatter',
        data: {
          datasets: [{
            label: 'Customers (Hours vs ₱ Sales)',
            data: rawData.map(r => ({ x: r.Internet_Hours, y: r.Total_Sales })),
            backgroundColor: 'rgba(16, 185, 129, 0.75)',
            borderColor: '#34d399',
            pointRadius: 5,
            pointHoverRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              callbacks: {
                label: (ctx) => ` ${ctx.raw.x} hrs → ₱${ctx.raw.y} (${rawData[ctx.dataIndex].Student === 'Yes' ? 'Student' : 'Non-Student'})`
              }
            }
          },
          scales: {
            x: {
              title: { display: true, text: 'Internet Hours (hrs)', color: '#94a3b8' },
              min: 0,
              max: 9
            },
            y: {
              title: { display: true, text: 'Total Sales (₱)', color: '#94a3b8' },
              ticks: { callback: v => `₱${v}` }
            }
          }
        }
      });
    }


    // Chart 2: Service Usage Totals (Column) - matches workbook Exam_Tasks chart 2
    const serviceCtx = document.getElementById('serviceVolumeChart');
    if (serviceCtx && typeof serviceRevenueVolume !== 'undefined') {
      const order = ['Internet Hours', 'Printing Pages', 'Scanning Pages', 'Gaming Sessions'];
      const svc = order.map(n => serviceRevenueVolume.find(s => s.service === n)).filter(Boolean);
      new Chart(serviceCtx, {
        type: 'bar',
        data: {
          labels: svc.map(s => s.service.replace('Sessions', '').replace('Pages', 'Page').trim()),
          datasets: [{
            label: 'Total',
            data: svc.map(s => s.total),
            backgroundColor: '#3b82f6',
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: ctx => ` ${ctx.raw} ${svc[ctx.dataIndex].unit}` } }
          },
          scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' } },
            x: { grid: { display: false } }
          }
        }
      });
    }

    // Charts 3-5: Students, Gender, Gaming (Pie) - match workbook Exam_Tasks pie charts
    const pieValueLabels = {
      id: 'pieValueLabels',
      afterDatasetsDraw(chart) {
        const { ctx } = chart;
        const meta = chart.getDatasetMeta(0);
        const vals = chart.data.datasets[0].data;
        const total = vals.reduce((a, b) => a + b, 0);
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.font = '600 13px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        meta.data.forEach((arc, i) => {
          const pos = arc.tooltipPosition();
          ctx.fillText(`${vals[i]} (${(vals[i] / total * 100).toFixed(0)}%)`, pos.x, pos.y);
        });
        ctx.restore();
      }
    };
    const makePie = (id, labels, values, colors) => {
      const el = document.getElementById(id);
      if (!el) return;
      new Chart(el, {
        type: 'pie',
        data: { labels, datasets: [{ data: values, backgroundColor: colors, borderColor: '#0b0b1a', borderWidth: 2 }] },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, padding: 12 } } }
        },
        plugins: [pieValueLabels]
      });
    };
    if (typeof demographicBreakdown !== 'undefined') {
      makePie('studentsChart', ['Yes', 'No'], [demographicBreakdown.studentStatus.yes, demographicBreakdown.studentStatus.no], ['#3b82f6', '#f97316']);
      makePie('genderChart', ['Male', 'Female'], [demographicBreakdown.gender.male, demographicBreakdown.gender.female], ['#3b82f6', '#f97316']);
      makePie('gamingChart', ['Yes', 'No'], [demographicBreakdown.gaming.yes, demographicBreakdown.gaming.no], ['#3b82f6', '#f97316']);
    }

    // 11. Interactive Filterable Raw Data Table
    const tableBody = document.querySelector('#rawDataTable tbody');
    const searchInput = document.getElementById('tableSearchInput');
    const filterSelect = document.getElementById('tableFilterSelect');
    const recordCountBadge = document.getElementById('tableRecordCount');

    function renderTable() {
      if (!tableBody) return;
      const search = (searchInput ? searchInput.value : '').toLowerCase().trim();
      const filter = filterSelect ? filterSelect.value : 'all';

      const filtered = rawData.filter(row => {
        // Filter match
        if (filter === 'student' && row.Student !== 'Yes') return false;
        if (filter === 'non-student' && row.Student === 'Yes') return false;
        if (filter === 'gaming' && row.Gaming !== 'Yes') return false;
        if (filter === 'male' && row.Gender !== 'Male') return false;
        if (filter === 'female' && row.Gender !== 'Female') return false;
        if (filter === 'top-sales' && row.Total_Sales < 250) return false;

        // Search match
        if (search) {
          const matchStr = `${row.Transaction_ID} ${row.Day} ${row.Day_of_Week} ${row.Costumer_Age} ${row.Gender} ${row.Total_Sales}`.toLowerCase();
          return matchStr.includes(search);
        }
        return true;
      });

      if (recordCountBadge) {
        recordCountBadge.textContent = `${filtered.length} of ${rawData.length} Records`;
      }

      tableBody.innerHTML = '';
      if (filtered.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="10" class="text-center text-muted py-4">No matching transactions found.</td></tr>`;
        return;
      }

      filtered.forEach(row => {
        const isStudent = row.Student === 'Yes';
        const isGamer = row.Gaming === 'Yes';
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><span class="badge bg-dark border border-secondary font-monospace">${row.Transaction_ID}</span></td>
          <td>Day ${row.Day} <small class="text-muted">(${row.Day_of_Week})</small></td>
          <td>${row.Costumer_Age}</td>
          <td>${row.Gender === 'Male' ? '<i class="bi bi-gender-male text-info me-1"></i>' : '<i class="bi bi-gender-female text-danger me-1"></i>'}${row.Gender}</td>
          <td>${isStudent ? '<span class="badge bg-success-subtle text-success">Yes</span>' : '<span class="badge bg-secondary-subtle text-muted">No</span>'}</td>
          <td>${row.Internet_Hours} hrs</td>
          <td>${row.Printing_Pages}</td>
          <td>${row.Scanning_Pages}</td>
          <td>${isGamer ? '<i class="bi bi-controller text-warning me-1"></i>Yes' : '<span class="text-muted">-</span>'}</td>
          <td class="fw-bold text-success">₱${row.Total_Sales}</td>
        `;
        tableBody.appendChild(tr);
      });
    }

    if (searchInput) searchInput.addEventListener('input', renderTable);
    if (filterSelect) filterSelect.addEventListener('change', renderTable);
    renderTable();

  } catch (err) {
    console.error("Dashboard initialization error:", err);
  }
});
