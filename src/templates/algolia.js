const postQuery = `{
  properties: allInternalPosts {
    edges{
      node{
        mlsId
        address {
          full
        }
        photos
        listPrice
      }
    }
  }

}`

const flatten = arr =>
  arr.map(({ node: { address, ...rest } }) => ({
    ...address,
    ...rest,
  }))

const queries = [
  {
    query: postQuery,
    transformer: ({ data }) => flatten(data.properties.edges),
    indexName: `Properties`,
  },
]

module.exports = queries
