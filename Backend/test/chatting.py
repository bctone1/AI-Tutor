from langchain_service import get_conversational_chain

def main():
    print("LangChain Chat (type 'exit' to quit)")
    session_id = input("Enter session ID (any string): ")
    chain = get_conversational_chain(session_id)

    while True:
        user_input = input("You: ")
        if user_input.lower() in ["exit", "quit"]:
            break
        response = chain.run(user_input)
        print(f"AI: {response}\n")

if __name__ == "__main__":
    main()