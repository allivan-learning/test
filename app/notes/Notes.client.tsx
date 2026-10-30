'use client';
import css from './../Home.module.css';
import { fetchNotes } from '@/lib/api';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import SearchBox from '@/components/SearchBox/SearchBox';
import { useDebouncedCallback } from 'use-debounce';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';

export default function NotesClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['notes', page, searchQuery],
    queryFn: () => fetchNotes({ page, perPage: 10, search: searchQuery }),
    placeholderData: keepPreviousData,
  });

  const handleSearch = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
    setPage(1);
  }, 500);

  if (isLoading) return <p>Loading, please wait...</p>;
  if (isError) return <p>Something went wrong.</p>;
  console.log(data);

  const onCloseModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div className={css.container}>
      <header className={css.toolbar}>
        <SearchBox onChange={handleSearch} />

        {isSuccess && data && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            currentPage={page}
            onPageChange={(newPage) => setPage(newPage)}
          />
        )}

        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {/* 1. Выводим список заметок */}
      {isSuccess && data.notes.length > 0 && <NoteList notes={data.notes} />}
      {isModalOpen && (
        <Modal onCloseModal={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
