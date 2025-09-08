import React, { useRef, useEffect } from 'react';
import { graphql, Link } from 'gatsby';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { Layout } from '@components';
import { usePrefersReducedMotion } from '@hooks';

const StyledPostsContainer = styled.main`
  max-width: 1000px;
`;
const StyledGrid = styled.ul`
  ${({ theme }) => theme.mixins.resetList};
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 15px;
  margin-top: 50px;

  @media (max-width: 1080px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
`;
const StyledPost = styled.li`
  transition: var(--transition);
  cursor: default;
  &:hover,
  &:focus-within {
    .post__inner {
      transform: translateY(-7px);
    }
  }
  a {
    position: relative;
    z-index: 1;
  }
  .post__inner {
    ${({ theme }) => theme.mixins.boxShadow};
    ${({ theme }) => theme.mixins.flexBetween};
    flex-direction: column;
    align-items: flex-start;
    position: relative;
    height: 100%;
    padding: 2rem 1.75rem;
    border-radius: var(--border-radius);
    background-color: var(--light-navy);
    transition: var(--transition);
  }
  .post__header {
    ${({ theme }) => theme.mixins.flexBetween};
    margin-bottom: 30px;
  }
  .folder {
    color: var(--green);
    svg {
      width: 40px;
      height: 40px;
    }
  }
  .post__title {
    margin-bottom: 0;
    color: var(--lightest-slate);
    font-size: var(--fz-xxl);
    a {
      position: static;
      &:before {
        content: '';
        display: block;
        position: absolute;
        z-index: 0;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }
    }
  }
  .post__desc {
    color: var(--light-slate);
    font-size: 17px;
  }
  .post__footer {
    display: flex;
    align-items: flex-end;
    flex-grow: 1;
    margin-top: 20px;
  }
  .post__tags {
    display: flex;
    align-items: flex-end;
    flex-wrap: wrap;
    padding: 0;
    margin: 0;
    list-style: none;
    li {
      font-family: var(--font-mono);
      font-size: var(--fz-xxs);
      line-height: 1.75;
      &:not(:last-of-type) {
        margin-right: 15px;
      }
    }
  }
`;

const PensievePage = ({ location, data }) => {
  const posts = data.allMarkdownRemark.edges;

  const revealTitle = useRef(null);
  const revealGrid = useRef(null);
  const revealPosts = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealTitle.current, srConfig());
    sr.reveal(revealGrid.current, srConfig());
    revealPosts.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
  }, []);

  return (
    <Layout location={location}>
      <Helmet title="Pensieve" />

      <StyledPostsContainer>
        <header ref={revealTitle}>
          <h1 className="big-heading">Pensieve</h1>
          <p className="subtitle">
            <a
              className="inline-link"
              href="https://www.wizardingworld.com/writing-by-jk-rowling/pensieve"
              target="_blank"
              rel="noreferrer">
              a collection of memories
            </a>
          </p>
        </header>

        <StyledGrid ref={revealGrid}>
          {posts.length > 0 &&
            posts.map(({ node }, i) => {
              const { frontmatter } = node;
              const { title, description, slug, date, tags } = frontmatter;
              const d = new Date(date);

              return (
                <StyledPost key={i} ref={el => (revealPosts.current[i] = el)}>
                  <div className="post__inner">
                    <header>
                      <div className="post__header">
                        <div className="folder">
                          <Link to={slug}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              role="img"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="feather feather-book-open">
                              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                            </svg>
                          </Link>
                        </div>
                      </div>
                      <h3 className="post__title">
                        <Link to={slug}>{title}</Link>
                      </h3>
                      <p className="post__desc">{description}</p>
                    </header>
                    <footer>
                      <span className="post__date">
                        {d.toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                      <ul className="post__tags">
                        {tags.map((tag, i) => (
                          <li key={i}>
                            <Link to={`/pensieve/tags/${tag}/`}>#{tag}</Link>
                          </li>
                        ))}
                      </ul>
                    </footer>
                  </div>
                </StyledPost>
              );
            })}
        </StyledGrid>
      </StyledPostsContainer>
    </Layout>
  );
};
PensievePage.propTypes = {
  location: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

export default PensievePage;

export const pageQuery = graphql`
  {
    allMarkdownRemark(
      filter: {
        fileAbsolutePath: { regex: "/content/posts/" }
        frontmatter: { draft: { ne: true } }
      }
      # FIX: Updated the sort query to the new syntax
      sort: { frontmatter: { date: DESC } }
    ) {
      edges {
        node {
          frontmatter {
            title
            description
            slug
            date
            tags
            draft
          }
          html
        }
      }
    }
  }
`;
