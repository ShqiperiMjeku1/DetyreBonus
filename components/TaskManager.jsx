import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { Link, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
      loadTasks();
    }, [])

  const loadTasks = async () => {
    try {
      const stored = await AsyncStorage.getItem("tasks");
      if (stored) {
        setTasks(JSON.parse(stored));
      } else {
        setTasks([]);
      }
    } catch (e) {
      console.log("Error loading tasks", e);
    }
  };

  const deleteTask = async (id) => {
    try {
      const updated = tasks.filter((item) => item.id !== id);
      setTasks(updated);
      await AsyncStorage.setItem("tasks", JSON.stringify(updated));
    } catch (e) {
      console.log("Error deleting task", e);
    }
  };

  const fetchExternalTasks = async () => {
  setLoading(true);
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=5");
    const data = await response.json();

    const newTasks = data.map((t) => ({
      id: t.id.toString(),
      title: t.title,
    }));

    const mergedTasks = [
      ...tasks,
      ...newTasks.filter((t) => !tasks.some((existing) => existing.id === t.id)),
    ];

    setTasks(mergedTasks);
    await AsyncStorage.setItem("tasks", JSON.stringify(mergedTasks));
  } catch (e) {
    console.log("Error fetching tasks", e);
  } finally {
    setLoading(false);
  }
};

  const renderEmpty = () => (
    <Text style={styles.emptyText}>No tasks yet. Add your first task!</Text>
  );

  const renderHeader = () => (
    <View>
      <Text style={styles.listHeader}>Your Tasks</Text>
      <TouchableOpacity style={styles.fetchBtn} onPress={fetchExternalTasks}>
        <Text style={styles.fetchText}>Fetch Example Tasks (API)</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFooter = () => (
    <Text style={styles.listFooter}>End of the list</Text>
  );

  const renderSeparator = () => <View style={styles.separator} />;

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          style={styles.container}
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <Link href={`/task/${item.id}`}>
                <Text>{item.title}</Text>
              </Link>
              <TouchableOpacity onPress={() => deleteTask(item.id)}>
                <Text style={{ color: "red" }}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
          ItemSeparatorComponent={renderSeparator}
          ListEmptyComponent={renderEmpty}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  taskItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "lightblue",
    padding: 12,
    borderRadius: 8,
    marginBottom: 4,
    elevation: 2,
  },
  separator: { height: 8 },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#888",
  },
  listHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
  },
  listFooter: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 14,
    color: "#666",
  },
  fetchBtn: {
    backgroundColor: "#007AFF",
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 10,
    width: 200,
  },
  fetchText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});
