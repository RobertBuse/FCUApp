import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

// Configurarea Firebase
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const storage = firebase.storage();

function SocialMediaPage() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const addNewPost = async (text, image) => {
    // Încarcă imaginea în Storage
    let imageUrl = null;
    if (image) {
      const imageRef = storage.ref().child(`images/${Date.now()}-${image.name}`);
      await imageRef.put(image);
      imageUrl = await imageRef.getDownloadURL();
    }

    // Adaugă postul în Firestore
    const post = { text, image: imageUrl };
    await db.collection('posts').add(post);

    // Actualizează lista de postări
    setPosts([...posts, post]);
    setNewPost('');
    setSelectedImage(null);
  };

  const deletePost = async (postId) => {
    // Șterge postul din Firestore
    await db.collection('posts').doc(postId).delete();

    // Actualizează lista de postări
    const updatedPosts = posts.filter((post) => post.id !== postId);
    setPosts(updatedPosts);
  };

  useEffect(() => {
    // Încarcă postările din Firestore la încărcarea paginii
    const unsubscribe = db.collection('posts').onSnapshot((snapshot) => {
      const loadedPosts = [];
      snapshot.forEach((doc) => {
        loadedPosts.push({ id: doc.id, ...doc.data() });
      });
      setPosts(loadedPosts);
    });

    return () => {
      // Dezabonează-te de la actualizările Firestore la demontarea componentei
      unsubscribe();
    };
  }, []);

  const handleAddPost = () => {
    if (newPost.trim() !== '') {
      addNewPost(newPost, selectedImage);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
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
            src={URL.createObjectURL(selectedImage)}
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
        {posts.map((post) => (
          <div className="card mb-3" key={post.id}>
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
                onClick={() => deletePost(post.id)}
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
