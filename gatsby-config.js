require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})
const postType = {
  id: 1,
  name: "String",
  published: true,
  object: { a: 1, b: "2", c: false },
  array: [{ a: 1, b: "2", c: false }],
}
const queries = require(`${__dirname}/src/templates/algolia`)
module.exports = {
  siteMetadata: {
    title: `Gatsby Default Starter`,
    description: `Kick off your next, great Gatsby project with this default starter. This barebones starter ships with the main Gatsby configuration files you might need.`,
    author: `@gatsbyjs`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-algolia`,
      options: {
        appId: "K9LG7KOA5G",
        apiKey: "444b1d03e0452bc8612d578a2f2261f0",
        queries,
        chunkSize: 10000, // default: 1000
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: "gatsby-source-apiserver",
      options: {
        // Type prefix of entities from server
        typePrefix: "internal__",

        // The url, this should be the endpoint you are attempting to pull data from
        url: `https://api.simplyrets.com/properties`,

        method: "get",

        headers: {
          "Content-Type": "application/json",
        },

        // Request body
        data: {},

        // Name of the data to be downloaded.  Will show in graphQL or be saved to a file
        // using this name. i.e. posts.json
        name: `posts`,

        // Nested level of entities in response object, example: `data.posts`
        // entityLevel: `data.posts`,

        // Define schemaType to normalize blank values
        // example:
        // const postType = {
        //   id: 1,
        //   name: 'String',
        //   published: true,
        //   object: {a: 1, b: '2', c: false},
        //   array: [{a: 1, b: '2', c: false}]
        // }
        schemaType: postType,

        // Request parameters
        // Only available from version 2.1.0
        params: {
          per_page: 1,
        },

        // Simple authentication, optional
        auth: {
          username: "simplyrets",
          password: "simplyrets",
        },

        //  Required folder path where the data should be saved if using localSave option
        //  This folder must already exist
        path: `${__dirname}/src/data/auth/`,

        // Optionally include some output when building
        // Default is false
        verboseOutput: true, // For debugging purposes
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
