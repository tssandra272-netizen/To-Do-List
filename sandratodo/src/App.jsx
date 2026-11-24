import { useState, useEffect } from "react";

export default function App() {
  const [todos, setTodos] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("my-todos")) || [];
    } catch {
      return [];
    }
  });

  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem("my-todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    setTodos([
      {
        id: Date.now(),
        text: input.trim(),
        completed: false,
      },
      ...todos,
    ]);

    setInput("");
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const completedCount = todos.filter((t) => t.completed).length;
  const progress =
    todos.length > 0
      ? Math.round((completedCount / todos.length) * 100)
      : 0;

  return (
    <div className="min-h-screen animated-bg flex items-center justify-center p-4 sm:p-6">

      <style>{`
        .animated-bg {
          background: linear-gradient(
            -45deg,
            #0f172a,
            #312e81,
            #581c87,
            #164e63
          );
          background-size: 400% 400%;
          animation: gradientMove 12s ease infinite;
        }

        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .glass {
          background: rgba(255, 255, 255, 0.10);
          backdrop-filter: blur(25px);
          border: 1px solid rgba(255,255,255,0.15);
        }

        .todo-item {
          animation: slideIn 0.35s ease both;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .gradient-text {
          background: linear-gradient(90deg, #67e8f9, #c084fc, #f0abfc);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        @media (prefers-reduced-motion: reduce) {
          .animated-bg {
            animation: none;
          }
          .todo-item {
            animation: none;
          }
        }
      `}</style>

      <div className="w-full max-w-xl">

        {/* Header */}
        <div className="text-center mb-8">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-cyan-200 text-sm mb-5">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Your productivity space
          </div>

          <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tight">
            Task<span className="gradient-text">Flow</span>
          </h1>

          <p className="text-indigo-200 mt-3 text-sm sm:text-base">
            Organize your day. Achieve your goals.
          </p>

        </div>

        {/* Main Card */}
        <div className="glass rounded-3xl p-5 sm:p-8 shadow-2xl">

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-7">

            <div className="bg-white/10 rounded-2xl p-3 text-center">
              <p className="text-2xl font-bold text-white">
                {todos.length}
              </p>
              <p className="text-xs text-indigo-200 mt-1">Total</p>
            </div>

            <div className="bg-white/10 rounded-2xl p-3 text-center">
              <p className="text-2xl font-bold text-cyan-300">
                {todos.length - completedCount}
              </p>
              <p className="text-xs text-indigo-200 mt-1">Active</p>
            </div>

            <div className="bg-white/10 rounded-2xl p-3 text-center">
              <p className="text-2xl font-bold text-green-300">
                {completedCount}
              </p>
              <p className="text-xs text-indigo-200 mt-1">Done</p>
            </div>

          </div>

          {/* Progress */}
          <div className="mb-7">

            <div className="flex justify-between text-sm mb-2">
              <span className="text-indigo-100">Daily progress</span>
              <span className="text-cyan-300 font-bold">
                {progress}%
              </span>
            </div>

            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>

          </div>

          {/* Add Todo */}
          <form onSubmit={addTodo} className="flex gap-2 mb-6">

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What needs to be done?"
              className="min-w-0 flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-indigo-200 outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20 transition"
            />

            <button
              type="submit"
              className="bg-gradient-to-r from-cyan-400 to-purple-500 hover:scale-105 active:scale-95 text-white px-5 rounded-xl font-bold text-2xl transition duration-300 shadow-lg"
            >
              +
            </button>

          </form>

          {/* Filters */}
          <div className="flex items-center justify-between gap-2 mb-5">

            <div className="flex gap-2 flex-wrap">

              {["all", "active", "completed"].map((item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`px-3 py-2 rounded-lg text-xs sm:text-sm capitalize transition duration-300 ${
                    filter === item
                      ? "bg-white text-indigo-900 font-bold"
                      : "bg-white/10 text-indigo-100 hover:bg-white/20"
                  }`}
                >
                  {item}
                </button>
              ))}

            </div>

            {completedCount > 0 && (
              <button
                onClick={clearCompleted}
                className="text-xs text-pink-300 hover:text-pink-200 transition whitespace-nowrap"
              >
                Clear done
              </button>
            )}

          </div>

          {/* Todo List */}
          <div className="space-y-3 min-h-32">

            {filteredTodos.length === 0 ? (

              <div className="text-center py-10">

                <div className="text-5xl mb-3">
                  {todos.length === 0 ? "📝" : "🎉"}
                </div>

                <p className="text-white font-semibold">
                  {todos.length === 0
                    ? "Nothing on your list yet!"
                    : "No tasks found"}
                </p>

                <p className="text-indigo-200 text-sm mt-1">
                  {todos.length === 0
                    ? "Add a task and get started."
                    : "Try selecting another filter."}
                </p>

              </div>

            ) : (

              filteredTodos.map((todo) => (

                <div
                  key={todo.id}
                  className="todo-item flex items-center gap-3 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl p-4 group transition duration-300"
                >

                  {/* Checkbox */}
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    aria-label={todo.completed ? "Mark as active" : "Complete task"}
                    className={`w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center transition duration-300 ${
                      todo.completed
                        ? "bg-green-400 border-green-400 text-white"
                        : "border-indigo-200 hover:border-cyan-300"
                    }`}
                  >
                    {todo.completed && (
                      <span className="text-sm font-bold">✓</span>
                    )}
                  </button>

                  {/* Text */}
                  <span
                    className={`flex-1 min-w-0 break-words text-sm sm:text-base transition ${
                      todo.completed
                        ? "text-indigo-300 line-through opacity-60"
                        : "text-white"
                    }`}
                  >
                    {todo.text}
                  </span>

                  {/* Delete */}
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    aria-label="Delete task"
                    className="shrink-0 text-indigo-200 hover:text-red-400 hover:scale-125 transition duration-300 text-lg"
                  >
                    ✕
                  </button>

                </div>

              ))

            )}

          </div>

          {/* Footer */}
          <div className="border-t border-white/10 mt-6 pt-5 flex justify-between items-center text-xs text-indigo-200">

            <span>
              {todos.length - completedCount} tasks remaining
            </span>

            <span className="flex items-center gap-1">
              Made with <span className="text-pink-400">♥</span> React
            </span>

          </div>

        </div>

        <p className="text-center text-indigo-200/60 text-xs mt-6">
          Small steps every day lead to big results ✨
        </p>

      </div>
    </div>
  );
}
