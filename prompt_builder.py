
def build_prompt(query, snippets, conversation_history=None):
    formatted = "\n\n".join([f"{i+1}. {s['title']}:\n{s['content']}" for i, s in enumerate(snippets)])
    
    context_prompt = f"""You are Krish Mitra, an intelligent agricultural assistant designed to help Indian farmers. Your goal is to provide accurate, helpful information about farming techniques, crop diseases, government schemes, weather adaptation strategies, and sustainable agricultural practices. Use the context below to answer the user's question in a clear and informative way. Emphasize sustainable and practical solutions suitable for Indian agricultural conditions.

Context:
{formatted}
"""
    
    if conversation_history and len(conversation_history) > 0:
        history = "\n".join([f"{'User' if is_user else 'Assistant'}: {message}" for message, is_user in conversation_history])
        prompt = f"""{context_prompt}

Conversation history:
{history}

User: {query}
Assistant:"""
    else:
        prompt = f"""{context_prompt}

Question: {query}
Answer:"""
    
    return prompt
