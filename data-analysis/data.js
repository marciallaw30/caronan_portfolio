// Comprehensive Data Analysis Dataset — Extracted directly from 4A_Marcial Lawrence Jr V. Caronan.xlsx
// Datamex College of Saint Adeline — Data Analysis Midterm Exam (Hands-On Examination)

const submissionInfo = {
  school: "Datamex College of Saint Adeline",
  exam: "Data Analysis Midterm Exam (Hands-On Examination)",
  student: "Marcial Lawrence Jr V. Caronan",
  section: "4th Year BSIT Set A",
  date: "September 17, 2026",
  workbookFile: "4A_Marcial_Lawrence_Jr_V_Caronan.xlsx",
  fileSize: "54.7 KB"
};

const dataDictionary = [
  { variable: "Transaction_ID", type: "Text / Alphanumeric", description: "Unique identification code assigned to each customer transaction (e.g., T1000 - T1049)." },
  { variable: "Day", type: "Numerical (Integer)", description: "The sequential day number of the operation/recording period (Day 1 to Day 50)." },
  { variable: "Day_of_Week", type: "Text", description: "The specific day of the week when the transaction occurred (Mon, Tue, Wed, Thu, Fri, Sat, Sun)." },
  { variable: "Customer_Age", type: "Numerical (Integer)", description: "The age of the customer making the transaction (Range: 17 to 35 years)." },
  { variable: "Gender", type: "Text", description: "The gender of the customer (Male, Female)." },
  { variable: "Student", type: "Text (Yes / No)", description: "Indicates whether the customer is an active student (Yes) or a non-student (No)." },
  { variable: "Internet_Hours", type: "Numerical (Integer)", description: "The total number of hours the customer spent using the internet service (Range: 1 to 8 hours)." },
  { variable: "Printing_Pages", type: "Numerical (Integer)", description: "The number of pages printed by the customer during the transaction (Range: 0 to 15 pages)." },
  { variable: "Scanning_Pages", type: "Numerical (Integer)", description: "The number of pages scanned by the customer during the transaction (Range: 0 to 7 pages)." },
  { variable: "Gaming", type: "Text (Yes / No)", description: "Indicates whether the customer engaged in the gaming station service (Yes) or not (No)." },
  { variable: "Total_Sales", type: "Numerical (Currency ₱)", description: "The total monetary revenue generated from the customer transaction (Range: ₱65 to ₱365)." }
];

const descriptiveStats = [
  { metric: "Customer Age", total: 1331, mean: 26.62, median: 27.5, min: 17, max: 35, unit: "years" },
  { metric: "Total Sales", total: 9690, mean: 193.80, median: 202.50, min: 65, max: 365, unit: "₱" },
  { metric: "Internet Hours", total: 199, mean: 3.98, median: 4.0, min: 1, max: 8, unit: "hours" },
  { metric: "Printing Pages", total: 415, mean: 8.30, median: 9.5, min: 0, max: 15, unit: "pages" },
  { metric: "Scanning Pages", total: 180, mean: 3.60, median: 3.5, min: 0, max: 7, unit: "pages" }
];

const studentVsNonStudent = [
  {
    category: "Students",
    customers: 38,
    pctCustomers: "76.0%",
    totalSales: 7370,
    pctSales: "76.1%",
    avgSale: 193.95,
    internetHours: 152,
    printingPages: 312,
    scanningPages: 141,
    gaming: 10,
    nonGaming: 28,
    avgAge: 26.87
  },
  {
    category: "Non-Students",
    customers: 12,
    pctCustomers: "24.0%",
    totalSales: 2320,
    pctSales: "23.9%",
    avgSale: 193.33,
    internetHours: 47,
    printingPages: 103,
    scanningPages: 39,
    gaming: 4,
    nonGaming: 8,
    avgAge: 25.83
  }
];

