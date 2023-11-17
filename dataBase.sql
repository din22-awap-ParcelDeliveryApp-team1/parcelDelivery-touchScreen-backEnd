DROP DATABASE IF EXISTS parcelDelivery;
CREATE DATABASE parcelDelivery;
USE parcelDelivery;

CREATE TABLE `user` (
  `id_user` INT NOT NULL AUTO_INCREMENT,
  `user_name` VARCHAR(45) NOT NULL,
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
  `sender_name` varchar(45) NOT NULL,
  `sender_telephone` varchar(45) DEFAULT NULL,
  `sender_street_address` varchar(45) DEFAULT NULL,
  `sender_postal_code` char(5) DEFAULT NULL,
  `sender_city` varchar(45) DEFAULT NULL,
  `parcel_dropoff_date` date NOT NULL,
  `parcel_pickup_date` date NOT NULL,
  `parcel_last_pickup_date` date NOT NULL,
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
  `id_cabinet` tinyint NOT NULL,
  `locker_number` tinyint NOT NULL,
  `cabinet_number` tinyint NOT NULL,
  `cabinet_status` ENUM('free', 'has_dropoff_parcel', 'has_pickup_parcel') NOT NULL,
  `parcel_id` int DEFAULT NULL,
  PRIMARY KEY (`id_cabinet`),
  UNIQUE KEY `id_cabinet_UNIQUE` (`id_cabinet`),
  KEY `parcel_id_idx` (`parcel_id`),
  CONSTRAINT `parcel_id` FOREIGN KEY (`parcel_id`) REFERENCES `parcel` (`id_parcel`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*
Values for cabinet status:
free - cabinet is empty
has_dropoff_parcel - cabinet has a parcel to collect by driver
has_pickup_parcel - cabinet has a parcel to pickup by a customer
*/

-- Insert dummy data into `user` table
INSERT INTO `user` (`user_name`, `password`, `first_name`, `last_name`, `telephone`, `email`, `street_address`, `postal_code`, `city`)
VALUES
  ('testuser1', 'password1', 'John', 'Doe', '123456789', 'john.doe@example.com', '123 Main St', '12345', 'City1'),
  ('testuser2', 'password2', 'Jane', 'Smith', '987654321', 'jane.smith@example.com', '456 Oak St', '54321', 'City2');

-- Insert dummy data into `parcel` table
INSERT INTO `parcel`
  (`id_user`, `reciever_name`, `reciever_telephone`, `reciever_street_address`, `reciever_postal_code`, `reciever_city`,
   `sender_name`, `sender_telephone`, `sender_street_address`, `sender_postal_code`, `sender_city`,
   `parcel_dropoff_date`, `parcel_pickup_date`, `parcel_last_pickup_date`,
   `pin_code`, `status`, `desired_dropoff_locker`, `desired_pickup_locker`, `alternative_pickup_locker`,
   `parcel_height`, `parcel_width`, `parcel_depth`, `parcel_mass`)
VALUES
  (1, 'Receiver1', '987654321', '789 Elm St', '67890', 'City3', 'Sender1', '123456789', '123 Maple St', '54321', 'City4',
   '2023-11-10', '2023-11-12', '2023-11-15',
   1001, 'ready_to_deliver', 1, 2, NULL, 10.5, 8.2, 5.0, 2.3),
  (2, 'Receiver2', '555555555', '456 Pine St', '12345', 'City5', 'Sender2', '111111111', '789 Birch St', '98765', 'City6',
   '2023-11-11', '2023-11-13', '2023-11-16',
   1002, 'ready_to_deliver', 1, 2, NULL, 12.0, 9.8, 6.2, 3.5);

-- Insert dummy data into `locker` table
INSERT INTO `locker` (`id_cabinet`, `locker_number`, `cabinet_number`, `cabinet_status`, `parcel_id`)
VALUES
  (1, 1, 1, 'free', NULL),
  (2, 1, 2,'has_dropoff_parcel', 1),
  (3, 1, 3, 'has_pickup_parcel', 2),
  
  (4, 2, 1, 'free', NULL),
  (5, 2, 2, 'free', NULL),
  
  (6, 3, 1, 'has_pickup_parcel', 1),
  (7, 3, 2, 'free', NULL);


select * from user;
select * from parcel;
select * from locker;


