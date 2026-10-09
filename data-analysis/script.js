document.addEventListener('DOMContentLoaded', () => {
    try {
        // Use rawData from data.js to bypass file:// CORS policy
        const data = typeof rawData !== 'undefined' ? rawData : [];
        if (data.length === 0) throw new Error("Data not loaded");
        
        // Populate KPIs
        document.getElementById('kpi-total-transactions').innerText = data.length;
        
        let totalRevenue = 0;
        let totalInternetHours = 0;
        let studentCount = 0;
        let maleRevenue = 0;
        let femaleRevenue = 0;
        let gamingRevenue = 0;
        let nonGamingRevenue = 0;
        
        let totalPrinting = 0;
        let totalScanning = 0;
        
        const days = [];
        const salesData = [];
        
        const tableBody = document.querySelector('#dataTable tbody');
        
        data.forEach(row => {
            const sales = parseFloat(row.Total_Sales) || 0;
            const internetHrs = parseFloat(row.Internet_Hours) || 0;
            const isStudent = row.Student === 'Yes';
            const printing = parseFloat(row.Printing_Pages) || 0;
            const scanning = parseFloat(row.Scanning_Pages) || 0;
            const isGamer = row.Gaming === 'Yes';
            
            totalRevenue += sales;
            totalInternetHours += internetHrs;
            if (isStudent) studentCount++;
            
            if (row.Gender === 'Male') maleRevenue += sales;
            else femaleRevenue += sales;
            
            if (isGamer) gamingRevenue += sales;
            else nonGamingRevenue += sales;
            
            totalPrinting += printing;
            totalScanning += scanning;
            
            days.push(`Day ${row.Day}`);
            salesData.push(sales);
            
            // Populate Table
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><span class="badge bg-secondary">${row.Transaction_ID}</span></td>
                <td>Day ${row.Day} <small class="text-muted">(${row.Day_of_Week})</small></td>
                <td>${row.Costumer_Age}</td>
                <td>${row.Gender === 'Male' ? '<i class="bi bi-gender-male text-info"></i>' : '<i class="bi bi-gender-female text-danger"></i>'} ${row.Gender}</td>
                <td>${isStudent ? '<span class="badge bg-success">Yes</span>' : '<span class="badge bg-dark border border-secondary">No</span>'}</td>
                <td>${internetHrs} hrs</td>
                <td>${printing}</td>
                <td>${scanning}</td>
                <td>${isGamer ? '<i class="bi bi-controller text-warning"></i>' : '-'}</td>
                <td class="fw-bold text-success">₱${sales}</td>
            `;
            tableBody.appendChild(tr);
        });
        
        // Update KPIs
        document.getElementById('kpi-total-revenue').innerText = `₱${totalRevenue.toLocaleString()}`;
        document.getElementById('kpi-avg-hours').innerText = (totalInternetHours / data.length).toFixed(1) + ' hrs';
        document.getElementById('kpi-student-ratio').innerText = Math.round((studentCount / data.length) * 100) + '%';
        
        // Configure Chart Defaults
        Chart.defaults.color = '#94a3b8';
        Chart.defaults.borderColor = 'rgba(255,255,255,0.05)';
        Chart.defaults.font.family = 'Inter, sans-serif';
        
        // 1. Sales Trend Chart (Line)
        new Chart(document.getElementById('salesChart'), {
            type: 'line',
            data: {
                labels: days,
                datasets: [{
                    label: 'Daily Revenue (₱)',
                    data: salesData,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#10b981'
                }]
            },
            options: { responsive: true, plugins: { legend: { display: false } } }
        });
        
        // 2. Gender Revenue (Doughnut)
        new Chart(document.getElementById('genderChart'), {
            type: 'doughnut',
            data: {
                labels: ['Male', 'Female'],
                datasets: [{
                    data: [maleRevenue, femaleRevenue],
                    backgroundColor: ['#3b82f6', '#ec4899'],
                    borderWidth: 0
                }]
            },
            options: { responsive: true, cutout: '70%' }
        });
        
        // 3. Gamers vs Non-Gamers (Bar)
        new Chart(document.getElementById('gamingChart'), {
            type: 'bar',
            data: {
                labels: ['Gamers', 'Non-Gamers'],
                datasets: [{
                    label: 'Total Revenue (₱)',
                    data: [gamingRevenue, nonGamingRevenue],
                    backgroundColor: ['#f59e0b', '#64748b'],
                    borderRadius: 6
                }]
            },
            options: { responsive: true, plugins: { legend: { display: false } } }
        });
        
        // 4. Services Volume (Pie)
        new Chart(document.getElementById('servicesChart'), {
            type: 'pie',
            data: {
                labels: ['Internet Hours', 'Printing Pages', 'Scanning Pages'],
                datasets: [{
                    data: [totalInternetHours, totalPrinting, totalScanning],
                    backgroundColor: ['#10b981', '#8b5cf6', '#06b6d4'],
                    borderWidth: 0
                }]
            },
            options: { responsive: true }
        });
        
    } catch (error) {
        console.error("Error loading JSON data:", error);
        document.querySelector('.table-container').innerHTML = '<div class="alert alert-danger">Failed to load JSON data. Ensure you are running this on a local server.</div>';
    }
});
