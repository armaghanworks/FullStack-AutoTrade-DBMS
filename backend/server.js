// ============================================================
// AutoTrade - server.js  (FINAL - All bugs fixed)
// Run: cd backend → node server.js
// Open: http://localhost:3000
// ============================================================

const express  = require('express');
const oracledb = require('oracledb');
const cors     = require('cors');
const path     = require('path');

const app  = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static(path.join(__dirname, '../frontend')));

// Auto-convert CLOB to string
oracledb.fetchAsString = [ oracledb.CLOB ];

const dbConfig = {
    user        : 'SYSTEM',
    password    : 'armaghan@420', 
    connectString: 'localhost:1521/XE'
};

async function runQuery(sql, binds, options) {
    let conn;
    try {
        conn = await oracledb.getConnection(dbConfig);
        const opts = Object.assign({ outFormat: oracledb.OUT_FORMAT_OBJECT }, options || {});
        return await conn.execute(sql, binds || [], opts);
    } finally {
        if (conn) try { await conn.close(); } catch(e) {}
    }
}

// GET all active vehicles
app.get('/api/vehicles', async (req, res) => {
    try {
        const r = await runQuery(`
            SELECT v.vehicle_id, v.title, v.brand, v.model, v.year,
                   v.price, v.kilometers, v.fuel, v.description, v.image_url,
                   c.category_name,
                   l.city AS location, l.latitude, l.longitude,
                   u.user_id, u.name AS seller, u.phone AS seller_phone,
                   li.status AS listing_status, li.post_date
            FROM Vehicles v
            JOIN Categories c  ON v.category_id = c.category_id
            JOIN Locations  l  ON v.location_id  = l.location_id
            JOIN Users      u  ON v.user_id       = u.user_id
            JOIN Listings   li ON li.vehicle_id   = v.vehicle_id
            WHERE li.status = 'active'
            ORDER BY li.post_date DESC`);
        res.json({ success: true, data: r.rows });
    } catch(err) {
        console.error('GET /vehicles:', err.message);
        res.status(500).json({ success: false, message: 'Could not load vehicles: ' + err.message });
    }
});

// GET my inactive/sold ads - MUST be before /:id
app.get('/api/vehicles/my-inactive', async (req, res) => {
    const user_id = parseInt(req.query.user_id);
    if (!user_id || isNaN(user_id))
        return res.status(400).json({ success: false, message: 'user_id required' });
    try {
        const r = await runQuery(`
            SELECT v.vehicle_id, v.title, v.brand, v.model, v.year,
                   v.price, v.kilometers, v.fuel, v.description, v.image_url,
                   c.category_name,
                   l.city AS location, l.latitude, l.longitude,
                   u.user_id, u.name AS seller, u.phone AS seller_phone,
                   li.status AS listing_status, li.post_date
            FROM Vehicles v
            JOIN Categories c  ON v.category_id = c.category_id
            JOIN Locations  l  ON v.location_id  = l.location_id
            JOIN Users      u  ON v.user_id       = u.user_id
            JOIN Listings   li ON li.vehicle_id   = v.vehicle_id
            WHERE v.user_id = :1 AND li.status IN ('sold','inactive')
            ORDER BY li.post_date DESC`, [user_id]);
        res.json({ success: true, data: r.rows });
    } catch(err) {
        console.error('GET /vehicles/my-inactive:', err.message);
        res.status(500).json({ success: false, message: 'Could not load inactive ads: ' + err.message });
    }
});

// GET single vehicle
app.get('/api/vehicles/:id', async (req, res) => {
    const vid = parseInt(req.params.id);
    if (isNaN(vid)) return res.status(400).json({ success: false, message: 'Invalid id' });
    try {
        const r = await runQuery(`
            SELECT v.vehicle_id, v.title, v.brand, v.model, v.year,
                   v.price, v.kilometers, v.fuel, v.description, v.image_url,
                   c.category_name,
                   l.city AS location, l.latitude, l.longitude,
                   u.user_id, u.name AS seller, u.phone AS seller_phone,
                   li.status AS listing_status, li.post_date
            FROM Vehicles v
            JOIN Categories c  ON v.category_id = c.category_id
            JOIN Locations  l  ON v.location_id  = l.location_id
            JOIN Users      u  ON v.user_id       = u.user_id
            JOIN Listings   li ON li.vehicle_id   = v.vehicle_id
            WHERE v.vehicle_id = :1`, [vid]);
        if (!r.rows || r.rows.length === 0)
            return res.status(404).json({ success: false, message: 'Vehicle not found' });
        res.json({ success: true, data: r.rows[0] });
    } catch(err) {
        console.error('GET /vehicles/:id:', err.message);
        res.status(500).json({ success: false, message: 'Could not load vehicle: ' + err.message });
    }
});

