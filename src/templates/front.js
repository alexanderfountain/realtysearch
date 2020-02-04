import algoliasearch from "algoliasearch/lite"
import {
  InstantSearch,
  ClearRefinements,
  SearchBox,
  Pagination,
  Highlight,
  Configure,
  connectHits,
  connectNumericMenu,
  connectRefinementList,
  connectRange,
} from "react-instantsearch-dom"
import {
  GoogleMapsLoader,
  GeoSearch,
  Marker,
} from "react-instantsearch-dom-maps"
import PropTypes from "prop-types"
import React, { Component, Fragment } from "react"
import Rheostat from "rheostat"
import withURLSync from "./URLSync"
import { withStyles, makeStyles } from "@material-ui/core/styles"
import Button from "@material-ui/core/Button"
import Tooltip from "@material-ui/core/Tooltip"
import Fade from "@material-ui/core/Fade"
import "./front.css"
import styled from "styled-components"
import logo from "../images/logo.png"

const searchClient = algoliasearch(
  "K9LG7KOA5G",
  "444b1d03e0452bc8612d578a2f2261f0"
)

const HtmlTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: "#ffffff",
    color: "rgba(0, 0, 0, 0.87)",
    padding: 20,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}))(Tooltip)

const useStyles = makeStyles(theme => ({
  button: {
    fontSize: 24,
    textDecoration: "none",
    paddingTop: 10,
    paddingBottom: 10,
    display: "block",
    width: 300,
  },
}))

const MapResultsStyle = styled.div`
  .filters {
    box-shadow: 0 4px 2px -2px rgba(0, 0, 0, 0.4);
    padding: 20px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    .filter {
      border-radius: 3px;
      border: thin solid #006aff;
      color: #006aff;
      background: #fff;
      padding: 7px 25px;
      margin-left: 20px;
    }
    .ais-SearchBox {
      .ais-SearchBox-form {
        display: flex;
        align-items: center;
      }
      input {
        padding: 10px 20px;
        -webkit-appearance: none;
        border: 1px solid #a7a6ab;
        border-right: 0px;
        border-top-left-radius: 3px;
        border-bottom-left-radius: 3px;
      }
      button {
        padding: 6px 20px;
        -webkit-appearance: none;
        border: 1px solid #a7a6ab;
        border-left: 0px;
        cursor: pointer;
        border-top-right-radius: 3px;
        border-bottom-right-radius: 3px;
        svg {
          fill: #006aff;
          height: 19px !important;
          width: 19px !important;
        }
      }
    }
  }
  header {
    padding: 20px 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #d8d8d8;
    .menu {
      display: flex;
      a {
        color: #006aff;
        font-wieght: bold;
        text-decoration: none;
        margin-left: 40px;
        font-size: 24px;
      }
    }
  }
  .map-results {
    display: flex;
    .results {
      overflow: scroll;
      height: 100vh;
      padding: 0px 20px;
      #hits {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding: 20px 0px;
        .hit {
          width: calc(100% / 2 - 10px);
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 5px solid #006aff;
          position: relative;
          .property-date {
            position: absolute;
            padding: 10px 20px;
            color: white;
            background-color: rgba(0, 0, 0, 0.5);
          }
        }
      }
    }
    .map {
      width: 40%;
      .ais-GeoSearch {
        height: 100%;
      }
      .ais-GeoSearch-map {
        height: 100%;
      }
    }
    .results {
      width: 60%;
      box-shadow: -2px 5px 5px 0 rgba(0, 0, 0, 0.4);
    }
  }
`
const Front = props => (
  <MapResultsStyle>
    <InstantSearch
      searchClient={searchClient}
      indexName="Properties"
      searchState={props.searchState}
      createURL={props.createURL}
      onSearchStateChange={props.onSearchStateChange}
    >
      <Header />
      <Filter />
      <div class="map-results">
        <Map />
        <div className="results">
          <MyHits />
          <Pagination />
        </div>
      </div>
    </InstantSearch>
  </MapResultsStyle>
)

function Header() {
  return (
    <header className="navbar navbar-static-top aisdemo-navbar">
      <div className="logo">
        <img src={logo} />
      </div>
      <div className="menu">
        <a href="#">Home</a>
        <a href="#">About</a>
        <a href="#">Contact</a>
      </div>
    </header>
  )
}

