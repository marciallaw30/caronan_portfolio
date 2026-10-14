# CHAPTER 3: RESEARCH METHODOLOGY

This chapter presents the research design, system development methodology, research locale, respondents and sampling technique, research instruments, step-by-step data gathering procedures, detailed hardware and software engineering requirements, system architecture, predictive data logging algorithms, testing procedures, data analysis and statistical treatment, and ethical considerations utilized in the design, development, and implementation of the *IoT-Based Smart Science Laboratory Safety, Access Control, and Incident Prevention System with Offline SMS Notification and Predictive Data Logging*.

---

## 3.1 Research Design

This study utilizes a **quantitative research design**, specifically employing a combined **developmental and descriptive approach**:

1. **Developmental Research Design**: Focuses on the systematic engineering, circuit prototyping, firmware programming, database structuring, and full physical integration of the IoT-based laboratory safety and access control ecosystem. The developmental methodology guides the iterative construction of the embedded hardware modules (ESP32 microcontroller, environmental sensors, biometric scanner, cellular failover, and segregated CCTV) and the software components (backend server, MySQL relational database, and responsive web monitoring dashboard).
2. **Descriptive Research Design**: Focuses on quantitatively evaluating the operational performance, accuracy, response latency, and user acceptability of the developed prototype. Quantitative telemetry data are collected through systematic bench tests (measuring sensor response times, biometric authentication accuracy, and SMS failover dispatch speed) and structured evaluation questionnaires administered to target stakeholders based on the **ISO/IEC 25010 Software Quality Standard**.

---

## 3.2 System / Project Development Methodology

The research team adopted the **Agile Development Methodology** to manage the software and hardware integration lifecycle. The Agile framework is specifically selected because IoT engineering projects involve interdependent physical sensors, communication protocols, and software layers that require continuous bench calibration, rapid feedback loops, and iterative refinement.

```
+-----------------------------------------------------------------------------------+
|                           AGILE DEVELOPMENT SPRINTS                               |
+-----------------------------------------------------------------------------------+
|  Sprint 1: Requirement Analysis & Architectural Planning                         |
|  Sprint 2: Hardware Circuit Design, Prototyping & Sensor Calibration               |
|  Sprint 3: Backend API, MySQL Database & Web Dashboard Development                |
|  Sprint 4: Full System Integration, Offline GSM Failover & Latency Stress Testing |
|  Sprint 5: In-Situ Laboratory Deployment & ISO/IEC 25010 User Acceptance Eval.    |
+-----------------------------------------------------------------------------------+
```

The lifecycle is divided into five iterative phases:

* **Phase 1: Requirement Analysis and Architectural Planning**:
  The researchers conducted comprehensive site inspections of the science laboratory to identify environmental hazards (combustible chemical storage, open-flame heating equipment, electrical distribution panels) and physical access vulnerabilities. System functional specifications were established, identifying sensor thresholds, power distribution requirements, communication failover conditions, and dashboard metrics.

* **Phase 2: Hardware Prototyping and Firmware Development**:
  Schematic diagrams and circuit layouts were drafted. Physical breadboard and perfboard prototypes of the ESP32 microcontroller hub were constructed. Embedded C++ firmware routines were programmed to calibrate the MQ-2 smoke/flammable gas sensor, MQ-135 air quality/toxic vapor sensor, DS18B20 1-Wire digital temperature probe, R307 optical fingerprint scanner, and SIM800L GSM cellular module.

* **Phase 3: Backend Server, Database, and Web Interface Development**:
  The central web server and RESTful APIs were built using Node.js (Express) with Socket.io WebSockets for real-time telemetry streaming. A normalized MySQL relational database was structured to store student/faculty profiles, biometric access timestamps, continuous environmental logs, and emergency alert dispatches. The frontend user interface was developed using HTML5, Tailwind CSS, and Chart.js to render live environmental gauge panels, historical trend charts, CCTV streams, and administrative controls.

* **Phase 4: System Integration, Failover Testing, and Bench Calibration**:
  All independent subsystems were interconnected into a unified operational hub. A dedicated ESP32-CAM/IP CCTV camera was integrated on a segregated local network channel to prevent high-bandwidth video traffic from congesting the primary sensor microcontroller. Network stress trials were executed by intentionally disconnecting local Wi-Fi to validate instantaneous failover to the SIM800L offline SMS module.

* **Phase 5: In-Situ Deployment, Acceptance Testing, and Evaluation**:
  The fully assembled, enclosed prototype was temporarily installed at the Datamex College of Saint Adeline Science Laboratory. Real-world benchmark trials were conducted, followed by the administration of structured ISO/IEC 25010 evaluation instruments to school administrators, science instructors, IT specialists, and student users.

---

## 3.3 Research Locale / Setting

