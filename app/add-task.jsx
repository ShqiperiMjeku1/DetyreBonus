import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal } from "react-native";
import { Link, router } from "expo-router";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AddTask() {
  const [task, setTask] = useState("");
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const addTask = async () => {
    if (task.trim() === "") {
      setError("Task name is required.");
      return;
    }
    if (task.length < 3) {
      setError("Task name must be at least 3 characters long.");
      return;
    }

    setError("");
    const newTask = { id: Date.now().toString(), title: task };

    try {
      const stored = await AsyncStorage.getItem("tasks");
      const tasks = stored ? JSON.parse(stored) : [];

      const updated = [...tasks, newTask];
      await AsyncStorage.setItem("tasks", JSON.stringify(updated));

      setTask("");
      setModalVisible(true); 
    } catch (e) {
      console.log("Error saving task:", e);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    router.push("/"); 
  };

  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <Text style={styles.title}>Add New Task</Text>
        <Link href="/" style={{ marginTop: 10, color: "#007AFF" }}>
          ← Back to Tasks
        </Link>
      </View>

      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="Enter a new task"
          value={task}
          onChangeText={setTask}
        />
        <TouchableOpacity style={styles.addBtn} onPress={addTask}>
          <Text style={styles.btnText}>Add</Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={{ fontSize: 16, marginBottom: 10 }}>Task added successfully!</Text>
            <TouchableOpacity style={styles.modalBtn} onPress={handleCloseModal}>
              <Text style={{ color: "white", fontWeight: "bold" }}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    marginBottom: 12,
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 10,
    height: 40,
  },
  addBtn: {
    backgroundColor: "#007AFF",
    marginLeft: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
    borderRadius: 8,
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", 
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "white",
    width: "80%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    minHeight: 180
  },
  modalBtn: {
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 6,
  },
});
