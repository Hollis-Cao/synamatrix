# Synamatrix

Synamatrix is an open Chinese-language knowledge commons for brain-computer interface research, products, emerging technologies, and community learning.

- Website: [synamatrix.xin](https://synamatrix.xin)
- Interface language: Simplified Chinese
- License: not yet specified

## What is included

- A searchable database of Chinese and international BCI products
- Curated paper notes covering BCI, flexible electrodes, memristive computing, EEG, sEEG, ECoG, neural decoding, and neural foundation models
- Emerging-technology briefs with reading checklists
- Core innovation frameworks for evaluating generalization, bandwidth, safety, daily-life use, co-adaptation, and reproducibility
- A structured learning path for computer science and engineering students
- Account-based bookmarks and progress tracking with Clerk
- Moderated resource submissions and community discussion prompts

## Editorial principles

Synamatrix prioritizes primary sources, separates evidence from interpretation, explains both technical significance and limitations, and does not treat product inclusion as an endorsement. Preprints and commercial claims should be clearly labeled and handled cautiously.

Community submissions are reviewed before publication. Contributors should provide an original source, explain why the item matters, disclose relevant conflicts of interest, and avoid copyrighted full text, private patient information, or unverifiable promotional claims.

## Local development

Requirements:

- Node.js 22.13 or later
- npm
- A Clerk application for authentication

Install and run:

```bash
npm ci
npm run dev
```

Copy the required Clerk values into a local `.env.local` file. Never commit that file or expose `CLERK_SECRET_KEY` in client code.

```dotenv
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
```

Other useful commands:

```bash
npm test
npm run build
```

## Project status

This is an early-stage independent open-source project. Content, moderation workflows, search, and mobile usability are still evolving. Corrections, source suggestions, and focused contributions are welcome.

## Contributing

Before proposing new content, please:

1. Link to the paper, regulatory filing, trial registration, laboratory page, or official product page.
2. State what changed and why it matters technically.
3. Separate facts, interpretation, and promotional claims.
4. Disclose any relationship to the featured team, company, or product.
5. Avoid personal data, copyrighted full text, and unsupported medical claims.

Open a GitHub issue for code defects or repository-level suggestions. Content submissions can also be made through the community page on the website.

## Disclaimer

Synamatrix is for research communication and education. It does not provide medical, investment, or purchasing advice.
