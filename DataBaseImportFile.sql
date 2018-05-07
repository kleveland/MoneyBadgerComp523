-- phpMyAdmin SQL Dump
-- version 4.7.9
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 07, 2018 at 01:03 AM
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
(10, 'Water', 0, 1),
(11, 'Diamond', 0, 1),
(12, 'Snow', 1, 1),
(13, '1', 0, 2),
(14, '4', 0, 2),
(15, '3', 0, 2),
(16, '5', 1, 2),
(59, '10', 1, 3),
(71, '1', 1, 35),
(72, '2', 0, 35),
(73, '123', 0, 36),
(74, '123', 0, 36),
(75, '2', 0, 36),
(76, '3', 1, 36),
(77, 'true', 0, 37),
(78, 'false', 0, 37),
(79, 'nope', 1, 37),
(80, '12', 0, 38),
(81, '2', 1, 38),
(82, '51', 0, 38),
(83, '1', 0, 39),
(84, '2', 1, 39),
(85, '3', 0, 39);

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
('Instructor', 1, 1),
('TA', 2, 1),
('Student', 3, 0);

-- --------------------------------------------------------

--
-- Table structure for table `open_quiz`
--

CREATE TABLE `open_quiz` (
  `quiz_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `open_quiz`
--

INSERT INTO `open_quiz` (`quiz_id`, `user_id`) VALUES
(1, 234),
(1, 236),
(1, 237),
(1, 238),
(1, 241),
(1, 1234),
(1, 720462663),
(1, 720470689);

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
(1, 'Which of these is not a mineral?123', 1),
(2, 'What is 2 +2? Yes.NO', 1),
(3, 'What is 4+6?', 1),
(33, 'testq', 1),
(35, 'testq', 1),
(36, 'testq3', 1),
(37, '<p style=\"text-align: center;\"><span style=\"font-size: 0.9375rem;\">Question 1: 2=2?</span></p>', 35),
(38, '<p><strong>Question 2:</strong></p><p><strong><br></strong></p><p><strong>1+1</strong></p>', 35),
(39, 'testq', 35);

-- --------------------------------------------------------

--
-- Table structure for table `quiz`
--

CREATE TABLE `quiz` (
  `quiz_id` int(11) NOT NULL,
  `creation_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `quiz_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `quiz`
--

INSERT INTO `quiz` (`quiz_id`, `creation_date`, `quiz_name`) VALUES
(1, '2018-05-06 11:03:56', 'Test Quiz 12334'),
(35, '2018-05-06 17:14:25', 'Test Quiz 2');

-- --------------------------------------------------------

--
-- Table structure for table `quiz_submission`
--

CREATE TABLE `quiz_submission` (
  `id` int(11) NOT NULL,
  `pid` int(11) NOT NULL,
  `quiz_id` int(11) NOT NULL,
  `score` int(11) NOT NULL,
  `total` int(11) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `quiz_submission_answers`
--

CREATE TABLE `quiz_submission_answers` (
  `submission_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `answer_id` int(11) NOT NULL,
  `correct` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `section`
--

CREATE TABLE `section` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `section`
--

INSERT INTO `section` (`id`, `name`) VALUES
(1, '101'),
(2, '102'),
(35, 'import_test');

-- --------------------------------------------------------

--
-- Table structure for table `ta_section`
--

CREATE TABLE `ta_section` (
  `ta_id` int(11) NOT NULL,
  `section_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `ta_section`
--

INSERT INTO `ta_section` (`ta_id`, `section_id`) VALUES
(123, 1),
(124, 2),
(123453212, 35);

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
(123, 'tatest1', 'Joe', 'Smoe', 2),
(124, 'tatest2', 'Sarah', 'Smith', 2),
(234, 'testuser1', 'test', 'user1', 3),
(235, 'testuser2', 'test', 'user2', 3),
(236, 'testuser3', 'test', 'user3', 3),
(237, 'testuser4', 'test', 'user4', 3),
(238, 'testuser5', 'test', 'user5', 3),
(241, 'testuser8', 'test', 'user8', 3),
(1234, '123', '123', '123', 3),
(32423432, '123', '123user', '123user2', 3),
(123453212, 'testatata', 'tatesttest', 'testtata', 2),
(720462663, 'stevenan', 'Steven', 'Nguyen', 1),
(720466550, 'manjil', 'Manjil', 'Thapa', 1),
(720469515, 'lukeatha', 'Luke', 'Athans', 1),
(720470689, 'k1996', 'Kacey', 'Cleveland', 1),
(1231231232, 'testTA123', 'testTA123', 'testTA', 2);

-- --------------------------------------------------------

--
-- Table structure for table `user_section`
--

CREATE TABLE `user_section` (
  `pid` int(11) NOT NULL,
  `section_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_section`
--

INSERT INTO `user_section` (`pid`, `section_id`) VALUES
(234, 1),
(235, 2),
(236, 1),
(237, 1),
(238, 1),
(241, 1),
(1234, 1),
(32423432, 2);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `answers`
--
ALTER TABLE `answers`
  ADD PRIMARY KEY (`answer_id`),
  ADD KEY `question_id` (`question_id`);

--
-- Indexes for table `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`group_id`);

--
-- Indexes for table `open_quiz`
--
ALTER TABLE `open_quiz`
  ADD UNIQUE KEY `unique_entry` (`quiz_id`,`user_id`),
  ADD KEY `open_quiz_ibfk_2` (`user_id`);

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`question_id`),
  ADD KEY `questions_ibfk_1` (`quiz_id`);

