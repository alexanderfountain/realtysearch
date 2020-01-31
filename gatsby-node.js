/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require("path")
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const pages = await graphql(`
    {
      property: allInternalPosts {
        nodes {
          mlsId
          id
        }
      }
    }
  `)
  const postTemplate = path.resolve("src/templates/post.js")
  pages.data.property.nodes.forEach(node => {
    if (node.mlsId != null) {
      createPage({
        path: `/property/${node.mlsId}`,
        component: postTemplate,
        context: {
          mlsId: node.mlsId,
        },
      })
    }
  })
  const frontTemplate = path.resolve("src/templates/front.js")
  createPage({
    path: `/`,
    component: frontTemplate,
  })
  //   const pageTemplate = path.resolve("src/templates/page.js")
  //   pages.data.page.nodes.forEach(node => {
  //     if (node.uid == "home") {
  //       createPage({
  //         path: `/`,
  //         component: pageTemplate,
  //         context: {
  //           uid: node.uid,
  //         },
  //       })
  //     } else {
  //       createPage({
  //         path: `/${node.uid}`,
  //         component: pageTemplate,
  //         context: {
  //           uid: node.uid,
  //         },
  //       })
  //     }
  //   })
}
