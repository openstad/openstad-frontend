import { useEffect } from "react";
import { useLeaflet } from "react-leaflet";
import Locate from "leaflet.locatecontrol";

export default function() {

  const { map } = useLeaflet();

  useEffect(() => {

    // geo locate props
    const locateOptions = {
      position: 'topright',
      maxZoom: 19,
      strings: {
          title: 'Show me where I am, yo!'
      },
      onActivate: () => {} // callback before engine starts retrieving locations
    }

    const lc = new Locate(locateOptions);
    // console.log(lc);
    lc.addTo(map);

  }, [map]);

  return null;

}
