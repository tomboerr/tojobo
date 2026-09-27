import os
folder = os.path.dirname(os.path.abspath(__file__))

ANSWERS_FILE = "answers_de.txt"   # change to the real name of the short list
ALLOWED_FILE = "full_de.txt"      # change to the real name of the big list

def load(name):
    words = set()
    for line in open(os.path.join(folder, name), encoding="utf-8"):
        w = line.strip().upper()
        if len(w) == 5 and w.isalpha() and w.isascii():
            words.add(w)
    return sorted(words)

answers = load(ANSWERS_FILE)
allowed = sorted(set(load(ALLOWED_FILE)) | set(answers))

with open(os.path.join(folder, "words.js"), "w") as f:
    f.write("var ANSWERS = " + str(answers).replace("'", '"') + ";\n")
    f.write("var ALLOWED = " + str(allowed).replace("'", '"') + ";\n")

print(len(answers), "answers,", len(allowed), "allowed guesses")