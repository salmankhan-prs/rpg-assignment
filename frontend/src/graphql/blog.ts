import gql from 'graphql-tag';

export const GET_BLOGS_QUERY = gql`
  query GetBlogs {
    blogs {
      id
      title
      content
      createdAt
      author {
        id
        name
        email
      }
    }
  }
`;

export const CREATE_BLOG_MUTATION = gql`
  mutation CreateBlog($input: CreateBlogInput!) {
    createBlog(input: $input) {
      id
      title
      content
      createdAt
      author {
        id
        name
      }
    }
  }
`;

export const BLOG_CREATED_SUBSCRIPTION = gql`
  subscription BlogCreated {
    blogCreated {
      id
      title
      content
      createdAt
      author {
        id
        name
        email
      }
    }
  }
`;