The study was conducted at the **Science Laboratory of Datamex College of Saint Adeline (DCSA), Parañaque Campus**, situated at **8167 Dr. A. Santos Avenue, Barangay San Dionisio, Parañaque City, Metro Manila, Philippines**.

```
+-------------------------------------------------------------------------------+
|             DATAMEX COLLEGE OF SAINT ADELINE - SCIENCE LABORATORY             |
|                                 FLOOR PLAN LAYOUT                             |
+-------------------------------------------------------------------------------+
| [ENTRY DOOR] <--- R307 Fingerprint Scanner + 12V Solenoid Magnetic Lock       |
|       |                                                                       |
|   [CORRIDOR]                                                                  |
|       |                                                                       |
| +---------------------------------------------------------------------------+ |
| | [PREPARATION ROOM & CHEMICAL STORAGE CABINETS]                            | |
| |  * MQ-135 Hazardous Gas Sensor (Toxic Chemical Fume Monitoring)           | |
| +---------------------------------------------------------------------------+ |
| | [WORKBENCHES & EXPERIMENT TABLES]                                         | |
| |  * MQ-2 Smoke & Flammable Gas Sensor (LPG / Combustion Detection)         | |
| |  * DS18B20 Precision Digital Temperature Probe (Thermal Runaway Alert)    | |
| |  * Dedicated CCTV Surveillance Camera (Segregated IP Stream)              | |
| +---------------------------------------------------------------------------+ |
| | [TEACHER'S LECTURE DEMONSTRATION DESK & MAIN DASHBOARD WORKSTATION]       | |
| |  * Central ESP32 Hub + 16x2 I2C LCD + Buzzer + SIM800L Offline GSM Unit   | |
| |  * Local Web Dashboard Monitoring Terminal                                | |
| +---------------------------------------------------------------------------+ |
+-------------------------------------------------------------------------------+
```

The DCSA Science Laboratory is an enclosed academic facility utilized by Senior High School STEM students and collegiate classes for practical biology, chemistry, and general science instruction. The facility contains:
1. Volatile chemical reagents (acids, alcohols, solvents) housed in specialized chemical storage cabinets.
2. Open heating equipment, including Bunsen burners, alcohol lamps, and electric heating plates.
3. A single primary entry door securing sensitive microscopes, glass apparatus, and institutional equipment.

The locale was specifically selected because it exhibits the exact operational conditions and safety vulnerabilities targeted by the study: a high-hazard academic space where accidental gas leaks, open flames, or unauthorized room access present critical safety risks that cannot be reliably mitigated through manual inspections alone.

---

## 3.4 Respondents, Participants, and Users of the Study

The evaluation of the developed system involved a total of **forty-five (45) purposively selected respondents ($N = 45$)** from Datamex College of Saint Adeline. The evaluator cohort was stratified into four distinct stakeholder groups to provide comprehensive domain-specific evaluations:

### Table 3.1: Distribution of Respondents

| Stakeholder Category | Description / Institutional Role | Sample Size ($n$) | Percentage (%) |
| :--- | :--- | :---: | :---: |
| **School Administrators & Safety Officers** | Campus Director, Head of Academic Affairs, Campus Safety Officer, Facilities Custodian | 5 | 11.11% |
| **Science Instructors & Lab Custodians** | Chemistry, Biology, and Physics Faculty; Laboratory Technicians | 10 | 22.22% |
| **IT & Systems Specialists** | Computer Science & Information Technology Faculty; Network Administrators | 5 | 11.11% |
| **STEM / Science Students** | Senior High School STEM and Collegiate Science Laboratory Students | 25 | 55.56% |
| **TOTAL** | | **45** | **100.00%** |

### Inclusion and Exclusion Criteria:
* **Inclusion Criteria**:
  - Bonafide administrators, faculty members, laboratory staff, and enrolled students of Datamex College of Saint Adeline during Academic Year 2025–2026.
  - Faculty and students who actively conduct or supervise laboratory classes in the DCSA Science Laboratory.
  - IT specialists who possess technical background in software engineering, embedded systems, or network infrastructure.
* **Exclusion Criteria**:
  - Personnel or students who have no scheduled activities or responsibilities inside the DCSA Science Laboratory.
  - External campus visitors without formal affiliation with institutional operations.

---

## 3.5 Sampling Technique

The study employed **Non-Probability Purposive (Judgmental) Sampling** for the expert evaluator cohorts and **Stratified Purposive Sampling** for the student respondents:

1. **Purposive Sampling (Administrators, Instructors, and IT Specialists)**:
   Purposive sampling was deemed essential for technical and administrative evaluators because assessing embedded IoT communication stability, offline cellular failovers, ISO/IEC 25010 software compliance, and laboratory occupational safety regulations requires specialized professional knowledge and institutional authority.
