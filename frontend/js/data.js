/* ==========================================================================
   Derma.co | Shared Data & Configuration (js/data.js)
   ========================================================================== */

window.DERMA_CONFIG = {
  API_BASE_URL: "https://dermafrontend-production.up.railway.app/",
  MAX_FILE_SIZE_BYTES: 10 * 1024 * 1024, // 10 MB
  REQUEST_TIMEOUT_MS: 60000 // 60 seconds
};

/* ==========================================================================
   TODO FOR PRATEEK:
   Fill CLASS_LABELS with your verified model index -> label mapping once your
   Colab training finishes (for example: 0: "Actinic Keratosis", etc.).
   If left empty or if a returned class_index is not listed here, Derma-Scan
   safely displays "Model Class N" and never invents a medical condition label.
   ========================================================================== */
window.CLASS_LABELS = {
  // Example placeholder entries (Uncomment & verify against your training folder order):
  // 0: "Actinic Keratosis",
  // 1: "Acne Vulgaris",
  // 2: "Eczema (Atopic Dermatitis)",
  // 3: "Melanoma",
  // 4: "Normal Skin"
};

/* ==========================================================================
   SKIN CONDITIONS DATABASE (37 entries total)
   Note: "Solar Lentigo" (Group A) and "Freckles and Solar Lentigines" (Group B)
   have been cleanly merged into a single comprehensive entry with id
   "freckles-and-solar-lentigines" (and alias matching for "Solar Lentigo").
   ========================================================================== */
