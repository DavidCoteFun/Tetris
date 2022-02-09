import sqlite3
con = sqlite3.connect("file.db")
cur = con.cursor()
#basic insert
cur.execute("INSERT INTO players VALUES('Tester',1)")
#faster way
manyPlayers=(
    (u'Anonymous', 2), 
    (u'David Cote', 3),
    (u'Sylvie Brunet', 4),
    (u'Bonhomme Carnaval', 5),
    (u'Bonhomme Carnaval sldkjflskdjflaskdjflkasjdlkfjasldkjflsakdjfl ', 6)
)
cur.executemany("INSERT INTO players VALUES(?,?)",manyPlayers)

cur.execute("INSERT INTO games VALUES(1,800,8,'2014.03.26 13:34')")
cur.execute("INSERT INTO games VALUES(5,200,2,'2014.03.26 13:37')")
cur.execute("INSERT INTO games VALUES(3,800,6,'2014.03.26 13:56')")

#save results into physical file. Use this for transactions.
con.commit()


cur.execute("Select * from players")
res1 = cur.fetchall()
print "players"
for r in res1: 
    print r


cur.execute("Select * from games")
res2 = cur.fetchall()
print "games"
for r in res2: 
    print r
