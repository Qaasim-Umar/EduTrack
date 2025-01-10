import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Import to access passed state
import { db } from "../../../firebase"; // Import Firestore instance
import { doc, getDoc, setDoc } from "firebase/firestore"; // Firestore methods

const ResultList = () => {
  const location = useLocation();
  const { studentEmail } = location.state; // Get studentEmail from the passed state

  const [subjects, setSubjects] = useState([
    { name: "Math", firstCA: "", secondCA: "", exam: "", total: "MG", grade: "MG", editable: false },
    { name: "English", firstCA: "", secondCA: "", exam: "", total: "MG", grade: "MG", editable: false },
    // Add more subjects as needed
  ]);
  const [loading, setLoading] = useState(true); // Loading state for fetching data

  // Fetch saved results from Firestore when the component mounts
  useEffect(() => {
    const fetchSavedResults = async () => {
      if (!studentEmail) {
        console.error("Student email not provided.");
        return;
      }

      try {
        setLoading(true);
        const studentDoc = await getDoc(doc(db, "studentResults", studentEmail));
        if (studentDoc.exists()) {
          const savedSubjects = studentDoc.data().subjects || [];
          setSubjects(savedSubjects); // Update subjects with fetched data
        } else {
          console.log("No results found for this student.");
        }
      } catch (error) {
        console.error("Error fetching results: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedResults();
  }, [studentEmail]);

  const handleEdit = (index) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index].editable = !updatedSubjects[index].editable;
    setSubjects(updatedSubjects);
  };

  const handleInputChange = (e, index, field) => {
    const value = e.target.value;
    const updatedSubjects = [...subjects];
    updatedSubjects[index][field] = value;

    if (field === "firstCA" || field === "secondCA" || field === "exam") {
      const firstCA = parseInt(updatedSubjects[index].firstCA) || 0;
      const secondCA = parseInt(updatedSubjects[index].secondCA) || 0;
      const exam = parseInt(updatedSubjects[index].exam) || 0;

      if (firstCA && secondCA && exam) {
        const total = firstCA + secondCA + exam;
        updatedSubjects[index].total = total > 100 ? 100 : total;

        if (total >= 70) updatedSubjects[index].grade = "A";
        else if (total >= 60) updatedSubjects[index].grade = "B";
        else if (total >= 50) updatedSubjects[index].grade = "C";
        else if (total >= 45) updatedSubjects[index].grade = "D";
        else updatedSubjects[index].grade = "F";
      } else {
        updatedSubjects[index].total = "MG";
      }
    }

    setSubjects(updatedSubjects);
  };

  const saveToFirestore = async () => {
    if (!studentEmail) {
      alert("Student email not found!");
      return;
    }

    try {
      // Save results under the specific student's email as the document ID
      await setDoc(doc(db, "studentResults", studentEmail), {
        subjects: subjects.map(({ name, firstCA, secondCA, exam, total, grade }) => ({
          name,
          firstCA: firstCA || 0,
          secondCA: secondCA || 0,
          exam: exam || 0,
          total,
          grade,
        })),
      });
      alert("Results saved successfully!");
    } catch (error) {
      console.error("Error saving results: ", error);
      alert("Failed to save results.");
    }
  };

  if (loading) {
    return <p>Loading results...</p>;
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Subject</th>
            <th>1st CA</th>
            <th>2nd CA</th>
            <th>Exam</th>
            <th>Total</th>
            <th>Grade</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject, index) => (
            <tr key={index}>
              <td>{subject.name}</td>
              <td>
                <input
                  type="number"
                  value={subject.firstCA}
                  onChange={(e) => handleInputChange(e, index, "firstCA")}
                  max="20"
                  disabled={!subject.editable}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={subject.secondCA}
                  onChange={(e) => handleInputChange(e, index, "secondCA")}
                  max="20"
                  disabled={!subject.editable}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={subject.exam}
                  onChange={(e) => handleInputChange(e, index, "exam")}
                  max="100"
                  disabled={!subject.editable}
                />
              </td>
              <td>{subject.total}</td>
              <td>{subject.grade}</td>
              <td>
                <button onClick={() => handleEdit(index)}>
                  {subject.editable ? "Save" : "Edit"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={saveToFirestore}>Save to Firestore</button>
    </div>
  );
};

export default ResultList;