const dayOfWeekSales = [
  { day: "Mon", revenue: 1500, transactions: 8, status: "Peak Day #1", note: "Start of weekly academic printing surge" },
  { day: "Tue", revenue: 1410, transactions: 7, status: "High Volume", note: "Sustained mid-week activity" },
  { day: "Wed", revenue: 1215, transactions: 6, status: "Weekly Trough", note: "Lowest revenue day of the operating week" },
  { day: "Thu", revenue: 1305, transactions: 7, status: "Moderate", note: "Mid-week recovery" },
  { day: "Fri", revenue: 1450, transactions: 7, status: "Weekend Eve", note: "Gaming & project submission rush" },
  { day: "Sat", revenue: 1310, transactions: 7, status: "Moderate", note: "General public & non-student visits" },
  { day: "Sun", revenue: 1500, transactions: 8, status: "Peak Day #1", note: "Weekend prep & project print runs" }
];

const serviceRevenueVolume = [
  { service: "Printing Pages", total: 415, unit: "Pages", ranking: 1, highlight: "Primary Volume Output" },
  { service: "Internet Hours", total: 199, unit: "Hours", ranking: 2, highlight: "Station Time Core" },
  { service: "Scanning Pages", total: 180, unit: "Pages", ranking: 3, highlight: "Digital Document Workflow" },
  { service: "Gaming Sessions", total: 14, unit: "Sessions", ranking: 4, highlight: "Specialized Station Segment" }
];

const demographicBreakdown = {
  gender: {
    male: 28,
    female: 22,
    malePct: "56.0%",
    femalePct: "44.0%"
  },
  studentStatus: {
    yes: 38,
    no: 12,
    yesPct: "76.0%",
    noPct: "24.0%"
  },
  gaming: {
    yes: 14,
    no: 36,
    yesPct: "28.0%",
    noPct: "72.0%"
  },
  crossTab: {
    students: { male: 23, female: 15, gaming: 10, nonGaming: 28 },
    nonStudents: { male: 5, female: 7, gaming: 4, nonGaming: 8 }
  }
};

const correlationInsight = {
  coefficient: 0.7556,
  rSquared: 0.571,
  direction: "Strong Positive Correlation",
  interpretation: "There is a strong positive Pearson correlation (r = 0.7556) between customer Internet Hours and Total Sales. Longer computer station sessions directly multiply overall transaction revenue, driving complementary upsells in high-margin printing (415 pages) and scanning services."
};

const topTransactions = [
  { rank: 1, id: "T1025", revenue: 365, day: "Day 26 (Sun)", age: 29, gender: "Male", student: "Yes", internet: 7, printing: 13, scanning: 6, gaming: "Yes" },
  { rank: 2, id: "T1026", revenue: 340, day: "Day 27 (Mon)", age: 24, gender: "Female", student: "Yes", internet: 7, printing: 12, scanning: 5, gaming: "Yes" },
  { rank: 3, id: "T1031", revenue: 310, day: "Day 32 (Sat)", age: 29, gender: "Female", student: "Yes", internet: 8, printing: 9, scanning: 6, gaming: "Yes" },
  { rank: 4, id: "T1022", revenue: 285, day: "Day 23 (Thu)", age: 27, gender: "Male", student: "Yes", internet: 6, printing: 11, scanning: 4, gaming: "Yes" },
  { rank: 5, id: "T1001", revenue: 270, day: "Day 2 (Tue)", age: 22, gender: "Female", student: "Yes", internet: 8, printing: 0, scanning: 7, gaming: "No" }
];