window.CONDITIONS = [
  // --- ACNE-RELATED ---
  {
    id: "acne-vulgaris",
    name: "Acne Vulgaris",
    category: "Acne-related",
    urgentNotice: false,
    shortDesc: "A common skin condition that happens when hair follicles become clogged with oil and dead skin cells.",
    signs: "Mix of blackheads, whiteheads, tender red bumps (papules), and pus-filled pimples across the face, chest, or back.",
    careTips: "Use a gentle non-comedogenic cleanser twice daily, avoid picking or squeezing blemishes, and choose oil-free moisturizers and sunscreen.",
    seeDoctor: "Consult a dermatologist if over-the-counter care does not help after 8–12 weeks, or if breakouts leave dark marks or scars."
  },
  {
    id: "whiteheads",
    name: "Whiteheads",
    category: "Acne-related",
    urgentNotice: false,
    shortDesc: "Closed clogged pores (closed comedones) where trapped oil and skin cells stay beneath a thin layer of skin.",
    signs: "Small, firm, flesh-colored or whitish bumps that do not have an open pore at the surface.",
    careTips: "Wash gently with lukewarm water, avoid heavy occlusive creams, and consider gentle exfoliating cleansers if tolerated.",
    seeDoctor: "See a dermatologist if closed bumps are widespread, persistent, or become inflamed when using standard skincare."
  },
  {
    id: "blackheads",
    name: "Blackheads",
    category: "Acne-related",
    urgentNotice: false,
    shortDesc: "Open clogged pores (open comedones) where the surface oil oxidizes upon air exposure, turning dark.",
    signs: "Tiny dark or black dots in pores, commonly on the nose, chin, and forehead, without surrounding redness.",
    careTips: "Keep skin clean with mild cleansers, avoid harsh pore strips or forceful squeezing, and use non-comedogenic sun protection.",
    seeDoctor: "A dermatologist can recommend safe comedone management or topical retinoids if blackheads are stubborn."
  },
  {
    id: "nodular-or-cystic-acne",
    name: "Nodular or Cystic Acne",
    category: "Acne-related",
    urgentNotice: false,
    shortDesc: "A deeper, more severe form of inflammatory acne that develops beneath the skin surface.",
    signs: "Large, painful, firm nodules or fluid-filled lumps deep under the skin that take weeks to resolve and can scar.",
    careTips: "Never squeeze or attempt to pop deep nodules. Use a cool compress for comfort and stick to a bland, gentle cleanser.",
    seeDoctor: "Prompt evaluation by a dermatologist is strongly recommended to prevent permanent scarring and discuss targeted therapies."
  },

  // --- INFLAMMATORY ---
  {
    id: "rosacea",
    name: "Rosacea",
    category: "Inflammatory",
    urgentNotice: false,
    shortDesc: "A chronic inflammatory skin tendency causing facial flushing, persistent redness, and sensitivity.",
    signs: "Easy blushing across cheeks and nose, visible tiny blood vessels, small red bumps, or burning/stinging sensations.",
    careTips: "Identify personal triggers (heat, spicy foods, sunlight), apply broad-spectrum mineral sunscreen daily, and use fragrance-free skincare.",
    seeDoctor: "See a dermatologist for tailored management, especially if redness persists or if your eyes feel dry, gritty, or irritated."
  },
  {
    id: "perioral-dermatitis",
    name: "Perioral Dermatitis",
    category: "Inflammatory",
    urgentNotice: false,
    shortDesc: "An inflammatory rash of tiny bumps that typically forms around the mouth, nose, or eyes.",
    signs: "Clusters of small red or pink papules, mild scaling, and irritation around the mouth while sparing the thin border right next to the lips.",
    careTips: "Pause heavy creams, fluorinated toothpastes, and topical steroid creams unless specifically directed by a physician.",
    seeDoctor: "Consult a dermatologist for an accurate evaluation and gentle treatment plan, as topical steroids often worsen this rash."
  },
  {
    id: "seborrheic-dermatitis",
    name: "Seborrheic Dermatitis",
    category: "Inflammatory",
    urgentNotice: false,
    shortDesc: "A common inflammatory condition affecting oil-rich areas such as the scalp, eyebrows, and sides of the nose.",
    signs: "Reddish skin covered with flaky white or yellowish scales around the creases of the nose, eyebrows, ears, or scalp.",
    careTips: "Cleanse gently and moisturize barrier-sensitive areas; avoid scratching flaky patches.",
    seeDoctor: "See a healthcare professional if flaking and redness cause discomfort, spread, or do not calm down with gentle care."
  },
  {
    id: "eczema-atopic-dermatitis",
    name: "Eczema (Atopic Dermatitis)",
    category: "Inflammatory",
    urgentNotice: false,
    shortDesc: "A skin barrier condition that makes skin dry, itchy, and prone to red or irritated flare-ups.",
    signs: "Dry, scaly, itchy patches that may look red on lighter skin or darker brown/violaceous on deeper skin tones.",
    careTips: "Apply plain, fragrance-free moisturizer immediately after bathing, take lukewarm showers, and avoid harsh soaps.",
    seeDoctor: "Consult a dermatologist if itching interferes with sleep, patches crack or ooze, or daily moisturizers are not enough."
  },
  {
    id: "psoriasis",
    name: "Psoriasis",
    category: "Inflammatory",
    urgentNotice: false,
    shortDesc: "An immune-mediated condition where skin cells build up faster than usual, forming scaly patches.",
    signs: "Well-defined raised plaques with silvery-white or opalescent scale on the scalp, hairline, elbows, knees, or face.",
    careTips: "Keep skin well moisturized, avoid picking at scales, and manage stress and skin trauma.",
    seeDoctor: "A dermatologist can confirm the diagnosis and discuss safe topical or systemic treatments, especially if joints ache."
  },
  {
    id: "contact-dermatitis",
    name: "Contact Dermatitis",
    category: "Inflammatory",
    urgentNotice: false,
    shortDesc: "An itchy rash caused by direct skin contact with an irritating substance or an allergen.",
    signs: "Redness, itching, swelling, or tiny blisters limited to the area exposed to a new cosmetic, fragrance, metal, or plant.",
    careTips: "Stop using suspected new products immediately, rinse with cool water, and use a plain soothing ointment.",
    seeDoctor: "Seek medical care if the rash affects the eyes or face extensively, blisters severely, or does not fade after avoiding triggers."
  },
  {
    id: "pityriasis-alba",
    name: "Pityriasis Alba",
    category: "Inflammatory",
    urgentNotice: false,
    shortDesc: "A mild, benign skin condition common in children and teens that leaves pale, slightly dry patches.",
    signs: "Round or oval light-colored patches with very fine scale, most often on the cheeks or upper arms, more noticeable after sun exposure.",
    careTips: "Moisturize regularly with bland emollients and use daily sunscreen so surrounding skin does not tan unevenly.",
    seeDoctor: "Visit a doctor if patches itch strongly, change rapidly, or you want to rule out fungal causes."
  },
  {
    id: "pseudofolliculitis-barbae",
    name: "Pseudofolliculitis Barbae",
    category: "Inflammatory",
    urgentNotice: false,
    shortDesc: "Irritation and razor bumps caused when shaved or curly hairs curve back into the skin.",
    signs: "Clustered tender bumps, pimples, and dark marks along the beard area, jawline, or neck after shaving.",
    careTips: "Shave in the direction of hair growth, use a moisturizing shave gel, avoid pulling the skin taut, or use clippers.",
    seeDoctor: "A dermatologist can help reduce inflammation, secondary infection, and post-inflammatory dark spots or keloids."
  },
  {
    id: "cutaneous-lupus-erythematosus",
    name: "Cutaneous Lupus Erythematosus",
    category: "Inflammatory",
    urgentNotice: false,
    shortDesc: "An autoimmune skin condition triggered or worsened by ultraviolet light exposure.",
    signs: "Red or scaly plaques on sun-exposed areas, or a butterfly-shaped rash across the cheeks and bridge of the nose.",
    careTips: "Strict daily broad-spectrum sun protection, wide-brimmed hats, and sun-protective clothing are essential.",
    seeDoctor: "Prompt medical evaluation by a dermatologist or rheumatologist is essential for testing and targeted care."
  },
  {
    id: "angioedema",
    name: "Angioedema",
    category: "Inflammatory",
    urgentNotice: true,
    shortDesc: "Rapid swelling beneath the deeper layers of the skin, often around the eyelids, lips, or face.",
    signs: "Sudden puffy swelling of the lips, eyelids, or cheeks, sometimes occurring alongside hives.",
    careTips: "Avoid known medication or food triggers and apply a cool compress for mild surface comfort.",
    seeDoctor: "Seek emergency medical care immediately if swelling involves the tongue, throat, or causes any difficulty breathing."
  },
  {
    id: "urticaria-hives",
    name: "Urticaria (Hives)",
    category: "Inflammatory",
    urgentNotice: false,
    shortDesc: "Raised, itchy welts on the skin surface that can appear suddenly and shift locations.",
    signs: "Pink, red, or skin-colored raised wheals of varying sizes that itch and typically fade within 24 hours individually.",
    careTips: "Keep skin cool, wear loose clothing, and avoid hot showers or known triggers.",
    seeDoctor: "See a doctor if hives last more than a few days, or seek emergency help if accompanied by lip/throat swelling or shortness of breath."
  },

  // --- PIGMENTATION ---
  {
    id: "melasma",
    name: "Melasma",
    category: "Pigmentation",
    urgentNotice: false,
    shortDesc: "A common pigmentation pattern causing symmetrical brown or grayish-brown patches on the face.",
    signs: "Patchy discoloration across the cheeks, forehead, bridge of the nose, or upper lip, often influenced by sun and hormones.",
    careTips: "Consistent daily broad-spectrum SPF 30+ (especially tinted mineral sunscreens blocking visible light) and hats.",
    seeDoctor: "Consult a dermatologist for safe brightening options and to distinguish melasma from other pigment conditions."
  },
  {
    id: "post-inflammatory-hyperpigmentation",
    name: "Post-Inflammatory Hyperpigmentation",
    category: "Pigmentation",
    urgentNotice: false,
    shortDesc: "Flat dark spots left behind after a pimple, rash, or skin injury heals.",
    signs: "Tan, brown, or dark gray macules at the exact site where acne, eczema, or a scratch previously occurred.",
    careTips: "Protect skin from UV rays daily to prevent spots from darkening, and avoid picking at active blemishes.",
    seeDoctor: "A dermatologist can suggest gentle topical ingredients suited to your skin tone if spots fade slowly."
  },
  {
    id: "vitiligo",
    name: "Vitiligo",
    category: "Pigmentation",
    urgentNotice: false,
    shortDesc: "A condition in which pigment-producing cells (melanocytes) stop functioning in certain areas, leading to light patches.",
    signs: "Smooth, milky-white or depigmented patches of skin with clear borders, often around the face, hands, or body folds.",
    careTips: "Protect depigmented skin carefully with high-SPF sunscreen to prevent sunburn.",
    seeDoctor: "See a dermatologist early if you notice new depigmented patches to discuss medical and phototherapy options."
  },
  {
    id: "freckles-and-solar-lentigines",
    aliases: ["Solar Lentigo", "Freckles and Solar Lentigines"],
    name: "Freckles & Solar Lentigines (Sun Spots)",
    category: "Pigmentation",
    urgentNotice: false,
    shortDesc: "Flat tan or brown spots on sun-exposed areas resulting from localized melanin concentration after UV exposure.",
    signs: "Small light-brown freckles (ephelides) or slightly larger, well-defined flat sun spots (solar lentigines) on the face, hands, or shoulders.",
    careTips: "Apply broad-spectrum sunscreen every day and reapply outdoors to minimize darkening and new spot formation.",
    seeDoctor: "Have a dermatologist examine any pigmented spot that changes shape, develops multiple colors, has irregular borders, or grows."
  },
  {
    id: "lichen-planus-pigmentosus",
    name: "Lichen Planus Pigmentosus",
    category: "Pigmentation",
    urgentNotice: false,
    shortDesc: "A chronic pigmentary condition causing slate-gray to brownish patches on sun-exposed skin or folds.",
    signs: "Diffuse or patchy dark brown to gray-blue discoloration on the temples, forehead, neck, or cheeks.",
    careTips: "Practice gentle sun protection and avoid harsh fragrances, hair dyes, or abrasive scrubs.",
    seeDoctor: "Consult a dermatologist for specialized evaluation, as early anti-inflammatory care can help stabilize pigmentation."
  },

  // --- INFECTIONS ---
  {
    id: "folliculitis",
    name: "Folliculitis",
    category: "Infections",
    urgentNotice: false,
    shortDesc: "Inflammation or superficial infection of hair follicles causing small, tender bumps.",
    signs: "Tiny red bumps or white-headed pustules centered directly around hair follicles.",
    careTips: "Keep the area clean with mild soap, wear breathable clothing, and avoid sharing razors or towels.",
    seeDoctor: "See a doctor if bumps spread, become warm and painful, or do not clear within a few days."
  },
  {
    id: "tinea-faciei-ringworm",
    name: "Tinea Faciei (Ringworm)",
    category: "Infections",
    urgentNotice: false,
    shortDesc: "A superficial fungal infection of the facial skin outside the beard area.",
    signs: "Itchy, reddish or darker circular patches with a slightly raised, scaly border and clearer center.",
    careTips: "Keep skin clean and dry, avoid sharing personal items, and do not apply leftover steroid creams.",
    seeDoctor: "See a healthcare professional for proper antifungal confirmation and guidance."
  },
  {
    id: "impetigo",
    name: "Impetigo",
    category: "Infections",
    urgentNotice: false,
    shortDesc: "A contagious superficial bacterial skin infection most common around the nose and mouth.",
    signs: "Red sores or fragile blisters that quickly rupture and form characteristic honey-colored crusts.",
    careTips: "Wash hands frequently, gently cleanse with mild soap and water, and avoid touching or scratching the sores.",
    seeDoctor: "Consult a doctor promptly, as prescription topical or oral antibiotic care is typically required."
  },
  {
    id: "herpes-simplex-cold-sores",
    name: "Herpes Simplex (Cold Sores)",
    category: "Infections",
    urgentNotice: false,
    shortDesc: "A common viral infection causing small fluid-filled blisters on or around the lips.",
    signs: "Tingling or burning followed by a cluster of small blisters on a red base that crust over and heal in 1–2 weeks.",
    careTips: "Avoid touching the blisters, do not share lip balm or utensils, and use sun protection on lips.",
    seeDoctor: "See a doctor if sores are near the eyes, occur frequently, spread widely, or if you have a weakened immune system."
  },
  {
    id: "molluscum-contagiosum",
    name: "Molluscum Contagiosum",
    category: "Infections",
    urgentNotice: false,
    shortDesc: "A benign viral skin infection that produces small, smooth, pearly bumps.",
    signs: "Firm, dome-shaped flesh-colored or pink bumps, often with a tiny central dimple (umbilication).",
    careTips: "Avoid scratching, picking, or shaving over the bumps to prevent spreading the virus to nearby skin.",
    seeDoctor: "A dermatologist can confirm the diagnosis and discuss gentle office-based or topical options if needed."
  },
  {
    id: "warts-verruca-vulgaris",
    name: "Warts (Verruca Vulgaris)",
    category: "Infections",
    urgentNotice: false,
    shortDesc: "Small, rough skin growths caused by human papillomavirus (HPV) in the top layer of skin.",
    signs: "Rough, grainy, flesh-colored bumps, sometimes with tiny black pinpoint dots (clotted capillaries).",
    careTips: "Do not pick or bite warts, and never apply harsh over-the-counter wart acids to the face.",
    seeDoctor: "Always consult a dermatologist for warts on the face or sensitive areas for safe removal."
  },
  {
    id: "demodicosis",
    name: "Demodicosis",
    category: "Infections",
    urgentNotice: false,
    shortDesc: "Skin irritation linked to an overgrowth of microscopic Demodex mites that naturally live in hair follicles.",
    signs: "Rough, sandpaper-like follicular scaling, redness, itching, or rosacea-like bumps on the face.",
    careTips: "Cleanse daily with a gentle, non-oily cleanser and avoid heavy occlusive facial oils.",
    seeDoctor: "See a dermatologist for simple microscopic confirmation and targeted topical care."
  },

  // --- BENIGN GROWTHS ---
  {
    id: "sebaceous-hyperplasia",
    name: "Sebaceous Hyperplasia",
    category: "Benign growths",
    urgentNotice: false,
    shortDesc: "Harmless enlargement of oil glands on the face, common in middle-aged and older adults.",
    signs: "Small, soft, yellowish or skin-colored bumps (2–4 mm) on the forehead or cheeks, often with a tiny central dip.",
    careTips: "Use lightweight, non-comedogenic skincare and daily sun protection.",
    seeDoctor: "Have a dermatologist check any new bump, as sebaceous hyperplasia can occasionally resemble basal cell carcinoma."
  },
  {
    id: "milia",
    name: "Milia",
    category: "Benign growths",
    urgentNotice: false,
    shortDesc: "Tiny, harmless white cysts formed when keratin gets trapped just beneath the surface of the skin.",
    signs: "Firm, pearl-like 1–2 mm white bumps, commonly around the eyelids, cheeks, or nose, with no redness.",
    careTips: "Do not try to squeeze or scrape milia at home, as they have no pore opening and squeezing damages skin.",
    seeDoctor: "A dermatologist can safely extract persistent milia or recommend gentle topical care."
  },
  {
    id: "seborrheic-keratosis",
    name: "Seborrheic Keratosis",
    category: "Benign growths",
    urgentNotice: false,
    shortDesc: "Very common, non-cancerous skin growths that develop gradually with age.",
    signs: "Tan, brown, or black raised spots with a waxy, scaly, or 'stuck-on' appearance.",
    careTips: "Leave growths alone and avoid picking or rubbing them against clothing.",
    seeDoctor: "Always have a dermatologist evaluate dark or changing growths to distinguish them from melanoma, or if they become irritated."
  },
  {
    id: "xanthelasma",
    name: "Xanthelasma",
    category: "Benign growths",
    urgentNotice: false,
    shortDesc: "Soft, yellowish cholesterol-rich deposits that form under the skin around the eyelids.",
    signs: "Flat or slightly raised yellowish plaques near the inner corners of the upper or lower eyelids.",
    careTips: "Never attempt to remove or apply harsh chemicals near the eyelids.",
    seeDoctor: "See a physician or dermatologist to check your blood lipid/cholesterol profile and discuss safe cosmetic removal."
  },

  // --- PRE-CANCEROUS AND CANCEROUS ---
  {
    id: "actinic-keratosis",
    name: "Actinic Keratosis",
    category: "Pre-cancerous and cancerous",
    urgentNotice: true,
    shortDesc: "A rough, scaly patch on sun-damaged skin that is considered precancerous.",
    signs: "Dry, gritty, sandpaper-like pink, red, or brownish patches on sun-exposed areas like the forehead, ears, scalp, or nose.",
    careTips: "Protect skin rigorously from UV exposure with high-SPF broad-spectrum sunscreen and hats.",
    seeDoctor: "Please schedule a prompt evaluation with a board-certified dermatologist. Early in-clinic assessment and treatment help prevent progression to squamous cell carcinoma."
  },
  {
    id: "actinic-cheilitis",
    name: "Actinic Cheilitis",
    category: "Pre-cancerous and cancerous",
    urgentNotice: true,
    shortDesc: "Precancerous sun-related changes affecting the border of the lip, most often the lower lip.",
    signs: "Persistent dryness, scaling, whitish-gray thickening, or blurring of the border between the lip and skin.",
    careTips: "Use a broad-spectrum SPF 30+ lip balm regularly and wear a wide-brimmed hat outdoors.",
    seeDoctor: "Please see a dermatologist promptly for any persistent scaly, thickened, or non-healing patch on the lip."
  },
  {
    id: "basal-cell-carcinoma-bcc",
    name: "Basal Cell Carcinoma (BCC)",
    category: "Pre-cancerous and cancerous",
    urgentNotice: true,
    shortDesc: "The most common type of skin cancer, arising in sun-exposed skin and typically growing slowly.",
    signs: "A pearly or translucent bump with tiny visible blood vessels, a pinkish patch, or a sore that bleeds easily and does not stay healed.",
    careTips: "Do not pick or delay evaluation; practice daily sun protection.",
    seeDoctor: "Please schedule a prompt visit with a dermatologist for an in-person clinical exam. BCC is highly treatable when evaluated early by a specialist."
  },
  {
    id: "squamous-cell-carcinoma-scc",
    name: "Squamous Cell Carcinoma (SCC)",
    category: "Pre-cancerous and cancerous",
    urgentNotice: true,
    shortDesc: "A common form of skin cancer that develops in the outer layer of sun-exposed skin.",
    signs: "A firm red nodule, a scaly or crusted plaque, or a sore that fails to heal or is tender to the touch.",
    careTips: "Protect the area from trauma and UV exposure while arranging a medical visit.",
    seeDoctor: "Please consult a qualified dermatologist promptly for an in-person diagnosis and timely care."
  },
  {
    id: "melanoma",
    name: "Melanoma",
    category: "Pre-cancerous and cancerous",
    urgentNotice: true,
    shortDesc: "A serious form of skin cancer that develops in pigment-producing cells (melanocytes).",
    signs: "A mole or new spot showing ABCDE signs: Asymmetry, Border irregularity, multiple Colors, Diameter >6mm, or Evolving size/shape/symptoms.",
    careTips: "Monitor your skin regularly and protect against UV rays, but never rely on a photo app to clear a concerning mole.",
    seeDoctor: "Please arrange an in-person examination with a board-certified dermatologist promptly if you notice any new, changing, unusual, or bleeding pigmented spot."
  },

  // --- OTHER / BASELINE ---
  {
    id: "normal-skin",
    name: "Normal Skin",
    category: "Other",
    urgentNotice: false,
    shortDesc: "Balanced, healthy-appearing skin without visible signs of active inflammation or lesions in the image.",
    signs: "Even texture, comfortable hydration, and absence of obvious breakouts, rashes, or atypical growths.",
    careTips: "Maintain skin health with a gentle cleanser, daily moisturizer, and broad-spectrum SPF 30+ sunscreen.",
    seeDoctor: "Even if a photo appears normal, always see a dermatologist if you have physical symptoms (itch, pain) or any spot you are concerned about."
  }
];

