import os
from PIL import Image, ImageDraw

# Saari 38 conditions ki complete list
all_conditions = [
    # Pehle wali list
    "Acne_Vulgaris",
    "Whiteheads",
    "Blackheads",
    "Nodular_Cystic_Acne",
    "Rosacea",
    "Seborrheic_Dermatitis",
    "Eczema_Atopic_Dermatitis",
    "Psoriasis",
    "Contact_Dermatitis",
    "Tinea_Faciei_Ringworm",
    "Impetigo",
    "Herpes_Simplex_Cold_Sores",
    "Molluscum_Contagiosum",
    "Melasma",
    "Post_Inflammatory_Hyperpigmentation",
    "Vitiligo",
    "Freckles_and_Solar_Lentigines",
    
    # Nayi 21 conditions
    "Perioral_Dermatitis",
    "Pityriasis_Alba",
    "Sebaceous_Hyperplasia",
    "Milia",
    "Folliculitis",
    "Pseudofolliculitis_Barbae",
    "Seborrheic_Keratosis",
    "Actinic_Keratosis",
    "Basal_Cell_Carcinoma_BCC",
    "Melanoma",
    "Cutaneous_Lupus_Erythematosus",
    "Lichen_Planus_Pigmentosus",
    "Angioedema",
    "Urticaria_Hives",
    "Warts_Verruca_Vulgaris",
    "Solar_Lentigo",
    "Xanthelasma",
    "Demodicosis",
    "Actinic_Cheilitis",
    "Squamous_Cell_Carcinoma_SCC",
    "Normal_Skin"
]

base_dir = "dataset"
os.makedirs(base_dir, exist_ok=True)

print(f"Total {len(all_conditions)} conditions ke folders banaye ja rahe hain...")

for cond in all_conditions:
    folder_path = os.path.join(base_dir, cond)
    os.makedirs(folder_path, exist_ok=True)
    
    # Har folder ke andar ek sample test image generate kar rahe hain
    img = Image.new('RGB', (224, 224), color=(80, 140, 160))
    d = ImageDraw.Draw(img)
    d.text((10, 10), cond, fill=(255, 255, 255))
    img.save(os.path.join(folder_path, "sample.jpg"))

print("Success! Sabhi 38 folders aur sample images successfully ban gayi hain!")