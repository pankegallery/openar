import React from 'react'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css';
import {mapMarker} from './marker'

// const Leaflet : any = dynamic(() => import('react-leaflet'), { ssr: false })

export default class LeafletMap extends React.Component {
  state = {
    inBrowser: false,
    map: null,
    centerX: 51.05,
    centerY: -0.09
  }
  leaflet: any
  markerIcon: any
  L: any

  async componentDidMount() {
    this.leaflet = await import('react-leaflet')
    this.L = await import('leaflet')    

    console.log("Marker icon: ", this.markerIcon)
    this.setState({ inBrowser: true, centerX: this.props.lat, centerY: this.props.lng })    
  }

  onMapCreated = (m) => {
    this.setState({ map: m }, () => {
      m.on('move', this.onMapMove)
    })
  }

  onMapMove = (e) => {
    const center = this.state.map.getCenter()
    this.setState({
      centerX: center.lat,
      centerY: center.lng
    })
    if (this.props.onCenterChange) {
      this.props.onCenterChange(center.lat, center.lng)
    }
  }

  render() {
    const { inBrowser } = this.state
    if (!inBrowser) return null

    const iconSize = 70
    this.markerIcon = this.L.icon({
      iconUrl: mapMarker,
      iconSize: [iconSize, iconSize],
      iconAnchor: [iconSize / 2, iconSize * 0.85],

    })

    const { MapContainer, TileLayer, Marker, Popup, Circle } = this.leaflet

    const { centerX, centerY } = this.state

    return (
      <div className="leaflet-map-container" style={{height: '500px', background: 'linear-gradient(90deg, rgb(201, 196, 169) 0%, rgb(137, 154, 190) 50%, rgba(214,180,229,1) 100%)'}}>
        <MapContainer 
          center={[centerX, centerY]} 
          zoom={13} 
          scrollWheelZoom={false} 
          style={{height: '100%', 'mix-blend-mode': 'overlay'}}
          whenCreated={this.onMapCreated}
        >
          <TileLayer
            attribution='Simultaneity'
            url="https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png"
          />
          <Circle center={[centerX, centerY]} pathOptions={{ fillColor: 'red', color: '#db93ba' }} radius={12.5}>
            <Popup>This is roughly the visibility area of your artwork</Popup>
          </Circle>
          <Marker icon={this.markerIcon} position={[centerX, centerY]}></Marker>          
        </MapContainer>
      </div>
    )
  }
}