2. **Stratified Purposive Sampling (Student Respondents)**:
   Student evaluators were stratified across active science laboratory class sections. This ensured that student participants represented actual end-users who physically interact with the biometric door scanner, observe the ambient environmental indicators, and respond to laboratory evacuation notifications.

---

## 3.6 Research Instruments

The researchers designed and utilized two categories of research instruments:

### 1. Technical Bench-Testing and Calibration Protocols
Engineered quantitative test sheets and logging scripts were developed to record empirical hardware performance metrics across controlled trials:
* **Sensor Calibration and Accuracy Test Sheet**: Recorded analog and digital outputs of the MQ-2, MQ-135, and DS18B20 sensors across graded smoke, vapor, and thermal exposure levels compared against reference digital instruments.
* **Biometric Authentication Latency and Error Log**: Documented recognition response time (in milliseconds), False Acceptance Rate (FAR), and False Rejection Rate (FRR) over 100 consecutive fingerprint scan trials.
* **Offline GSM SMS Latency and Delivery Sheet**: Quantified the elapsed time (in seconds) between an environmental hazard trigger and successful SMS delivery under active Wi-Fi and simulated broadband disconnection.
* **CCTV Video Isolation and Bandwidth Log**: Measured stream frame rate (FPS), latency, and microcontroller CPU/bus utilization to verify zero bus contention.

### 2. Standardized User Acceptance Evaluation Survey (ISO/IEC 25010)
A structured evaluation questionnaire was formulated adhering strictly to the **ISO/IEC 25010 Software Quality Model**. The questionnaire utilizes a **4-Point Likert Scale** to avoid central tendency bias:

### Table 3.2: 4-Point Likert Scale Interpretation

| Scale | Score Range | Verbal Interpretation | Operational Meaning |
| :---: | :---: | :---: | :--- |
| **4** | 3.50 – 4.00 | **Strongly Agree / Highly Acceptable (HA)** | The system exceeds requirements with flawless performance. |
| **3** | 2.50 – 3.49 | **Agree / Acceptable (A)** | The system satisfies all functional requirements effectively. |
| **2** | 1.50 – 2.49 | **Disagree / Moderately Acceptable (MA)** | The system exhibits minor inconsistencies requiring revision. |
| **1** | 1.00 – 1.49 | **Strongly Disagree / Not Acceptable (NA)** | The system fails to meet acceptable operational criteria. |

The survey evaluated eight (8) software and system quality characteristics:
1. **Functional Suitability**: Completeness, correctness, and appropriateness of hazard detection, biometric access, and alerting.
2. **Performance Efficiency**: Sensor response times, biometric unlocking speed, and resource utilization.
3. **Compatibility**: Interoperability between microcontroller hardware, backend APIs, and web clients.
4. **Usability**: User interface clarity, ease of dashboard navigation, and intuitive alert visualization.
5. **Reliability**: System fault tolerance, continuous uptime, and autonomous offline SMS failover execution.
6. **Security**: Biometric template privacy, encrypted communication, role-based access control, and tamper prevention.
7. **Maintainability**: Modularity of firmware code, circuit serviceability, and database scalability.
8. **Portability**: Adaptability of the web dashboard across desktop and mobile browsers.

---

## 3.7 Data Gathering Procedure

The data gathering process was executed systematically across four sequential phases:

```
+-----------------------------------------------------------------------------------+
|                        DATA GATHERING PROCEDURAL PHASES                           |
+-----------------------------------------------------------------------------------+
|  [PHASE 1] Administrative Permissions, Institutional Endorsement & Ethics Clearance |
|       |                                                                           |
|  [PHASE 2] Hardware Bench Testing, Component Calibration & Quantitative Trials    |
|       |                                                                           |
|  [PHASE 3] In-Situ Prototype Installation & Controlled Simulation Deployment      |
|       |                                                                           |
|  [PHASE 4] ISO/IEC 25010 Survey Administration, Data Tabulation & Analysis        |
+-----------------------------------------------------------------------------------+
```

* **Phase 1: Administrative Clearances and Ethics Protocol**:
  The researchers drafted a formal letter of request addressed to the Campus Director and Dean of Datamex College of Saint Adeline, requesting authorization to utilize the science laboratory as the research locale and conduct evaluations with faculty, staff, and students. Informed consent forms detailing research objectives, data privacy guarantees, and safety measures were distributed and signed.

