"use client";
import { useEffect, useState } from "react";
import { fetchFromAPI } from "../../../lib/api";
import B2CPageLayout from "../B2CPageLayout";

export default function SearchPage() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetchFromAPI("tickets")
      .then(setTickets)
      .catch(console.error);
  }, []);

  return (
    <B2CPageLayout>
    <div className="p-6">
      <h1 className="text-2xl mb-4">Available Tickets</h1>
      <ul>
        {tickets.map((t) => (
          <li key={t.id} className="border p-4 mb-2 rounded">
            {t.name} - {t.price} AED
          </li>
        ))}
      </ul>
    </div>
    </B2CPageLayout>
  );
}
