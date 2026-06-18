import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;
app.use(express.json());

const primaryDb = new pg.Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "system_design",
  password: process.env.DB_PASSWORD || "001347",
  port: process.env.DB_PORT || 5433,
});

const replicaDb = new pg.Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "system_design",
  password: process.env.DB_PASSWORD || "001347",
  port: process.env.DB_PORT || 5434,
});

app.get("/:roll", async (req, res) => {
    const roll = req.params.roll;
    let result;

    try {
        result = await replicaDb.query(
            "SELECT * FROM students WHERE roll_no = $1",
            [roll]
        );

        if (result.rows.length === 0) {
            result = await primaryDb.query(
                "SELECT * FROM students WHERE roll_no = $1",
                [roll]
            );
        }
    } catch (err) {
        try {
            result = await primaryDb.query(
                "SELECT * FROM students WHERE roll_no = $1",
                [roll]
            );
        } catch (primaryErr) {
            return res.status(500).json({ error: primaryErr.message });
        }
    }

    if (!result || result.rows.length === 0) {
        return res.status(404).json({ message: "Student not found" });
    }

    res.json(result.rows[0]);
});

app.post("/", async (req, res) => {
    try {
        const { roll_no, name, class: studentClass, father, mother } = req.body;

        await primaryDb.query(
            `INSERT INTO students (roll_no, name, class, father_name, mother_name) VALUES ($1,$2,$3,$4,$5)`,
            [roll_no, name, studentClass, father, mother]
        );

        res.status(201).json({ message: "Student inserted successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});