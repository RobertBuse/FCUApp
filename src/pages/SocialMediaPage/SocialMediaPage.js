import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/storage';

const firebaseConfig = {
  // Configurațiile Firebase aici
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const storage = firebase.storage();

function SocialMediaPage() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const addNewPost = async (text, image) => {
    // Încarcă imaginea în Firebase Storage
    let imageUrl = null;
    if (image) {
      const imageRef = storage.ref().child(`images/${Date.now()}-${image.name}`);
      await imageRef.put(image);
      imageUrl = await imageRef.getDownloadURL();
    }

    // Adaugă postul în starea locală sau în baza de date Firebase
    const post = { text, image: imageUrl };

    // Aici poți decide dacă dorești să utilizezi Firebase Realtime Database sau altă bază de date pentru a stoca posturile.

    // Actualizează lista de postări
    setPosts([...posts, post]);
    setNewPost('');
    setSelectedImage(null);
  };

  const deletePost = (index) => {
    const updatedPosts = [...posts];
    updatedPosts.splice(index, 1);
    setPosts(updatedPosts);
  };

  const saveDataToLocalStorage = () => {
    localStorage.setItem('socialMediaData', JSON.stringify({ posts, newPost }));
  };

  const loadDataFromLocalStorage = () => {
    const storedData = localStorage.getItem('socialMediaData');
    if (storedData) {
      const { posts: storedPosts, newPost: storedNewPost } = JSON.parse(storedData);
      setPosts(storedPosts);
      setNewPost(storedNewPost);
    }
  };

  useEffect(() => {
    loadDataFromLocalStorage();
  }, []);

  useEffect(() => {
    saveDataToLocalStorage();
  }, [posts, newPost]);

  const handleAddPost = () => {
    if (newPost.trim() !== '') {
      addNewPost(newPost, selectedImage);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(URL.createObjectURL(file));
  };

  return (
    <div className="container mt-5">
      <h1>Pagina de Social Media</h1>

      <div className="mb-3">
        <textarea
          className="form-control"
          rows="3"
          placeholder="Ce vrei să postezi?"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        ></textarea>
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="mb-3"
      />

      {selectedImage && (
        <div className="mb-3">
          <img
            src={selectedImage}
            alt="Imagine selectată"
            style={{ maxWidth: '100%', maxHeight: '200px' }}
          />
        </div>
      )}

      <button className="btn btn-primary" onClick={handleAddPost}>
        Postează
      </button>

      <hr />

      <div>
        {posts.map((post, index) => (
          <div className="card mb-3" key={index}>
            <div className="card-body">
              <p>{post.text}</p>
              {post.image && (
                <img
                  src={post.image}
                  alt="Imagine postare"
                  style={{ maxWidth: '100%', maxHeight: '200px' }}
                />
              )}
              <button
                className="btn btn-danger"
                onClick={() => deletePost(index)}
              >
                Șterge
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SocialMediaPage;
