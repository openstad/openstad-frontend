import React, {Component} from 'react';
import {Map, Marker, TileLayer} from 'react-leaflet';

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
            <Map
                center={currentPos}
                ref={(ref) => { this.map = ref; }}
                zoom={this.getZoomLevel()}
                style={{ width: '100%', height: '250px'}}
                onClick={this.handleClick.bind(this)}
            >
                <TileLayer
                    url="https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=BqThJi6v35FQeB3orVDl"
                    attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                />
                {currentPos && <Marker position={currentPos} />}
            </Map>
        )
    }
}

export default LocationPicker;
