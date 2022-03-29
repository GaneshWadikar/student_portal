-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 09, 2022 at 08:33 AM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 8.0.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `adcet_student_portal`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `username` varchar(30) NOT NULL,
  `password` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `earlier_education`
--

CREATE TABLE `earlier_education` (
  `urn` int(11) NOT NULL,
  `board` varchar(10) NOT NULL,
  `year` int(11) NOT NULL,
  `mark` varchar(8) NOT NULL,
  `medium` varchar(20) NOT NULL,
  `place_of_study` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `information`
--

CREATE TABLE `information` (
  `urn` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `division` varchar(1) DEFAULT NULL,
  `roll` int(11) DEFAULT NULL,
  `branch` varchar(30) DEFAULT NULL,
  `guardian_occupation` varchar(30) DEFAULT NULL,
  `guardian_name` varchar(50) DEFAULT NULL,
  `seat_allocation` int(11) DEFAULT NULL,
  `dob` varchar(15) DEFAULT NULL,
  `blood_group` varchar(4) DEFAULT NULL,
  `mother_tongue` varchar(20) DEFAULT NULL,
  `year_of_admission` int(11) DEFAULT NULL,
  `aadhar_number` varchar(12) DEFAULT NULL,
  `staying_with` int(11) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `guardian_mobile_number` varchar(15) DEFAULT NULL,
  `mobile_number` varchar(15) DEFAULT NULL,
  `special_achievement` text DEFAULT NULL,
  `email` varchar(30) DEFAULT NULL,
  `hobby` text DEFAULT NULL,
  `strength` text DEFAULT NULL,
  `profile_pic` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `mentor_batch`
--

CREATE TABLE `mentor_batch` (
  `trn` int(11) NOT NULL,
  `urn` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `performance`
--

CREATE TABLE `performance` (
  `urn` int(11) NOT NULL,
  `sem` int(11) NOT NULL,
  `remark` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `performance_subject`
--

CREATE TABLE `performance_subject` (
  `urn` int(11) NOT NULL,
  `sem` int(11) NOT NULL,
  `subject_name` varchar(30) DEFAULT NULL,
  `ise_1` int(11) DEFAULT NULL,
  `ise_2` int(11) DEFAULT NULL,
  `mse` int(11) DEFAULT NULL,
  `ese` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `problems`
--

CREATE TABLE `problems` (
  `urn` int(11) NOT NULL,
  `sem` int(11) NOT NULL,
  `attendance` varchar(10) DEFAULT NULL,
  `p1` int(11) DEFAULT NULL,
  `p2` int(11) DEFAULT NULL,
  `p3` int(11) DEFAULT NULL,
  `p4` int(11) DEFAULT NULL,
  `p5` int(11) DEFAULT NULL,
  `p6` int(11) DEFAULT NULL,
  `p7` int(11) DEFAULT NULL,
  `p8` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `urn` int(11) NOT NULL,
  `password` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `suggestion`
--

CREATE TABLE `suggestion` (
  `urn` int(11) NOT NULL,
  `sem` int(11) NOT NULL,
  `suggestion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `teacher`
--

CREATE TABLE `teacher` (
  `name` varchar(50) NOT NULL,
  `password` text NOT NULL,
  `trn` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `information`
--
ALTER TABLE `information`
  ADD PRIMARY KEY (`urn`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`urn`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
