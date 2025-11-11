import { useEffect, useState } from "react";
import { useLocalSearchParams, Link } from "expo-router";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TaskDetail() {
  const { id } = useLocalSearchParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTask = async () => {
      try {
        const stored = await AsyncStorage.getItem("tasks");
        const tasks = stored ? JSON.parse(stored) : [];
        const found = tasks.find((t) => t.id === id);
        setTask(found);
      } catch (e) {
        console.log("Error loading task:", e);
      } finally {
        setLoading(false);
      }
    };
    loadTask();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!task) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>Task not found</Text>
        <Link href="/" style={styles.link}>← Back</Link>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{task.title}</Text>
      <Text style={styles.subtitle}>ID: {task.id}</Text>

      <Link href="/" style={styles.link}>
        ← Back to Tasks
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
  },
  notFound: {
    fontSize: 16,
    color: "red",
    marginBottom: 10,
  },
  link: {
    color: "#007AFF",
    fontSize: 16,
  },
});
