import Chat from "../components/Chat";

function Home() {
    return (
        <>
            <div class="h-16 border-b-4 border-border bg-background-secondary">
            </div>
            <div class="flex flex-1 flex-col overflow-hidden bg-background-secondary">
                <Chat/>
            </div>
        </>

    );
}

export default Home;
