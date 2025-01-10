import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import { auth, db } from "../../firebase"; // Import Firebase setup
import { doc, getDoc } from "firebase/firestore";

const StudentDashboard = () => {
  const [userData, setUserData] = useState(null); // To store user data
  const [error, setError] = useState(""); // To handle errors
  const [loading, setLoading] = useState(true); // Loading state
  const [results, setResults] = useState([]); // Store student results
  const navigate = useNavigate(); // Navigation hook

  useEffect(() => {
    const checkAuthAndFetchUserData = async () => {
      try {
        setLoading(true); // Start loading
        const user = auth.currentUser; // Get currently logged-in user

        if (!user) {
          throw new Error("No user is logged in.");
        }

        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          throw new Error("User data not found in the database.");
        }
      } catch (err) {
        console.error("Error fetching user data:", err.message);
        setError(err.message);
        // Redirect to login if no user is logged in
        setTimeout(() => navigate("/login"), 2000);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    checkAuthAndFetchUserData();
  }, [navigate]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const user = auth.currentUser;

        if (!user) return;

        // Fetch results based on user's email
        const studentRef = doc(db, "studentResults", user.email);
        const studentDoc = await getDoc(studentRef);

        if (studentDoc.exists()) {
          setResults(studentDoc.data().subjects); // Results stored as "subjects"
        } else {
          console.log("No results found for this student.");
        }
      } catch (error) {
        console.error("Error fetching results:", error.message);
      }
    };

    fetchResults();
  }, []);

  if (loading) {
    return <p>Loading your dashboard...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!userData) {
    return <p>No data available for this user.</p>;
  }

  return (
    <div>
      <h1>Student Dashboard</h1>
      <p>Welcome, {userData.email}!</p>
      <p>Your class: {userData.class}</p>
      <h2>Your Results:</h2>

      {results.length > 0 ? (
        <table style={{ border: "1px solid black", borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid black", padding: "8px" }}>Subject</th>
              <th style={{ border: "1px solid black", padding: "8px" }}>1st CA</th>
              <th style={{ border: "1px solid black", padding: "8px" }}>2nd CA</th>
              <th style={{ border: "1px solid black", padding: "8px" }}>Exam</th>
              <th style={{ border: "1px solid black", padding: "8px" }}>Total</th>
              <th style={{ border: "1px solid black", padding: "8px" }}>Grade</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid black", padding: "8px" }}>{result.name}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>{result.firstCA}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>{result.secondCA}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>{result.exam}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>{result.total}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>{result.grade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No results available yet.</p>
      )}
    </div>
  );
};

export default StudentDashboard;
