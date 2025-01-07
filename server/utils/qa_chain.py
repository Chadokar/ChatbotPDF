from langchain.chains.question_answering import load_qa_chain
from langchain.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
import os

GOOGLE_API_KEY = os.getenv("GEMINI_API_KEY")


def get_conversational_chain():
    prompt_template = """
    Answer the question as detailed as possible from the provided context. Include relevant citations in your answer using the format [Source: filename, Page: X].
    If the answer is not in the provided context, say "Answer is not available in the provided documents."
    Context:\n {context}\n
    Question: \n{question}\n
    Answer:
    """
    model = ChatGoogleGenerativeAI(
        model="gemini-pro",
        temperature=0.3,
        google_api_key=GOOGLE_API_KEY
    )
    prompt = PromptTemplate(template=prompt_template,
                            input_variables=["context", "question"])
    return load_qa_chain(model, chain_type="stuff", prompt=prompt)