/* ==========================================================================
   FAQ ITEMS
   ========================================================================== */
window.FAQS = [
  {
    q: "How does Derma-Scan work?",
    a: "You upload a clear photo of a skin area or capture one with your camera. Upon your consent, the image is sent to our FastAPI screening service, which runs the classifier trained directly on the local dataset and returns a top class prediction and confidence score."
  },
  {
    q: "What image formats are supported?",
    a: "Derma-Scan supports JPEG (.jpg, .jpeg), PNG (.png), and WebP (.webp) images up to 10 MB in size. For best results, use a well-lit, focused photo taken against a simple background."
  },
  {
    q: "Is this a medical diagnosis?",
    a: "No. Derma-Scan provides AI-generated informational screening results only. It is NOT a medical diagnosis, cannot rule out skin cancer or serious conditions, and never replaces an in-person evaluation by a qualified dermatologist."
  },
  {
    q: "What happens if the scan fails?",
    a: "If the backend server is unreachable, times out, or returns an unexpected format, Derma-Scan displays a clear status message with a Retry option so you can verify your connection or try another image."
  },
  {
    q: "Should I consult a dermatologist?",
    a: "Yes. You should always consult a qualified healthcare professional or dermatologist for any new, changing, painful, bleeding, persistent, or concerning skin lesion—regardless of what an AI screening tool reports."
  }
];

