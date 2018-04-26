-- phpMyAdmin SQL Dump
-- version 4.7.9
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 25, 2018 at 07:50 PM
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
(41, 'as', 1, 14),
(42, '123', 1, 15),
(43, 'as', 1, 16),
(44, '123', 1, 17),
(45, 'as', 1, 18),
(46, '123', 1, 19),
(47, '123', 1, 20),
(48, 'sd', 1, 21),
(49, 'ads', 1, 22),
(50, 'asd', 1, 23),
(51, '32', 1, 24),
(52, 'sd', 1, 25),
(53, '123', 1, 26),
(54, 'asd', 1, 27),
(55, 'asd', 1, 28),
(56, '1', 0, 29),
(57, '2', 1, 29),
(58, '3', 0, 29),
(59, '10', 1, 3),
(60, '12', 0, 30),
(61, '5', 1, 30),
(62, '2', 0, 30),
(63, '2', 1, 31),
(64, '312', 0, 31),
(65, '12', 0, 31),
(66, '12', 1, 32),
(67, '4', 0, 32),
(68, '5', 0, 32);

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
(1, 720462663),
(1, 720470689),
(2, 234),
(2, 720462663),
(2, 720470689),
(3, 234),
(3, 720470689),
(20, 720466550),
(21, 242),
(22, 336),
(23, 720466550),
(27, 242),
(27, 704),
(29, 336),
(32, 704),
(32, 720462663),
(32, 720470689),
(34, 720462663);

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
(14, 'adsadas', 17),
(15, 'Test', 18),
(16, 'sadas', 19),
(17, 'Test Q', 20),
(18, 'asdsa', 21),
(19, 'asdas', 22),
(20, '123', 23),
(21, 'sad', 24),
(22, 'dsa', 25),
(23, 'asd', 26),
(24, 'Test', 27),
(25, 'sdafdsa', 28),
(26, 'Test quest', 29),
(27, 'asdas', 30),
(28, 'asdas', 31),
(29, 'Test question 1', 32),
(30, 'Test Question', 33),
(31, 'Test Question 1', 34),
(32, 'Test question 123 again', 34);

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
(1, '2018-04-01 15:43:19', 'Test Quiz 1'),
(2, '2018-04-01 15:43:03', 'Test Quiz 2'),
(3, '2018-04-01 15:45:59', 'Test Quiz 3'),
(10, '2018-04-01 20:22:34', 'Test Quiz Entry 1'),
(15, '2018-04-02 11:04:15', 'test q'),
(16, '2018-04-02 11:08:31', 'Test Quiz Create 3'),
(17, '2018-04-02 11:09:01', 'Test Quiz Create 3'),
(18, '2018-04-02 11:11:14', 'Test Create quiz 1#'),
(19, '2018-04-02 11:11:50', 'Test Quiz Create #12'),
(20, '2018-04-02 11:26:58', 'Create Quiz'),
(21, '2018-04-02 11:29:08', 'Test Quiz Create'),
(22, '2018-04-02 11:52:41', 'Test QUiz Create'),
(23, '2018-04-02 11:53:14', 'Test Create Quiz #2'),
(24, '2018-04-02 11:54:37', 'sdafasd'),
(25, '2018-04-02 11:55:14', 'sndlas'),
(26, '2018-04-02 11:57:24', 'sadas'),
(27, '2018-04-02 12:03:58', 'Test Quiz #12312'),
(28, '2018-04-02 13:09:58', 'Test QUiz Create'),
(29, '2018-04-02 13:10:35', 'Test Quiz Again'),
(30, '2018-04-02 13:12:44', 'Test Quiz 123'),
(31, '2018-04-02 13:13:18', 'asdas Quiz'),
(32, '2018-04-03 13:18:19', 'Test quiz 1'),
(33, '2018-04-22 18:11:08', 'New Quiz Test 4/22'),
(34, '2018-04-22 18:11:49', 'Test Quiz 4/22 #2');

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

--
-- Dumping data for table `quiz_submission`
--

INSERT INTO `quiz_submission` (`id`, `pid`, `quiz_id`, `score`, `total`, `timestamp`) VALUES
(55, 720470689, 1, 6, 6, '2018-04-22 20:57:02'),
(58, 720470689, 32, 2, 2, '2018-04-22 21:03:50'),
(59, 720462663, 34, 1, 4, '2018-04-23 17:41:48'),
(60, 214124532, 1, 4, 6, '2018-04-25 13:40:35'),
(61, 123123123, 1, 3, 6, '2018-04-25 13:40:51'),
(63, 234, 1, 4, 6, '2018-04-25 13:42:03'),
(64, 242, 1, 1, 6, '2018-04-25 13:42:18'),
(65, 720462663, 1, 5, 6, '2018-04-25 13:42:47'),
(69, 720462663, 32, 2, 2, '2018-04-25 13:49:34');

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

