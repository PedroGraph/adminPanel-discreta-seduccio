
import React, { useEffect, useState } from "react";

function formatDateTime(date: Date) {
  return date.toLocaleString("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function CurrentDateTime() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden md:flex items-center text-gray-300 text-sm font-medium px-2 select-none">
      {formatDateTime(now)}
    </div>
  );
}
