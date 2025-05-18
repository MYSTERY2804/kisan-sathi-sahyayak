
def build_prompt(query, snippets):
    formatted = "\n\n".join([f"{i+1}. {s['title']}:\n{s['content']}" for i, s in enumerate(snippets)])
    prompt = f"""You are Krish Mitra, an intelligent agricultural assistant designed to help Indian farmers. Your goal is to provide accurate, helpful information about farming techniques, crop diseases, government schemes, weather adaptation strategies, and sustainable agricultural practices. Use the context below to answer the user's question in a clear and informative way. Emphasize sustainable and practical solutions suitable for Indian agricultural conditions.

Context:
{formatted}

Question: {query}
Answer:"""
    return prompt
