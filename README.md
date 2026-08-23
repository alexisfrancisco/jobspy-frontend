# JobSpy Frontend

A modern Next.js dashboard for searching and managing job listings from multiple platforms.

## Setup

### Prerequisites
- Node.js 18+ installed
- JobSpy API running on `http://localhost:8000`

### Installation

```bash
# Install dependencies (already done)
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

### Current (Phase 1)
- ✅ Search form with multiple filters
- ✅ Results display in card format
- ✅ Sort by recent or salary
- ✅ Filter by salary (show only jobs with salary data)
- ✅ Export results to CSV
- ✅ Multi-site search (Indeed, LinkedIn, Glassdoor, etc.)

### Planned (Phase 2)
- 📝 Save/favorite jobs
- 📊 Track application status
- 🏷️ Add notes to jobs
- 📈 Application statistics
- 🔍 Search history

## Project Structure

```
jobspy-frontend/
├── app/
│   ├── page.tsx           # Main dashboard
│   └── layout.tsx         # Root layout
├── components/
│   ├── SearchForm.tsx     # Search filters
│   └── JobResults.tsx     # Results display
├── public/
└── package.json
```

## Configuration

### API Connection

Edit `app/page.tsx` line 24 to change API endpoint and API key:
```typescript
const response = await fetch('http://localhost:8000/api/v1/search_jobs', {
  headers: {
    'x-api-key': 'your-api-key-here',
  },
});
```

## Troubleshooting

### "Can't connect to API"
- Ensure JobSpy API is running on `localhost:8000`
- Check that CORS is enabled in the FastAPI backend
- Verify API key is correct

### "No results found"
- Try different search parameters
- Check that at least one job site is selected
- For Indeed/Glassdoor, ensure country_indeed is set

## Development

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run lint     # Run linter
```

## Next Steps

1. Add database integration for saving jobs
2. Add user authentication
3. Create job application tracking
4. Add email notifications
5. Deploy to production (Vercel, AWS, etc.)

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
