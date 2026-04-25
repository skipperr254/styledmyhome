# Styled My Home — Product Requirements Document

## The Idea

Styled My Home is an online interior design style quiz. A user answers a series of visual questions by picking images they're drawn to, and at the end the app tells them what their dominant interior design style is — for example, "You're a Bohemian" or "You're a Japandi person." Along with the result, they get a detailed breakdown of their style: what it means, what colors to use, what materials to look for, design tips, and a short history. They can then download a PDF guide that goes deeper into their style and purchase an even more detail style guide described below.

The goal is to be fun, visual, and useful. It should feel like a premium experience — not a basic BuzzFeed quiz. The images are the product. They need to be beautiful and aspirational.

There are **8 design styles** the app recognizes:

1. French Country
2. Japandi
3. Modern Farmhouse
4. Bohemian
5. Mid Century Modern
6. Coastal
7. Industrial
8. Transitional

---

## The User Journey

### Step 1 — Welcome Screen

The first thing a user sees is a welcome/intro page. It shows the brand logo and the name of the product. There is a short tagline explaining what the app is about — something like "Discover your interior design style."

On this screen there is a text input where the user can type their **first name**. This is optional — if they enter it, the quiz will address them personally. There is a button to continue — something like "Let's Begin."

Clicking the button takes them to the next screen regardless of whether they entered a name.

---

### Step 2 — How It Works Screen

Before the quiz starts, the user sees a simple instruction screen. It explains the three steps of the experience:

1. Answer the visual questions
2. Get your personalized style result
3. Use your style guide to decorate with confidence

It also mentions how long it takes (approximately 5 minutes) and that the results are personalized. There is a button to start the quiz — "Start Quiz."

---

### Step 3 — The Quiz

This is the main part of the app. The quiz has **11 questions**. Each question is shown one at a time — the user cannot skip ahead or go back.

At the top of each question screen, it shows "Question X of 11" so the user knows where they are.

Each question shows **8 image tiles** in a grid. Each image represents one of the 8 design styles applied to a specific room or design element. The user clicks the image they are most drawn to. As soon as they click, the app immediately moves to the next question — no confirmation needed.

The questions, in no particular order (they should be randomized each time), cover these topics:

| #   | Question                                                        | What the images show                                           |
| --- | --------------------------------------------------------------- | -------------------------------------------------------------- |
| 1   | Which kitchen style can you envision yourself in?               | 8 kitchen photos, one per style                                |
| 2   | Which living room style speaks to you?                          | 8 living room photos                                           |
| 3   | Which dining room style can you see yourself enjoying meals in? | 8 dining room photos                                           |
| 4   | Which primary bedroom style would make you feel most at home?   | 8 bedroom photos                                               |
| 5   | Which primary bathroom style appeals to you most?               | 8 bathroom photos                                              |
| 6   | Which wood finish appeals to you?                               | 8 home office photos (showing different wood tones in context) |
| 7   | Which entryway style would welcome you home?                    | 8 entryway/foyer photos                                        |
| 8   | Which outdoor patio style would be your perfect retreat?        | 8 patio photos                                                 |
| 9   | Which color palette do you prefer?                              | 8 color palette images, one per style                          |
| 10  | Which chair would you like to relax in?                         | 8 chair photos, one per style                                  |
| 11  | Which door knob would you open to your home?                    | 8 door knob/hardware photos                                    |

**Important:** The order of both the questions AND the 8 image options within each question should be randomized every time the quiz is taken. This prevents users from memorizing which position leads to which style.

Each image tile shows only a letter (A, B, C… H) as a label — it does not show the name of the style. The user is picking based purely on visual preference, not by reading style names.

---

### Step 4 — Results

After the user answers all 11 questions, the app calculates their result. The calculation is simple: whichever of the 8 styles they picked the most times is their dominant style. If there's a tie, pick the one that appeared first in their answers.

The results shows the following:

Your Result Headline - which style did you match

If the user didn't enter their name, it just says "Your interior design style is." The style name is displayed prominently, in a large font, in a highlight color.

Below the style name, there is a short description of the style

Style Hero Image - A large, beautiful image representing the style. This is a signature image that sets the tone.

Style History - 2–3 sentences about where this style came from and its cultural/historical origins.

Key Characteristics - a bullet list of 5 descriptive words or short phrases that define this style (e.g., "Natural Materials," "Clean Lines," "Zen Atmosphere").

