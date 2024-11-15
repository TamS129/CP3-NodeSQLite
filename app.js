/*
  Name: Tamara Slone
  Date: November 12,2024
  This is the api that connects all of my database to the website.
*/

'use strict';

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

const app = express();
const port = 3005;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

async function getDBConnection() {
    const db = await sqlite.open({
        filename: './retrogradegaming.db',  
        driver: sqlite3.Database  
    });
    return db;
}

async function initializeDatabase(){
    const db = await getDBConnection();

    await db.exec(`
        CREATE TABLE IF NOT EXISTS User (
        UserID          INTEGER PRIMARY KEY AUTOINCREMENT,
        FullName        TEXT     NOT NULL,
        Birthday        DATETIME NOT NULL,
        Email           TEXT     NOT NULL,
        Password        TEXT     NOT NULL,
        PhoneNumber     TEXT,
    
        CHECK (Birthday >= '1900-01-01')
        );`
    );

    await db.exec(
        `CREATE TABLE IF NOT EXISTS Product (
        ProductID       INTEGER PRIMARY KEY AUTOINCREMENT,
        Conditions      TEXT     DEFAULT 'No Information',
        Description     TEXT,
        Company         TEXT     NOT NULL,
        YearOfRelease   INTEGER  NOT NULL
        );`
    );
    
    await db.exec(`
        CREATE TABLE IF NOT EXISTS Review (
        ReviewID          INTEGER PRIMARY KEY AUTOINCREMENT,
        UserID            INTEGER         NOT NULL,
        ProductID         INTEGER         NOT NULL,
        Rating            INTEGER         NOT NULL,
        ReviewDescription TEXT,
        DatePosted        DATE            NOT NULL,
    
        FOREIGN KEY (UserID) REFERENCES User(UserID),               
        FOREIGN KEY (ProductID) REFERENCES Product(ProductID) ON DELETE CASCADE,
    
        CHECK (Rating > 0 AND Rating <= 5)
        );`
    );
    await db.exec(`
        CREATE TABLE IF NOT EXISTS Inventory (
        InventoryID     INTEGER PRIMARY KEY AUTOINCREMENT,
        ProductID		INTEGER				NOT NULL,
        StoreAvailable  TEXT     			DEFAULT 'Not Available',
        QuantityOnHand  INTEGER             NOT NULL,
        QuantityOnOrder INTEGER             NOT NULL,
    
        FOREIGN KEY(ProductID) REFERENCES Product(ProductID) ON DELETE CASCADE
        );
        `
    );

    await db.exec(
        `CREATE TABLE IF NOT EXISTS GAME (
        ProductID       INTEGER            NOT NULL,
        Title           TEXT     		   NOT NULL,
        Genre           TEXT,
        Platform        TEXT,
        Conditions      TEXT     		   DEFAULT 'No Information',
        Description     TEXT,
        Company         TEXT     		   NOT NULL,
        YearOfRelease   INTEGER            NOT NULL,
    
         PRIMARY KEY(ProductID),
        FOREIGN KEY(ProductID) REFERENCES Product(ProductID) ON DELETE CASCADE
        );`
    );
    
    await db.exec(
        `CREATE TABLE IF NOT EXISTS Store (
        StoreID         INTEGER PRIMARY KEY AUTOINCREMENT,
        InventoryID     INTEGER NOT NULL,
        Address         TEXT NOT NULL,
        PhoneNumber     BIGINT NOT NULL,

        FOREIGN KEY(InventoryID)
            REFERENCES Inventory(InventoryID)
            ON DELETE CASCADE
        );`
    );

    await db.exec(
        `
        CREATE TABLE IF NOT EXISTS Console (
        ProductID       INTEGER PRIMARY KEY AUTOINCREMENT,
        ConsoleName     TEXT     NOT NULL,
        Conditions      TEXT     DEFAULT 'No Information',
        Company         TEXT     NOT NULL,
        YearOfRelease   INTEGER NOT NULL,
    
        CHECK (Company IN ('Nintendo', 'Microsoft', 'Sony', 'Atari', 'Bandai', 'Sega', 'Mattel', 'Panasonic', 'PC')),

        FOREIGN KEY(ProductID) 
            REFERENCES Product(ProductID)
            ON DELETE CASCADE
            );
        `
    );
    


    await db.close();
}

initializeDatabase();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/stores', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'stores.html'));
});


app.get('/storeconsoles', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'storeconsoles.html'));
});

app.get('/storegames', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'storegames.html'));
});


app.post('/games', async (req, res) => {
    try {
        const db = await getDBConnection();
        const games = await db.all(`SELECT * FROM Game`);
        await db.close();
        res.json({ success: true, games });
    } catch (error) {
        res.status(500).json({ error: 'Cannot fetch games' });
    }
});


app.post('/consoles', async (req, res) => {

    try {
        const db = await getDBConnection();
        const consoles = await db.all(`SELECT * FROM Console`);
        await db.close();
        res.json({ success: true, consoles });
    } 
    catch (error) {
        res.status(500).json({ error: 'Cannot fetch consoles' });
    }
});


app.post('/stores', async (req, res) => { 
    try {
        const db = await getDBConnection();
        const stores = await db.all(`SELECT * FROM Store`);
        await db.close();
        res.json({ success: true, stores });
    } 
    catch (error) {
        res.status(500).json({ error: `Cannot fetch stores.` });
    }
});

app.get('/products/company/:company', async (req, res) => {
    const { company } = req.params;

    try {
        const db = await getDBConnection();
        const games = await db.all(`SELECT * FROM Game WHERE Company = ?`, [company]);
        const consoles = await db.all(`SELECT * FROM Console WHERE Company = ?`, [company]);

        await db.close();
        res.json({ games, consoles }); 
    } 
    catch (error) {
        res.status(500).json({ error: 'Cannot retrieve company products' });
    }
});

app.get('/api/game/:productId', async (req, res) => {
    const productID = req.params.productId;

    try {
        const db = await getDBConnection();
        const product = await db.get(`SELECT * FROM Product WHERE ProductID = ?`, [productID]);

        let productDesc = await db.get(`SELECT * FROM Game WHERE ProductID = ?`, [productID]);
        if (!productDesc) {
            productDesc = await db.get(`SELECT * FROM Console WHERE ProductID = ?`, [productID]);
        }

        const reviews = await db.all(`SELECT * FROM Review WHERE ProductID = ?`, [productID]);
        if (product && productDesc) {
            res.json({
                success: true,
                product: { ...product, ...productDesc }, 
                reviews
            });
        } else {
            res.status(404).json({ error: 'Product not found' });
        }

    } catch (error) {
        console.error('Product Information Not Available', error);
        res.status(500).json({ error: 'Error: Cannot find product details' });
    }
});


app.get('/api/console/:productId', async (req, res) => {
    const productID = req.params.productId;

    try {
        const db = await getDBConnection();
        const product = await db.get(`SELECT * FROM Product WHERE ProductID = ?`, [productID]);

        let productDesc = await db.get(`SELECT * FROM Console WHERE ProductID = ?`, [productID]);
        if (!productDesc) {
            productDesc = await db.get(`SELECT * FROM Game WHERE ProductID = ?`, [productID]);
        }

        const reviews = await db.all(`SELECT * FROM Review WHERE ProductID = ?`, [productID]);
        if (product && productDesc) {
            res.json({
                success: true,
                product: { ...product, ...productDesc }, 
                reviews
            });
        } else {
            res.status(404).json({ error: 'Product not found' });
        }

    } catch (error) {
        console.error('Product Information Not Available', error);
        res.status(500).json({ error: 'Error: Cannot find product details' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});