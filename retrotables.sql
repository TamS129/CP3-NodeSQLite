
CREATE TABLE User (
    UserID          INTEGER PRIMARY KEY AUTOINCREMENT,
    FullName        TEXT     NOT NULL,
    Birthday        DATETIME NOT NULL,
    Email           TEXT     NOT NULL,
    Password        TEXT     NOT NULL,
    PhoneNumber     TEXT,
    
    CHECK (Birthday >= '1900-01-01')
);

CREATE TABLE Product (
    ProductID       INTEGER PRIMARY KEY AUTOINCREMENT,
    Conditions      TEXT     DEFAULT 'No Information',
    Description     TEXT,
    Company         TEXT     NOT NULL,
    YearOfRelease   INTEGER  NOT NULL
);

CREATE TABLE Review (
    ReviewID          INTEGER PRIMARY KEY AUTOINCREMENT,
    UserID            INTEGER         NOT NULL,
    ProductID         INTEGER         NOT NULL,
    Rating            INTEGER         NOT NULL,
    ReviewDescription TEXT,
    DatePosted        DATE            NOT NULL,
    
    FOREIGN KEY (UserID) REFERENCES User(UserID),               
    FOREIGN KEY (ProductID) REFERENCES Product(ProductID) ON DELETE CASCADE,
    
    CHECK (Rating > 0 AND Rating <= 5)
);

CREATE TABLE Inventory (
    InventoryID     INTEGER PRIMARY KEY AUTOINCREMENT,
    ProductID		INTEGER				NOT NULL,
    StoreAvailable  TEXT     			DEFAULT 'Not Available',
    QuantityOnHand  INTEGER             NOT NULL,
    QuantityOnOrder INTEGER             NOT NULL,
    
    FOREIGN KEY(ProductID) REFERENCES Product(ProductID) ON DELETE CASCADE
);


CREATE TABLE Game (
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
);