--
-- Dumping data for table `quiz_submission_answers`
--

INSERT INTO `quiz_submission_answers` (`submission_id`, `question_id`, `answer_id`, `correct`) VALUES
(55, 1, 10, 1),
(55, 2, 14, 1),
(55, 3, 59, 1),
(58, 29, 57, 1),
(59, 31, 63, 1),
(59, 31, 64, 0),
(59, 32, 66, 1),
(59, 32, 67, 0),
(59, 32, 68, 0),
(65, 1, 10, 1),
(65, 1, 11, 0),
(65, 2, 14, 1),
(65, 3, 59, 1),
(69, 29, 57, 1);

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
(3, 'test'),
(4, 'import_test'),
(5, 'import_test'),
(6, 'import_test'),
(7, 'import_test'),
(8, 'import_test'),
(9, 'import_test'),
(10, 'import_test'),
(11, 'import_test'),
(12, 'import_test'),
(13, 'import_test'),
(14, 'import_test'),
(15, 'import_test'),
(16, 'import_test'),
(17, 'import_test'),
(18, 'import_test'),
(19, 'HeelMail'),
(20, 'import_test'),
(21, 'import_test'),
(22, 'import_test'),
(23, 'import_test'),
(24, 'import_test'),
(25, 'import_test'),
(26, 'import_test'),
(27, 'import_test'),
(28, 'import_test'),
(29, 'import_test'),
(30, 'import_test'),
(31, 'import_test'),
(32, 'import_test');

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
(720462663, 3),
(720462663, 4),
(720462663, 5),
(720462663, 6),
(720462663, 7),
(720462663, 8),
(720462663, 9),
(720462663, 10),
(720462663, 11),
(720462663, 12),
(720462663, 13),
(720462663, 14),
(720462663, 15),
(720462663, 17),
(720462663, 18),
(720462663, 19),
(720462663, 20),
(720462663, 21),
(720462663, 22),
(720462663, 23),
(720462663, 24),
(720462663, 25),
(720462663, 26),
(720462663, 27),
(720462663, 28),
(720462663, 29),
(720462663, 30),
(720462663, 31),
(1231231232, 32);

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
(239, 'testuser6', 'test', 'user6', 3),
(240, 'testuser7', 'test', 'user7', 3),
(241, 'testuser8', 'test', 'user8', 3),
(242, 'testuser9', 'test', 'user9', 3),
(336, 'stevenan', 'stephen', 'nguyen', 3),
(704, 'stevenan', 'steven', 'nguyen', 3),
(800, 'stevenan', 'stephen', 'nguyen', 3),
(911, 'stevenan', 'stephen', 'nguyen', 3),
(919, 'stevenan', 'stephen', 'nguyen', 3),
(7777, 'steven', 'ste', 'ng', 3),
(123123123, 'sdfasdfas', 'asdf', 'sdaf', 3),
(214124532, 'testonyen', ' testname2', 'testname', 3),
(720462663, 'stevenan', 'Steven', 'Nguyen', 1),
(720466550, 'manjil', 'Manjil', 'Thapa', 1),
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
(235, 1),
(236, 1),
(237, 2),
(238, 1),
(239, 1),
(240, 2),
(241, 2),
(242, 2),
(704, 8),
(336, 10),
(919, 11),
(800, 13),
(919, 14),
(919, 18),
(919, 21),
(919, 22),
(919, 24),
(911, 26),
(911, 28),
(911, 29),
(7777, 1),
(123123123, 1),
(214124532, 30),
(214124532, 31),
(214124532, 32);

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
  MODIFY `answer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `question_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `quiz`
--
ALTER TABLE `quiz`
  MODIFY `quiz_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `quiz_submission`
--
ALTER TABLE `quiz_submission`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- AUTO_INCREMENT for table `section`
--
ALTER TABLE `section`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

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
  ADD CONSTRAINT `section` FOREIGN KEY (`section_id`) REFERENCES `section` (`id`),
  ADD CONSTRAINT `ta` FOREIGN KEY (`ta_id`) REFERENCES `users` (`pid`);

--
-- Constraints for table `user_section`
--
ALTER TABLE `user_section`
  ADD CONSTRAINT `user` FOREIGN KEY (`pid`) REFERENCES `users` (`pid`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_section_ibfk_1` FOREIGN KEY (`section_id`) REFERENCES `section` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
