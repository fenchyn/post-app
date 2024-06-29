import React from "react";
import { useQuery, gql } from "@apollo/client";
import Post from "./Post";
import { Grid, LinearProgress, Typography } from "@mui/material";

const GET_POSTS = gql`
  query GetPosts {
    posts {
      data {
        id
        title
      }
    }
  }
`;

const Posts: React.FC = () => {
  const { loading, error, data } = useQuery(GET_POSTS);

  if (loading) return <LinearProgress />;
  if (error) return <Typography>Error: {error.message}</Typography>;

  return (
    <Grid container spacing={2} justifyContent="center">
      {data.posts.data.map((post: { id: string; title: string }) => (
        <Grid item xs={12} key={post.id}>
          <Post post={post} />
        </Grid>
      ))}
    </Grid>
  );
};

export default Posts;
