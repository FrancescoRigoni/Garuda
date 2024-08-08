import sqlite3 from 'sqlite3'

class Database {
    constructor() {
        this.db = new sqlite3.Database(':memory:', (err) => {
            if (err) {
                return console.error(err.message);
            }
        });

        this.initialize();
    }

    initialize() {
        this.db.run(`
            CREATE TABLE IF NOT EXISTS user (
                id TEXT PRIMARY KEY,
                firstName TEXT NOT NULL,
                lastName TEXT NOT NULL
            )
        `);
        this.db.run(`
            CREATE TABLE IF NOT EXISTS token_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId TEXT,
                delta INTEGER NOT NULL,
                timestamp INTEGER NOT NULL,
                reason TEXT NOT NULL
            )
        `);
        this.db.run(`
            CREATE TABLE IF NOT EXISTS promoted_listing (
                listingId TEXT NOT NULL,
                listingHash TEXT NOT NULL,
                eventId TEXT NOT NULL,
                eventTypeId TEXT NOT NULL
            )
        `);
    }

    addUser(id, firstName, lastName) {
        const insert = 'INSERT OR IGNORE INTO user (id, firstName, lastName) VALUES (?, ?, ?)';
        return new Promise((resolve, reject) => {
            this.db.run(insert, [id, firstName, lastName], function(err) {
                if (err) {
                    return reject(err);
                }
                resolve({ id: this.lastID });
            });
        });
    }

    getUserTokenAmount(id) {
        const selectQuery = 'SELECT SUM(delta) AS amount FROM token_history WHERE userId = ?';
        return new Promise((resolve, reject) => {
            this.db.get(selectQuery, [id], (err, row) => {
                if (err) {
                    return reject(err);
                }
                resolve(row.amount ?? 0);
            });
        });
    }

    getUserTokenHistory(id) {
        const selectQuery = 'SELECT delta, timestamp, reason FROM token_history WHERE userId = ?';
        return new Promise((resolve, reject) => {
            this.db.all(selectQuery, [id], (err, row) => {
                if (err) {
                    return reject(err);
                }
                resolve(row);
            });
        });
    }

    addUserTokenDelta(id, delta, reason) {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const insert = 'INSERT INTO token_history (userId, delta, reason, timestamp) VALUES (?, ?, ?, ?)';
        return new Promise((resolve, reject) => {
            this.db.run(insert, [id, delta, reason, currentTimestamp], (err, row) => {
                if (err) {
                    return reject(err);
                }
                resolve(row);
            });
        });
    }

    getPromotedListings() {
        const selectQuery = 'SELECT * FROM promoted_listing';
        return new Promise((resolve, reject) => {
            this.db.all(selectQuery, [], (err, row) => {
                if (err) {
                    return reject(err);
                }
                resolve(row);
            });
        });
    }

    addPromotedListing(listingId, listingHash, eventId, eventTypeId) {
        const insert = 'INSERT INTO promoted_listing (listingId, listingHash, eventId, eventTypeId) VALUES (?, ?, ?, ?)';
        return new Promise((resolve, reject) => {
            this.db.run(insert, [listingId, listingHash, eventId, eventTypeId], (err, row) => {
                if (err) {
                    return reject(err);
                }
                resolve(row);
            });
        });
    }
}

export const database = new Database()