* **Phase 2: Hardware Bench Testing and Empirical Calibration**:
  Prior to room installation, all electronic components were calibrated under controlled bench conditions:
  - The MQ-2 and MQ-135 sensors were subjected to a 24-hour pre-heating burn-in period to stabilize baseline internal resistance ($R_0$).
  - Baseline voltage curves were mapped using known concentrations of safe test aerosols (smoke canister, 70% isopropyl alcohol vapor) inside an acrylic test chamber.
  - The DS18B20 temperature probe was benchmarked against a calibrated laboratory digital thermometer.
  - The R307 fingerprint sensor was enrolled with authorized templates and tested for 100 verification cycles.
  - The SIM800L module was bench-tested for AT command execution, SMS dispatch speed, and signal reception stability.

* **Phase 3: In-Situ Laboratory Installation and Live Demonstration**:
  The prototype hardware was mounted inside the DCSA Science Laboratory. The R307 scanner and 12V electromagnetic lock were installed at the main entrance door. The MQ-2, MQ-135, and DS18B20 sensor modules were deployed at high-risk experiment bench zones and chemical storage areas. The dedicated CCTV streaming unit was positioned for comprehensive room coverage on an independent network channel. The web server and MySQL database were hosted on a local laboratory terminal.

* **Phase 4: Survey Administration and Data Consolidation**:
  The researchers conducted live demonstrations for the 45 evaluators. Each participant witnessed real-time sensor telemetry, biometric door unlocking, simulated hazard triggers, and offline SMS failover execution. Evaluators subsequently completed the standardized ISO/IEC 25010 questionnaire. Survey sheets and automated system logs were compiled, tabulated into statistical matrices, and subjected to statistical analysis.

---

## 3.8 System Requirements and Technical Architecture

### 3.8.1 Hardware Specifications

The physical prototype is engineered around industrial-grade, cost-effective embedded modules:

1. **Central Microcontroller Hub (ESP32 NodeMCU-32S)**:
   - Processor: Xtensa dual-core 32-bit LX6 microprocessor operating at 240 MHz.
   - Memory: 520 KB SRAM, 4 MB Flash memory.
   - Wireless Connectivity: Built-in 802.11 b/g/n Wi-Fi (2.4 GHz) and Bluetooth v4.2 BR/EDR & BLE.
   - Dual-Core Architecture: Core 0 executes network polling, WebSocket broadcasts, and GSM AT commands; Core 1 executes time-critical sensor ADC sampling, digital filtering, and biometric UART communication.
2. **Smoke and Flammable Gas Sensor (MQ-2)**:
   - Target Gases: Combustible gases (LPG, propane, methane, butane, hydrogen) and dense smoke.
   - Sensing Layer: Tin Dioxide ($SnO_2$) semiconductor resistor; resistance decreases as gas concentration increases.
   - Range: 300 to 10,000 ppm; Analog output wired to ESP32 ADC1 (GPIO 36).
3. **Hazardous Chemical and Air Quality Sensor (MQ-135)**:
   - Target Gases: Ammonia ($NH_3$), nitrogen oxides ($NO_x$), alcohol vapors, benzene, carbon dioxide ($CO_2$).
   - Sensing Layer: Micro SnO2 ceramic tube; Analog output wired to ESP32 ADC1 (GPIO 39).
4. **Precision High-Heat Temperature Sensor (DS18B20)**:
   - Form Factor: Waterproof stainless-steel probe.
   - Measurement Range: -55°C to +125°C with ±0.5°C accuracy between -10°C and +85°C.
   - Communication: Maxim 1-Wire digital bus with 4.7 kΩ pull-up resistor connected to GPIO 4.
5. **Biometric Fingerprint Scanner (R307 / AS608)**:
   - Optical Sensor: 500 DPI resolution with integrated capacitive touch detection.
   - Capacity: Up to 1,000 enrolled fingerprint templates.
   - Security Metrics: False Acceptance Rate (FAR) < 0.001%; False Rejection Rate (FRR) < 0.1%.
   - Interface: UART TTL (baud rate 57,600 bps) wired to ESP32 HardwareSerial2 (GPIO 16 RX2 / GPIO 17 TX2).
6. **Access Control Door Actuator**:
   - Actuator: 12V DC heavy-duty solenoid / electromagnetic lock (holding force: 60 kg / 130 lbs).
   - Driver: 1-Channel 5V Optocoupler-Isolated Relay Module (GPIO 23) equipped with a 1N4007 flyback diode to suppress inductive reverse-EMF voltage spikes.
7. **Offline Cellular Failover Module (SIM800L GSM/GPRS)**:
   - Quad-Band: 850/900/1800/1900 MHz operating on 2G GSM cellular networks.
   - Power Subsystem: Dedicated LM2596 DC-DC buck converter calibrated to 4.0V DC capable of supplying 2.0A peak burst current during antenna transmission, stabilized with a 1000 µF low-ESR electrolytic capacitor.
   - Interface: UART TTL via HardwareSerial1 (GPIO 26 RX1 / GPIO 27 TX1) with common ground to the ESP32.
