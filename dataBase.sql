DROP DATABASE IF EXISTS parcelDelivery;
CREATE DATABASE parcelDelivery;
USE parcelDelivery;

CREATE TABLE `user` (
  `id_user` INT NOT NULL AUTO_INCREMENT,
  `user_name` VARCHAR(45) NOT NULL UNIQUE,
  `password` VARCHAR(45) NOT NULL,
  `first_name` VARCHAR(45) NOT NULL,
  `last_name` VARCHAR(45) NOT NULL,
  `telephone` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `street_address` VARCHAR(45) NOT NULL,
  `postal_code` CHAR(5) NOT NULL,
  `city` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `parcel` (
  `id_parcel` int NOT NULL AUTO_INCREMENT,
  `id_user` int DEFAULT NULL,
  `reciever_name` varchar(45) NOT NULL,
  `reciever_telephone` varchar(45) NOT NULL,
  `reciever_street_address` varchar(45) NOT NULL,
  `reciever_postal_code` char(6) NOT NULL,
  `reciever_city` varchar(45) NOT NULL,
  `receiver_email` VARCHAR(45) NOT NULL,
  `sender_name` varchar(45) NOT NULL,
  `sender_telephone` varchar(45) DEFAULT NULL,
  `sender_street_address` varchar(45) DEFAULT NULL,
  `sender_postal_code` char(6) DEFAULT NULL,
  `sender_city` varchar(45) DEFAULT NULL,
  `sender_email` VARCHAR(45) NOT NULL,
  `parcel_dropoff_date` date DEFAULT NULL,
  `parcel_readyforpickup_date` date DEFAULT NULL,
  `parcel_pickup_date` date DEFAULT NULL,
  `parcel_last_pickup_date` date DEFAULT NULL,
  `pin_code` int DEFAULT NULL,
  `status` ENUM('ready_to_deliver', 'parcel_at_dropoff_locker', 'parcel_in_transportation', 'parcel_in_pickup_locker', 'reciever_recieved_parcel') NOT NULL,
  `desired_dropoff_locker` tinyint NOT NULL,
  `desired_pickup_locker` tinyint NOT NULL,
  `alternative_pickup_locker` tinyint DEFAULT NULL,
  `parcel_height` float NOT NULL,
  `parcel_width` float NOT NULL,
  `parcel_depth` float NOT NULL,
  `parcel_mass` float NOT NULL,
  PRIMARY KEY (`id_parcel`),
  KEY `id_user_idx` (`id_user`),
  CONSTRAINT `id_user` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `locker` (
  `id_cabinet` tinyint NOT NULL AUTO_INCREMENT,
  `locker_number` tinyint NOT NULL,
  `cabinet_number` tinyint NOT NULL,
  `cabinet_status` ENUM('free', 'has_dropoff_parcel', 'has_pickup_parcel') NOT NULL,
  `parcel_id` int DEFAULT NULL,
  PRIMARY KEY (`id_cabinet`),
  UNIQUE KEY `id_cabinet_UNIQUE` (`id_cabinet`),
  KEY `parcel_id_idx` (`parcel_id`),
  CONSTRAINT `parcel_id` FOREIGN KEY (`parcel_id`) REFERENCES `parcel` (`id_parcel`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Insert dummy data into `user` table
INSERT INTO `user` (`user_name`, `password`, `first_name`, `last_name`, `telephone`, `email`, `street_address`, `postal_code`, `city`)
VALUES
  ('shehara', '1234', 'Shehara', 'Jayawardena', '0401234567', 'shehara1991@gmail.com', 'Yliopistokatu 10B', '90014', 'Oulu'),
  ('dinesh', '1234', 'Dinesh', 'Jayawardena', '0401234567', 'shoj@jkj.com', 'Yliopistokatu 10B', '90014', 'Oulu'),
  ('Pushpa', '1234', 'pushpa', 'Jayawardena', '0401234567', 'adfa@klk.com', 'Yliopistokatu 10B', '90014', 'Oulu'),
  ('Kamal', '1234', 'kml', 'Jayawardena', '0401234567', 'ff@lk.com', 'Yliopistokatu 10B', '90014', 'Oulu'),
  ('Sumith', '1234', 'sumi', 'Jayawardena', '0401234567', 'aAF@JJK.com', 'Yliopistokatu 10B', '90014', 'Oulu');
 
-- Insert dummy data into `parcel` table
INSERT INTO `parcel`
  (`id_user`, `reciever_name`, `reciever_telephone`, `reciever_street_address`, `reciever_postal_code`, `reciever_city`, `receiver_email`, `sender_name`, `sender_telephone`,
   `sender_street_address`, `sender_postal_code`, `sender_city`, `sender_email`, 
   `parcel_dropoff_date`, `parcel_readyforpickup_date`, `parcel_pickup_date`, `parcel_last_pickup_date`,
    `pin_code`, `status`, `desired_dropoff_locker`, `desired_pickup_locker`, `alternative_pickup_locker`, `parcel_height`, `parcel_width`, `parcel_depth`, `parcel_mass`)
VALUES
  (1, 'Shehara', '0401234567', 'Yliopistokatu 10B', '90014', 'Oulu', 'shehara1991@gmail.com', 'Dinesh', '0401234567', 
  'Yliopistokatu 10B', '90014', 'Oulu', 'dineshweera@gmail.com',
   '2023-12-05', NULL, NULL, NULL,
    1234, 'parcel_in_transportation', 1, 2, NULL, 10, 10, 10, 10),
  (2, 'Shehara', '0401234567', 'Yliopistokatu 10B', '90014', 'Oulu', 'shehara1991@gmail.com', 'Dinesh', '0401234567',
   'Yliopistokatu 10B', '90014', 'Oulu', 'afajakfj@add.com',
    '2023-12-05', NULL, NULL, NULL,
     1234, 'parcel_in_transportation', 1, 2, NULL, 10, 10, 10, 10),
  -- create parcel in dropoff locker. add dropoff date
  (3, 'Shehara', '0401234567', 'Yliopistokatu 10B', '90014', 'Oulu', 'dadafaff@gmail.com', 'Dinesh', '0401234567',
   'Yliopistokatu 10B', '90014', 'Oulu', 'adadad@kjk.com',
   '2023-12-05', NULL, NULL, NULL,
     1234, 'parcel_at_dropoff_locker', 1, 3, NULL, 10, 10, 10, 10),
  -- create parcel in pickup locker
  (4, 'Shehara', '0401234567', 'Yliopistokatu 10B', '90014', 'Oulu', 'sheha@jjd.com', 'Dinesh', '0401234567',
   'Yliopistokatu 10B', '90014', 'Oulu', 'ddfsf@jjk.com',
   '2023-12-05', '2023-12-06', NULL, '2023-12-08',
      1234, 'parcel_in_pickup_locker', 1, 2, NULL, 10, 10, 10, 10);

-- Insert dummy data into `locker` table
INSERT INTO `locker` (`cabinet_number`,`locker_number`, `cabinet_status`, `parcel_id`)
VALUES
  (1, 1, 'free', NULL),
  (2, 1, 'has_dropoff_parcel', 3),
  (3, 1, 'free', NULL),
  (4, 1, 'free', NULL),
  (5, 1, 'free', NULL),
  (6, 1, 'free', NULL),
  (7, 1, 'free', NULL),
  (8, 1, 'free', NULL),
  (9, 1, 'free', NULL),
  (10, 1, 'free', NULL),
  (11, 1, 'free', NULL),
  (12,1, 'free', NULL),
  (13, 1, 'free', NULL),
  (14, 1, 'free', NULL),
  (15, 1, 'free', NULL),

  (1, 2, 'free', NULL),
  (2, 2, 'has_pickup_parcel', 4),
  (3, 2, 'free', NULL),
  (4, 2, 'free', NULL),
  (5, 2, 'free', NULL),
  (6, 2, 'free', NULL),
  (7, 2, 'free', NULL),
  (8, 2, 'free', NULL),
  (9, 2, 'free', NULL),
  (10, 2, 'free', NULL),
  (11, 2, 'free', NULL),
  (12, 2, 'free', NULL),
  (13, 2, 'free', NULL),
  (14, 2, 'free', NULL),
  (15, 2, 'free', NULL),

  (1, 3, 'free', NULL),
  (2, 3, 'free', NULL),
  (3, 3, 'free', NULL),
  (4, 3, 'free', NULL),
  (5, 3, 'free', NULL),
  (6, 3, 'free', NULL),
  (7, 3, 'free', NULL),
  (8, 3, 'free', NULL),
  (9, 3, 'free', NULL),
  (10, 3, 'free', NULL),
  (11, 3, 'free', NULL),
  (12, 3, 'free', NULL),
  (13, 3, 'free', NULL),
  (14, 3, 'free', NULL),
  (15, 3, 'free', NULL),

  (1, 4, 'free', NULL),
  (2, 4, 'free', NULL),
  (3, 4, 'free', NULL),
  (4, 4, 'free', NULL),
  (5, 4, 'free', NULL),
  (6, 4, 'free', NULL),
  (7, 4, 'free', NULL),
  (8, 4, 'free', NULL),
  (9, 4, 'free', NULL),
  (10, 4, 'free', NULL),
  (11, 4, 'free', NULL),
  (12, 4, 'free', NULL),
  (13, 4, 'free', NULL),
  (14, 4, 'free', NULL),
  (15, 4, 'free', NULL),

  (1, 5, 'free', NULL),
  (2, 5, 'free', NULL),
  (3, 5, 'free', NULL),
  (4, 5, 'free', NULL),
  (5, 5, 'free', NULL),
  (6, 5, 'free', NULL),
  (7, 5, 'free', NULL),
  (8, 5, 'free', NULL),
  (9, 5, 'free', NULL),
  (10, 5, 'free', NULL),
  (11, 5, 'free', NULL),
  (12, 5, 'free', NULL),
  (13, 5, 'free', NULL),
  (14, 5, 'free', NULL),
  (15, 5, 'free', NULL);

-- Display the inserted data
SELECT * FROM `user`;
SELECT * FROM `parcel`;
SELECT * FROM `locker`;
