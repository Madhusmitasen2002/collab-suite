export default function MessageList({ messages, currentUser }) {
  return (
    <div className="flex flex-col gap-2">
      {messages.map((msg) => {
        const isMine = msg.sender_id === currentUser.id;
        return (
          <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs px-3 py-2 rounded-xl ${
                isMine ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
              }`}
            >
              {!isMine && (
                <p className="text-xs font-semibold text-gray-700 mb-1">
                  {msg.sender_name || "Anonymous"}
                </p>
              )}
              <p>{msg.content}</p>
              <p className="text-[10px] text-gray-500 mt-1 text-right">
                {new Date(msg.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
