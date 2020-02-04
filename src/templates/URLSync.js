import React, { Component } from "react"
import qs from "qs"
if (typeof window !== "undefined") {
  const updateAfter = 700
  const searchStateToURL = searchState =>
    searchState
      ? `${window.location.pathname}?${qs.stringify(searchState)}`
      : ""

  var withURLSync = Front =>
    class WithURLSync extends Component {
      state = {
        searchState: qs.parse(window.location.search.slice(1)),
      }

      componentDidMount() {
        window.addEventListener("popstate", this.onPopState)
      }

      componentWillUnmount() {
        clearTimeout(this.debouncedSetState)
        window.removeEventListener("popstate", this.onPopState)
      }

      onPopState = ({ state }) =>
        this.setState({
          searchState: state || {},
        })

      onSearchStateChange = searchState => {
        clearTimeout(this.debouncedSetState)

        this.debouncedSetState = setTimeout(() => {
          window.history.pushState(
            searchState,
            null,
            searchStateToURL(searchState)
          )
        }, updateAfter)

        this.setState({ searchState })
      }

      render() {
        const { searchState } = this.state

        return (
          <Front
            {...this.props}
            searchState={searchState}
            onSearchStateChange={this.onSearchStateChange}
            createURL={searchStateToURL}
          />
        )
      }
    }
} else {
  var withURLSync = Front =>
    class WithURLSync extends Component {
      render() {
        return <Front />
      }
    }
}

export default withURLSync
