const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

// Define the templates
const blogPost = path.resolve(`./src/templates/blog-post.js`)
const badBlogPost = path.resolve(`./src/templates/bad-blog-post.js`)

exports.createPages = async ({ graphql, actions, reporter }) => {
  actions.createSlice({
    id: `header`,
    component: require.resolve(`./src/components/header.js`),
  })

  const { createPage } = actions

  // Get all markdown blog posts sorted by date
  const result = await graphql(`
    {
      allMarkdownRemark(sort: { frontmatter: { date: ASC } }, limit: 1000) {
        nodes {
          id
          fields {
            slug
          }
          frontmatter {
            template
          }
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panicOnBuild(
        `There was an error loading your blog posts`,
        result.errors
    )
    return
  }

  const posts = result.data.allMarkdownRemark.nodes

  if (posts.length > 0) {
    posts.forEach((post, index) => {
      const previousPostId = index === 0 ? null : posts[index - 1].id
      const nextPostId = index === posts.length - 1 ? null : posts[index + 1].id

      let component
      switch (post.frontmatter.template) {
        case 'bad-blog-post':
          component = badBlogPost
          break
        default:
          component = blogPost
      }

      createPage({
        path: post.fields.slug,
        component: component,
        context: {
          id: post.id,
          previousPostId,
          nextPostId,
        },
      })
    })
  }
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })

    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  createTypes(`
    type SiteSiteMetadata {
      author: Author
      siteUrl: String
      social: Social
    }

    type Author {
      name: String
      summary: String
    }

    type Social {
      twitter: String
    }

    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Frontmatter {
      title: String
      description: String
      date: Date @dateformat
      template: String
      tags: [String]
    }

    type Fields {
      slug: String
    }
  `)
}