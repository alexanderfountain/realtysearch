import React, { Component } from "react"
import { graphql, Link } from "gatsby"
import styled from "styled-components"
import algoliasearch from "algoliasearch/lite"
import {
  InstantSearch,
  Hits,
  SearchBox,
  Pagination,
  Highlight,
  Panel,
} from "react-instantsearch-dom"

const PropertiesStyle = styled.div`
  .properties-container {
    display: flex;
    flex-wrap: wrap;
  }
  .property {
    box-sizing: border-box;
    border: thin solid black;
    padding: 20px;
    width: calc(100% / 2);
  }
  .ais-Highlight-highlighted {
    background-color: yellow;
  }
`

const searchClient = algoliasearch(
  "K9LG7KOA5G",
  "444b1d03e0452bc8612d578a2f2261f0"
)

class Front extends Component {
  render() {
    return (
      <PropertiesStyle>
        <div className="ais-InstantSearch">
          <InstantSearch indexName="Properties" searchClient={searchClient}>
            <h1>Properties</h1>
            <SearchBox />
            <h2>Filter</h2>
            <div className="filters-inner"></div>
            <Hits className="hitter" hitComponent={Hit} />
            <Pagination />
          </InstantSearch>
        </div>
      </PropertiesStyle>
    )
  }
}
function Hit(props) {
  console.log(props)
  return (
    <div class="property-hit">
      <Link className="image-result" to={"/property/" + props.hit.mlsId}>
        <h2>
          <Highlight attribute="full" hit={props.hit} />
        </h2>
      </Link>
      <h3>MLSID: {props.hit.mlsId}</h3>
      <h4>Price: ${props.hit.listPrice}</h4>
      {props.hit.photos && <img src={props.hit.photos[0]} />}
    </div>
  )
}

// Hit.propTypes = {
//   hit: PropTypes.object.isRequired,
// }
export default Front