// POST add vehicle
app.post('/api/vehicles', async (req, res) => {
    const { title, brand, model, year, price, kilometers,
            fuel, description, image_url, category_id, location_id, user_id } = req.body;
    if (!title || !price || !user_id)
        return res.status(400).json({ success: false, message: 'Title, price and user_id required' });

    let conn;
    try {
        conn = await oracledb.getConnection(dbConfig);
        const vidR = await conn.execute(`SELECT NVL(MAX(vehicle_id),0)+1 AS NID FROM Vehicles`);
        const vehicle_id = vidR.rows[0][0];

        const img = (image_url && image_url.length <= 500000) ? image_url : '';

        await conn.execute(
            `INSERT INTO Vehicles
                (vehicle_id,title,brand,model,year,price,kilometers,
                 fuel,description,image_url,category_id,location_id,user_id)
             VALUES (:1,:2,:3,:4,:5,:6,:7,:8,:9,:10,:11,:12,:13)`,
            [vehicle_id, title, brand||title.split(' ')[0], model||title,
             year||2024, price, kilometers||0,
             fuel||'Petrol', description||'', img,
             category_id||1, location_id||1, user_id]
        );

        const lidR = await conn.execute(`SELECT NVL(MAX(listing_id),0)+1 AS NID FROM Listings`);
        await conn.execute(
            `INSERT INTO Listings (listing_id,vehicle_id,status) VALUES (:1,:2,'active')`,
            [lidR.rows[0][0], vehicle_id]
        );

        await conn.commit();
        console.log('✅ New vehicle:', title, '(id:', vehicle_id + ')');
        res.json({ success: true, message: 'Vehicle published!', vehicle_id });

    } catch(err) {
        if (conn) try { await conn.rollback(); } catch(e) {}
        console.error('POST /vehicles:', err.message);
        res.status(500).json({ success: false, message: 'Failed to publish: ' + err.message });
    } finally {
        if (conn) try { await conn.close(); } catch(e) {}
    }
});

// PUT edit vehicle - ALL positional binds, no reserved words
app.put('/api/vehicles/:id', async (req, res) => {
    const vid = parseInt(req.params.id);
    const { title, price, year, kilometers, fuel,
            description, image_url, category_id, location_id, user_id } = req.body;
    if (!title || !price || !user_id)
        return res.status(400).json({ success: false, message: 'Title, price and user_id required' });

    let conn;
    try {
        conn = await oracledb.getConnection(dbConfig);
        const chk = await conn.execute(
            `SELECT vehicle_id FROM Vehicles WHERE vehicle_id = :1 AND user_id = :2`, [vid, user_id]
        );
        if (!chk.rows || chk.rows.length === 0)
            return res.status(403).json({ success: false, message: 'Not found or not yours' });

        // Only update image_url if a new one was provided
        // If image_url is undefined/null in payload, keep the existing image
        if (image_url !== undefined && image_url !== null) {
            const img = (image_url.length <= 500000) ? image_url : '';
            await conn.execute(
                `UPDATE Vehicles SET
                    title=:1, price=:2, year=:3, kilometers=:4,
                    fuel=:5, description=:6, image_url=:7,
                    category_id=:8, location_id=:9
                 WHERE vehicle_id=:10`,
                [title, price, year||2024, kilometers||0,
                 fuel||'Petrol', description||'', img,
                 category_id||1, location_id||1, vid]
            );
        } else {
            // No new image — update everything EXCEPT image_url
            await conn.execute(
                `UPDATE Vehicles SET
                    title=:1, price=:2, year=:3, kilometers=:4,
                    fuel=:5, description=:6,
                    category_id=:7, location_id=:8
                 WHERE vehicle_id=:9`,
                [title, price, year||2024, kilometers||0,
                 fuel||'Petrol', description||'',
                 category_id||1, location_id||1, vid]
            );
        }
        await conn.commit();
        console.log('✏️  Updated vehicle:', vid);
        res.json({ success: true, message: 'Vehicle updated!' });

    } catch(err) {
        if (conn) try { await conn.rollback(); } catch(e) {}
        console.error('PUT /vehicles/:id:', err.message);
        res.status(500).json({ success: false, message: 'Update failed: ' + err.message });
    } finally {
        if (conn) try { await conn.close(); } catch(e) {}
    }
});

// PATCH update status - positional binds only, no reserved word :status
app.patch('/api/vehicles/:id/status', async (req, res) => {
    const vid = parseInt(req.params.id);
    const { status, user_id } = req.body;

    if (!['active','sold','inactive'].includes(status))
        return res.status(400).json({ success: false, message: 'Status must be: active, sold, or inactive' });
    if (!user_id)
        return res.status(400).json({ success: false, message: 'user_id required' });

    let conn;
    try {
        conn = await oracledb.getConnection(dbConfig);
        const chk = await conn.execute(
            `SELECT v.vehicle_id FROM Vehicles v
             JOIN Listings li ON li.vehicle_id = v.vehicle_id
             WHERE v.vehicle_id = :1 AND v.user_id = :2`, [vid, user_id]
        );
        if (!chk.rows || chk.rows.length === 0)
            return res.status(403).json({ success: false, message: 'Not found or not yours' });

        // :1 and :2 — no reserved word issues
        await conn.execute(
            `UPDATE Listings SET status=:1 WHERE vehicle_id=:2`, [status, vid]
        );
        await conn.commit();
        console.log('🔄 Vehicle', vid, '→', status);
        res.json({ success: true, message: 'Status updated to ' + status });

    } catch(err) {
        if (conn) try { await conn.rollback(); } catch(e) {}
        console.error('PATCH status:', err.message);
        res.status(500).json({ success: false, message: 'Status update failed: ' + err.message });
    } finally {
        if (conn) try { await conn.close(); } catch(e) {}
    }
});

