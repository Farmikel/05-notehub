import css from "./App.module.css";
import Modal from "../Modal/Modal";
import Loader from "../Loader/Loader";
import NoteForm from "../NoteForm/NoteForm";
import NoteList from "../NoteList/NoteList";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "../../services/noteService";
import { keepPreviousData } from "@tanstack/react-query";
import type { FetchNotesResponse } from "../../services/noteService";

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [debouncedQuery] = useDebounce(query, 500);

  const { data, isLoading, isError, error } = useQuery<
    FetchNotesResponse,
    Error
  >({
    queryKey: ["notes", debouncedQuery, page],
    queryFn: () => fetchNotes(page, 12, debouncedQuery),
    enabled: true,
    placeholderData: keepPreviousData,
    retry: 1,
  });

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setPage(1);
  };

  const handlePageChange = (selectedPage: number) => {
    setPage(selectedPage);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={handleSearch} />
        {data && data.totalPages > 1 && (
          <Pagination
            pageCount={Math.min(data.totalPages, 4)}
            onPageChange={handlePageChange}
            currentPage={page}
          />
        )}
        <button className={css.button} onClick={handleOpenModal}>
          Create note +
        </button>
      </header>
      {isLoading && !data && <Loader />}
      {isError && (
        <div>
          Error fetching notes: {error.message}
          {error.message.includes("400") && (
            <p>Check if the token is valid or try a different search query.</p>
          )}
        </div>
      )}
      {data && data.notes && data.notes.length > 0 && (
        <NoteList notes={data.notes} />
      )}
      {data && data.notes && data.notes.length === 0 && !isLoading && (
        <p>No notes found.</p>
      )}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <NoteForm onClose={handleCloseModal} />
        </Modal>
      )}
    </div>
  );
}