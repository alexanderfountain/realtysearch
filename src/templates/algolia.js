const postQuery = `{
  properties: allInternalPosts(filter: {geo: {lat: {ne: null}}}) {
    edges{
      node{
        mlsId
        address {
          full
        }
        photos
        listPrice
        listDate(formatString: "MMM, d, Y")
        geo {
          lat
          lng
        }
        property {
          bedrooms
          bathsFull
          bathsHalf
          area
        }
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
    transformer: ({ data }) => {
      data.properties.edges.map(hit => {
        hit.node._geoloc = hit.node.geo
        console.log(hit.node)
      })
      return flatten(data.properties.edges)
    },
    indexName: `Properties`,
  },
]

module.exports = queries
