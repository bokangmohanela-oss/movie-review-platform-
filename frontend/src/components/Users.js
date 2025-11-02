import React, { useState, useEffect } from "react";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from "firebase/firestore";
import db from "../firebase";

const Users = () => {
  const [data, setData] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    setData(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleCreate = async () => {
    await addDoc(collection(db, "users"), { name });
    setName("");
    fetchUsers();
  };

  const handleUpdate = async (id) => {
    const userRef = doc(db, "users", id);
    await updateDoc(userRef, { name });
    fetchUsers();
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "users", id));
    fetchUsers();
  };

  return (
    <div>
      <h2>Users</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter name"
      />
      <button onClick={handleCreate}>Add</button>

      <ul>
        {data.map((user) => (
          <li key={user.id}>
            {user.name}
            <button onClick={() => handleUpdate(user.id)}>Update</button>
            <button onClick={() => handleDelete(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;