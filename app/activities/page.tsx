// app/activities/page.tsx
export default function Activities() {
  const list = [
    {
      title: "Free Health Camps",
      desc: "Basic medical checkups and awareness.",
    },
    {
      title: "Food Distribution",
      desc: "Weekly food drives for needy families.",
    },
    {
      title: "Education & Training",
      desc: "Skill development and cultural education.",
    },
  ];

  return (
    <section className="py-12">
      <h1 className="text-3xl font-bold text-temple">Our Activities</h1>
      <div className="mt-6 grid md:grid-cols-3 gap-6">
        {list.map((a) => (
          <div key={a.title} className="border p-4 rounded-md">
            <h3 className="font-semibold">{a.title}</h3>
            <p className="mt-2 text-sm text-gray-700">{a.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