function Filter() {
  const classes = useStyles()
  return (
    <div className="filters">
      <SearchBox />
      <HtmlTooltip
        TransitionComponent={Fade}
        interactive
        title={
          <React.Fragment>
            <div className={classes.button}>Price Range</div>
            <ConnectedRange attribute="listPrice" />
          </React.Fragment>
        }
      >
        <div className="filter filter-price">Price</div>
      </HtmlTooltip>
    </div>
  )
}

class Range extends Component {
  static propTypes = {
    min: PropTypes.number,
    max: PropTypes.number,
    currentRefinement: PropTypes.object,
    refine: PropTypes.func.isRequired,
    canRefine: PropTypes.bool.isRequired,
  }

  state = { currentValues: { min: this.props.min, max: this.props.max } }

  componentDidUpdate(prevProps) {
    {
      console.log(this)
    }
    if (
      this.props.canRefine &&
      (prevProps.currentRefinement.min !== this.props.currentRefinement.min ||
        prevProps.currentRefinement.max !== this.props.currentRefinement.max)
    ) {
      this.setState({
        currentValues: {
          min: this.props.currentRefinement.min,
          max: this.props.currentRefinement.max,
        },
      })
    }
  }

  onValuesUpdated = sliderState => {
    this.setState({
      currentValues: { min: sliderState.values[0], max: sliderState.values[1] },
    })
  }

  onChange = sliderState => {
    if (
      this.props.currentRefinement.min !== sliderState.values[0] ||
      this.props.currentRefinement.max !== sliderState.values[1]
    ) {
      this.props.refine({
        min: sliderState.values[0],
        max: sliderState.values[1],
      })
    }
  }

  render() {
    const { min, max, currentRefinement } = this.props
    const { currentValues } = this.state
    return min !== max ? (
      <div>
        <Rheostat
          min={min}
          max={max}
          values={[currentRefinement.min, currentRefinement.max]}
          onChange={this.onChange}
          onValuesUpdated={this.onValuesUpdated}
        />
        <div className="rheostat-values">
          <div>{currentValues.min}</div>
          <div>{currentValues.max}</div>
        </div>
      </div>
    ) : null
  }
}

const ConnectedRange = connectRange(Range)

function Map() {
  return (
    <Fragment>
      <div className="map">
        <GoogleMapsLoader
          apiKey="AIzaSyAYtZxS3vCaL-IkVVVsdSThFIZ_J40OPf4"
          endpoint="https://maps.googleapis.com/maps/api/js?v=weekly"
        >
          {google => (
            <GeoSearch google={google} minZoom={2}>
              {({ hits }) => (
                <Fragment>
                  {hits.map(hit => (
                    <Marker key={hit.objectID} hit={hit} />
                  ))}
                  <ClearRefinements
                    className="ClearGeoRefinement"
                    transformItems={items =>
                      items.filter(item => item.id === "boundingBox")
                    }
                    translations={{
                      reset: "Clear the map refinement",
                    }}
                  />
                </Fragment>
              )}
            </GeoSearch>
          )}
        </GoogleMapsLoader>
      </div>
    </Fragment>
  )
}

const MyHits = connectHits(({ hits }) => {
  const hs = hits.map(hit => <HitComponent key={hit.objectID} hit={hit} />)
  return <div id="hits">{hs}</div>
})

function HitComponent({ hit }) {
  return (
    <div className="hit">
      {/* <div className="pictures-wrapper">
        <img className="picture" alt={hit.name} src={hit.picture_url} />
        <img
          className="profile"
          alt={hit.user.user.first_name}
          src={hit.user.user.thumbnail_url}
        />
      </div>
      <div className="infos">
        <h4 className="media-heading">
          <Highlight attribute="name" hit={hit} />
        </h4>
        <HitDescription hit={hit} />
      </div> */}
      <div className="property-date">{hit.listDate}</div>
      <div class="property-image">
        {hit.photos && <img src={hit.photos[0]} />}
      </div>
      <div className="property-price-deets">
        <div className="property-price">${hit.listPrice}</div>
        <div className="property-deets">
          {hit.property.bedrooms} bds | {hit.property.bathsFull} ba
        </div>
      </div>
      <div className="address">{hit.full}</div>
    </div>
  )
}

function HitDescription({ hit }) {
  return (
    <p>
      {hit.room_type} - <Highlight attribute="city" hit={hit} />,{" "}
      <Highlight attribute="country" hit={hit} />
    </p>
  )
}

HitComponent.propTypes = {
  hit: PropTypes.object,
}

export default withURLSync(Front)
