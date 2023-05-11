import L from "leaflet";
import "leaflet-routing-machine";
import 'lrm-graphhopper';

function CreateRoutingMachine(props) {
  const createRoutineMachineLayer = () => {
    const instance = L.Routing.control({
      waypoints: [
        L.latLng(props.start),
        L.latLng(props.end)
      ], 
      lineOptions: {
        styles: [{ color: "#6FA1EC", weight: 4 }]
      },
      router: L.Routing.graphHopper('ab541c14-bf36-4eae-9cbb-6a887bbc5215' , {
        urlParameters: {
            vehicle: 'foot'
        }
      }),
      createMarker: function() {
        return null
      },
      show: false,
      addWaypoints: false,
      routeWhileDragging: true,
      draggableWaypoints: false,
      fitSelectedRoutes: false,
      showAlternatives: false,
    });
  
    return instance;
  };

  return createRoutineMachineLayer();
}

export default CreateRoutingMachine;



