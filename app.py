from flask import Flask, render_template, request, jsonify
import cohere
import re

app = Flask(__name__)

cohere_api_key = 'qcvSX0NkULTmRPEQKKQQCxS7UqqFv4C1c8xi3NHx'
co = cohere.Client(cohere_api_key)

default_footer = """
Easy Tech The Technology Mall

Contact Sales on WhatsApp:

https://wa.me/9613000728 - Zouk Mosbeh
https://wa.me/9613000729 - Saida
https://wa.me/9613000723 - Tripoli

---- or ---
Service Center: +961 03 000 642
Gaming Lounge: +961 03 000 435
"""

@app.route('/')
def index():
    return render_template('index.html', footer=default_footer)

@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    product_name = data.get('product_name')
    language = data.get('language', 'English')
    with_emojis = data.get('with_emojis', True)

    description = get_product_description(product_name, language)
    if not with_emojis:
        description = remove_emojis(description)
    formatted_description = format_txt(description, product_name, language, with_emojis)
    
    return jsonify({'description': formatted_description})

@app.route('/update_footer', methods=['POST'])
def update_footer():
    global default_footer
    new_footer = request.form.get('footer')
    default_footer = new_footer
    return 'Footer updated successfully', 200

@app.route('/update_api_key', methods=['POST'])
def update_api_key():
    global cohere_api_key, co
    new_key = request.form.get('api_key')
    cohere_api_key = new_key
    co = cohere.Client(cohere_api_key)
    return 'API key updated successfully', 200

def get_product_description(product_name, language="English"):
    prompt = f"Create a very concise product description for {product_name} in {language}. Include exactly 5 short points with appropriate emojis. The points should not be numbered. Also, generate a catchy introductory sentence and a final recommendation sentence that fits the product."
    
    response = co.generate(
        model='command-xlarge-nightly',
        prompt=prompt,
        max_tokens=200,
        temperature=0.6,
        stop_sequences=["--"]
    )
    
    return response.generations[0].text.strip()

def remove_emojis(text):
    return re.sub(r'[^\w\s,.\-()/]', '', text)

def format_txt(description, product_name, language="English", with_emojis=True):
    paragraphs = description.split("\n")
    intro_sentence = paragraphs[0].strip()
    points = [p.strip() for p in paragraphs[1:6] if p.strip()]
    recommendation_sentence = paragraphs[6].strip().lstrip("- ") if len(paragraphs) > 6 else ""
    
    formatted_paragraphs = "\n\n".join(points)
    
    if language == "English":
        return f"""
*{product_name}*

{intro_sentence}

{formatted_paragraphs}

*{recommendation_sentence}* 

{default_footer}
"""
    elif language == "Arabic":
        return f"""
*{product_name}*

{intro_sentence}

{formatted_paragraphs}

*{recommendation_sentence}* 

{default_footer}
"""

if __name__ == '__main__':
    app.run(debug=True)