/* ==========================================================================
   SKINCARE GUIDES
   ========================================================================== */
window.GUIDES = [
  {
    id: "photo-tips",
    title: "How to Take a Clear Skin Photo for Screening",
    category: "Screening Tips",
    readTime: "3 min read",
    image: "images/skincare-1.jpg",
    summary: "Learn how natural daylight, steady focus, and proper framing help avoid blurry uploads during AI-assisted screening."
  },
  {
    id: "sun-protection-basics",
    title: "Everyday Sunscreen Habits Across All Skin Tones",
    category: "Sun Care",
    readTime: "4 min read",
    image: "images/skincare-2.jpg",
    summary: "Why broad-spectrum SPF 30+ matters for preventing photoaging, post-inflammatory dark spots, and UV damage."
  },
  {
    id: "gentle-barrier-routine",
    title: "Building a Calm, Barrier-Friendly Routine",
    category: "Daily Care",
    readTime: "5 min read",
    image: "images/skincare-3.jpg",
    summary: "Simple steps with a mild cleanser and fragrance-free moisturizer when your skin feels dry, tight, or reactive."
  },
  {
    id: "when-to-see-derm",
    title: "The ABCDEs of Moles & When to Book an In-Person Exam",
    category: "Clinical Safety",
    readTime: "4 min read",
    image: "images/skincare-4.jpg",
    summary: "Key visual signs that mean you should skip home remedies and schedule a prompt visit with a dermatologist."
  },
  {
    id: "understanding-acne-types",
    title: "Comedonal vs. Inflammatory Blemishes Explained",
    category: "Acne Care",
    readTime: "5 min read",
    image: "images/skincare-5.jpg",
    summary: "Understanding the difference between blackheads, whiteheads, papules, and deep nodules—and why picking causes scars."
  },
  {
    id: "hyperpigmentation-care",
    title: "Patience & Protection: Managing Post-Blemish Dark Marks",
    category: "Pigmentation",
    readTime: "4 min read",
    image: "images/skincare-6.jpg",
    summary: "How visible light and UV exposure affect pigment, and gentle habits that support an even skin tone."
  }
];

