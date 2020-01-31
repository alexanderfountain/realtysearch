import React from "react"
import { graphql } from "gatsby"
import { Img } from "gatsby-image"
const Post = ({ data }) => {
  const property = data.internalPosts
  console.log(property)
  return (
    <React.Fragment>
      <h1>{property.address.full}</h1>
      <h2>mlsId: {property.mlsId}</h2>
      {property.photos.map((photo, index) => (
        <img src={photo} />
      ))}
      {/* <div dangerouslySetInnerHTML={{ __html: data.content.html }} /> */}
    </React.Fragment>
  )
}
export default Post
export const pageQuery = graphql`
  query PostByMlsid($mlsId: Int!) {
    internalPosts(mlsId: { eq: $mlsId }) {
      mlsId
      photos
      address {
        full
      }
    }
  }
`
