import React, { Component, useLocation } from 'react';
import { MapContainer, Marker, Popup, TileLayer, Polyline } from 'react-leaflet';

function EventHandler({onPositionChange}) {
  const map = useMapEvent('click', (e) => {
    alert(1212)
    console.log('12123123', e);
    onPositionChange(e.latlng.lat, e.latlng.lng);
  //  map.setCenter([50.5, 30.5])
});

  return null
}


class LocationPicker extends Component {
  handleClick(e){
    this.props.onPositionChange(e.latlng.lat, e.latlng.lng);
  }

  getZoomLevel() {
    return this.map && this.map.leafletElement ? this.map.leafletElement.getZoom() : 12;
  }

  render() {
    var currentPos = this.props.lat &&  this.props.lng ? [this.props.lat, this.props.lng] : false;

    return (
      <MapContainer
        center={currentPos}
        ref={(ref) => { this.map = ref; }}
        zoom={this.getZoomLevel()}
        style={{ width: '100%', height: '250px'}}
        onClick={this.handleClick.bind(this)}
        eventHandlers={{
          click: (e) => {
            alert(12123123)
          },
        }}
      >
        <TileLayer
          url="https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=BqThJi6v35FQeB3orVDl"
          attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />
        {currentPos && <Marker position={currentPos} />}
        <EventHandler onPositionChange={this.props.onPositionChange}  />
      </MapContainer>
    )
  }
}

export default LocationPicker
