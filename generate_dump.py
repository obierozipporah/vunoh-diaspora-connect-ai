import sqlite3

# Connect to your Django SQLite database
con = sqlite3.connect('db.sqlite3')

# Write the dump to a new file
with open('database_dump.sql', 'w', encoding='utf-8') as f:
    for line in con.iterdump():
        f.write('%s\n' % line)

con.close()
print("SQL dump generated successfully.")