const mysql = require('mysql2/promise');

async function migrate() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'urbon'
    });

    try {
        console.log('Checking columns in tutors table...');
        const [columns] = await connection.query("SHOW COLUMNS FROM tutors");
        const columnNames = columns.map(c => c.Field);

        if (!columnNames.includes('payment_status')) {
            console.log('Adding payment_status column...');
            await connection.query("ALTER TABLE tutors ADD COLUMN payment_status VARCHAR(50) DEFAULT 'unpaid'");
        }

        if (!columnNames.includes('is_submitted')) {
            console.log('Adding is_submitted column...');
            await connection.query("ALTER TABLE tutors ADD COLUMN is_submitted BOOLEAN DEFAULT FALSE");
        }

        console.log('Migration successful!');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await connection.end();
    }
}

migrate();
