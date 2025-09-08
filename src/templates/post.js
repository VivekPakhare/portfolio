import React from 'react';
import { graphql, Link } from 'gatsby';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Layout } from '@components';

const StyledPostContainer = styled.main`
  max-width: 1000px;
`;
const StyledPostHeader = styled.header`
  margin-bottom: 50px;
  .tag {
    margin-right: 10px;
  }
`;
const StyledPostContent = styled.div`
  margin-bottom: 100px;
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 2em 0 1em;
  }

  p {
    margin: 1em 0;
    line-height: 1.5;
    color: var(--light-slate);
  }
`;

const PostTemplate = ({ data, location }) => {
  // Defensive check to prevent build crash if data is missing
  if (!data || !data.markdownRemark) {
    return null;
  }

  const { frontmatter, html } = data.markdownRemark;
  const { title, date, tags } = frontmatter;

  return (
    <Layout location={location}>
      <Helmet title={title} />

      <StyledPostContainer>
        <StyledPostHeader>
          <h1 className="medium-heading">{title}</h1>
          <p className="subtitle">
            <time>
              {new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <span>&nbsp;&mdash;&nbsp;</span>
            {tags &&
              tags.length > 0 &&
              tags.map((tag, i) => (
                <Link key={i} to={`/pensieve/tags/${tag}/`} className="tag">
                  #{tag}
                </Link>
              ))}
          </p>
        </StyledPostHeader>

        {/* This renders the HTML that comes from your markdown files */}
        <StyledPostContent dangerouslySetInnerHTML={{ __html: html }} />
      </StyledPostContainer>
    </Layout>
  );
};

export default PostTemplate;

PostTemplate.propTypes = {
  data: PropTypes.object,
  location: PropTypes.object,
};

// The GraphQL query uses the slug passed in from gatsby-node.js to find the correct post
export const pageQuery = graphql`
  query ($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        date
        slug
        tags
      }
    }
  }
`;
