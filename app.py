from flask import Flask, render_template, request, redirect, url_for, flash, Response
import sqlite3
from datetime import datetime

app = Flask(__name__)
app.secret_key = "super-secret-key-123"

DB_PATH = "leads.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS leads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()

def insert_lead(name, email):
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO leads (name, email, created_at) VALUES (?, ?, ?)",
        (name, email, datetime.now().isoformat(timespec="seconds"))
    )
    conn.commit()
    conn.close()

def fetch_leads():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    cur.execute("SELECT * FROM leads ORDER BY id DESC")
    rows = cur.fetchall()
    conn.close()
    return rows

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/signup", methods=["POST"])
def signup():
    name = request.form.get("name")
    email = request.form.get("email")

    if not name or not email:
        flash("Completa todos los campos.", "error")
        return redirect(url_for("home") + "#registro")

    insert_lead(name, email)
    flash("Registro exitoso 🎉", "success")
    return redirect(url_for("home") + "#registro")

@app.route("/admin")
def admin():
    leads = fetch_leads()
    return render_template("admin.html", leads=leads)

@app.route("/admin/export")
def export_csv():
    leads = fetch_leads()

    def generate():
        yield "id,name,email,created_at\n"
        for r in leads:
            yield f'{r["id"]},{r["name"]},{r["email"]},{r["created_at"]}\n'

    return Response(
        generate(),
        mimetype="text/csv",
        headers={"Content-Disposition": "attachment; filename=leads.csv"}
    )

if __name__ == "__main__":
    init_db()
    app.run(debug=True)

