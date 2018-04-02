-- phpMyAdmin SQL Dump
-- version 4.7.9
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 02, 2018 at 03:30 PM
-- Server version: 10.1.31-MariaDB
-- PHP Version: 7.2.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `comp523`
--

-- --------------------------------------------------------

--
-- Table structure for table `answers`
--

CREATE TABLE `answers` (
  `answer_id` int(11) NOT NULL,
  `answer` text NOT NULL,
  `correct_answer` tinyint(1) NOT NULL,
  `question_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `answers`
--

INSERT INTO `answers` (`answer_id`, `answer`, `correct_answer`, `question_id`) VALUES
(9, 'Salt (Halite)', 0, 1),
(10, 'Water', 1, 1),
(11, 'Diamond', 0, 1),
(12, 'Snow', 0, 1),
(13, '1', 0, 2),
(14, '4', 1, 2),
(15, '3', 0, 2),
(16, '5', 0, 2),
(26, '101', 1, 9),
(27, '12', 0, 9),
(28, '2', 0, 10),
(29, '4', 0, 10),
(30, '10', 0, 10),
(31, '5', 1, 10),
(32, '100', 0, 10),
(33, '1', 0, 11),
(34, '124', 0, 11),
(35, '213', 0, 11),
(36, '42', 0, 11),
(37, '100', 1, 11);

-- --------------------------------------------------------

--
-- Table structure for table `groups`
--

CREATE TABLE `groups` (
  `type` text NOT NULL,
  `group_id` int(11) NOT NULL,
  `is_admin` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `groups`
--

INSERT INTO `groups` (`type`, `group_id`, `is_admin`) VALUES
('instructor', 1, 1),
('TA', 2, 1),
('student', 3, 0);

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `question_id` int(11) NOT NULL,
  `question` text NOT NULL,
  `quiz_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`question_id`, `question`, `quiz_id`) VALUES
(1, 'Which of these is not a mineral?', 1),
(2, 'What is 2 +2?', 1),
(3, 'What is 4+6?', 1),
(9, '<p><strong>Test Quiz Q1: 1+100 = ?</strong></p>', 10),
(10, '<p>Here is a question.<strong><sub> The Answer is 5.</sub></strong></p>', 11),
(11, '<p><strong>Here is another question. The answer should be 100.</strong></p>', 11);

-- --------------------------------------------------------

--
-- Table structure for table `quiz`
--

CREATE TABLE `quiz` (
  `quiz_id` int(11) NOT NULL,
  `due_date` datetime NOT NULL,
  `creation_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `quiz_name` varchar(255) NOT NULL,
  `start_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `quiz`
--

INSERT INTO `quiz` (`quiz_id`, `due_date`, `creation_date`, `quiz_name`, `start_date`) VALUES
(1, '2018-04-06 00:00:00', '2018-04-01 15:43:19', 'Test Quiz 1', '0000-00-00 00:00:00'),
(2, '2018-04-03 00:00:00', '2018-04-01 15:43:03', 'Test Quiz 2', '0000-00-00 00:00:00'),
(3, '2018-04-12 00:00:00', '2018-04-01 15:45:59', 'Test Quiz 3', '0000-00-00 00:00:00'),
(10, '0000-00-00 00:00:00', '2018-04-01 20:22:34', 'Test Quiz Entry 1', '0000-00-00 00:00:00'),
(11, '0000-00-00 00:00:00', '2018-04-02 09:23:36', 'Test Quiz Create 2', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `pid` int(11) NOT NULL,
  `onyen` text NOT NULL,
  `first_name` text NOT NULL,
  `last_name` text NOT NULL,
  `group_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`pid`, `onyen`, `first_name`, `last_name`, `group_id`) VALUES
(720466550, 'manjil', 'Manjil', 'Thapa', 3),
(720470689, 'k1996', 'Kacey', 'Cleveland', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `answers`
--
ALTER TABLE `answers`
  ADD PRIMARY KEY (`answer_id`);

--
-- Indexes for table `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`group_id`);

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`question_id`);

--
-- Indexes for table `quiz`
--
ALTER TABLE `quiz`
  ADD PRIMARY KEY (`quiz_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`pid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `answers`
--
ALTER TABLE `answers`
  MODIFY `answer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `question_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `quiz`
--
ALTER TABLE `quiz`
  MODIFY `quiz_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
