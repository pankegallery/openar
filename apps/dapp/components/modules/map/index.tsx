import React from 'react'
import 'leaflet/dist/leaflet.css'
import dynamic from 'next/dynamic'
import { mapMarker } from './marker'

// const Leaflet : any = dynamic(() => import('react-leaflet'), { ssr: false })

type LeafletMapProps = typeof LeafletMap.defaultProps & {
  lat: number,
  lng: number,
  onCenterChange: (lat: number, lng: number) => any,  
  shouldUpdateMarkerToMapCenter: boolean,
  shouldLocateUser: boolean
  onUserLocationUpdate: (lat: number, lng: number, accuracy: number) => any,
}

export const ARTWORK_RADIUS = 5

export default class LeafletMap extends React.Component<LeafletMapProps> {
  static defaultProps = {
    lat: 51.05,
    lng: -0.09,
    onCenterChange: null,
    shouldUpdateMarkerToMapCenter: true,
    shouldLocateUser: false,
    onUserLocationUpdate: null
  }
  state = {
    inBrowser: false,
    map: null,
    centerX: 51.05,
    centerY: -0.09,
    userLocationX: 0,
    userLocationY: 0,
    userAccuracy: 0
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
    const { shouldLocateUser, onUserLocationUpdate } = this.props

    this.setState({ map: m }, () => {
      m.on('move', this.onMapMove)
      if (shouldLocateUser) {
        m.locate({ watch: true }).on('locationfound', (e) => {
          this.setState({
            userLocationX: e.latitude,
            userLocationY: e.longitude,
            userAccuracy: e.accuracy
          })
          if (onUserLocationUpdate) {
            onUserLocationUpdate(e.latitude, e.longitude, e.accuracy)
          }
        })
        .on('locationerror', (e) => {
          console.log(e)
          // alert(e.message)
        })
      }
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

    const { MapContainer, TileLayer, Marker, Popup, Circle, CircleMarker } = this.leaflet

    const { centerX, centerY, userLocationX, userLocationY, userAccuracy } = this.state
    const { shouldLocateUser, shouldUpdateMarkerToMapCenter, lat, lng } = this.props
    const markerCenter = shouldUpdateMarkerToMapCenter ? [centerX, centerY] : [lat, lng]

    return (      
      <div className="leaflet-map-container" style={{minHeight: '200px', height: '100%', background: "#bab79f" }}>
        <MapContainer 
          center={[centerX, centerY]} 
          zoom={18} 
          scrollWheelZoom={false} 
          style={{
            // transform: "translate3d(0,0,0)",
            height: '100%', 
            'mixBlendMode': 'exclusion',
            'filter': 'invert(100%)'
          }}
          whenCreated={this.onMapCreated}
        >
          <TileLayer
            attribution='Simultaneity'
            url="https://tiles-eu.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}{r}.png"
          />
          <Circle center={markerCenter} pathOptions={{ fillColor: 'red', color: '#db93ba', fillOpacity: 0.85, opacity: 0 }} radius={7.5}>
            { shouldUpdateMarkerToMapCenter && <Popup>This is roughly the visibility area of your artwork</Popup> }
          </Circle>
          { shouldLocateUser && 
            <>
              <CircleMarker center={[userLocationX, userLocationY]} pathOptions={{ fillColor: '#4466cc', color: '#221199', opacity: 1, fillOpacity: 1 }} radius={10}></CircleMarker>        
              <Circle center={[userLocationX, userLocationY]} pathOptions={{ fillColor: '#112299', color: '#112299', opacity: 0.2, fillOpacity: 0.2 }} radius={userAccuracy}></Circle>        
            </>
          }
          <Marker icon={this.markerIcon} position={markerCenter}></Marker>          
        </MapContainer>
        <div className="test-overlay" style={{"mixBlendMode": 'overlay'}}></div>
      </div>
    )
  }
}
