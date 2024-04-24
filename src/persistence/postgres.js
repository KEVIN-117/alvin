const dotenv = require('dotenv');
const { Client } = require('pg');

dotenv.config();

const {
    POSTGRES_HOST: dbHost,
    POSTGRES_USER: dbUser,
    POSTGRES_PASSWORD: dbPassword,
    POSTGRES_DB: dbDatabase,
} = process.env;

let client;

async function init() {
    const host = dbHost;
    const user = dbUser;
    const password = dbPassword;
    const database = dbDatabase;
    port = 5432;

    client = new Client({
      host,
      port,
      database,
      user,
      password,
    })

    

    return client
        .connect()
        .then(async () => {
            console.log(`Connected to postgres db at host ${host}`);
            // Run the SQL instruction to create the table if it does not exist
            await client.query(
                'CREATE TABLE IF NOT EXISTS libros (id varchar(36), title varchar(255), author varchar(255))',
            );
            console.log(
                'Connected to db and created table libros if it did not exist',
            );
        })
        .catch((err) => {
            console.error('Unable to connect to the database:', err);
        });
}

// Get all items from the table
async function getItems() {
    return client.query('SELECT * FROM libros')
        .then((res) => {
            return res.rows.map((row) => ({
                id: row.id,
                title: row.title,
                author: row.author,
            }));
        })
        .catch((err) => {
            console.error('Unable to get items:', err);
        });
}

// End the connection
async function teardown() {
    return client
        .end()
        .then(() => {
            console.log('Client ended');
        })
        .catch((err) => {
            console.error('Unable to end client:', err);
        });
}

// Get one item by id from the table
async function getItem(id) {
    return client
        .query('SELECT * FROM libros WHERE id = $1', [id])
        .then((res) => {
            return res.rows.length > 0 ? res.rows[0] : null;
        })
        .catch((err) => {
            console.error('Unable to get item:', err);
        });
}

// Store one item in the table
async function storeItem(item) {
    return client
        .query('INSERT INTO libros(id, title, author) VALUES($1, $2, $3)', [
            item.id,
            item.title,
            item.author,
        ])
        .then(() => {
            console.log('Stored item:', item);
        })
        .catch((err) => {
            console.error('Unable to store item:', err);
        });
}

// Update one item by id in the table
async function updateItem(id, item) {
    return client
        .query('UPDATE libros SET title = $1, author = $2 WHERE id = $3', [
            item.title,
            item.author,
            id,
        ])
        .then(() => {
            console.log('Updated item:', item);
        })
        .catch((err) => {
            console.error('Unable to update item:', err);
        });
}

// Remove one item by id from the table
async function removeItem(id) {
    return client
        .query('DELETE FROM libros WHERE id = $1', [id])
        .then(() => {
            console.log('Removed item:', id);
        })
        .catch((err) => {
            console.error('Unable to remove item:', err);
        });
}

module.exports = {
    init,
    teardown,
    getItems,
    getItem,
    storeItem,
    updateItem,
    removeItem,
};
