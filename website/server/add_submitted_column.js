const mysql = require('mysql2/promise');

async function migrate() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'urbon_pro'
    });

    try {
        console.log('Adding is_submitted column to tutors table...');
        await connection.query("ALTER TABLE tutors ADD COLUMN is_submitted BOOLEAN DEFAULT FALSE");
        console.log('Migration successful!');
    } catch (err) {
        if (err.code === 'ER_DUP_COLUMN_NAME') {
            console.log('Column is_submitted already exists.');
        } else {
            console.error('Migration failed:', err);
        }
    } finally {
        await connection.end();
    }
}

migrate();
