SELECT 
    v.vehicle_id, v.title, v.brand, v.model, v.year, v.price, v.kilometers, v.fuel,
    v.description, c.category_name, l.city, l.latitude, l.longitude, u.name AS seller_name,
    u.email, u.phone, li.listing_id, li.post_date, li.status
FROM Vehicles v
JOIN Categories c ON v.category_id = c.category_id
JOIN Locations l  ON v.location_id = l.location_id
JOIN Users u      ON v.user_id = u.user_id
JOIN Listings li  ON v.vehicle_id = li.vehicle_id
ORDER BY v.vehicle_id;

SELECT 
    u.user_id, u.name, u.email, u.phone, u.created_at, v.vehicle_id, v.title,
    v.brand, v.model, v.year, v.price, c.category_name, l.city, li.status, li.post_date
FROM Users u
LEFT JOIN Vehicles v   ON u.user_id = v.user_id
LEFT JOIN Categories c ON v.category_id = c.category_id
LEFT JOIN Locations l  ON v.location_id = l.location_id
LEFT JOIN Listings li  ON v.vehicle_id = li.vehicle_id
ORDER BY u.user_id, v.vehicle_id;

SELECT 
    li.listing_id,
    li.vehicle_id,
    v.title,
    v.brand,
    v.model,
    li.status
FROM Listings li
JOIN Vehicles v ON li.vehicle_id = v.vehicle_id
ORDER BY li.listing_id;


-- DELETE VEHICLE from listing
DELETE FROM Listings WHERE listing_id = 11;


-- DELETE USER
DELETE FROM Listings
WHERE vehicle_id IN (
    SELECT vehicle_id FROM Vehicles WHERE user_id = 
);

DELETE FROM Vehicles
WHERE user_id = ;

DELETE FROM Users
WHERE user_id = ;

COMMIT;