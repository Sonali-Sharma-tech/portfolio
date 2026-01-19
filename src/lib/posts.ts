export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readingTime: string;
  tags?: string[];
}

export const posts: Post[] = [
  {
    slug: "react-server-components-2025",
    title: "React Server Components: The Complete Guide for 2025",
    excerpt:
      "Understanding RSC architecture, when to use Server vs Client Components, and how they're changing the way we build React applications.",
    content: `
React Server Components (RSC) have fundamentally changed how we think about React applications. After using them extensively in production, here's everything you need to know.

## What Are Server Components?

Server Components are React components that render exclusively on the server. They never ship JavaScript to the client, resulting in smaller bundles and faster page loads.

\`\`\`tsx
// This component runs ONLY on the server
async function BlogPosts() {
  const posts = await db.posts.findMany();
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
\`\`\`

## Server vs Client Components

The key mental model is simple:

- **Server Components**: For data fetching, accessing backend resources, keeping sensitive info on server
- **Client Components**: For interactivity, browser APIs, state, effects

\`\`\`tsx
// Server Component (default in Next.js App Router)
async function ProductPage({ id }: { id: string }) {
  const product = await getProduct(id);
  return <ProductDetails product={product} />;
}

// Client Component (add 'use client' directive)
'use client';
function AddToCartButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false);
  // ... client-side logic
}
\`\`\`

## The Composition Pattern

The most powerful pattern is composing Server and Client components together:

\`\`\`tsx
// Server Component
async function Dashboard() {
  const data = await fetchDashboardData();

  return (
    <div>
      <ServerRenderedChart data={data.chart} />
      <InteractiveFilters /> {/* Client Component */}
      <DataTable rows={data.rows} />
    </div>
  );
}
\`\`\`

## Common Mistakes to Avoid

1. **Don't pass functions as props to Client Components** - Functions can't be serialized
2. **Don't use hooks in Server Components** - No useState, useEffect, etc.
3. **Don't import Client Components into Server Components without careful consideration** - This can accidentally pull code to the client

## Performance Benefits

In our production apps, we've seen:

- **40-60% reduction** in JavaScript bundle size
- **2-3x faster** Time to Interactive (TTI)
- **Better SEO** with server-rendered content

## When to Use What

Use **Server Components** for:
- Data fetching
- Accessing backend services
- Rendering static or semi-static content
- Large dependencies that shouldn't ship to client

Use **Client Components** for:
- onClick, onChange, onSubmit handlers
- useState, useEffect, useReducer
- Browser-only APIs (localStorage, geolocation)
- Third-party libraries that need browser APIs

The future of React is hybrid - embrace the composition model and you'll build faster, more efficient applications.
    `.trim(),
    date: "2025-01-15",
    readingTime: "8 min read",
    tags: ["React", "Next.js", "Server Components"],
  },
  {
    slug: "ai-coding-assistants-developer-workflow",
    title: "How AI Coding Assistants Are Transforming Developer Workflows",
    excerpt:
      "A practical look at integrating AI tools like Claude, GitHub Copilot, and Cursor into your daily development workflow for maximum productivity.",
    content: `
AI coding assistants have evolved from novelty to necessity. Here's how I've integrated them into my workflow and what I've learned about getting the most out of these tools.

## The Current Landscape

The main players in 2025:

- **GitHub Copilot** - Best for inline code completion
- **Claude** - Excellent for complex reasoning and architecture decisions
- **Cursor** - IDE-integrated AI with context awareness
- **ChatGPT** - Good for explanations and learning

## My Daily Workflow

### Morning: Architecture & Planning

I start complex tasks by discussing architecture with Claude. The key is providing good context:

\`\`\`
"I'm building a real-time notification system for a Next.js app.
Requirements:
- Push notifications to mobile and web
- Database: PostgreSQL with Prisma
- Need to handle 10k concurrent users

What architecture would you recommend?"
\`\`\`

### Coding: Copilot + Cursor

For actual coding, I use a combination:

1. **Copilot** for boilerplate and common patterns
2. **Cursor** for complex refactors with full codebase context
3. **Claude** for debugging tricky issues

### Code Review: AI as First Pass

Before requesting human review, I ask AI to review my code:

\`\`\`
"Review this React component for:
- Performance issues
- Accessibility problems
- Security vulnerabilities
- Best practice violations"
\`\`\`

## Prompting Strategies That Work

### Be Specific About Context

Bad: "Fix this function"

Good: "This function fetches user data from our REST API. It's called on page load in a Next.js Server Component. Currently it's throwing a timeout error on slow connections. Here's the function..."

### Ask for Explanations

Don't just accept code - understand it:

\`\`\`
"Explain why you chose useCallback here instead of useMemo.
What's the performance implication?"
\`\`\`

### Iterate Incrementally

Instead of asking for complete solutions, break problems down:

1. "What's the best approach for X?"
2. "Show me the core implementation"
3. "Now add error handling"
4. "Add TypeScript types"

## What AI Is NOT Good At

Be aware of limitations:

- **Domain-specific business logic** - AI doesn't know your business
- **Up-to-date library APIs** - Training data cutoffs matter
- **Complex state management** - Often suggests suboptimal patterns
- **Security-critical code** - Always verify independently

## Productivity Metrics

After 6 months of intentional AI integration:

- **30% faster** feature development
- **50% reduction** in time spent on boilerplate
- **Better documentation** - AI helps write docs
- **Fewer bugs** - AI catches obvious issues early

## The Human Element

AI is a tool, not a replacement. The most valuable skills now are:

1. **Knowing what to ask** - Problem decomposition
2. **Evaluating output** - Critical thinking
3. **System design** - Big picture thinking
4. **Code review** - Catching what AI misses

The developers who thrive will be those who leverage AI as a force multiplier while maintaining deep technical understanding.
    `.trim(),
    date: "2025-01-10",
    readingTime: "7 min read",
    tags: ["AI", "Developer Tools", "Productivity"],
  },
  {
    slug: "react-19-new-hooks-features",
    title: "React 19: New Hooks and Features You Should Know",
    excerpt:
      "Exploring the new hooks in React 19 including useActionState, useFormStatus, useOptimistic, and the new use() API.",
    content: `
React 19 introduces several new hooks that simplify common patterns. Let's explore each one with practical examples.

## useActionState

Replaces the old useFormState from react-dom. Handles form submission state elegantly:

\`\`\`tsx
'use client';
import { useActionState } from 'react';

function SignupForm() {
  const [state, formAction, isPending] = useActionState(
    async (prevState, formData) => {
      const email = formData.get('email');
      const result = await signupUser(email);
      return result;
    },
    null
  );

  return (
    <form action={formAction}>
      <input name="email" type="email" disabled={isPending} />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Signing up...' : 'Sign Up'}
      </button>
      {state?.error && <p className="error">{state.error}</p>}
    </form>
  );
}
\`\`\`

## useFormStatus

Access the pending state of a parent form from any child component:

\`\`\`tsx
'use client';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending, data, method } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  );
}
\`\`\`

## useOptimistic

Show optimistic UI updates before server confirmation:

\`\`\`tsx
'use client';
import { useOptimistic } from 'react';

function TodoList({ todos }: { todos: Todo[] }) {
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo: Todo) => [...state, newTodo]
  );

  async function handleAdd(formData: FormData) {
    const newTodo = {
      id: Date.now(),
      text: formData.get('text'),
      pending: true
    };

    addOptimisticTodo(newTodo);
    await saveTodo(newTodo);
  }

  return (
    <form action={handleAdd}>
      <input name="text" />
      <button type="submit">Add</button>
      <ul>
        {optimisticTodos.map(todo => (
          <li key={todo.id} style={{ opacity: todo.pending ? 0.5 : 1 }}>
            {todo.text}
          </li>
        ))}
      </ul>
    </form>
  );
}
\`\`\`

## The use() API

A new way to read resources in render, including promises and context:

\`\`\`tsx
import { use } from 'react';

function UserProfile({ userPromise }: { userPromise: Promise<User> }) {
  const user = use(userPromise);

  return <div>Hello, {user.name}!</div>;
}

// Also works with context
function ThemeButton() {
  const theme = use(ThemeContext);
  return <button style={{ background: theme.primary }}>Click</button>;
}
\`\`\`

## Actions and Transitions

React 19 formalizes the concept of Actions - async functions that trigger state updates:

\`\`\`tsx
function UpdateName() {
  const [name, setName] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(async () => {
      await updateNameOnServer(name);
      // State updates after await are batched
    });
  };

  return (
    <>
      <input value={name} onChange={e => setName(e.target.value)} />
      <button onClick={handleSubmit} disabled={isPending}>
        {isPending ? 'Updating...' : 'Update'}
      </button>
    </>
  );
}
\`\`\`

## Document Metadata

React 19 supports rendering metadata tags anywhere in your component tree:

\`\`\`tsx
function BlogPost({ post }) {
  return (
    <article>
      <title>{post.title}</title>
      <meta name="description" content={post.excerpt} />
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}
\`\`\`

## Migration Tips

1. **Update react and react-dom** to version 19
2. **Replace useFormState** with useActionState
3. **Test async transitions** thoroughly
4. **Leverage Server Components** where possible

React 19 makes async patterns first-class citizens. Embrace these new primitives to write cleaner, more performant code.
    `.trim(),
    date: "2025-01-05",
    readingTime: "6 min read",
    tags: ["React", "Hooks", "React 19"],
  },
  {
    slug: "building-ai-powered-features-react",
    title: "Building AI-Powered Features in React Applications",
    excerpt:
      "A hands-on guide to integrating AI capabilities into your React apps using OpenAI, Anthropic Claude, and the Vercel AI SDK.",
    content: `
Adding AI features to your React application has never been easier. Here's how to build intelligent features using modern tools and best practices.

## Setting Up the Vercel AI SDK

The Vercel AI SDK provides React hooks for streaming AI responses:

\`\`\`bash
npm install ai @ai-sdk/openai @ai-sdk/anthropic
\`\`\`

## Basic Chat Implementation

\`\`\`tsx
'use client';
import { useChat } from 'ai/react';

function ChatInterface() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  });

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map(m => (
          <div key={m.id} className={m.role === 'user' ? 'user' : 'ai'}>
            {m.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask anything..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          Send
        </button>
      </form>
    </div>
  );
}
\`\`\`

## API Route with Streaming

\`\`\`ts
// app/api/chat/route.ts
import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: anthropic('claude-3-5-sonnet-20241022'),
    messages,
    system: 'You are a helpful assistant.',
  });

  return result.toDataStreamResponse();
}
\`\`\`

## Building an AI Writing Assistant

Here's a more practical example - an AI-powered content editor:

\`\`\`tsx
'use client';
import { useCompletion } from 'ai/react';

function WritingAssistant() {
  const { completion, input, setInput, complete, isLoading } = useCompletion({
    api: '/api/improve-writing',
  });

  const improveText = async () => {
    await complete(input);
  };

  return (
    <div className="editor">
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Paste your text here..."
        rows={10}
      />

      <div className="actions">
        <button onClick={improveText} disabled={isLoading}>
          ✨ Improve Writing
        </button>
        <button onClick={() => complete(input, {
          body: { action: 'summarize' }
        })}>
          📝 Summarize
        </button>
        <button onClick={() => complete(input, {
          body: { action: 'fix-grammar' }
        })}>
          🔧 Fix Grammar
        </button>
      </div>

      {completion && (
        <div className="result">
          <h3>Improved Version:</h3>
          <p>{completion}</p>
        </div>
      )}
    </div>
  );
}
\`\`\`

## Semantic Search with Embeddings

Build intelligent search using vector embeddings:

\`\`\`tsx
async function semanticSearch(query: string) {
  // Generate embedding for the query
  const { embedding } = await embed({
    model: openai.embedding('text-embedding-3-small'),
    value: query,
  });

  // Search your vector database
  const results = await vectorDB.search({
    vector: embedding,
    topK: 5,
  });

  return results;
}

function SearchWithAI() {
  const [results, setResults] = useState([]);

  const handleSearch = async (query: string) => {
    const matches = await semanticSearch(query);
    setResults(matches);
  };

  return (
    <div>
      <input
        onChange={e => handleSearch(e.target.value)}
        placeholder="Search naturally..."
      />
      <ul>
        {results.map(r => <li key={r.id}>{r.title}</li>)}
      </ul>
    </div>
  );
}
\`\`\`

## Best Practices

1. **Stream responses** - Always stream for better UX
2. **Handle errors gracefully** - AI APIs can fail
3. **Implement rate limiting** - Protect your API costs
4. **Cache when possible** - Avoid redundant API calls
5. **Provide loading states** - Users should know AI is thinking

## Cost Optimization

- Use smaller models for simple tasks
- Implement response caching
- Set token limits appropriately
- Consider on-device models for simple classification

AI features can transform your application's user experience. Start small, measure impact, and iterate based on user feedback.
    `.trim(),
    date: "2024-12-28",
    readingTime: "9 min read",
    tags: ["AI", "React", "Vercel AI SDK"],
  },
  {
    slug: "typescript-patterns-2025",
    title: "Advanced TypeScript Patterns Every Developer Should Know",
    excerpt:
      "Level up your TypeScript with discriminated unions, branded types, type guards, and other advanced patterns used in production codebases.",
    content: `
TypeScript has evolved significantly. These patterns will help you write safer, more maintainable code.

## Discriminated Unions for State Management

Handle complex state with type safety:

\`\`\`typescript
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

function renderUser(state: AsyncState<User>) {
  switch (state.status) {
    case 'idle':
      return <p>Ready to load</p>;
    case 'loading':
      return <Spinner />;
    case 'success':
      return <UserCard user={state.data} />;
    case 'error':
      return <Error message={state.error.message} />;
  }
}
\`\`\`

## Branded Types for Type Safety

Prevent mixing up primitive types that represent different things:

\`\`\`typescript
type Brand<K, T> = K & { __brand: T };

type UserId = Brand<string, 'UserId'>;
type PostId = Brand<string, 'PostId'>;

function getUser(id: UserId) { /* ... */ }
function getPost(id: PostId) { /* ... */ }

const userId = 'abc' as UserId;
const postId = 'xyz' as PostId;

getUser(userId); // ✅ Works
getUser(postId); // ❌ Type error!
\`\`\`

## Type Guards with Assertion Functions

\`\`\`typescript
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== 'string') {
    throw new Error('Expected string');
  }
}

function processInput(input: unknown) {
  assertIsString(input);
  // TypeScript now knows input is string
  console.log(input.toUpperCase());
}
\`\`\`

## Const Assertions for Literal Types

\`\`\`typescript
// Without const assertion
const config = {
  endpoint: '/api/users',
  method: 'GET'
};
// Type: { endpoint: string; method: string }

// With const assertion
const config = {
  endpoint: '/api/users',
  method: 'GET'
} as const;
// Type: { readonly endpoint: '/api/users'; readonly method: 'GET' }
\`\`\`

## Template Literal Types

Create type-safe string patterns:

\`\`\`typescript
type EventName = 'click' | 'focus' | 'blur';
type Handler = \`on\${Capitalize<EventName>}\`;
// Type: 'onClick' | 'onFocus' | 'onBlur'

type APIRoute = \`/api/\${string}\`;
function fetchAPI(route: APIRoute) { /* ... */ }

fetchAPI('/api/users'); // ✅
fetchAPI('/users');     // ❌
\`\`\`

## Conditional Types for Flexibility

\`\`\`typescript
type ApiResponse<T> = T extends undefined
  ? { success: boolean }
  : { success: boolean; data: T };

function apiCall<T = undefined>(): ApiResponse<T> {
  // Implementation
}

const response1 = apiCall();           // { success: boolean }
const response2 = apiCall<User>();     // { success: boolean; data: User }
\`\`\`

## Mapped Types for Transformations

\`\`\`typescript
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

type Required<T> = {
  [K in keyof T]-?: T[K];
};

type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};

interface User {
  name?: string;
  email?: string;
}

type RequiredUser = Required<User>;
// { name: string; email: string }
\`\`\`

## The satisfies Operator

Get the best of both inference and validation:

\`\`\`typescript
type Colors = Record<string, [number, number, number]>;

// With satisfies, we get both validation AND literal types
const colors = {
  red: [255, 0, 0],
  green: [0, 255, 0],
  blue: [0, 0, 255],
} satisfies Colors;

// colors.red is typed as [number, number, number], not number[]
// and we still get autocomplete for 'red', 'green', 'blue'
\`\`\`

## Utility Types You Should Know

\`\`\`typescript
// Pick specific keys
type UserPreview = Pick<User, 'id' | 'name'>;

// Omit specific keys
type UserWithoutPassword = Omit<User, 'password'>;

// Make all properties optional
type PartialUser = Partial<User>;

// Extract types from unions
type SuccessStates = Extract<AsyncState<User>, { status: 'success' }>;
\`\`\`

These patterns will help you catch bugs at compile time rather than runtime. TypeScript's type system is incredibly powerful - use it to its full potential.
    `.trim(),
    date: "2024-12-20",
    readingTime: "7 min read",
    tags: ["TypeScript", "JavaScript", "Best Practices"],
  },
];

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getAllPosts(): Post[] {
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
