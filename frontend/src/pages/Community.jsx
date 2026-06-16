import { useParams } from 'react-router-dom';
import { useState } from 'react';

export default function Community() {
  const { id } = useParams();
  const [posts, setPosts] = useState([
    { id: 1, text: 'Bem-vindos ao meu canal!', likes: 10 },
    { id: 2, text: 'Enquete: qual conteúdo vocês preferem?', poll: ['Vlogs', 'Tutoriais'] },
  ]);

  return (
    <div>
      <h2>Comunidade</h2>
      {posts.map(post => (
        <div key={post.id} className="community-post">
          <p>{post.text}</p>
          {post.poll && (
            <div className="poll">
              {post.poll.map(option => (
                <button key={option} className="poll-option">{option}</button>
              ))}
            </div>
          )}
          <span>{post.likes} curtidas</span>
        </div>
      ))}
    </div>
  );
}