8. **Segregated CCTV Video Surveillance Hardware**:
   - Hardware: Dedicated ESP32-CAM (OV2640 2MP sensor) / RTSP IP Camera operating on independent physical silicon and power rail.
   - Network Channel: Direct local subnet streaming (MJPEG/RTSP over port 81/554) consumed directly by the web dashboard client. This hardware segregation prevents video frame processing and streaming from congesting the primary sensor microcontroller's memory and CPU cycles.
9. **Local Audio-Visual Alert Units**:
   - Display: 16x2 Character LCD with PCF8574 I2C interface backpack (SDA GPIO 21, SCL GPIO 22).
   - Siren: 5V Active Piezo Buzzer (GPIO 18) generating an 85 dB local acoustic warning during hazard states.
10. **Power Supply Distribution Architecture**:
    - Master Input: 12V 3.0A Regulated DC Power Adapter.
    - Rail 1 (12V): Powers the door solenoid lock and buck converter inputs.
    - Rail 2 (5V via LM2596 Buck #1): Powers ESP32 VIN, 5V Relay, LCD backpack, and active buzzer.
    - Rail 3 (4.0V via LM2596 Buck #2): Dedicated clean power for SIM800L VCC.

---

### Table 3.3: Hardware Pin Configuration and Interfacing Matrix

| Hardware Component | Component Pin | ESP32 GPIO Pin | Protocol / Interface | Operating Voltage | Functional Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **MQ-2 Smoke/Gas Sensor** | AOUT | GPIO 36 (ADC1_CH0) | Analog Input | 5.0V VCC / 3.3V ADC | Continuous flammable gas/smoke sampling |
| **MQ-135 Air Quality Sensor**| AOUT | GPIO 39 (ADC1_CH3) | Analog Input | 5.0V VCC / 3.3V ADC | Continuous toxic chemical fume monitoring |
| **DS18B20 Temp Probe** | DATA | GPIO 4 | 1-Wire Digital Bus | 3.3V VCC (4.7kΩ Pull-up)| Precision digital thermal monitoring |
| **R307 Fingerprint Scanner** | TX | GPIO 16 (RX2) | UART TTL (57600 baud)| 3.3V / 5.0V VCC | Biometric template packet reception |
| **R307 Fingerprint Scanner** | RX | GPIO 17 (TX2) | UART TTL (57600 baud)| 3.3V / 5.0V VCC | Biometric command packet transmission |
| **SIM800L GSM Module** | TXD | GPIO 26 (RX1) | UART TTL (9600 baud) | 4.0V VCC (Dedicated) | Cellular AT command response reception |
| **SIM800L GSM Module** | RXD | GPIO 27 (TX1) | UART TTL (9600 baud) | 4.0V VCC (Dedicated) | Emergency SMS AT command transmission |
| **1-Channel Relay Module** | IN | GPIO 23 | Digital Output (GPIO) | 5.0V VCC / 3.3V Logic | 12V Solenoid door lock actuation |
| **16x2 I2C LCD Backpack** | SDA | GPIO 21 | I2C Data Line | 5.0V VCC (Level Shifted) | Room status and sensor readout |
| **16x2 I2C LCD Backpack** | SCL | GPIO 22 | I2C Clock Line | 5.0V VCC (Level Shifted) | I2C synchronization clock |
| **Active Piezo Buzzer** | POS (+) | GPIO 18 | Digital Output (GPIO) | 5.0V VCC / 3.3V Logic | Local audible emergency acoustic alarm |
| **Segregated CCTV Camera** | LAN/WLAN | Independent Subnet| RTSP / HTTP MJPEG | 5.0V VCC (Dedicated) | Direct video stream to web dashboard |

---

### 3.8.2 Software Architecture and Tech Stack

The software ecosystem comprises embedded firmware, backend APIs, relational database schemas, and a responsive web monitoring dashboard:

```
+-------------------------------------------------------------------------------+
|                         SYSTEM SOFTWARE ARCHITECTURE                          |
+-------------------------------------------------------------------------------+
|  [ESP32 FIRMWARE] (C++ / FreeRTOS)                                             |
|   Core 0: Wi-Fi Reconnection, Socket.io / HTTP Client, SIM800L AT State Mach. |
|   Core 1: Sensor ADC Sampling, Moving Avg Filter, R307 Fingerprint Matching   |
+-------------------------------------------------------------------------------+
                                      |
                           (HTTP REST / WebSockets)
                                      v
+-------------------------------------------------------------------------------+
|  [BACKEND API SERVER] (Node.js / Express.js / Socket.io)                      |
|   * Real-time Telemetry Ingestion Engine & Broadcast Gateway                  |
|   * Biometric Authentication & Access Logging Controller                      |
|   * Threshold Evaluation & Emergency Alert Dispatcher                         |
|   * Moving Average & Linear Regression Predictive Analysis Engine             |
+-------------------------------------------------------------------------------+
                                      |
                     +----------------+----------------+
                     |                                 |
                     v                                 v
+-----------------------------+   +---------------------------------------------+
|  [DATABASE] (MySQL)         |   |  [CENTRALIZED WEB DASHBOARD]                |
|  * tbl_users                |   |  * Real-time Environmental Gauge Cards      |
|  * tbl_access_logs          |   |  * Biometric Door Access Activity Stream    |
|  * tbl_sensor_telemetry     |   |  * Segregated CCTV Live Stream Player       |
|  * tbl_incident_alerts      |   |  * SMS Dispatch Logs & Signal Monitor       |
|  * tbl_cctv_sessions        |   |  * Predictive Hazard Escalation Chart       |
+-----------------------------+   +---------------------------------------------+
```

1. **Embedded Firmware (ESP32)**:
   - Written in C++ utilizing the Arduino core and PlatformIO framework.
   - Dual-Core FreeRTOS Multitasking:
     - **TaskCore0 (Communications)**: Manages Wi-Fi state machines, handles HTTP/WebSocket telemetry payloads, polls ping heartbeats, and drives SIM800L UART AT-command sequences.
     - **TaskCore1 (Hardware I/O)**: Executes analog-to-digital conversions on MQ-2 and MQ-135 pins every 200 ms, queries the DS18B20 1-Wire scratchpad, parses R307 fingerprint matching packets, and triggers relay/buzzer outputs.
   - Key Libraries: `WiFi.h`, `SocketIOclient.h`, `Adafruit_Fingerprint.h`, `DallasTemperature.h`, `OneWire.h`, `LiquidCrystal_I2C.h`.

2. **Backend Server & RESTful APIs**:
   - Runtime: Node.js (v18+) with Express.js framework.
   - Communication: Bidirectional real-time WebSockets via `Socket.io` for millisecond-latency telemetry push to connected browsers.
   - Security: Password hashing with `bcrypt`, JWT authentication for administrative dashboard sessions, input sanitization to prevent SQL injection.

3. **Relational Database Schema (MySQL)**:
   - **`tbl_users`**: Stores authorized user accounts (`user_id`, `student_faculty_id`, `full_name`, `user_role` [ADMIN/INSTRUCTOR/STUDENT], `fingerprint_slot_id`, `contact_number`, `status`, `created_at`).
   - **`tbl_access_logs`**: Logs door entry activity (`log_id`, `user_id`, `timestamp`, `auth_status` [GRANTED/DENIED], `verification_type`).
   - **`tbl_sensor_telemetry`**: Stores periodic room metrics (`telemetry_id`, `timestamp`, `mq2_smoke_ppm`, `mq135_air_ppm`, `temperature_celsius`, `hazard_status` [NORMAL/WARNING/CRITICAL]).
   - **`tbl_incident_alerts`**: Tracks emergency alerts (`incident_id`, `timestamp`, `trigger_source`, `sensor_value`, `notification_medium` [WEBSOCKET/SMS], `delivery_status`, `recipient_phone`).
   - **`tbl_cctv_sessions`**: Manages video camera network endpoints (`session_id`, `camera_ip`, `stream_url`, `fps_rate`, `status`).

4. **Centralized Frontend Web Dashboard**:
   - Single Page Application (SPA) constructed with HTML5, Vanilla JavaScript (ES6+), and Tailwind CSS for styling.
   - Live visual gauge widgets powered by Chart.js displaying real-time smoke concentration, hazardous air quality, and temperature curves.
   - Live access control feed displaying authenticated student/instructor profiles and real-time door open/close statuses.
   - Integrated RTSP/MJPEG video canvas rendering real-time surveillance footage from the isolated CCTV unit.
   - Historical log export engine generating CSV and PDF safety compliance audit reports.

---

### 3.8.3 Predictive Data Logging and Early Anomaly Detection Algorithm

To elevate the system from a simple reactive alarm into a proactive incident prevention platform, the firmware and backend implement a **Predictive Data Logging Algorithm**. The algorithm combines a **Rolling Moving Average Filter** with **First-Order Linear Regression Trend Analysis** to detect rapid hazard acceleration *before* values cross critical danger thresholds.

#### Mathematical Formulation:

1. **Moving Average Smoothing**:
   To eliminate transient ADC noise caused by atmospheric turbulence or dust particles, raw sensor readings are smoothed over a rolling window of $k = 10$ samples:
   $$\bar{S}_t = \frac{1}{k} \sum_{i=0}^{k-1} S_{t-i}$$

2. **Linear Regression Slope Rate Calculation ($dT/dt$ and $dGas/dt$)**:
   The trend rate of change ($m$, representing the rate of increase per second) is computed over an observation window of $n = 30$ seconds using the least-squares linear regression slope formula:
   $$m = \frac{n \sum (t \cdot \bar{S}_t) - (\sum t)(\sum \bar{S}_t)}{n \sum (t^2) - (\sum t)^2}$$
   Where:
   - $t$ is the elapsed time in seconds.
   - $\bar{S}_t$ is the smoothed sensor reading at time $t$.
   - $m$ is the rate of change ($dT/dt$ for temperature, $dGas/dt$ for gas ppm).

3. **Predictive Early Escalation Rule**:
   - If current temperature $T < 45^\circ\text{C}$ (below the static fire alarm threshold of $55^\circ\text{C}$), but the calculated slope $m_{temp} = \frac{dT}{dt} \ge 0.75^\circ\text{C/sec}$ sustained for 5 consecutive seconds, the system immediately flags a **"Thermal Runaway Pre-Alarm"**.
   - If gas concentration $G < 400\text{ ppm}$ (below the emergency threshold of $700\text{ ppm}$), but the gas accumulation slope $m_{gas} = \frac{dGas}{dt} \ge 15\text{ ppm/sec}$, the system flags an **"Accelerating Chemical Vapor Leak"**.
   - The system dispatches pre-emptive warnings to the dashboard, activates the 16x2 LCD amber warning, and logs the predictive anomaly to `tbl_incident_alerts` prior to catastrophic combustion.

---

### 3.8.4 Offline SMS Failover Logic and Process Flowchart

The system utilizes an autonomous dual-channel communication architecture to guarantee emergency delivery during network interruptions:

```
+-------------------------------------------------------------------------------+
|                       OFFLINE SMS FAILOVER STATE MACHINE                      |
+-------------------------------------------------------------------------------+
|                                                                               |
|                             [SENSOR HAZARD DETECTED]                          |
|                        (Smoke > Threshold OR Temp > 55°C)                     |
|                                        |                                      |
|                                        v                                      |
|                            [LOCAL ALARM ACTIVATION]                           |
|                         (Buzzer ON + LCD Displays Hazard)                     |
|                                        |                                      |
|                                        v                                      |
|                          <IS WI-FI / INTERNET CONNECTED?>                     |
|                                 /              \                              |
|                          YES   /                \   NO                        |
|                               v                  v                            |
|             [TRANSMIT VIA WEBSOCKETS]      [INVOKE SIM800L CELLULAR ENGINE]   |
|            - Instant Dashboard Warning     - Send AT+CMGF=1                   |
|            - Push Notification Dispatched  - Send AT+CMGS="+639XXXXXXXXX"     |
|                       |                    - Dispatch SMS:                    |
|                       v                      "EMERGENCY ALERT: Smoke / Gas    |
|                <ACK RECEIVED?>               detected in DCSA Science Lab!"   |
|                /             \                              |                 |
|         YES   /               \  NO                         v                 |
|              v                 v                    [LOG SMS DISPATCH]        |
|      [EVENT LOGGED TO DB]  [FALLBACK TO SMS]       - Timestamp logged         |
|                            - Trigger SIM800L       - Delivery status recorded |
|                                                                               |
+-------------------------------------------------------------------------------+
```

---

## 3.9 Testing and Evaluation Procedures

The experimental verification of the system was executed across four distinct testing methodologies:

1. **Unit Testing**:
   Each component was isolated and validated against its operational parameters:
   - *Sensor Calibrations*: Testing MQ-2 and MQ-135 voltage outputs against varying ppm concentrations; verifying DS18B20 temperature readouts against a precision mercury-in-glass thermometer.
   - *Biometric Sensor Verification*: Validating finger placement angle tolerance, enroll/delete operations, and baud communication stability.
   - *Relay & Solenoid Cycling*: Subjecting the relay module and 12V solenoid lock to 100 consecutive open/close cycles to ensure no coil overheating or mechanical sticking occurred.
   - *Cellular Module AT Commands*: Verifying network registration (`AT+CREG?`), signal quality (`AT+CSQ`), and message format (`AT+CMGF=1`).

2. **Integration Testing**:
   Evaluated data exchange between the physical ESP32 hub, Node.js server, MySQL database, and frontend dashboard:
   - Validating FreeRTOS queue communication between Core 0 and Core 1.
   - Measuring WebSocket telemetry latency from sensor sampling to screen rendering.
   - Verifying database transaction integrity under simulated concurrent write requests (simultaneous biometric logging and sensor streaming).

3. **Stress and Offline Failover Testing**:
   - *Simulated Broadband Outage*: The local Wi-Fi router was disconnected during active sensor hazard triggers. The system's failover detection was evaluated to confirm automatic fallback to the SIM800L module within five (5) seconds.
   - *Surveillance Network Isolation*: Heavy network packets were flooded across the CCTV camera stream to confirm that the video feed did not interrupt or delay sensor ADC sampling or door unlocking on the main ESP32 microcontroller.

4. **User Acceptance Testing (UAT)**:
   The complete integrated system was presented to the 45 evaluators at the DCSA Science Laboratory. Participants executed guided testing scenarios (enrolling fingerprints, scanning fingers, observing real-time telemetry, simulating smoke triggers, and receiving emergency SMS text alerts), followed by completing the standardized ISO/IEC 25010 evaluation questionnaire.

---

## 3.10 Data Analysis and Statistical Treatment

Quantitative data collected from technical benchmark trials and ISO/IEC 25010 evaluation surveys were analyzed using descriptive and inferential statistical treatments:

### 1. Frequency and Percentage Distribution
Used to profile the distribution of evaluators across stakeholder groups:
$$P = \left(\frac{f}{N}\right) \times 100$$
Where:
- $P$ = Percentage (%)
- $f$ = Frequency of responses in a category
- $N$ = Total number of respondents ($N = 45$)

### 2. Weighted Mean ($\bar{x}$)
Used to calculate the central tendency score for each ISO/IEC 25010 evaluation criterion:
$$\bar{x} = \frac{\sum (f \cdot x)}{N}$$
Where:
- $\bar{x}$ = Weighted Mean
- $f$ = Frequency of respondents choosing a specific rating
- $x$ = Scale weight (4, 3, 2, or 1)
- $N$ = Total number of respondents

The resulting weighted means were interpreted using the four-point Likert scale boundaries defined in Table 3.2.

### 3. Sensor Measurement Accuracy and Relative Error Rate
Calculated to evaluate the empirical accuracy of the environmental sensors against reference meters:
$$\text{Relative Error } (\%) = \left| \frac{V_{\text{measured}} - V_{\text{reference}}}{V_{\text{reference}}} \right| \times 100$$
$$\text{Sensor Accuracy } (\%) = 100\% - \text{Relative Error } (\%)$$

### 4. Biometric Authentication Performance Metrics
Evaluated using False Acceptance Rate (FAR) and False Rejection Rate (FRR) over 100 trials:
$$\text{FAR } (\%) = \left( \frac{\text{Number of False Acceptances}}{\text{Total Non-Enrolled Access Trials}} \right) \times 100$$
$$\text{FRR } (\%) = \left( \frac{\text{Number of False Rejections}}{\text{Total Enrolled Access Trials}} \right) \times 100$$
$$\text{Authentication Latency } (T_{\text{auth}}) = T_{\text{unlocked}} - T_{\text{finger\_placed}}$$

### 5. Offline SMS Delivery Latency and Success Rate
Quantified to measure the dependability of the cellular failover:
$$\text{SMS Latency } (T_{\text{SMS}}) = T_{\text{received\_phone}} - T_{\text{hazard\_triggered}}$$
$$\text{Delivery Success Rate } (\%) = \left( \frac{N_{\text{successfully\_received}}}{N_{\text{total\_dispatched}}} \right) \times 100$$

---

## 3.11 Ethical Considerations and Safety Protocols

The researchers strictly adhered to ethical principles and safety standards throughout the research and testing process:

1. **Compliance with the Philippine Data Privacy Act of 2012 (Republic Act No. 10173)**:
   - *Biometric Protection*: The R307 optical fingerprint scanner extracts and hashes mathematical minutiae coordinates (ridge endings and bifurcations). No actual raster images of human fingerprints are ever captured, transmitted, or stored in the database.
   - *Data Encryption and Anonymity*: Access logs and telemetry records stored in MySQL are protected with role-based access control (RBAC). Evaluator survey responses are anonymized, and personal mobile numbers registered for SMS alerts are strictly restricted to designated safety officers.

2. **Informed Consent and Voluntary Participation**:
   All 45 evaluators were provided with comprehensive Informed Consent Disclosures detailing the research purpose, the voluntary nature of their participation, and their unconditional right to withdraw at any stage without prejudice.

3. **Laboratory Safety and Environmental Protection Protocols**:
   - Hardware bench testing involving combustible vapors and simulated smoke was strictly conducted inside a sealed, transparent acrylic enclosure equipped with exhaust ventilation.
   - Standard non-toxic, non-corrosive aerosol testing canisters (clean test smoke and diluted isopropyl vapor) were utilized instead of open flammable gases or toxic industrial chemicals.
   - An ABC dry chemical fire extinguisher and personal protective equipment (safety goggles, laboratory coats, nitrile gloves) were maintained on standby throughout all testing phases under the supervision of the DCSA campus safety officer.
