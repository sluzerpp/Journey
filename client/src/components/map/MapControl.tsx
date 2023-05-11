import { useMap } from 'react-leaflet';
import {isMobile} from 'react-device-detect'
import MapBtn from './MapBtn';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { setCenter, setFilterModal, setIsModal, setIsPath, setNearModal, setZoom } from '../../store/reducers/Actions/MapActionCreators';
import { DEFAULT_POS } from '../../store/reducers/MapSlice';
import { ControlProps } from './pathControl';

export default function MapControl({control, setControl}: ControlProps) {
  const map = useMap();
  const dispatch = useAppDispatch();
  const {userPos, isPath, isModal} = useAppSelector(state => state.mapReducer);

  const userCenter = () => {
    dispatch(setCenter(userPos || DEFAULT_POS));
    dispatch(setZoom(map.getZoom()));
  }

  const toggleNearModal = () => {
    dispatch(setIsModal(!isModal));
    dispatch(setNearModal(true));
  }

  const toggleFilterModal = () => {
    dispatch(setIsModal(!isModal));
    dispatch(setFilterModal(true));
  }

  return (
    <>
      {
        isMobile && isPath && 
        <MapBtn callback={() => {
          dispatch(setIsPath(false));
          if (control) map.removeControl(control);
          setControl(undefined);
        }} icon={<><i className="uil uil-analysis"></i><i className="uil uil-multiply"></i></>}
        className='map-btn--two-icons'></MapBtn>
      }
      <MapBtn
        callback={toggleFilterModal}
        icon={<i className="uil uil-filter"></i>}
      ></MapBtn>  
      {
        isMobile && userPos && 
        <>
          <MapBtn
            callback={userCenter}
            icon={<i className="uil uil-user-location"></i>}
          ></MapBtn>
          <MapBtn
            callback={toggleNearModal}
            icon={<i className="uil uil-compass"></i>}
          ></MapBtn>
        </>
      }
    </>
  ) 
}