/* ==========================================================================
   PRICING PLANS (DEMO / PLACEHOLDER ONLY)
   ========================================================================== */
window.PRICING_PLANS = [
  {
    name: "Starter Explorer",
    badge: "Demo Plan",
    monthlyPrice: "$0",
    yearlyPrice: "$0",
    period: "Forever free demo",
    description: "Explore the educational skin condition library, skincare guides, and try local AI-assisted screening.",
    features: [
      "Access to Derma-Scan interface",
      "37 educational condition guides",
      "Photo capture & lighting checklist",
      "Clear medical safety disclaimers"
    ],
    ctaText: "Try Derma-Scan",
    ctaLink: "scan.html",
    highlighted: false
  },
  {
    name: "Plus Care Tracker",
    badge: "Popular Demo",
    monthlyPrice: "$9",
    yearlyPrice: "$7",
    period: "per month (Placeholder)",
    description: "A conceptual plan illustrating how routine check-ins and educational tracking could work.",
    features: [
      "Everything in Starter Explorer",
      "Guided skin routine checklists",
      "Dermatologist visit prep worksheet",
      "Priority educational updates"
    ],
    ctaText: "Explore Demo Plan",
    ctaLink: "scan.html",
    highlighted: true
  },
  {
    name: "Clinic Connect Preview",
    badge: "Concept Tier",
    monthlyPrice: "$29",
    yearlyPrice: "$24",
    period: "per month (Placeholder)",
    description: "Demonstrates how AI screening can pair with preparing questions for a real dermatologist visit.",
    features: [
      "Everything in Plus Care Tracker",
      "Consultation request demo form",
      "Printable symptom summary guide",
      "Dedicated support placeholders"
    ],
    ctaText: "View Doctor Page",
    ctaLink: "doctor.html",
    highlighted: false
  }
];

/* ==========================================================================
   DOCTORS / DERMATOLOGIST DIRECTORY (DEMO PROFILES)
   ========================================================================== */
window.DOCTORS = [
  {
    name: "Dr. Ananya Rao, MD",
    specialty: "General & Pigmentary Dermatology (Sample Profile)",
    location: "Clinical Advisor Placeholder",
    image: "images/doctor-1.jpg",
    bio: "Focuses on evidence-based care across diverse skin tones, acne management, and patient education."
  },
  {
    name: "Dr. Kabir Mehta, MD",
    specialty: "Medical Dermatology & Skin Screening (Sample Profile)",
    location: "Clinical Advisor Placeholder",
    image: "images/doctor-2.jpg",
    bio: "Advocates for early in-person mole evaluations, sun safety education, and calm, accessible dermatology guidance."
  },
  {
    name: "Dr. Maya Lin, MD",
    specialty: "Inflammatory Skin Conditions (Sample Profile)",
    location: "Clinical Advisor Placeholder",
    image: "images/doctor-3.jpg",
    bio: "Specializes in eczema, rosacea, and sensitive skin barrier repair for teenagers and adults."
  }
];
