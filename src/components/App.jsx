import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchImages, perPage } from '../Api/api';

import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { CustomLoader } from './Loader/Loader';
import { Button } from './Button/Button';
import { Modal } from './Modal/Modal';
import { BackgroundImage } from './BackgroundImage/BackgroundImage';

export const App = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [load, setLoad] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState('');

  useEffect(() => {
    if (!query) return;

    setLoading(true);
    fetchImages(query, page)
      .then((response) => {
        if (response.hits.length === 0) {
          toast.error('Images not found');
          setImages([]);
        } else {
          setImages((prevImages) => [...prevImages, ...response.hits]);
          setLoad(false);
        }
        setLoading(false);
      })
      .catch((error) => {
        setError('Failed to fetch images');
        setLoading(false);
      });
  }, [query, page]);

  const handleSubmit = (query) => {
    setQuery(query);
    setPage(1);
    setImages([]);
  };

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleOpenModal = (imageUrl) => {
    setShowModal(true);
    setModalImageUrl(imageUrl);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalImageUrl('');
  };

  const isLastPage = images.length > 0 && images.length % perPage !== 0;

  return (
    <div>
      <ToastContainer autoClose={1000} />
      <Searchbar onSubmit={handleSubmit} />
      {loading && <CustomLoader />}
      {error && <p>{error}</p>}
      <ImageGallery images={images} onOpenModal={handleOpenModal} />
      {!isLastPage && images.length > 0 && <Button onLoadMore={handleLoadMore} />}
      {showModal && (
        <Modal showModal={showModal} onCloseModal={handleCloseModal}>
          <img src={modalImageUrl} alt={images.tags} />
        </Modal>
      )}
      {load && <BackgroundImage />}
    </div>
  );
};