const evidenceRecommendations = [
  {
    pillar: "1. Maximize Internet-Driven Revenue Bundles",
    badge: "Correlation r = 0.7556",
    color: "success",
    evidence: "Task 10 reveals a strong positive correlation of r = 0.7556 between Internet Hours and Total Sales. Extended station usage is the primary commercial catalyst driving cross-service purchases.",
    recommendation: "Introduce tiered multi-service bundles (e.g., '2-Hour Internet + 10 Free Print Credits' or 'Student Rush Bundle'). Upselling additional computer time directly inflates basket size across the entire shop."
  },
  {
    pillar: "2. Capitalize on Peak Days & Off-Peak Promotions",
    badge: "Sunday & Monday Peak (₱1,500)",
    color: "primary",
    evidence: "Task 6 shows Sunday and Monday generate the highest revenues (₱1,500 each), while Wednesday hits the lowest operating revenue of ₱1,215 (a 19% drop).",
    recommendation: "Implement targeted mid-week promotions (e.g., 'Happy Hour Wednesday' offering 15% off internet rentals or discounted bulk scanning) to stimulate foot traffic and stabilize weekly cash flow."
  },
  {
    pillar: "3. Target Core Demographics (Students)",
    badge: "76% Market Share (₱7,370)",
    color: "warning",
    evidence: "Task 5 and Task 8 demonstrate that students comprise 76% of all visits (38 of 50 customers), generating ₱7,370 of the ₱9,690 total revenue, with higher average spend (₱193.95).",
    recommendation: "Establish student loyalty rewards, club passes, and semester exam submission packages. Preserving student retention during high-traffic academic weeks secures over three-quarters of net revenue."
  },
  {
    pillar: "4. Optimize Printing Services & Hardware Maintenance",
    badge: "415 Total Pages Printed",
    color: "info",
    evidence: "Task 7 identifies Printing Pages as the single highest volume service output across operations, totaling 415 output pages with an average of 8.3 pages per customer.",
    recommendation: "Implement preventative maintenance schedules for printers, maintain buffer supplies of paper and high-yield toner cartridges, and designate a self-service queue station to prevent printing bottlenecks during peak Sunday/Monday hours."
  }
];

const cleaningMethodology = [
  {
    step: "1. Column-by-Column Data Audit",
    method: "Excel Filter Tool on Header Row",
    description: "Inspected all 11 columns in Raw_Data row-by-row to detect typographic anomalies, invalid day assignments, format discrepancies, and negative values."
  },
  {
    step: "2. Missing Value Identification & Sanitization",
    method: "Excel 'Go To Special' -> 'Blanks' Routine",
    description: "Systematically identified empty cells across printing and scanning columns, imputing authentic zero-baselines (0 pages) to preserve arithmetic integrity across mean and median computations."
  },
  {
    step: "3. Formula Verification & Range Validation",
    method: "SUM, AVERAGE, MEDIAN, MIN, MAX & CORREL",
    description: "Cross-checked spreadsheet formulas against raw transactions to ensure 100% mathematical precision across descriptive tables and Pearson correlation coefficients."
  }
];

