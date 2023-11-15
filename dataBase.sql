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
  `parcel_dropoff_code` INT NOT NULL,
  `parcel_pickup_code` INT NOT NULL,
  `parcel_status` TINYINT NOT NULL,
  `parcel_dropoff_locker` TINYINT(5) NOT NULL,
  `parcel_pickup_locker` TINYINT(5) NOT NULL,
  `parcel_height` FLOAT NOT NULL,
  `parcel_width` FLOAT NOT NULL,
  `parcel_depth` FLOAT NOT NULL,
  `parcel_mass` FLOAT NOT NULL,
  PRIMARY KEY (`id_parcel`),
  KEY `id_user_idx` (`id_user`),
  CONSTRAINT `id_user` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `locker` (
  `id_cabinet` TINYINT NOT NULL,
  `parcel_id` INT DEFAULT NULL,
  `locker_number` TINYINT NOT NULL,
  `cabinet_status` TINYINT NOT NULL,
  PRIMARY KEY (`id_cabinet`),
  KEY `parcel_id_idx` (`parcel_id`),
  CONSTRAINT `parcel_id` FOREIGN KEY (`parcel_id`) REFERENCES `parcel` (`id_parcel`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


/*
Values for cabinet status:
1 - cabinet is empty
2 - cabinet has a parcel to collect by driver
3 - cabinet has a parcel to pickup by a customer
*/

/*
Values for parcel status:
0 - parcel is ready (moment when sender confirm the action of sending parcel)
1 - parcel is in the dropoff locker (moment when sender drop off the parcel at dropoff locker and close the cabinet door)
2 - parcel is in transportation (from the moment of driver collect the parcel and transport it to the destination locker)
3 - parcel is in the pickup locker (moment when driver put the package in the destination(pickup location) locker and close the door
4 - parcel is delivered to the reciever (moment when reciever collect the parcel from pickup locker and close the cabinet door )
*/

