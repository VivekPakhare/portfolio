import React from 'react';
import { Link, graphql } from 'gatsby';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { kebabCase } from 'lodash';
import { Layout } from '@components';

const StyledTagsContainer = styled.main`
  max-width: 1000px;

  h1 {
    margin-bottom: 50px;
  }
  ul {
    display: flex;
    flex-wrap: wrap;

    li {
      margin-right: 10px;
      font-size: var(--fz-xxl);

      a {
        .count {
          color: var(--slate);
          font-family: var(--font-mono);
          font-size: var(--fz-sm);
        }
      }
    }
  }
`;

const TagsPage = ({
  data: {
    allMarkdownRemark: { group },
  },
  location,
}) => (
  <Layout location={location}>
    <Helmet title="Tags" />

    <StyledTagsContainer>
      <header>
        <h1 className="big-heading">Tags</h1>
      </header>

      <ul>
        {group.map(tag => (
          <li key={tag.fieldValue}>
            <Link to={`/pensieve/tags/${kebabCase(tag.fieldValue)}/`}>
              {tag.fieldValue} <span className="count">({tag.totalCount})</span>
            </Link>
          </li>
        ))}
      </ul>
    </StyledTagsContainer>
  </Layout>
);

TagsPage.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      group: PropTypes.arrayOf(
        PropTypes.shape({
          fieldValue: PropTypes.string.isRequired,
          totalCount: PropTypes.number.isRequired,
        }).isRequired,
      ),
    }),
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }),
    }),
  }),
  location: PropTypes.object,
};

export default TagsPage;

export const pageQuery = graphql`
  {
    allMarkdownRemark(limit: 2000, filter: { frontmatter: { draft: { ne: true } } }) {
      # FIX: Updated the group query to the new syntax
      group(field: { frontmatter: { tags: SELECT } }) {
        fieldValue
        totalCount
      }
    }
  }
`;
