import express from "express";
import fs from "fs";

const app = express();
const PORT = 3000;

app.use(express.json());


const readStudents = () => {
  try {
    const data = fs.readFileSync("students.json", "utf8");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
};


const writeStudents = (students) => {
  fs.writeFileSync("students.json", JSON.stringify(students, null, 2));
};


app.post("/students", (req, res) => {
  const { id, name, email, course } = req.body;

  if (!id || !name || !email || !course) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const students = readStudents();
  const exists = students.find((s) => s.id === id);

  if (exists) {
    return res.status(409).json({ message: "Student already exists" });
  }

  students.push({ id, name, email, course });
  writeStudents(students);

  res.status(201).json({ message: "Student added successfully" });
});


app.get("/students", (req, res) => {
  const students = readStudents();
  res.json(students);
});


app.get("/students/:id", (req, res) => {
  const students = readStudents();
  const id = Number(req.params.id)
  const student = students.find((s) => s.id === id);

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  res.json(student);
});


app.put("/students/:id", (req, res) => {
  const students = readStudents();
  const id = Number(req.params.id)
  const index = students.findIndex((s) => s.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Student not found" });
  }

  const { name, email, course } = req.body;

  students[index] = {
    ...students[index],
    name: name || students[index].name,
    email: email || students[index].email,
    course: course || students[index].course,
  };

  writeStudents(students);
  res.json({ message: "Student updated successfully" });
});


app.delete("/students/:id", (req, res) => {
  const students = readStudents();
  const id = Number(req.params.id)
  const filteredStudents = students.filter(
    (s) => s.id !== id
  );

  if (students.length === filteredStudents.length) {
    return res.status(404).json({ message: "Student not found" });
  }

  writeStudents(filteredStudents);
  res.json({ message: "Student deleted successfully" });
});


app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Global error handler
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: 'Invalid JSON in request body' });
  }
  next(err);
});