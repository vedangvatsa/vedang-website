import re

def clean_file():
    with open('src/lib/glossary.ts', 'r') as f:
        content = f.read()
    
    replacements = [
        (r"\(think of these as adjustable settings", r"(these function as adjustable settings"),
        (r"Imagine the AI's memory as a container", r"The AI's memory functions as a container"),
        (r"Consider a decentralized insurance app", r"A decentralized insurance app"),
        (r"Imagine your online store suddenly gets featured", r"If an online store suddenly gets featured"),
        (r"Consider how this works in practice\.", r"This works in practice as follows:"),
        (r"Imagine trying to generate a report", r"Generating a report"),
        (r"Consider a bucket that automatically receives tokens", r"A bucket automatically receives tokens"),
        (r"Consider a simple math problem", r"For a simple math problem"),
        (r"Imagine you want an AI assistant", r"If an AI assistant needs to"),
        (r"Consider a brilliant professor who knows everything", r"A brilliant professor knows everything"),
        (r"Think of your seed phrase like the master blueprint", r"The seed phrase functions as the master blueprint"),
        (r"Imagine you want to buy 1,000 tokens", r"If a user wants to buy 1,000 tokens"),
        (r"Think about how cell phone networks typically get built\.", r"Cell phone networks typically get built by"),
        (r"Picture receiving a surprise gift", r"Receiving a surprise gift"),
        (r"Picture the difference between measuring something", r"This is analogous to the difference between measuring something"),
        (r"Think about how you might clean and organize a messy garage\.", r"When cleaning and organizing a messy garage,"),
        (r"Think of synthetic data like a flight simulator for pilots\.", r"Synthetic data functions like a flight simulator for pilots."),
        (r"Consider it like hiding a fake road sign", r"This is analogous to hiding a fake road sign"),
        (r"Consider a large law firm with hundreds of lawyers\.", r"A large law firm with hundreds of lawyers operates similarly."),
        (r"Think of the difference between asking someone", r"The difference between asking someone"),
        (r"Consider a liquidity pool as a digital vault", r"A liquidity pool functions as a digital vault"),
        (r"Picture someone with a savings account", r"This is similar to someone with a savings account"),
        (r"Think of Layer 1 as the bedrock of a digital city\.", r"Layer 1 functions as the bedrock of a digital city."),
        (r"Picture thousands of computers around the world", r"Thousands of computers around the world"),
        (r"Think of it like a security deposit", r"This is analogous to a security deposit"),
        (r"Think of your cryptocurrency like valuable jewelry\.", r"Cryptocurrency functions like valuable jewelry."),
        (r"Consider it like exchanging foreign currency", r"This is analogous to exchanging foreign currency"),
        (r"Consider a bank vault with an automated system\.", r"A bank vault with an automated system"),
        (r"Consider ordering food at a drive-through window\.", r"Ordering food at a drive-through window"),
        (r"Consider this token as a temporary ID badge", r"This token acts as a temporary ID badge"),
        (r"Consider a busy restaurant during dinner rush\.", r"A busy restaurant during dinner rush"),
        (r"At its core", r"Fundamentally"),
        (r"In simple terms", r"Essentially"),
        (r"Here's how it works", r"The mechanics are as follows"),
        (r"Here's how this works", r"The mechanics are as follows")
    ]
    
    for old, new in replacements:
        content = re.sub(old, new, content, flags=re.IGNORECASE)
        
    with open('src/lib/glossary.ts', 'w') as f:
        f.write(content)

if __name__ == '__main__':
    clean_file()
