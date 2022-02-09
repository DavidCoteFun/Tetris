CREATE TABLE players (
       name CHAR(20),
       id INTEGER(4) PRIMARY KEY
);

CREATE TABLE games (
       id INTEGER(4),
       points INTEGER(8),
       nb_rows INTEGER(4),
       date CHAR(16),
       FOREIGN KEY (id) REFERENCES players
);

