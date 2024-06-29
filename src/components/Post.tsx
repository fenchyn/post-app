import React, { useState, useEffect } from "react";
import { useMutation, gql } from "@apollo/client";
import { useForm, Controller } from "react-hook-form";
import { Card, Stack, TextField, Typography } from "@mui/material";

const rules = {
  required: "Field is required",
  maxLength: {
    value: 100,
    message: "Field cannot exceed 100 characters",
  },
};

const UPDATE_POST = gql`
  mutation UpdatePost($id: ID!, $title: String!) {
    updatePost(id: $id, input: { title: $title }) {
      id
      title
    }
  }
`;

interface PostProps {
  post: {
    id: string;
    title: string;
  };
}

interface PostForm {
  title: string;
}

const Post: React.FC<PostProps> = ({ post }) => {
  const [editMode, setEditMode] = useState(false);

  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const [updatePost] = useMutation(UPDATE_POST);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PostForm>({
    defaultValues: {
      title: post.title,
    },
  });

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (unsavedChanges) {
        event.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [unsavedChanges]);

  const onSubmit = async (data: PostForm) => {
    if (data.title !== post.title) {
      setUnsavedChanges(false);

      await updatePost({ variables: { id: post.id, title: data.title } });
    }

    setEditMode(false);
  };

  const handleTitleChange = (value: string) => {
    setValue("title", value);

    setUnsavedChanges(true);
  };

  return (
    <Card variant="outlined">
      <Stack p={2}>
        {editMode ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="title"
              control={control}
              rules={rules}
              render={({ field }) => (
                <TextField
                  {...field}
                  autoFocus
                  fullWidth
                  error={Boolean(errors.title)}
                  helperText={errors.title ? errors.title.message : ""}
                  onBlur={handleSubmit(onSubmit)}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  variant="standard"
                />
              )}
            />
          </form>
        ) : (
          <Typography
            onClick={() => setEditMode(true)}
            sx={{ cursor: "pointer", lineHeight: 2 }}
          >
            {post.title}
          </Typography>
        )}
      </Stack>
    </Card>
  );
};

export default Post;
