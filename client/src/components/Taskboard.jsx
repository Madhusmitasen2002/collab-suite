import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { supabase } from "../supabaseClient";

export default function TaskBoard({ workspaceId }) {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  console.log("🚀 Taskboard workspaceId:", workspaceId);


  const [newTaskTitle, setNewTaskTitle] = useState({}); // {listId: title}
  const [newListName, setNewListName] = useState("");

  useEffect(() => {
    fetchLists();
  }, [workspaceId]);

  async function fetchLists() {
  setLoading(true);
  try {
    const { data: listData, error: listError } = await supabase
      .from("task_lists")
      .select("*, tasks(*)")
      .eq("workspace_id", workspaceId)
      .order("id", { ascending: true });

    console.log("Fetching lists for workspace:", workspaceId);
    if (listError) throw listError;

    setLists(listData || []);
  } catch (err) {
    console.error(err);
    setError("Failed to load lists");
  } finally {
    setLoading(false);
  }
}

  // Create new list
  const createList = async () => {
    if (!newListName.trim()) return;
    const { data, error } = await supabase
      .from("task_lists")
      .insert([{ name: newListName, workspace_id: workspaceId }])
      .select()
      .single();

    if (!error) {
      setLists([...lists, { ...data, tasks: [] }]);
      setNewListName("");
    }
  };

  // Create new task
  const createTask = async (listId) => {
    const title = newTaskTitle[listId]?.trim();
    if (!title) return;

    const { data, error } = await supabase
      .from("tasks")
      .insert([{ title, list_id: listId }])
      .select()
      .single();

    if (!error) {
      setLists(lists.map(l => l.id === listId ? { ...l, tasks: [...l.tasks, data] } : l));
      setNewTaskTitle(prev => ({ ...prev, [listId]: "" }));
    }
  };

  // Delete task
  const deleteTask = async (taskId, listId) => {
    await supabase.from("tasks").delete().eq("id", taskId);
    setLists(lists.map(l => l.id === listId ? { ...l, tasks: l.tasks.filter(t => t.id !== taskId) } : l));
  };

  // Drag & drop tasks
  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId === destination.droppableId && source.index === destination.index)
      return;

    const sourceList = lists.find(l => l.id.toString() === source.droppableId);
    const destList = lists.find(l => l.id.toString() === destination.droppableId);
    const task = sourceList.tasks[source.index];

    // Remove from source
    sourceList.tasks.splice(source.index, 1);
    // Insert into destination
    destList.tasks.splice(destination.index, 0, task);

    setLists([...lists]);

    // Update task's list_id in Supabase
    await supabase.from("tasks").update({ list_id: destination.droppableId }).eq("id", draggableId);
  };

  return (
    <div className="p-4 overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4">Task Board</h1>

      {/* Create new list */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="New List"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          className="border rounded px-2 py-1 flex-1"
        />
        <button onClick={createList} className="px-2 bg-blue-600 text-black rounded">
          Add List
        </button>
      </div>

      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading ? (
        <div>Loading…</div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4">
            {lists.map((list) => (
              <Droppable key={list.id} droppableId={list.id.toString()}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="bg-gray-100 rounded shadow p-4 min-w-[250px] flex-shrink-0"
                  >
                    <h3 className="font-semibold mb-2">{list.name}</h3>

                    {/* Add new task */}
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="New task"
                        className="flex-1 border rounded px-2 py-1 text-sm"
                        value={newTaskTitle[list.id] || ""}
                        onChange={(e) =>
                          setNewTaskTitle(prev => ({ ...prev, [list.id]: e.target.value }))
                        }
                        onKeyDown={(e) => e.key === "Enter" && createTask(list.id)}
                      />
                      <button
                        onClick={() => createTask(list.id)}
                        className="px-2 bg-blue-600 text-black rounded"
                      >
                        +
                      </button>
                    </div>

                    {/* Tasks */}
                    {list.tasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white rounded p-2 mb-2 flex justify-between items-center cursor-pointer"
                          >
                            <span>{task.title}</span>
                            <button
                              onClick={() => deleteTask(task.id, list.id)}
                              className="text-red-500 font-bold"
                            >
                              ×
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      )}
    </div>
  );
}
