# Gift Guide - An AI Powered Gift Suggester

[Gift Guide](https://gift-guide-neon.vercel.app/) is my capstone project for [Ada Developers Academy](http://adadevelopersacademy.org/), Digital Campus, Cohort 18. This project is a web application that uses AI to generate personalized gift ideas for the person they are shopping for.

## Functionality

After creating an account, a user will have full access to the web application. It includes a homepage with a breif description of the application as well as links to the application's "New Gift Guide" and "Saved Gift Guides" pages. The homepage also includes a hamburger menu that reveals a card where the user can update their account details.

The New Gift Guide page includes a form that the user completes with details about the and gift they are shopping for. When the form is submitted, the application uses the form details and Open AI's GPT-3 API to generate a "Gift Guide" of 10 gift suggestions. The form details and the newly generated gift suggestions are displayed to the user on the New Gift Guide page along with a button to refresh the page and create another Gift Guide.

The Saved Gift Guides page includes a display of previous Gift Guides that the user has created and, after the user selects a Gift Guide from their list, includes a display of the form details and gift suggestions. The display of previous Gift Guides includes an option to delete a Gift Guide from their account. If the user selects a delete button, they are prompted with a model to cancel or continue. The display of gift suggestions includes an option to mark each gift as "gifted" or "not gifted" if the user chooses to track the status of each gift.

## Technologies

- Typescript
- Tailwind CSS
- DaisyUI
- Next.js
- [Open AI GPT-3 API](https://openai.com/api/)
- Supabase Database
- Supabase Authentication
- Vercel

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Development Environment

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/[filename]](http://localhost:3000/api/[filename]). This endpoint can be edited in `pages/api/[filename].ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deployed on Vercel

This Next.js app is deployed using the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
