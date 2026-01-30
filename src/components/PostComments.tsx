import { useEffect, useState } from 'react';
import { Comment } from '../types/Comment';
import { createComment, deleteComment, getPostComments } from '../api/api';
import { Loader } from './Loader';
import { NewCommentForm } from './NewCommentForm';

type Props = {
  postId: number;
};

export const PostComments: React.FC<Props> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [isWriting, setIsWriting] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setErrorMessage(false);
    setIsWriting(false);

    getPostComments(postId)
      .then(setComments)
      .catch(() => setErrorMessage(true))
      .finally(() => setIsLoading(false));
  }, [postId]);

  const handleDelete = (commentId: number) => {
    setComments(prevComms => prevComms.filter(comm => comm.id !== commentId));

    deleteComment(commentId).catch(() => {});
  };

  const handleAdd = (newComment: Omit<Comment, 'id'>): Promise<void> => {
    return createComment(newComment)
      .then(res => setComments(prev => [...prev, res]))
      .catch(() => setErrorMessage(true));
  };

  return (
    <div className="block">
      {isLoading && <Loader />}

      {!isLoading && errorMessage && (
        <div className="notification is-danger" data-cy="CommentsError">
          Something went wrong
        </div>
      )}

      {!isLoading &&
        !errorMessage &&
        (comments.length === 0 ? (
          <p className="title is-4" data-cy="NoCommentsMessage">
            No comments yet
          </p>
        ) : (
          <p className="title is-4">Comments:</p>
        ))}

      {!isLoading &&
        !errorMessage &&
        comments.length > 0 &&
        comments.map(comm => (
          <article key={comm.id} className="message is-small" data-cy="Comment">
            <div className="message-header">
              <a href={`mailto:${comm.email}`} data-cy="CommentAuthor">
                {comm.name}
              </a>
              <button
                data-cy="CommentDelete"
                type="button"
                className="delete is-small"
                aria-label="delete"
                onClick={() => handleDelete(comm.id)}
              >
                delete button
              </button>
            </div>

            <div className="message-body" data-cy="CommentBody">
              {comm.body}
            </div>
          </article>
        ))}

      {!isWriting ? (
        <button
          data-cy="WriteCommentButton"
          type="button"
          className="button is-link"
          onClick={() => setIsWriting(true)}
        >
          Write a comment
        </button>
      ) : (
        <NewCommentForm key={postId} postId={postId} onAdd={handleAdd} />
      )}
    </div>
  );
};