// DELETE vehicle
app.delete('/api/vehicles/:id', async (req, res) => {
    const vid = parseInt(req.params.id);
    let conn;
    try {
        conn = await oracledb.getConnection(dbConfig);
        await conn.execute(`DELETE FROM Listings WHERE vehicle_id=:1`, [vid]);
        await conn.execute(`DELETE FROM Vehicles WHERE vehicle_id=:1`, [vid]);
        await conn.commit();
        console.log('🗑️  Deleted:', vid);
        res.json({ success: true, message: 'Deleted' });
    } catch(err) {
        if (conn) try { await conn.rollback(); } catch(e) {}
        res.status(500).json({ success: false, message: 'Delete failed: ' + err.message });
    } finally {
        if (conn) try { await conn.close(); } catch(e) {}
    }
});

// POST login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ success: false, message: 'Email and password required' });
    try {
        const r = await runQuery(
            `SELECT user_id, name, email, phone FROM Users
             WHERE LOWER(email)=LOWER(:1) AND password=:2`,
            [email.trim(), password.trim()]
        );
        if (!r.rows || r.rows.length === 0)
            return res.status(401).json({ success: false, message: 'Wrong email or password' });
        console.log('🔑 Login:', r.rows[0].NAME);
        res.json({ success: true, user: r.rows[0] });
    } catch(err) {
        console.error('POST /login:', err.message);
        res.status(500).json({ success: false, message: 'Login failed: ' + err.message });
    }
});

// POST register
app.post('/api/register', async (req, res) => {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password)
        return res.status(400).json({ success: false, message: 'Name, email, password required' });
    let conn;
    try {
        conn = await oracledb.getConnection(dbConfig);
        const chk = await conn.execute(
            `SELECT COUNT(*) AS CNT FROM Users WHERE LOWER(email)=LOWER(:1)`, [email]
        );
        if (chk.rows[0][0] > 0)
            return res.status(400).json({ success: false, message: 'Email already registered' });
        const idR = await conn.execute(`SELECT NVL(MAX(user_id),0)+1 AS NID FROM Users`);
        await conn.execute(
            `INSERT INTO Users (user_id,name,email,password,phone) VALUES (:1,:2,:3,:4,:5)`,
            [idR.rows[0][0], name, email, password, phone||'']
        );
        await conn.commit();
        res.json({ success: true, message: 'Registered!', user_id: idR.rows[0][0] });
    } catch(err) {
        if (conn) try { await conn.rollback(); } catch(e) {}
        res.status(500).json({ success: false, message: 'Registration failed: ' + err.message });
    } finally {
        if (conn) try { await conn.close(); } catch(e) {}
    }
});

// GET categories
app.get('/api/categories', async (req, res) => {
    try {
        const r = await runQuery(`SELECT * FROM Categories ORDER BY category_id`);
        res.json({ success: true, data: r.rows });
    } catch(err) { res.status(500).json({ success: false, message: 'Error' }); }
});

// GET locations
app.get('/api/locations', async (req, res) => {
    try {
        const r = await runQuery(`SELECT * FROM Locations ORDER BY city`);
        res.json({ success: true, data: r.rows });
    } catch(err) { res.status(500).json({ success: false, message: 'Error' }); }
});

// POST add location
app.post('/api/locations', async (req, res) => {
    const { city, latitude, longitude } = req.body;
    if (!city) return res.status(400).json({ success: false, message: 'City required' });
    let conn;
    try {
        conn = await oracledb.getConnection(dbConfig);
        const chk = await conn.execute(
            `SELECT location_id FROM Locations WHERE LOWER(city)=LOWER(:1)`, [city]
        );
        if (chk.rows.length > 0)
            return res.json({ success: true, location_id: chk.rows[0][0] });
        const idR = await conn.execute(`SELECT NVL(MAX(location_id),0)+1 AS NID FROM Locations`);
        const lid = idR.rows[0][0];
        await conn.execute(
            `INSERT INTO Locations (location_id,city,latitude,longitude) VALUES (:1,:2,:3,:4)`,
            [lid, city, latitude||33.7240, longitude||73.0854]
        );
        await conn.commit();
        res.json({ success: true, location_id: lid });
    } catch(err) {
        if (conn) try { await conn.rollback(); } catch(e) {}
        res.status(500).json({ success: false, message: 'Could not add location' });
    } finally {
        if (conn) try { await conn.close(); } catch(e) {}
    }
});

app.listen(PORT, () => {
    console.log('\n✅ AutoTrade server running at http://localhost:' + PORT);
    console.log('   Open http://localhost:' + PORT + ' in your browser\n');
});
