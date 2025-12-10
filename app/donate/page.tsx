// app/donate/page.tsx
export default function Donate() {
  return (
    <section className="py-12 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-temple text-center">
        Support Our Seva
      </h1>
      <p className="mt-4 text-center text-gray-700">
        Your donation helps run health camps, food drives and community
        programs.
      </p>

      <div className="mt-8 bg-gray-50 p-6 rounded-md border">
        <label className="block text-sm font-medium">Amount (INR)</label>
        <input
          type="number"
          className="mt-2 w-full border rounded-md p-2"
          placeholder="500"
        />

        <button className="mt-4 w-full bg-saffron text-white py-2 rounded-md font-semibold">
          Donate (UI only)
        </button>

        <p className="mt-4 text-xs text-gray-600">
          We&apos;ll add online payment (Razorpay) integration in the next step.
        </p>
      </div>
    </section>
  );
}
