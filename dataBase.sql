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
  `id_parcel` INT NOT NULL AUTO_INCREMENT,
  `id_user` INT DEFAULT NULL,
  `locker_number` TINYINT DEFAULT NULL,
  `reciever_name` VARCHAR(45) NOT NULL,
  `reciever_telephone` VARCHAR(45) NOT NULL,
  `reciever_street_address` VARCHAR(45) NOT NULL,
  `reciever_postal_code` CHAR(6) NOT NULL,
  `reciever_city` VARCHAR(45) NOT NULL,
  `sender_name` VARCHAR(45) NOT NULL,
  `sender_telephone` VARCHAR(45) DEFAULT NULL,
  `sender_street_address` VARCHAR(45) DEFAULT NULL,
  `sender_postal_code` CHAR(5) DEFAULT NULL,
  `sender_city` VARCHAR(45) DEFAULT NULL,
  `parcel_dropoff_date` DATE NOT NULL,
  `parcel_pickup_date` DATE NOT NULL,
  `parcel_last_pickup_date` DATE NOT NULL,
  `parcel_dropoff_code` INT DEFAULT NULL,
  `parcel_pickup_code` INT DEFAULT NULL,
  `status` TINYINT NOT NULL,
  PRIMARY KEY (`id_parcel`),
  KEY `locker_number_idx` (`locker_number`),
  KEY `id_user_idx` (`id_user`),
  CONSTRAINT `id_user` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `locker` (
  `id_cabinet` TINYINT NOT NULL,
  `parcel_id` INT DEFAULT NULL,
  `locker_number` TINYINT NOT NULL,
  `cabinet_status` TINYINT NOT NULL,
  PRIMARY KEY (`id_cabinet`),
  UNIQUE KEY `unique_locker_number` (`locker_number`),
  KEY `parcel_id_idx` (`parcel_id`),
  CONSTRAINT `parcel_id` FOREIGN KEY (`parcel_id`) REFERENCES `parcel` (`id_parcel`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Add foreign key constraint for parcel referring to locker
ALTER TABLE `parcel`
ADD CONSTRAINT `locker_number` FOREIGN KEY (`locker_number`) REFERENCES `locker` (`locker_number`) ON DELETE SET NULL;

/*
Values for cabinet status:
1 - cabinet is empty
2 - parcel to dropoff
3 - parcel to pickup
*/

/*
Values for parcel status:
1 - parcel is in the dropoff locker
2 - parcel is transported (by consumer user to dropoff locker or by driver to pickup locker)
3 - parcel is in the pickup locker
4 - parcel is delivered to the reciever (final status)
*/
-- insert data for testing
-- Insert data into `user` table
-- INSERT INTO user (
--   user_name,
--   password,
--   first_name,
--   last_name,
--   telephone,
--   email,
--   street_address,
--   postal_code,
--   city
-- ) VALUES (
--   'john_doe',
--   'password123',
--   'John',
--   'Doe',
--   '1234567890',
--   'john.doe@example.com',
--   '123 Main St',
--   '12345',
--   'CityA'
-- );



