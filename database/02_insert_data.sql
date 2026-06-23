
-- Categories
INSERT INTO Categories VALUES (1, 'Car');
INSERT INTO Categories VALUES (2, 'Bike');

-- Locations
INSERT INTO Locations VALUES (1, 'Gulshan-e-Iqbal, Karachi',  24.943000, 67.116000);
INSERT INTO Locations VALUES (2, 'DHA Phase 5, Karachi',      24.823000, 67.063000);
INSERT INTO Locations VALUES (3, 'Nazimabad, Karachi',        24.920800, 67.033500);
INSERT INTO Locations VALUES (4, 'Bahria Town, Karachi',      24.850000, 67.130000);
INSERT INTO Locations VALUES (5, 'Gulberg III, Lahore',       31.530000, 74.343500);
INSERT INTO Locations VALUES (6, 'Model Town, Lahore',        31.583000, 74.344000);
INSERT INTO Locations VALUES (7, 'F-8 Markaz, Islamabad',    33.720000, 73.078000);
INSERT INTO Locations VALUES (8, 'H-8, Islamabad',           33.677000, 73.038000);
INSERT INTO Locations VALUES (9, 'I-8, Islamabad',           33.660000, 73.025000);

-- Users
INSERT INTO Users (user_id, name, email, password, phone)
    VALUES (1, 'Armaghan Khan', 'armaghan@autotrade.pk', 'pass123', '03123456789');
INSERT INTO Users (user_id, name, email, password, phone)
    VALUES (2, 'Roman',        'roman@autotrade.pk',    'pass456', '03219876543');
INSERT INTO Users (user_id, name, email, password, phone)
    VALUES (3, 'Fahad Khan',   'fahad@autotrade.pk',    'pass789', '03001122334');

-- Vehicles 
INSERT INTO Vehicles (vehicle_id,title,brand,model,year,price,kilometers,fuel,description,image_url,category_id,location_id,user_id)
VALUES (1,'Lamborghini Huracán','Lamborghini','Huracán',2023,32000000,5000,'Petrol',
    'Pristine white Lamborghini with full service history.',
    'https://images.unsplash.com/photo-1742056024244-02a093dae0b5?w=600',1,1,1);

INSERT INTO Vehicles (vehicle_id,title,brand,model,year,price,kilometers,fuel,description,image_url,category_id,location_id,user_id)
VALUES (2,'Mercedes-AMG GT','Mercedes','AMG GT',2023,28500000,3200,'Petrol',
    'Stunning Mercedes-AMG GT in showroom condition.',
    'https://images.unsplash.com/photo-1698543252450-463b8b16e567?w=600',1,2,2);

INSERT INTO Vehicles (vehicle_id,title,brand,model,year,price,kilometers,fuel,description,image_url,category_id,location_id,user_id)
VALUES (3,'BMW M4 Competition','BMW','M4 Competition',2022,18500000,8500,'Petrol',
    'Gorgeous BMW M4 Competition. Exceptional handling.',
    'https://images.unsplash.com/photo-1698543252507-cd8c187212e2?w=600',1,7,3);

INSERT INTO Vehicles (vehicle_id,title,brand,model,year,price,kilometers,fuel,description,image_url,category_id,location_id,user_id)
VALUES (4,'Yamaha YZF-R1','Yamaha','YZF-R1',2023,3500000,1200,'Petrol',
    'Premium Yamaha superbike with cutting-edge technology.',
    'https://images.unsplash.com/photo-1762012507866-ef40646195c0?w=600',2,8,3);

INSERT INTO Vehicles (vehicle_id,title,brand,model,year,price,kilometers,fuel,description,image_url,category_id,location_id,user_id)
VALUES (5,'Ducati Panigale V4','Ducati','Panigale V4',2023,4200000,800,'Petrol',
    'Stunning Ducati Panigale V4 in pristine condition.',
    'https://images.unsplash.com/photo-1677587690975-20d44c7e6d31?w=600',2,5,3);

INSERT INTO Vehicles (vehicle_id,title,brand,model,year,price,kilometers,fuel,description,image_url,category_id,location_id,user_id)
VALUES (6,'Ducati 959 Panigale','Ducati','959 Panigale',2022,3800000,2500,'Petrol',
    'White Ducati 959 Panigale with exceptional performance.',
    'https://images.unsplash.com/photo-1759001186046-8953f3899d7f?w=600',2,8,2);

INSERT INTO Vehicles (vehicle_id,title,brand,model,year,price,kilometers,fuel,description,image_url,category_id,location_id,user_id)
VALUES (7,'Toyota Corolla GLi','Toyota','Corolla GLi',2021,4500000,35000,'Petrol',
    'Well-maintained Corolla with full service history.',
    'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=600',1,3,1);

INSERT INTO Vehicles (vehicle_id,title,brand,model,year,price,kilometers,fuel,description,image_url,category_id,location_id,user_id)
VALUES (8,'Honda Civic Reborn','Honda','Civic',2022,6200000,22000,'Petrol',
    'Like-new Honda Civic with premium audio and alloy wheels.',
    'https://images.unsplash.com/photo-1761315087712-4b1bd53ce39b?w=600',1,6,1);

INSERT INTO Vehicles (vehicle_id,title,brand,model,year,price,kilometers,fuel,description,image_url,category_id,location_id,user_id)
VALUES (9,'Suzuki Swift','Suzuki','Swift',2020,1800000,40000,'Petrol',
    'City-friendly Swift in excellent condition. Low mileage.',
    'https://images.unsplash.com/photo-1663852408695-f57f4d75a536?w=600',1,9,1);

INSERT INTO Vehicles (vehicle_id,title,brand,model,year,price,kilometers,fuel,description,image_url,category_id,location_id,user_id)
VALUES (10,'Kawasaki Ninja 400','Kawasaki','Ninja 400',2023,2800000,500,'Petrol',
    'Brand new Ninja 400 with zero scratches. Perfect for beginners and pros.',
    'https://images.unsplash.com/photo-1595472167001-dbe2069e1b07?w=600',2,4,2);

-- Listings (all 10 active)
INSERT INTO Listings VALUES (1,  1, DATE '2025-11-01', 'active');
INSERT INTO Listings VALUES (2,  2, DATE '2025-11-05', 'active');
INSERT INTO Listings VALUES (3,  3, DATE '2025-11-10', 'active');
INSERT INTO Listings VALUES (4,  4, DATE '2025-11-15', 'active');
INSERT INTO Listings VALUES (5,  5, DATE '2025-11-20', 'active');
INSERT INTO Listings VALUES (6,  6, DATE '2025-12-01', 'active');
INSERT INTO Listings VALUES (7,  7, DATE '2025-12-05', 'active');
INSERT INTO Listings VALUES (8,  8, DATE '2025-12-10', 'active');
INSERT INTO Listings VALUES (9,  9, DATE '2025-12-15', 'active');
INSERT INTO Listings VALUES (10, 10, DATE '2025-12-20', 'active');

COMMIT;

SELECT * FROM Users;
SELECT * FROM vehicles;
