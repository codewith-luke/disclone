export async function requestChatLogin(tkn: string): Promise<void> {
    await fetch("http://localhost:8000/chat/login", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${tkn}`
        }
    })
        .catch((err) => {
            console.error("failed to auth chat", err);
            return "";
        });
}