export async function requestTicket(tkn: string): Promise<void> {
    await fetch("http://localhost:8000/chat/ticket", {
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