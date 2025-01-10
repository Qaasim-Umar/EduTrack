import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import navigate
import { auth, db } from "../../firebase"; // Import Firebase setup
import { query, collection, where, getDocs, doc, getDoc } from "firebase/firestore"; // Correct import

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]); // To store students' data
  const [error, setError] = useState(""); // To handle errors
  const [loading, setLoading] = useState(true); // Loading state
  const [teacherClass, setTeacherClass] = useState(""); // To store teacher's class
  const [currentUser, setCurrentUser] = useState(null); // To store current user

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user); // Set the user when logged in
      } else {
        setCurrentUser(null); // Reset the user when logged out
      }
    });

    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);

  useEffect(() => {
    if (!currentUser) return; // If there's no user, don't fetch teacher and student data

    const fetchTeacherAndStudents = async () => {
      try {
        setLoading(true); // Start loading

        // Fetch teacher's data from Firestore
        const teacherDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (teacherDoc.exists()) {
          const teacherData = teacherDoc.data();
          setTeacherClass(teacherData.class); // Store teacher's class
        } else {
          throw new Error("Teacher data not found.");
        }

        // Query Firestore to get all students in the same class as the teacher
        const studentsQuery = query(
          collection(db, "users"),
          where("role", "==", "Student"),
          where("class", "==", teacherClass) // Filter by teacher's class
        );
        const querySnapshot = await getDocs(studentsQuery);

        const studentList = querySnapshot.docs.map((doc) => ({
          id: doc.id, // Document ID
          ...doc.data(), // Document data
        }));

        setStudents(studentList);
      } catch (err) {
        console.error("Error fetching data:", err.message);
        setError(err.message);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchTeacherAndStudents();
  }, [currentUser, teacherClass]); // Run when currentUser or teacherClass changes

  const handleUploadResult = (studentEmail) => {
    navigate("/Resultlist", { state: { studentEmail } }); // Pass email instead of studentId
  };

  if (loading) {
    return <p>Loading student list...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!currentUser) {
    return <p>No user is logged in.</p>;
  }

  return (
  
      <div>
        <h1>Teacher Dashboard</h1>
        <p>Welcome, {currentUser.email}!</p>
        <p>Your class: {teacherClass}</p>
    
        <h2>Student List</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {students.map((student) => (
            <li key={student.id} style={{ marginBottom: "10px", padding: "10px", border: "1px solid #ddd" }}>
              <p>Email: {student.email}</p>
              <button
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#007BFF",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={() => handleUploadResult(student.email)} // Pass student email
              >
                Upload Result
              </button>
            </li>
          ))}
        </ul>
      </div>
  
  );
};

export default TeacherDashboard;
