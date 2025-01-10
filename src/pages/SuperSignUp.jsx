import React, { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase"; // Firestore instance
import { doc, setDoc } from "firebase/firestore"; // Firestore functions
import { Link } from "react-router-dom";

const SuperSignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
  
    const navigate = useNavigate();
  
    const handleSignUp = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError("");
  
      try {
        // Create Super Admin account
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
  
        console.log("Super Admin created:", user);
  
        // Save role to Firestore
        await setDoc(doc(db, "users", user.uid), {
          email: email,
          role: "super_admin",
        });
  
        alert("Super Admin account created successfully!");
        navigate("/SuperDashboard"); // Redirect to dashboard
      } catch (err) {
        console.error("Error signing up:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  

    return (
        <>
        <Link to="/">Home</Link>
        
        <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h2>Super Admin Sign Up</h2>
      <form onSubmit={handleSignUp}>
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
        {error && <p style={{ color: "red" }}>{error}</p>}
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
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <p>Have an account? <Link to="/SuperLogin">Login </Link> </p>
      </form>
    </div>
        </>
    )
}

export default SuperSignUp