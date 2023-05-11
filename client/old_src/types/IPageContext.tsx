import { Map } from "leaflet";
import { IQuest, IQuestsRoute } from "./IQuests";

export type IPageContext = {
  page: React.ReactNode,
  isLoading: boolean,
  setIsLoading: (val: boolean) => void;
  openAuthorizationPage: IPageItemCallback,
  openMapPage: IPageItemCallback,
  openMyQuestsPage: IPageItemCallback,
  openQuestsPage: IPageItemCallback,
  openProfilePage: ICallback,
  openRoutesPage: IPageItemCallback,
  openShopPage: ICallback,
  openDetails: IPageItemCallback,
  map?: Map
}

export type IPageItem = {
  quest?: IQuest,
  questRoute?: IQuestsRoute 
};

export type ICallback = () => void;
export type IPageItemCallback = (item?: IPageItem) => void;