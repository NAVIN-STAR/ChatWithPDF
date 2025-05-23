export class ChatService {
    static async sendMessage(message, fileId) {
        fileId = parseInt(fileId);
        try {
            const response = await fetch("http://127.0.0.1:8000/chat/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    query: message,
                    file_id: fileId
                })
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.detail || "Failed to get response from assistant");

            return {
                success: true,
                answer: result.answer
            };
        } catch (error) {
            console.error("Chat error:", error);
            return {
                success: false,
                answer: `⚠️ Error: ${error.message}`
            };
        }
    }
}
