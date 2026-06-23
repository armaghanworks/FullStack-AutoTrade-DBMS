
BEGIN EXECUTE IMMEDIATE 'DROP TABLE Listings CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE Vehicles CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE Categories CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE Locations CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE Users CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/

CREATE TABLE Users (
    user_id    NUMBER        PRIMARY KEY,
    name       VARCHAR2(100) NOT NULL,
    email      VARCHAR2(150) UNIQUE NOT NULL,
    password   VARCHAR2(255) NOT NULL,
    phone      VARCHAR2(20),
    created_at DATE DEFAULT SYSDATE
);

CREATE TABLE Categories (
    category_id   NUMBER       PRIMARY KEY,
    category_name VARCHAR2(50) NOT NULL
);

CREATE TABLE Locations (
    location_id NUMBER        PRIMARY KEY,
    city        VARCHAR2(200) NOT NULL,
    latitude    NUMBER(10,6),
    longitude   NUMBER(10,6)
);

CREATE TABLE Vehicles (
    vehicle_id  NUMBER        PRIMARY KEY,
    title       VARCHAR2(200) NOT NULL,
    brand       VARCHAR2(100),
    model       VARCHAR2(100),
    year        NUMBER(4),
    price       NUMBER(15,2)  NOT NULL,
    kilometers  NUMBER(10),
    fuel        VARCHAR2(50),
    description VARCHAR2(2000),
    image_url   CLOB,
    category_id NUMBER        NOT NULL,
    location_id NUMBER        NOT NULL,
    user_id     NUMBER        NOT NULL,
    CONSTRAINT fk_veh_cat FOREIGN KEY (category_id) REFERENCES Categories(category_id),
    CONSTRAINT fk_veh_loc FOREIGN KEY (location_id) REFERENCES Locations(location_id),
    CONSTRAINT fk_veh_usr FOREIGN KEY (user_id)     REFERENCES Users(user_id)
);

CREATE TABLE Listings (
    listing_id NUMBER       PRIMARY KEY,
    vehicle_id NUMBER       NOT NULL,
    post_date  DATE         DEFAULT SYSDATE,
    status     VARCHAR2(20) DEFAULT 'active'
               CONSTRAINT chk_status CHECK (status IN ('active','sold','inactive','pending')),
    CONSTRAINT fk_lst_veh FOREIGN KEY (vehicle_id) REFERENCES Vehicles(vehicle_id)
);

SELECT table_name FROM user_tables
WHERE table_name IN ('USERS','CATEGORIES','LOCATIONS','VEHICLES','LISTINGS')
ORDER BY table_name;
