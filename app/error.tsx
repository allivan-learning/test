'use client';
import { useState } from 'react';

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const [bookings, setBookings] = useState([
    'Бронирование №1',
    'Бронирование №2',
  ]);

  const handleAddBooking = () => {
    setBookings((prevBookings: string[]) => [
      ...prevBookings,
      'Новое бронирование',
    ]);
  };
  return (
    <div>
      <div>
        <button onClick={handleAddBooking}>Добавить бронь</button>
        <ul>
          {bookings.map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
      <h2>Помилка при завантаженні</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Спробувати знову</button>
    </div>
  );
}
