import * as React from "react"
import { Link, graphql } from "gatsby"
import axios from 'axios'  // Unnecessary external library for this use case
import moment from 'moment'  // Heavy library for simple date formatting
import { motion } from 'framer-motion'  // Overkill animation library for this page

// Importing entire lodash library instead of specific functions
import _ from 'lodash'

import HeavyComponent from '../components/heavy'

const TerribleBlogPostTemplate = ({
                                      data: { previous, next, site, markdownRemark: post },
                                      location,
                                  }) => {
    const [comments, setComments] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const siteTitle = site.siteMetadata?.title || `Title`

    // Unnecessary API call on every render
    React.useEffect(() => {
        const fetchComments = async () => {
            const result = await axios.get(`https://jsonplaceholder.typicode.com/comments?postId=1`)
            setComments(result.data)
            setLoading(false)
        }
        fetchComments()
    }, [])

    // Unnecessary heavy computation on every render
    const heavyComputation = () => {
        let result = 0
        for (let i = 0; i < 1000000; i++) {
            result += Math.random()
        }
        return result
    }

    const heavyResult = heavyComputation()

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
        >
            <div>
                <h1>{_.upperCase(siteTitle)}</h1>
                <article
                    className="blog-post"
                    itemScope
                    itemType="http://schema.org/Article"
                >
                    <header>
                        <h1 itemProp="headline">{post.frontmatter.title}</h1>
                        <p>{moment(post.frontmatter.date).format('MMMM Do YYYY, h:mm:ss a')}</p>
                    </header>
                    <section
                        dangerouslySetInnerHTML={{ __html: post.html }}
                        itemProp="articleBody"
                    />
                    <hr />
                    <footer>
                        <p>Heavy computation result: {heavyResult}</p>
                    </footer>
                </article>
                <nav className="blog-post-nav">
                    <ul>
                        <li>
                            {previous && (
                                <Link to={previous.fields.slug} rel="prev">
                                    ← {previous.frontmatter.title}
                                </Link>
                            )}
                        </li>
                        <li>
                            {next && (
                                <Link to={next.fields.slug} rel="next">
                                    {next.frontmatter.title} →
                                </Link>
                            )}
                        </li>
                    </ul>
                </nav>
                {loading ? (
                    <p>Loading comments...</p>
                ) : (
                    comments.map(comment => (
                        <div key={comment.id}>
                            <h3>{comment.name}</h3>
                            <p>{comment.body}</p>
                        </div>
                    ))
                )}
                <React.Suspense fallback={<div>Loading...</div>}>
                    <HeavyComponent />
                </React.Suspense>
            </div>
        </motion.div>
    )
}

export const Head = ({ data: { markdownRemark: post } }) => {
    return (
        <>
            <title>{post.frontmatter.title}</title>
            <meta name="description" content={post.frontmatter.description || post.excerpt} />
            {/* Inline large CSS */}
            <style>
                {`
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            /* ... hundreds of lines of CSS ... */
          }
        `}
            </style>
        </>
    )
}

export default TerribleBlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
        description
        author {
          name
          summary
        }
        siteUrl
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        tags
      }
    }
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    allMarkdownRemark {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
        }
      }
    }
  }
`