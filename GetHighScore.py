import sqlite3
con = sqlite3.connect("file.db")
cur = con.cursor()

cur.execute("SELECT MAX(points) from games")
maxPts = cur.fetchall()[0][0]
cur.execute("SELECT name from players,games WHERE players.id=games.id AND points=%i"%maxPts)
tmp=cur.fetchall()
high_players=[]
for p in tmp:
    high_players.append(p[0])
print maxPts,high_players


