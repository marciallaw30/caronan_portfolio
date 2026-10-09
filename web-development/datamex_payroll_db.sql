-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 25, 2025 at 09:36 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `datamex_payroll_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `announcements`
--

CREATE TABLE `announcements` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `image_path` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `announcements`
--

INSERT INTO `announcements` (`id`, `title`, `content`, `created_at`, `image_path`) VALUES
(2, 'ROBLOX TOURNAMENT', 'PLAYER CAN PLAY', '2025-09-24 16:56:45', 'uploads/announcement_68d422cd78bb71.99226635.png');

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `id` int(11) NOT NULL,
  `employeeNo` varchar(50) NOT NULL,
  `date` date NOT NULL,
  `time_in` time DEFAULT NULL,
  `time_out` time DEFAULT NULL,
  `working_hours` decimal(5,2) DEFAULT 0.00,
  `late_minutes` int(11) DEFAULT 0,
  `overtime_hours` decimal(5,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendance`
--

INSERT INTO `attendance` (`id`, `employeeNo`, `date`, `time_in`, `time_out`, `working_hours`, `late_minutes`, `overtime_hours`) VALUES
(3, '2023035', '2025-09-15', '00:00:08', '00:00:17', 8.00, 0, 0.00),
(15, '2024012', '2025-09-25', '19:17:57', '19:18:03', 0.00, 677, 0.00),
(21, '2023009', '2025-09-25', '08:00:00', '19:00:00', 8.00, 0, 2.00),
(22, '2023009', '2025-09-24', '08:00:47', '21:00:52', 8.00, 0, 4.00);

-- --------------------------------------------------------

--
-- Table structure for table `benefits`
--