Design & Décor Tips — a bullet list of 6 actionable tips for how to bring this style into your home.

Color Palette — a list of 5 colors that belong to this style, displayed as labeled tags or chips.

Metal Finishes - a list of 3–4 metal types that complement this style (e.g., "Brushed Nickel," "Matte Black").

Wood Finishes — a list of 3–4 wood finish types that complement this style.

Style Vision Video - It shows a video that gives the user a visual feel for their style in motion. The video has playback controls. Below the video is a short caption like "Step into a beautiful Bohemian home to see your design style in action."

Style Match Breakdown - A section that shows a visual breakdown of the user's top 3 style preferences as percentages. For example, if they picked Bohemian 5 times out of 11, that's 45%. The top 3 styles are shown with a label, a percentage number, and a progress bar. Styles with 0% are not shown.

This gives users insight into their secondary styles and makes the result feel richer and more personalized.

---

After the use has seen their results, they can download their style guide in the form of a PDF. This download is included in their first purchase $9.99 for the quiz. So this should be readily available for them. It's a single-style PDF guide tailored to the user's result. It's a beautifully designed document with everything on the results page plus additional inspiration, imagery, and guidance for their specific style.

There is also the complete design style guide which the user can purchase for the $29.99. It's a complete guide covering all their top styles. Good for someone who scored close across multiple styles, or who wants to explore all their options.

To get this, they can click a button that opens a dialog/popup when clicked. The popup shows:

- What's included (a checklist of features: complete style guide, design recommendations, color palette & material guide, PDF format)
- A field to enter the user's email address
- The price
- A "Purchase Now" button

We will use Stripe to handle this purchase.

When they complete the purchase, the PDF immediately downloads to their device.

---

The user can decide to take the quiz again. They can take it up to 3 times. They can get a button to do so.

---

## The 8 Styles — Content Requirements

Each style needs the following content prepared:

| Field               | Description                                                                    |
| ------------------- | ------------------------------------------------------------------------------ |
| Name                | The style name (e.g., "Japandi")                                               |
| Description         | 3–4 sentences in second person describing this style and who resonates with it |
| History             | 2–3 sentences on the style's origins                                           |
| Key Characteristics | 5 descriptive labels                                                           |
| Design Tips         | 6 actionable home decorating tips                                              |
| Color Palette       | 5 color names                                                                  |
| Metal Finishes      | 3–4 metal type names                                                           |
| Wood Finishes       | 3–4 wood finish names                                                          |
| Hero Image          | One beautiful signature image representing the style                           |
| Video               | One video showing the style in action                                          |
| Style Guide PDF     | A downloadable PDF with expanded content for this style                        |

---

## Images Required

For each of the 11 quiz questions, 8 images are needed — one per style. That's **88 quiz images** in total.

Additionally, 8 **hero images** are needed (one per style) for the results page.

All images should be high quality and aspirational. They are the core of the user experience.

---

## Payments & Downloads

- Payment processing must be handled by a real payment provider (Stripe is what we are leaning towards). The user enters their email and pays. On success, the PDF downloads automatically.
- You pay $9.99 to get access to the quiz and once done receive a top rated design style guide.
- To get the full design guide, you pay $29.99.
- The PDFs are pre-made — they are not generated on the fly. They are stored securely and served as downloadable files after a successful payment.
- The email address is collected at the time of purchase (for receipts or future follow-up). It should not be required to take the quiz.

---

## Content Management

All quiz content — questions, images, style descriptions, tips, etc. — should live in a database or content system so it can be updated without touching code. If a new question needs to be added, or a style description needs rewording, that should be doable without a developer.

---

## Branding & Feel

- The product is called **"Styled My Home"**.
- The tone is warm, personal, and aspirational. It speaks to the user as if a knowledgeable design friend is guiding them.
- The color palette of the interface itself is clean and neutral — The images do the visual heavy lifting.
- It should look and feel premium. Not flashy — refined.
- It works on both desktop and mobile browsers.

---

## What Success Looks Like

A user lands on the site, enters their name, learns how it works, answers 11 beautifully visual questions, discovers their design style, reads a rich and personalized result, and feels genuinely excited and inspired. They then purchase their style guide PDF and walk away with something useful and beautiful that helps them decorate their home with confidence.

The experience should take about 5 minutes and leave the user feeling like they learned something real about themselves.
