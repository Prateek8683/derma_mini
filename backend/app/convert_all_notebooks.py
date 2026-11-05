import os
import json

def convert_all_notebooks():
    # Path ko dataset/ipymg-folder kar diya hai
    input_folder = "dataset/ipymg-folder"
    output_folder = "extracted_python_scripts"
    
    if not os.path.exists(input_folder):
        print(f"Error: '{input_folder}' folder nahi mila! Please check folder name.")
        return

    os.makedirs(output_folder, exist_ok=True)
    
    notebooks = [f for f in os.listdir(input_folder) if f.endswith('.ipynb')]
    
    if not notebooks:
        print(f"'{input_folder}' ke andar koi bhi .ipynb file nahi mili!")
        return

    for nb_file in notebooks:
        nb_path = os.path.join(input_folder, nb_file)
        print(f"Processing: {nb_file}...")
        
        try:
            with open(nb_path, 'r', encoding='utf-8') as f:
                notebook = json.load(f)
            
            code_lines = []
            for cell in notebook.get('cells', []):
                if cell.get('cell_type') == 'code':
                    source = cell.get('source', [])
                    if isinstance(source, list):
                        code_lines.extend(source)
                    elif isinstance(source, str):
                        code_lines.append(source)
                    code_lines.append("\n\n# --- Cell Separator ---\n\n")
            
            py_filename = nb_file.replace('.ipynb', '.py')
            output_py_path = os.path.join(output_folder, py_filename)
            
            with open(output_py_path, 'w', encoding='utf-8') as f:
                f.writelines(code_lines)
                
            print(f"-> Successfully converted to: {output_py_path}")
            
        except Exception as e:
            print(f"Error while processing {nb_file}: {e}")

if __name__ == "__main__":
    convert_all_notebooks()