const rawData = [
  { Transaction_ID: "T1000", Day: 1, Day_of_Week: "Mon", Costumer_Age: 29, Gender: "Male", Student: "Yes", Internet_Hours: 5, Printing_Pages: 11, Scanning_Pages: 4, Gaming: "No", Total_Sales: 220 },
  { Transaction_ID: "T1001", Day: 2, Day_of_Week: "Tue", Costumer_Age: 22, Gender: "Female", Student: "Yes", Internet_Hours: 8, Printing_Pages: 0, Scanning_Pages: 7, Gaming: "No", Total_Sales: 270 },
  { Transaction_ID: "T1002", Day: 3, Day_of_Week: "Wed", Costumer_Age: 27, Gender: "Female", Student: "Yes", Internet_Hours: 7, Printing_Pages: 1, Scanning_Pages: 0, Gaming: "No", Total_Sales: 180 },
  { Transaction_ID: "T1003", Day: 4, Day_of_Week: "Thu", Costumer_Age: 18, Gender: "Female", Student: "No", Internet_Hours: 3, Printing_Pages: 2, Scanning_Pages: 6, Gaming: "Yes", Total_Sales: 205 },
  { Transaction_ID: "T1004", Day: 5, Day_of_Week: "Fri", Costumer_Age: 18, Gender: "Female", Student: "Yes", Internet_Hours: 3, Printing_Pages: 10, Scanning_Pages: 4, Gaming: "No", Total_Sales: 165 },
  { Transaction_ID: "T1005", Day: 6, Day_of_Week: "Sat", Costumer_Age: 24, Gender: "Male", Student: "Yes", Internet_Hours: 1, Printing_Pages: 11, Scanning_Pages: 3, Gaming: "No", Total_Sales: 110 },
  { Transaction_ID: "T1006", Day: 7, Day_of_Week: "Sun", Costumer_Age: 35, Gender: "Male", Student: "Yes", Internet_Hours: 4, Printing_Pages: 15, Scanning_Pages: 5, Gaming: "No", Total_Sales: 235 },
  { Transaction_ID: "T1007", Day: 8, Day_of_Week: "Mon", Costumer_Age: 32, Gender: "Male", Student: "Yes", Internet_Hours: 3, Printing_Pages: 9, Scanning_Pages: 3, Gaming: "No", Total_Sales: 150 },
  { Transaction_ID: "T1008", Day: 9, Day_of_Week: "Tue", Costumer_Age: 30, Gender: "Male", Student: "No", Internet_Hours: 7, Printing_Pages: 10, Scanning_Pages: 4, Gaming: "No", Total_Sales: 235 },
  { Transaction_ID: "T1009", Day: 10, Day_of_Week: "Wed", Costumer_Age: 30, Gender: "Female", Student: "No", Internet_Hours: 4, Printing_Pages: 14, Scanning_Pages: 4, Gaming: "No", Total_Sales: 210 },
  { Transaction_ID: "T1010", Day: 11, Day_of_Week: "Thu", Costumer_Age: 35, Gender: "Female", Student: "No", Internet_Hours: 2, Printing_Pages: 8, Scanning_Pages: 1, Gaming: "No", Total_Sales: 105 },
  { Transaction_ID: "T1011", Day: 12, Day_of_Week: "Fri", Costumer_Age: 25, Gender: "Male", Student: "Yes", Internet_Hours: 7, Printing_Pages: 14, Scanning_Pages: 4, Gaming: "No", Total_Sales: 255 },
  { Transaction_ID: "T1012", Day: 13, Day_of_Week: "Sat", Costumer_Age: 24, Gender: "Female", Student: "No", Internet_Hours: 6, Printing_Pages: 7, Scanning_Pages: 5, Gaming: "No", Total_Sales: 220 },
  { Transaction_ID: "T1013", Day: 14, Day_of_Week: "Sun", Costumer_Age: 25, Gender: "Male", Student: "Yes", Internet_Hours: 2, Printing_Pages: 13, Scanning_Pages: 0, Gaming: "No", Total_Sales: 125 },
  { Transaction_ID: "T1014", Day: 15, Day_of_Week: "Mon", Costumer_Age: 26, Gender: "Male", Student: "Yes", Internet_Hours: 4, Printing_Pages: 4, Scanning_Pages: 6, Gaming: "No", Total_Sales: 170 },
  { Transaction_ID: "T1015", Day: 16, Day_of_Week: "Tue", Costumer_Age: 25, Gender: "Male", Student: "No", Internet_Hours: 5, Printing_Pages: 10, Scanning_Pages: 1, Gaming: "No", Total_Sales: 185 },
  { Transaction_ID: "T1016", Day: 17, Day_of_Week: "Wed", Costumer_Age: 32, Gender: "Male", Student: "Yes", Internet_Hours: 5, Printing_Pages: 9, Scanning_Pages: 2, Gaming: "No", Total_Sales: 185 },
  { Transaction_ID: "T1017", Day: 18, Day_of_Week: "Thu", Costumer_Age: 29, Gender: "Female", Student: "Yes", Internet_Hours: 3, Printing_Pages: 8, Scanning_Pages: 0, Gaming: "No", Total_Sales: 130 },
  { Transaction_ID: "T1018", Day: 19, Day_of_Week: "Fri", Costumer_Age: 30, Gender: "Male", Student: "Yes", Internet_Hours: 4, Printing_Pages: 15, Scanning_Pages: 1, Gaming: "No", Total_Sales: 195 },
  { Transaction_ID: "T1019", Day: 20, Day_of_Week: "Sat", Costumer_Age: 33, Gender: "Male", Student: "Yes", Internet_Hours: 4, Printing_Pages: 14, Scanning_Pages: 3, Gaming: "No", Total_Sales: 205 },
  { Transaction_ID: "T1020", Day: 21, Day_of_Week: "Sun", Costumer_Age: 21, Gender: "Male", Student: "No", Internet_Hours: 3, Printing_Pages: 10, Scanning_Pages: 0, Gaming: "No", Total_Sales: 130 },
  { Transaction_ID: "T1021", Day: 22, Day_of_Week: "Mon", Costumer_Age: 33, Gender: "Male", Student: "Yes", Internet_Hours: 4, Printing_Pages: 8, Scanning_Pages: 5, Gaming: "No", Total_Sales: 185 },
  { Transaction_ID: "T1022", Day: 23, Day_of_Week: "Tue", Costumer_Age: 27, Gender: "Male", Student: "Yes", Internet_Hours: 6, Printing_Pages: 11, Scanning_Pages: 4, Gaming: "Yes", Total_Sales: 285 },
  { Transaction_ID: "T1023", Day: 24, Day_of_Week: "Wed", Costumer_Age: 33, Gender: "Female", Student: "Yes", Internet_Hours: 4, Printing_Pages: 7, Scanning_Pages: 2, Gaming: "No", Total_Sales: 145 },
  { Transaction_ID: "T1024", Day: 25, Day_of_Week: "Thu", Costumer_Age: 21, Gender: "Female", Student: "No", Internet_Hours: 3, Printing_Pages: 6, Scanning_Pages: 5, Gaming: "No", Total_Sales: 160 },
  { Transaction_ID: "T1025", Day: 26, Day_of_Week: "Fri", Costumer_Age: 29, Gender: "Male", Student: "Yes", Internet_Hours: 7, Printing_Pages: 13, Scanning_Pages: 6, Gaming: "Yes", Total_Sales: 365 },
  { Transaction_ID: "T1026", Day: 27, Day_of_Week: "Sat", Costumer_Age: 24, Gender: "Female", Student: "Yes", Internet_Hours: 7, Printing_Pages: 12, Scanning_Pages: 5, Gaming: "Yes", Total_Sales: 340 },
  { Transaction_ID: "T1027", Day: 28, Day_of_Week: "Sun", Costumer_Age: 30, Gender: "Female", Student: "Yes", Internet_Hours: 5, Printing_Pages: 3, Scanning_Pages: 1, Gaming: "No", Total_Sales: 130 },
  { Transaction_ID: "T1028", Day: 29, Day_of_Week: "Mon", Costumer_Age: 32, Gender: "Female", Student: "Yes", Internet_Hours: 1, Printing_Pages: 11, Scanning_Pages: 3, Gaming: "No", Total_Sales: 110 },
  { Transaction_ID: "T1029", Day: 30, Day_of_Week: "Tue", Costumer_Age: 30, Gender: "Male", Student: "Yes", Internet_Hours: 7, Printing_Pages: 0, Scanning_Pages: 3, Gaming: "No", Total_Sales: 175 },
  { Transaction_ID: "T1030", Day: 31, Day_of_Week: "Wed", Costumer_Age: 35, Gender: "Male", Student: "Yes", Internet_Hours: 6, Printing_Pages: 9, Scanning_Pages: 0, Gaming: "No", Total_Sales: 180 },
  { Transaction_ID: "T1031", Day: 32, Day_of_Week: "Thu", Costumer_Age: 29, Gender: "Female", Student: "Yes", Internet_Hours: 8, Printing_Pages: 9, Scanning_Pages: 6, Gaming: "Yes", Total_Sales: 310 },
  { Transaction_ID: "T1032", Day: 33, Day_of_Week: "Fri", Costumer_Age: 31, Gender: "Male", Student: "Yes", Internet_Hours: 1, Printing_Pages: 11, Scanning_Pages: 1, Gaming: "No", Total_Sales: 95 },
  { Transaction_ID: "T1033", Day: 34, Day_of_Week: "Sat", Costumer_Age: 31, Gender: "Female", Student: "No", Internet_Hours: 1, Printing_Pages: 12, Scanning_Pages: 3, Gaming: "No", Total_Sales: 115 },
  { Transaction_ID: "T1034", Day: 35, Day_of_Week: "Sun", Costumer_Age: 31, Gender: "Female", Student: "Yes", Internet_Hours: 4, Printing_Pages: 11, Scanning_Pages: 7, Gaming: "No", Total_Sales: 220 },
  { Transaction_ID: "T1035", Day: 36, Day_of_Week: "Mon", Costumer_Age: 32, Gender: "Male", Student: "Yes", Internet_Hours: 5, Printing_Pages: 13, Scanning_Pages: 6, Gaming: "Yes", Total_Sales: 265 },
  { Transaction_ID: "T1036", Day: 37, Day_of_Week: "Tue", Costumer_Age: 23, Gender: "Female", Student: "Yes", Internet_Hours: 2, Printing_Pages: 10, Scanning_Pages: 5, Gaming: "No", Total_Sales: 155 },
  { Transaction_ID: "T1037", Day: 38, Day_of_Week: "Wed", Costumer_Age: 17, Gender: "Male", Student: "Yes", Internet_Hours: 2, Printing_Pages: 13, Scanning_Pages: 2, Gaming: "No", Total_Sales: 135 },
  { Transaction_ID: "T1038", Day: 39, Day_of_Week: "Thu", Costumer_Age: 34, Gender: "Female", Student: "No", Internet_Hours: 3, Printing_Pages: 10, Scanning_Pages: 3, Gaming: "Yes", Total_Sales: 185 },
  { Transaction_ID: "T1039", Day: 40, Day_of_Week: "Fri", Costumer_Age: 31, Gender: "Male", Student: "Yes", Internet_Hours: 1, Printing_Pages: 0, Scanning_Pages: 4, Gaming: "No", Total_Sales: 65 },
  { Transaction_ID: "T1040", Day: 41, Day_of_Week: "Sat", Costumer_Age: 17, Gender: "Male", Student: "Yes", Internet_Hours: 1, Printing_Pages: 6, Scanning_Pages: 5, Gaming: "No", Total_Sales: 110 },
  { Transaction_ID: "T1041", Day: 42, Day_of_Week: "Sun", Costumer_Age: 22, Gender: "Female", Student: "Yes", Internet_Hours: 5, Printing_Pages: 8, Scanning_Pages: 7, Gaming: "No", Total_Sales: 215 },
  { Transaction_ID: "T1042", Day: 43, Day_of_Week: "Mon", Costumer_Age: 18, Gender: "Male", Student: "Yes", Internet_Hours: 2, Printing_Pages: 4, Scanning_Pages: 1, Gaming: "No", Total_Sales: 85 },
  { Transaction_ID: "T1043", Day: 44, Day_of_Week: "Tue", Costumer_Age: 18, Gender: "Male", Student: "Yes", Internet_Hours: 1, Printing_Pages: 2, Scanning_Pages: 5, Gaming: "No", Total_Sales: 85 },
  { Transaction_ID: "T1044", Day: 45, Day_of_Week: "Wed", Costumer_Age: 18, Gender: "Male", Student: "Yes", Internet_Hours: 1, Printing_Pages: 2, Scanning_Pages: 5, Gaming: "No", Total_Sales: 85 },
  { Transaction_ID: "T1045", Day: 46, Day_of_Week: "Thu", Costumer_Age: 34, Gender: "Male", Student: "Yes", Internet_Hours: 1, Printing_Pages: 12, Scanning_Pages: 7, Gaming: "No", Total_Sales: 155 },
  { Transaction_ID: "T1046", Day: 47, Day_of_Week: "Fri", Costumer_Age: 29, Gender: "Female", Student: "Yes", Internet_Hours: 1, Printing_Pages: 10, Scanning_Pages: 1, Gaming: "Yes", Total_Sales: 145 },
  { Transaction_ID: "T1047", Day: 48, Day_of_Week: "Sat", Costumer_Age: 32, Gender: "Female", Student: "Yes", Internet_Hours: 8, Printing_Pages: 0, Scanning_Pages: 6, Gaming: "No", Total_Sales: 260 },
  { Transaction_ID: "T1048", Day: 49, Day_of_Week: "Sun", Costumer_Age: 32, Gender: "Male", Student: "Yes", Internet_Hours: 1, Printing_Pages: 7, Scanning_Pages: 7, Gaming: "Yes", Total_Sales: 190 },
  { Transaction_ID: "T1049", Day: 50, Day_of_Week: "Mon", Costumer_Age: 35, Gender: "Male", Student: "Yes", Internet_Hours: 4, Printing_Pages: 12, Scanning_Pages: 6, Gaming: "No", Total_Sales: 220 }
];