CREATE TABLE `benefits` (
  `id` int(11) NOT NULL,
  `benefit_title` varchar(255) NOT NULL,
  `benefit_details` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `image_path` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `benefits`
--

INSERT INTO `benefits` (`id`, `benefit_title`, `benefit_details`, `created_at`, `image_path`) VALUES
(1, 'SOCIAL SECURITY SYSTEM', 'ASFG', '2025-09-23 16:09:23', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `benefits_deductions`
--

CREATE TABLE `benefits_deductions` (
  `id` int(11) NOT NULL,
  `benefit_name` varchar(255) NOT NULL,
  `deduction_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `benefits_deductions`
--

INSERT INTO `benefits_deductions` (`id`, `benefit_name`, `deduction_amount`, `name`) VALUES
(1, 'SSS Contribution', 1440.00, 'SSS Contribution'),
(2, 'Pag-IBIG Contribution', 100.00, 'PhilHealth Contribution'),
(3, 'PhilHealth Contribution', 400.00, ''),
(4, 'TIN Tax', 0.00, ''),
(5, '', 0.00, 'PAG-IBIG Contribution'),
(6, '', 0.00, 'TIN Contribution');

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` int(11) NOT NULL,
  `employeeNo` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `firstName` varchar(100) DEFAULT NULL,
  `lastName` varchar(100) DEFAULT NULL,
  `middleName` varchar(100) DEFAULT NULL,
  `birthDay` date DEFAULT NULL,
  `birthPlace` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `gender` varchar(20) DEFAULT NULL,
  `civilStatus` varchar(50) DEFAULT NULL,
  `nationality` varchar(50) DEFAULT NULL,
  `religion` varchar(50) DEFAULT NULL,
  `phoneNumber` varchar(20) DEFAULT NULL,
  `sssNumber` varchar(50) DEFAULT NULL,
  `pagibigNumber` varchar(50) DEFAULT NULL,
  `tinNumber` varchar(50) DEFAULT NULL,
  `philhealthNumber` varchar(50) DEFAULT NULL,
  `bankAccount` varchar(50) DEFAULT NULL,
  `accountType` enum('employee','admin') NOT NULL DEFAULT 'employee'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `employeeNo`, `password`, `firstName`, `lastName`, `middleName`, `birthDay`, `birthPlace`, `address`, `email`, `gender`, `civilStatus`, `nationality`, `religion`, `phoneNumber`, `sssNumber`, `pagibigNumber`, `tinNumber`, `philhealthNumber`, `bankAccount`, `accountType`) VALUES
(1, '2023009', '$2y$10$XyUFcjrsiQ0ZIPIKSrAb1uGO0/v.zDC524w03sSeB8YxrEsLd.WFK', 'MARCIAL LAWRENCE JR', 'CARONAN', 'VILLAGONZALO', '1997-08-30', 'PARANAQUE CITY', 'BLK 14 CRC PETCHAYAN, MULTINATIONAL VILLAGE, MOONWALK, PARANAQUE CITY', 'marcialcaronan@gmail.com', 'male', 'single', 'filipino', 'roman catholic', '09202720151', '123', '123', '123', '123', '123', 'admin'),
(4, '2023039', '$2y$10$yn/Nali2yRw3nBozQUxMj.pReX89rbkhu.WMjQ8cOpFuT8lXSmiEG', 'Tyron John', 'Dela Cruz', 'Lucreda', '2004-09-04', 'Las Pinas', 'Las Pinas', 'tyronjohn04@gmail.com', 'male', 'single', 'filipino', 'r. catholic', '09234567281', '123', '123', '123', '123', '123', 'admin'),
(6, '2023035', '$2y$10$4bB7.KFfL88e42LcoPJHVOdKpf7O7sveUYGELbhQ6oNZWCi/EovHW', 'KERR', 'PANGAN', 'BALIBER', '2005-08-14', 'paranaque', 'paranaque', 'kerr@gmail.com', 'male', 'single', 'filipino', 'catholic', '09202720151', '222', '111', '333', '444', '333344', 'admin'),
(8, '2024012', '$2y$10$ApmmxUQ2r5/VUzg41wAYn.Dyog7VYaRWtbppsQEtjoL6pDvM4BUWu', 'Rica Mhay', 'Saturinas', 'Castro', '2004-08-27', 'paranaque', 'paranaque', 'ricamhaysaturinas2@gmail.com', 'female', 'single', 'filipino', 'catholic', '09123456789', '123', '123', '123', '123', '123', 'employee'),
(10, '2023024', '$2y$10$SNh/MQOsJDFa9sRBaBFTb.gB9uhZlZhFbahqKK9fTHh5gkVaNnVre', 'Jhay', 'Castro', 'Logatoc', '2004-12-30', 'Cavite', 'paranaque', 'cj5224751@gmail.com', 'male', 'single', 'filipino', 'r. catholic', '09876565445', '123', '111', '1111', '1111', '123', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `employee_benefits`
--

CREATE TABLE `employee_benefits` (
  `id` int(11) NOT NULL,
  `employeeNo` varchar(50) NOT NULL,
  `benefit_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee_benefits`
--

INSERT INTO `employee_benefits` (`id`, `employeeNo`, `benefit_id`, `amount`, `created_at`) VALUES
(15, '2023009', 1, 0.00, '2025-09-24 08:26:04'),
(16, '2023009', 2, 0.00, '2025-09-24 08:26:04'),
(17, '2023009', 3, 0.00, '2025-09-24 08:26:04'),
(18, '2023009', 4, 0.00, '2025-09-24 08:26:04'),
(19, '2023009', 5, 0.00, '2025-09-24 08:26:04'),
(20, '2023009', 6, 0.00, '2025-09-24 08:26:04'),
(21, '2024012', 1, 0.00, '2025-09-24 08:29:19'),
(22, '2024012', 2, 0.00, '2025-09-24 08:29:19'),
(23, '2024012', 3, 0.00, '2025-09-24 08:29:19'),
(24, '2024012', 4, 0.00, '2025-09-24 08:29:19'),
(25, '2024012', 5, 0.00, '2025-09-24 08:29:19'),
(26, '2024012', 6, 0.00, '2025-09-24 08:29:19');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `event_name` varchar(255) NOT NULL,
  `event_date` date NOT NULL,
  `event_location` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `image_path` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `event_name`, `event_date`, `event_location`, `created_at`, `image_path`) VALUES
(1, 'Psychology Seminar', '2025-10-15', 'jahfjshdfjhvd', '2025-09-23 16:07:30', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE `feedback` (
  `id` int(11) NOT NULL,
  `feedback_text` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `feedback`
--

INSERT INTO `feedback` (`id`, `feedback_text`, `created_at`) VALUES
(1, 'I love datamex college of saint adeline', '2025-09-23 15:23:12'),
(2, '123', '2025-09-23 15:23:22');

-- --------------------------------------------------------

--
-- Table structure for table `payroll`
--

CREATE TABLE `payroll` (
  `id` int(11) NOT NULL,
  `employeeNo` varchar(50) NOT NULL,
  `pay_period_start` date DEFAULT NULL,
  `pay_period_end` date DEFAULT NULL,
  `ratePerHour` decimal(10,2) NOT NULL DEFAULT 0.00,
  `hoursWorked` decimal(10,2) NOT NULL DEFAULT 0.00,
  `regular_days` decimal(10,2) NOT NULL DEFAULT 0.00,
  `grossPay` decimal(10,2) DEFAULT NULL,
  `deductions` decimal(10,2) DEFAULT NULL,
  `netPay` decimal(10,2) DEFAULT NULL,
  `payDate` date NOT NULL,
  `lateDeductions` decimal(10,2) NOT NULL DEFAULT 0.00,
  `overtime` decimal(10,2) NOT NULL DEFAULT 0.00,
  `overtime_hours` decimal(10,2) NOT NULL DEFAULT 0.00,
  `regularHolidayPay` decimal(10,2) NOT NULL DEFAULT 0.00,
  `regular_holiday_days` decimal(10,2) NOT NULL DEFAULT 0.00,
  `regular_holiday_ot_hours` decimal(10,2) NOT NULL DEFAULT 0.00,
  `specialHolidayPay` decimal(10,2) NOT NULL DEFAULT 0.00,
  `special_holiday_days` decimal(10,2) NOT NULL DEFAULT 0.00,
  `special_holiday_ot_hours` decimal(10,2) NOT NULL DEFAULT 0.00,
  `payroll_start_date` date DEFAULT NULL,
  `payroll_end_date` date DEFAULT NULL,
  `pay_day_schedule` varchar(255) DEFAULT NULL,
  `otherDeductions` decimal(10,2) DEFAULT 0.00,
  `benefitsData` text DEFAULT NULL,
  `other_deduction_name` varchar(255) DEFAULT NULL,
  `other_deductions` decimal(10,2) NOT NULL DEFAULT 0.00,
  `gross_pay` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total_deductions` decimal(10,2) NOT NULL DEFAULT 0.00,
  `net_pay` decimal(10,2) NOT NULL DEFAULT 0.00,
  `late_minutes` int(11) DEFAULT NULL,
  `late_deductions` decimal(10,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payroll`
--

INSERT INTO `payroll` (`id`, `employeeNo`, `pay_period_start`, `pay_period_end`, `ratePerHour`, `hoursWorked`, `regular_days`, `grossPay`, `deductions`, `netPay`, `payDate`, `lateDeductions`, `overtime`, `overtime_hours`, `regularHolidayPay`, `regular_holiday_days`, `regular_holiday_ot_hours`, `specialHolidayPay`, `special_holiday_days`, `special_holiday_ot_hours`, `payroll_start_date`, `payroll_end_date`, `pay_day_schedule`, `otherDeductions`, `benefitsData`, `other_deduction_name`, `other_deductions`, `gross_pay`, `total_deductions`, `net_pay`, `late_minutes`, `late_deductions`) VALUES
(9, '2024012', NULL, NULL, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, '2025-09-24', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, '2025-09-01', '2025-09-15', 'first_half', 0.00, '{\"1\":0,\"2\":0,\"3\":0,\"4\":0,\"5\":0,\"6\":0}', NULL, 0.00, 0.00, 0.00, 0.00, NULL, 0.00),
(16, '2023009', '2025-09-16', '2025-09-30', 0.00, 0.00, 2.00, NULL, NULL, NULL, '0000-00-00', 0.00, 0.00, 6.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, '2025-10-06', 0.00, '{\"PhilHealth\":\"0\",\"SSS\":\"0\",\"PAG-IBIG\":\"0\",\"TIN\":\"0\",\"OtherDeductionName\":\"\"}', '', 0.00, 2041.56, 0.00, 2041.56, 0, 0.00);

-- --------------------------------------------------------

--
-- Table structure for table `training`
--

CREATE TABLE `training` (
  `id` int(11) NOT NULL,
  `training_title` varchar(255) NOT NULL,
  `training_description` text NOT NULL,
  `training_link` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `image_path` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `training`
--

INSERT INTO `training` (`id`, `training_title`, `training_description`, `training_link`, `created_at`, `image_path`) VALUES
(1, 'CSS NCII', 'ASDGF', 'https://e-tesda.gov.ph/course/index.php?categoryid=16', '2025-09-23 16:08:57', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employeeNo` (`employeeNo`),
  ADD KEY `idx_date` (`date`);

--
-- Indexes for table `benefits`
--
ALTER TABLE `benefits`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `benefits_deductions`
--
ALTER TABLE `benefits_deductions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `employeeNo` (`employeeNo`);

--
-- Indexes for table `employee_benefits`
--
ALTER TABLE `employee_benefits`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employeeNo` (`employeeNo`),
  ADD KEY `benefit_id` (`benefit_id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payroll`
--
ALTER TABLE `payroll`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employeeNo` (`employeeNo`);

--
-- Indexes for table `training`
--
ALTER TABLE `training`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `announcements`
--
ALTER TABLE `announcements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `benefits`
--
ALTER TABLE `benefits`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `benefits_deductions`
--
ALTER TABLE `benefits_deductions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `employee_benefits`
--
ALTER TABLE `employee_benefits`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `payroll`
--
ALTER TABLE `payroll`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `training`
--
ALTER TABLE `training`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`employeeNo`) REFERENCES `employees` (`employeeNo`) ON DELETE CASCADE;

--
-- Constraints for table `employee_benefits`
--
ALTER TABLE `employee_benefits`
  ADD CONSTRAINT `employee_benefits_ibfk_1` FOREIGN KEY (`employeeNo`) REFERENCES `employees` (`employeeNo`) ON DELETE CASCADE,
  ADD CONSTRAINT `employee_benefits_ibfk_2` FOREIGN KEY (`benefit_id`) REFERENCES `benefits_deductions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payroll`
--
ALTER TABLE `payroll`
  ADD CONSTRAINT `payroll_ibfk_1` FOREIGN KEY (`employeeNo`) REFERENCES `employees` (`employeeNo`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
