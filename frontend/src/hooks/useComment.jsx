import { mutate } from "swr";
import {
  createComment,
  uploadCommentImages,
  deleteComment,
  getComments,
} from "../features/api/commentApi";
import { fetchPost } from "../features/api/postApi";
import { POSTS_ENDPOINT } from "../utils/api";

const getCommentsKey = (postId) => `comments-${postId}`;
const getPostKey = (postId) => `post/${postId}`;
const getPostsKey = (pageIndex) =>
  `${POSTS_ENDPOINT}?offset=${pageIndex * 50}&limit=50`;

export const useComment = () => {
  const handleSubmit = async (commentData, imageData) => {
    try {
      // コメントを作成
      const response = await createComment(commentData);
      const commentId = response.data.id;

      // 画像がある場合はアップロード
      if (imageData && imageData.length > 0) {
        const images = imageData.map(({ file }) => file);
        await uploadCommentImages(commentId, images);
      }

      // 新しいデータを取得
      const [newComments, updatedPost] = await Promise.all([
        getComments(commentData.post_id),
        fetchPost(commentData.post_id),
      ]);

      // キャッシュを更新
      await Promise.all([
        mutate(getCommentsKey(commentData.post_id), newComments, true),
        mutate(getPostKey(commentData.post_id), updatedPost, true),
        mutate(
          getPostsKey(0),
          async (posts) => {
            if (!posts) return posts;
            return posts.map((post) =>
              post.id === commentData.post_id
                ? { ...post, comments_count: updatedPost.data.comments_count }
                : post
            );
          },
          true
        ),
      ]);

      return response;
    } catch (error) {
      console.error("コメント作成エラー:", error);
      throw error;
    }
  };

  const handleDelete = async (commentId, postId) => {
    if (!postId) {
      console.error("post_idが指定されていません");
      throw new Error("post_idが指定されていません");
    }

    try {
      // APIを呼び出してコメントを削除
      await deleteComment(commentId);

      // 新しいデータを取得
      const [updatedComments, updatedPost] = await Promise.all([
        getComments(postId),
        fetchPost(postId),
      ]);

      // キャッシュを更新
      await Promise.all([
        mutate(getCommentsKey(postId), updatedComments, true),
        mutate(getPostKey(postId), updatedPost, true),
        mutate(
          getPostsKey(0),
          async (posts) => {
            if (!posts) return posts;
            return posts.map((post) =>
              post.id === postId
                ? { ...post, comments_count: updatedPost.data.comments_count }
                : post
            );
          },
          true
        ),
      ]);
    } catch (error) {
      console.error("コメント削除エラー:", error);
      throw error;
    }
  };

  return { handleSubmit, handleDelete };
};