CREATE TABLE Console (
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

CREATE TABLE Store (
    StoreID         INTEGER PRIMARY KEY AUTOINCREMENT,
    InventoryID     INTEGER NOT NULL,
    Address         TEXT NOT NULL,
    PhoneNumber     BIGINT NOT NULL,

    FOREIGN KEY(InventoryID)
        REFERENCES Inventory(InventoryID)
        ON DELETE CASCADE
);

INSERT INTO User (FullName, Birthday, Email, Password, PhoneNumber) VALUES
('John Doe', '1990-05-15', 'john.doe@gmail.com', 'password123', 1234567890),
('Jane Smith', '1985-08-25', 'jane.smith@msn.com', '222333444', 2345678901),
('Light Kira', '1999-06-10', 'IamKira@yahoo.com', 'iHavetheDeathNote', 2067890099),
('Terra Armstead', '1993-07-17', 'darknessinmysoul@yahoo.com', '1234destruction', 6066390000),
('Stark Grier', '1990-10-13', 'bestgoodboi@gmail.com', 'dontStEaLmYPasS', 6064337000),
('Dexter Pauper', '1988-12-03', 'ghoulsforlife@live.com', '123girrrll4356', 7889005464),
('Diego Ortiz', '1995-10-11', 'anime4life@yahoo.com', '149494950201282839404', 6067770099),
('Audrey Kingsley', '1996-06-23', 'loveyouall@gmail.com', 'badabingbadaboom', 6068886600),
('Denji Chain', '2002-09-12', 'chainsawMan@live.com', 'makima', 9999015464),
('Alice Johnson', '1992-06-20', 'alice.johnson@example.com', 'password123', 1234567890),
('Bob Smith', '1988-11-10', 'bob.smith@example.com', 'securepassword', 2345678901),
('Charlie Brown', '1995-09-05', 'charlie.brown@example.com', 'password1234', 3456789012),
('David Lee', '1983-06-15', 'david.lee@example.com', 'letmein', 4567890123);

INSERT INTO Product (Conditions, Description, Company, YearOfRelease) VALUES
('New', 'NES Game', 'Nintendo', 1985),
('Used', 'PS1 Game', 'Square Enix', 1997),
('Used', 'DreamCast Game', 'Sega', 2001),
('New', 'Xbox Game', 'Microsoft', 2001),
('New', 'NES Console', 'Nintendo', 1985),
('Used', 'PS1 Console', 'Sony', 1995),
('Used', 'DreamCast Console', 'Sega', 1999),
('New', 'Xbox Console', 'Microsoft', 2001),
('Used', 'GameCube Game', 'Nintendo', 2001),
('New', 'PS2 Game', 'Sony', 2000),
('Used', 'GameBoy Game', 'Nintendo', 1989),
('New', 'Sega Genesis Game', 'Sega', 1988),
('New', 'PS3 Game', 'Sony', 2006);

INSERT INTO Review (UserID, ProductID, Rating, ReviewDescription, DatePosted) VALUES
(1, 1, 5, 'Amazing game, brings back memories!', '2023-01-01'),
(6, 2, 4, 'Great console, but has some wear and tear.', '2024-02-01'),
(7, 3, 5, 'Loved this game, brought back childhood memories!', '2024-02-01'), 
(8, 5, 4, 'Great console, works perfectly!', '2024-02-05'), 
(9, 7, 3, 'The console works but has some issues.', '2024-02-10'),
(10, 9, 4, 'Great game, hours of fun!', '2024-04-10'),
(11, 10, 5, 'Excellent console, works like a charm.', '2024-05-05'),
(12, 11, 3, 'Decent game, but not my favorite.', '2024-06-01');

INSERT INTO Inventory (ProductID, StoreAvailable, QuantityOnHand, QuantityOnOrder) VALUES
(1, 'Available', 10, 5),
(5, 'Not Available', 0, 2),
(6, 'Available', 3, 5),
(2, 'Not Available', 0, 8),
(3, 'Available', 15, 5),
(4, 'Available', 10, 2),
(5, 'Available', 8, 1),
(6, 'Available', 5, 3),
(7, 'Available', 7, 0),
(9, 'Available', 5, 2),
(10, 'Not Available', 0, 5),
(11, 'Available', 10, 3),
(12, 'Available', 3, 8),
(13, 'Available', 15, 5);

INSERT INTO Game (ProductID, Title, Genre, Platform, Conditions, Description, Company, YearOfRelease) VALUES
(1, 'Super Mario Bros.', 'Platformer', 'NES', 'New', 'A classic retro game', 'Nintendo', 1985),
(2, 'Final Fantasy 7', 'JRPG', 'PS1', 'Used', 'A classic retro game', 'Square Enix', 1997),
(3, 'Sonic Adventure 2', 'Platform, Adventure Game', 'DreamCast', 'Used', 'A classic retro game', 'Sega', 2001),
(4, 'Halo', 'First Person Shooter', 'Xbox', 'New', 'A classic retro game', 'Microsoft', 2001),
(5, 'The Legend of Zelda', 'Action-Adventure', 'NES', 'New', 'A classic retro game', 'Nintendo', 1986),
(6, 'Metal Gear Solid 2', 'Stealth', 'PS2', 'New', 'A classic retro game', 'Konami', 2001),
(7, 'Pokemon Red', 'Role-Playing', 'GameBoy', 'Used', 'A classic retro game', 'Nintendo', 1996),
(8, 'Sonic the Hedgehog', 'Platformer', 'Sega Genesis', 'New', 'A classic retro game', 'Sega', 1991),
(9, 'Uncharted 2: Among Thieves', 'Action-Adventure', 'PS3', 'New', 'A classic retro game', 'Naughty Dog', 2009);

INSERT INTO Console (ProductID, ConsoleName, Conditions, Company, YearOfRelease) VALUES
(5, 'NES', 'New', 'Nintendo', 1985),
(6, 'PlayStation', 'Used', 'Sony', 1995),
(7, 'DreamCast', 'Used', 'Sega', 1999),
(8, 'Xbox', 'New', 'Microsoft', 2001),
(9, 'GameCube', 'Used', 'Nintendo', 2001),
(10, 'PlayStation 2', 'New', 'Sony', 2000),
(11, 'GameBoy Color', 'Used', 'Nintendo', 1998),
(12, 'Sega Saturn', 'Used', 'Sega', 1994),
(13, 'PlayStation 3', 'New', 'Sony', 2006);

INSERT INTO Store (InventoryID, Address, PhoneNumber) VALUES
(1, '123 Retro St, Gametown', 3456789012),
(2, '456 Vintage Ave, Gamecity', 4567890123),
(3, '555 Greenwood Ave NE, AnotherCastle', 2067889194),
(4, '1000 North City Street, BeachCity', 2063771898),
(5, '9234 Retro SW, Seattle', 4457008912),
(6, '678 Retro Way, Gameville', 9876543210),
(7, '789 Classic Dr, Oldtown', 8765432109),
(8, '890 Vintage Blvd, Retropolis', 7654321098),
(9, '111 Retro Rd, Arcade City', 5678901234),
(10, '222 Vintage Blvd, Retroville', 6789012345),
(11, '333 Old Town Ave, Nostalgia City', 7890123456),
(12, '444 Classic St, Gameburg', 8901234567),
(13, '555 Memory Lane, Console Town', 9012345678);

