const {
  collection,
  addDoc,
  getDoc,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
} = require("firebase/firestore");
const {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} = require("firebase/auth");
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");
const { db, auth } = require("../config/firebase");

// Initialize Firebase Storage
const storage = getStorage();

// Get all employees from the Firestore
const getAllEmployees = async (req, res) => {
  try {
    const querySnapshot = await getDocs(collection(db, "employees"));
    const employees = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      message: "Employees retrieved successfully",
      employees,
    });
  } catch (error) {
    console.log("Error getting employees", error);
    res.status(500).json({
      message: "Error retrieving employees",
    });
  }
};

// Add an employee
const addEmployee = async (req, res) => {
  const { firstName, lastName, idNumber, eMailAddress, phoneNumber, position } =
    req.body;

  // Check for required fields
  if (
    !firstName ||
    !lastName ||
    !idNumber ||
    !eMailAddress ||
    !phoneNumber ||
    !position
  ) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Access the uploaded file
  const imageFile = req.file;

  if (!imageFile) {
    return res.status(400).json({ message: "Image file is required." });
  }

  const imageRef = ref(
    getStorage(),
    `images/${Date.now()}-${imageFile.originalname}`
  );

  try {
    // Upload the image file to Firebase Storage
    const snapshot = await uploadBytes(imageRef, imageFile.buffer);

    // Get the download URL
    const url = await getDownloadURL(snapshot.ref);

    // Add the employee to Firestore
    const docRef = await addDoc(collection(db, "employees"), {
      firstName,
      lastName,
      idNumber,
      eMailAddress,
      phoneNumber,
      position,
      image: url,
    });

    res.status(201).json({
      message: "Employee added successfully",
      employeeId: docRef.id,
    });
  } catch (error) {
    console.error("Error adding employee:", error);
    res.status(500).json({
      message: "Error adding employee",
      error: error.message,
    });
  }
};

// Get an employee by their id
const getEmployee = async (req, res) => {
  const { uid } = req.body;

  try {
    const docRef = doc(db, "employees", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      res.json({
        message: "Employee retrieved successfully",
        employee: { id: docSnap.id, ...docSnap.data() },
      });
    } else {
      res.status(404).json({
        message: "Employee not found",
      });
    }
  } catch (error) {
    console.log("Error getting employee", error);
    res.status(500).json({
      message: "Error retrieving employee",
    });
  }
};

// Update an employee by their id
const updateEmployee = async (req, res) => {
  const id = req.params.id;

  const { firstName, lastName, eMailAddress, phoneNumber, position } =
    req.body;

  // Check for required fields
  if (
    !firstName ||
    !lastName ||
    !eMailAddress ||
    !phoneNumber ||
    !position
  ) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const docRef = doc(db, "employees", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const updates = {
        firstName,
        lastName,
        eMailAddress,
        phoneNumber,
        position,
      };

      // If a new image is uploaded
      if (req.file) {
        updates.image = req.file.path; // Adjust based on your storage solution
      }

      await updateDoc(docRef, updates);

      res.json({
        message: "Employee updated successfully",
        employee: { id: docSnap.id, ...updates },
      });
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({ message: "Error updating employee" });
  }
};

// Delete an employee by their id
const deleteEmployee = async (req, res) => {
  const { id } = req.body;

  try {
    const docRef = doc(db, "employees", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await deleteDoc(docRef);

      res.json({
        message: "Employee deleted successfully",
      });
    } else {
      res.status(404).json({
        message: "Employee not found",
      });
    }
  } catch (error) {
    console.log("Error deleting employee", error);
    res.status(500).json({
      message: "Error deleting employee",
    });
  }
};

// Register a user
const registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    res.status(201).json({
      message: "User registered successfully",
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      },
    });
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;

    console.log("Error registering user:", errorMessage);

    res.status(400).json({
      message: "Error registering user",
      error: errorMessage,
      code: errorCode,
    });
  }
};

// Login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    res.json({
      message: "User logged in successfully",
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      },
    });
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;

    console.log("Error logging in user:", errorMessage);

    res.status(401).json({
      message: "Invalid credentials",
      error: errorMessage,
      code: errorCode,
    });
  }
};

// Send password reset
const resetEmail = async (req, res) => {
  try {
    const { email } = req.body;

    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent!
        // ..
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });

    res.json({
      message: "Password reset successful",
    });
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;

    console.log("Error resetting password: ", errorMessage);

    res.status(401).json({
      message: "Invalid credentials",
      error: errorMessage,
      code: errorCode,
    });
  }
};

module.exports = {
  getAllEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
  addEmployee,
  registerUser,
  loginUser,
  resetEmail,
};
