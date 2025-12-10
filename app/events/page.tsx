// app/events/page.tsx
export default function Events() {
  const events = [
    { id: 1, title: "Health Camp - Athagada", date: "2025-04-12" },
    { id: 2, title: "Food Drive - Polasara", date: "2025-04-20" },
    { id: 3, title: "Satsang - Ganjam", date: "2025-05-05" },
  ];

  return (
    <section className="py-12">
      <h1 className="text-3xl font-bold text-temple">Events & Schedule</h1>
      <div className="mt-6 space-y-4">
        {events.map((e) => (
          <div
            key={e.id}
            className="p-4 border rounded-md flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{e.title}</h3>
              <p className="text-sm text-gray-600">{e.date}</p>
            </div>
            <button className="btn bg-saffron text-white px-4 py-2 rounded-md">
              View
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
