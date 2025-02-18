// app/page.tsx
async function getUsers() {
  const response = await fetch('https://jsonplaceholder.typicode.com/users', {
    cache: 'no-store' // Disable caching to always fetch fresh data
  })

  if (!response.ok) {
    throw new Error('Failed to fetch users')
  }

  return response.json()
}

export default async function Home() {
  const users = await getUsers()

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <div className="grid gap-4">
        {users.map((user: any) => (
          <div key={user.id} className="border p-4 rounded-lg">
            <h2 className="font-semibold">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-sm">{user.company.name}</p>
          </div>
        ))}
      </div>
    </main>
  )
}

// To add TypeScript support, add this interface:
interface User {
  id: number
  name: string
  email: string
  company: {
    name: string
  }
}