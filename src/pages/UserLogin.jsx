import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase"; // Import your Firebase setup file
import { doc, getDoc } from "firebase/firestore"; // Import Firestore methods

const UserLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState(""); // State for email
    const [password, setPassword] = useState(""); // State for password
    const [error, setError] = useState(""); // State for error messages
    const [loading, setLoading] = useState(false); // State for loading
  
    const handleLogin = async (e) => {
      e.preventDefault(); // Prevent page refresh on form submit
      setLoading(true); // Show loading state
      setError(""); // Clear any previous errors
  
      try {
        // Firebase Authentication: Log user in
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
  
        // Successfully logged in
        const user = userCredential.user;
        console.log("User logged in:", user);
  
        // Fetch user's role and class from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log("User data:", userData);
  
          // Navigate to the appropriate dashboard based on role
          if (userData.role === "Student") {
            navigate("/StudentDashboard", {
              state: { email: user.email, class: userData.class },
            });
          } else if (userData.role === "Teacher") {
            navigate("/TeacherDashboard", {
              state: { email: user.email, class: userData.class },
            });
          } else {
            throw new Error("Invalid role. Please contact support.");
          }
        } else {
          throw new Error("User data not found. Please contact support.");
        }
      } catch (err) {
        // Handle errors
        console.error("Error logging in:", err.message);
        setError(err.message); // Show error to the user
      } finally {
        setLoading(false); // Stop loading state
      }
    };
  
  
  return (
    <>
      <Link to="/">Home</Link>

      <h1 className="text-3xl font-bold underline">Hello User!</h1>
      <p>Login your accounts here</p>
      <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          {/* Email Input */}
          <div style={{ marginBottom: "15px" }}>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </div>

          {/* Password Input */}
          <div style={{ marginBottom: "15px" }}>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </div>

          {/* Error Message */}
          {error && <p style={{ color: "red" }}>{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#007BFF",
              color: "white",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </>
  );
};

export default UserLogin;