--
-- Indexes for table `quiz`
--
ALTER TABLE `quiz`
  ADD PRIMARY KEY (`quiz_id`);

--
-- Indexes for table `quiz_submission`
--
ALTER TABLE `quiz_submission`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_entry` (`pid`,`quiz_id`),
  ADD KEY `quiz_id` (`quiz_id`);

--
-- Indexes for table `quiz_submission_answers`
--
ALTER TABLE `quiz_submission_answers`
  ADD UNIQUE KEY `unique_entry` (`submission_id`,`question_id`,`answer_id`) USING BTREE,
  ADD KEY `answer_id` (`answer_id`),
  ADD KEY `question_id` (`question_id`);

--
-- Indexes for table `section`
--
ALTER TABLE `section`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ta_section`
--
ALTER TABLE `ta_section`
  ADD KEY `ta` (`ta_id`),
  ADD KEY `section` (`section_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`pid`);

--
-- Indexes for table `user_section`
--
ALTER TABLE `user_section`
  ADD KEY `user` (`pid`),
  ADD KEY `section_id` (`section_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `answers`
--
ALTER TABLE `answers`
  MODIFY `answer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=86;

--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `question_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `quiz`
--
ALTER TABLE `quiz`
  MODIFY `quiz_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `quiz_submission`
--
ALTER TABLE `quiz_submission`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=80;

--
-- AUTO_INCREMENT for table `section`
--
ALTER TABLE `section`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `answers`
--
ALTER TABLE `answers`
  ADD CONSTRAINT `answers_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`question_id`) ON DELETE CASCADE;

--
-- Constraints for table `open_quiz`
--
ALTER TABLE `open_quiz`
  ADD CONSTRAINT `open_quiz_ibfk_1` FOREIGN KEY (`quiz_id`) REFERENCES `quiz` (`quiz_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `open_quiz_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`pid`) ON DELETE CASCADE;

--
-- Constraints for table `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`quiz_id`) REFERENCES `quiz` (`quiz_id`) ON DELETE CASCADE;

--
-- Constraints for table `quiz_submission`
--
ALTER TABLE `quiz_submission`
  ADD CONSTRAINT `quiz_submission_ibfk_1` FOREIGN KEY (`pid`) REFERENCES `users` (`pid`) ON DELETE CASCADE,
  ADD CONSTRAINT `quiz_submission_ibfk_2` FOREIGN KEY (`quiz_id`) REFERENCES `quiz` (`quiz_id`) ON DELETE CASCADE;

--
-- Constraints for table `quiz_submission_answers`
--
ALTER TABLE `quiz_submission_answers`
  ADD CONSTRAINT `quiz_submission_answers_ibfk_1` FOREIGN KEY (`answer_id`) REFERENCES `answers` (`answer_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `quiz_submission_answers_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `questions` (`question_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `quiz_submission_answers_ibfk_3` FOREIGN KEY (`submission_id`) REFERENCES `quiz_submission` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `ta_section`
--
ALTER TABLE `ta_section`
  ADD CONSTRAINT `section` FOREIGN KEY (`section_id`) REFERENCES `section` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `ta` FOREIGN KEY (`ta_id`) REFERENCES `users` (`pid`) ON DELETE CASCADE;

--
-- Constraints for table `user_section`
--
ALTER TABLE `user_section`
  ADD CONSTRAINT `user` FOREIGN KEY (`pid`) REFERENCES `users` (`pid`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_section_ibfk_1` FOREIGN KEY (`section_id`) REFERENCES `section` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
