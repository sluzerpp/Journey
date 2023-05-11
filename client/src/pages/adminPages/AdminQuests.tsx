import L from 'leaflet';
import React, { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import { createFact, deleteFactReq, FactData, getAllFacts } from '../../api/facts';
import { createImage, deleteImage, getAllImages, QuestImageData } from '../../api/images';
import { createQuest, deleteQuest, QuestData, updateQuest } from '../../api/quests';
import { IAdminRouteData } from '../../api/routes';
import AdminMarker from '../../components/admin/adminmarker'
import { HOST } from '../../components/quests/QuestListItem';
import ButtonUI from '../../components/UI/ButtonUI';
import { useFileValidate, useValidate } from '../../hooks/useValidate';
import { showError } from '../../store/reducers/Actions/Actions';
import { DEFAULT_POS } from '../../store/reducers/MapSlice'
import { MarkerType } from '../../types/IMap';
import { IQuest, QuestType } from '../../types/IQuest';
import { toMarkerType } from '../../util/transform';
import { isImageFile, isNotEmpty } from '../../util/validation';

export function AdminRouteListItem({route, routeQuests}: {route: IAdminRouteData, routeQuests: IQuest[]}) {
  const str = `----- Маршрут - ${route.name} -----`;
  return (
    <>
      <option key={`${route.id} start`} value="dada" disabled>{str}</option>
      {
        routeQuests.map((quest) => {
          return <option key={`${quest.id} ${route.id}`} value={quest.id}>
            {`Маршрутный - ${quest.id}: ${quest.name} | ${quest.type} | ${quest.experience}`}
            </option>
        })
      }
      <option key={`${route.id} end`} value="dada" disabled>{str.replaceAll(/./g,'-')}</option>
    </>
  )
}

export const urlToObject = async(url: string)=> {
  const response = await fetch(`${HOST}/${url}`);
  const blob = await response.blob();
  const file = new File([blob], 'image.jpg', {type: blob.type});
  return file;
}

const emptyQuest: IQuest = {
  id: -1,
  name: '',
  experience: 0,
  thumbnail: '',
  description: '',
  isRouteQuest: false,
  latitude: 0,
  longitude: 0,
  type: QuestType.MEMORIAL,
  createdAt: '',
  updatedAt: ''
}

export default function AdminQuests({quests, routes, callback}: {quests: IQuest[], routes: IAdminRouteData[], callback: CallableFunction}) {
  const [coord, setCoord] = useState<L.LatLng>();
  const [facts, setFacts] = useState<string[]>([])
  const [images, setImages] = useState<File[]>([])
  const [update, setUpdate] = useState(false);
  const [isSuccess, setSuccess] = useState(false);

  const [currentQuest, setCurrentQuest] = useState<IQuest>();
  
  const [questId, setQuestId] = useState<string>('');
  const [type, setType] = useState<MarkerType>(MarkerType.Galery);

  const nameRef = useRef<HTMLInputElement>(null);
  const expRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const factRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLInputElement>(null);

  const {input: nameInput, isValid: isNameValid, setValue: setName} = useValidate(nameRef, isNotEmpty, '');
  const {input: expInput, isValid: isExpValid, setValue: setExp} = useValidate(expRef, isNotEmpty, 0);
  const {input: descInput, isValid: isDescValid, setValue: setDesc} = useValidate(descRef, isNotEmpty, '');
  const {input: factInput, isValid: isFactValid} = useValidate(factRef, isNotEmpty, '');
  const {file, preview, onChange: onFileChange, isValid: isFileValid, setImage} = useFileValidate(fileRef, isImageFile);
  const {file: img, onChange: onImgChange, isValid: isImgValid} = useFileValidate(imgRef, isImageFile);

  const questHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuestId(e.target.value);
  }

  const selectHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(toMarkerType(e.target.value));
  }
  
  const getFacts = async (questId: number) => {
    const facts = await getAllFacts(questId);
    setFacts(facts.map(fact => fact.fact))
  }

  const getImages = async (questId: number) => {
    const images = await getAllImages(questId);
    const files = await Promise.all(images.map(async (img) => await urlToObject(img.image)));
    setImages(files);
  }

  const clearForm = () => {
    setQuestId('');
    setCurrentQuest(emptyQuest);
    setFacts([]);
    setImages([]);
  }

  const success = () => {
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);  
    }, 2500)
  }

  const error = () => {
    showError('Ошибка');
  }

  const getThumbnail = async (url: string) => {
    const image = await urlToObject(url);
    setImage(image);
  }

  const createFactElem = () => {
    if (!isFactValid()) return;
    setFacts(prev => {
      const candidate = prev.find(el => el == factInput.value)
      if (!candidate) {
        prev.push(factInput.value);
      }
      return prev;
    });
    setUpdate(true);
  }

  const deleteFact = (fact: string) => {
    return () => {
      setFacts(prev => {
        return prev.filter(f => f !== fact);
      }); 
    }
  }

  const createImg = () => {
    if (!isImgValid()) return;
    setImages(prev => {
      const candidate = prev.find(el => el == img)
      if (img && !candidate) {
        prev.push(img);
      }
      return prev;
    });
    setUpdate(true);
  }

  const deleteImg = (img: File) => {
    return () => {
      setImages(prev => {
        return prev.filter(i => i !== img);
      });
    }
  }

  const takeInfoFromCurrentQuest = () => {
    if (currentQuest) {
      getThumbnail(currentQuest.thumbnail);
      getFacts(currentQuest.id);
      getImages(currentQuest.id);
      setName(currentQuest.name)
      setDesc(currentQuest.description)
      setExp(currentQuest.experience)
      setCoord(L.latLng(currentQuest.latitude, currentQuest.longitude));
      setType(toMarkerType(currentQuest.type));
    }
  }

  const createData = () => {
    const data: QuestData = {};
    data.description = descInput.value;
    data.experience = expInput.value;
    data.latitude = coord?.lat;
    data.longitude = coord?.lng;
    data.name = nameInput.value;
    data.thumbnail = file;
    data.type = type;
    return data;
  }

  const createBtnHandler = async () => {
    const isValid = [isDescValid(), isExpValid(), isFileValid(), isNameValid(), coord].every(el => el);
    if (!isValid) return;
    const data = createData();
    try {
      const quest = await createQuest(data);
      if (images.length > 0) {
        await Promise.all(images.map(async (img) => {
          const data: QuestImageData = {};
          data.image = img;
          data.questId = quest.id;
          await createImage(data);
        }));
      }
      if (facts.length > 0) {
        await Promise.all(facts.map(async (fact) => {
          const data: FactData = {};
          data.fact = fact;
          data.questId = quest.id;
          await createFact(data);
        }));
      }
      setQuestId(String(quest.id));
      success();
    } catch (e) {
      error();
    }
    callback(true);
  }

  const updateBtnHandler = async () => {
    const isValid = [isDescValid(), isExpValid(), isFileValid(), isNameValid(), coord].every(el => el);
    if (!isValid || !currentQuest) return;
    const data = createData();
    try {
      const quest = await updateQuest(currentQuest.id, data);
      await deleteImage(quest.id);
      if (images.length > 0) {
        await Promise.all(images.map(async (img) => {
          const data: QuestImageData = {};
          data.image = img;
          data.questId = quest.id;
          await createImage(data);
        }));
      }
      await deleteFactReq(quest.id);
      if (facts.length > 0) {
        await Promise.all(facts.map(async (fact) => {
          const data: FactData = {};
          data.fact = fact;
          data.questId = quest.id;
          await createFact(data);
        }));
      }
      setQuestId(String(quest.id));
      success();
    } catch (e) {
      error();
    }
    callback(true);
  }

  const deleteBtnHandler = async () => {
    if (!currentQuest) return;
    try {
      await deleteQuest(currentQuest.id);
      success();
    } catch (e) {
      error();
    }
    callback(true);
    setQuestId('');
  }

  useEffect(() => {
    if (questId !== '') {
      const id = Number(questId);
      const quest = quests.find((quest) => quest.id === id);
      if (quest) {
        setCurrentQuest(quest);
      }
    }
  }, [questId, quests])

  useEffect(() => {
    takeInfoFromCurrentQuest();
  }, [currentQuest]);

  useEffect(() => {
    setUpdate(false);
  }, [update]);

  return (
    <div className="admin__page">
      <div className={`success ${isSuccess ? 'show' : ''}` } onClick={() => setSuccess(false)}>Успешно изменено!</div>
      <div className="admin__title">Выбрать существующий</div>
      <select value={questId} onChange={questHandler} className='input input--two-columns'>
        <option key={`empty option`} value={''} disabled></option>
        {
          quests.length > 0 &&
          quests.map((quest) => {
            if (quest.isRouteQuest) return null;
            return <option key={`${quest.id} ${quest.name} ${quest.description}`} value={quest.id}>
              {`Одиночный - ${quest.id}: ${quest.name} | ${quest.type} | ${quest.experience}`}
              </option>
          })
        }
        {
          routes.map((route, id) => {
            if (!route.quests || route.quests.length === 0) return null;
            const routeQuests = quests.filter((quest) => {
              if (!route.quests) return false;
              return route.quests.map(el => el.id).includes(quest.id);
            });
            return (
              <AdminRouteListItem key={`${route.id} ${id}`} routeQuests={routeQuests} route={route}></AdminRouteListItem>
            )
          }).filter(el => el !== null)
        }
      </select>
      <MapContainer className='admin__map' zoom={10} center={DEFAULT_POS } scrollWheelZoom={true}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <AdminMarker callback={setCoord} coord={coord}></AdminMarker>
      </MapContainer>
      <div className="admin__title">Координаты</div>
      <input value={coord?.lat || 0} className='input' type="number" readOnly />
      <input value={coord?.lng || 0} className='input' type="number" readOnly />

      <hr style={{backgroundColor: '#333'}} className='input--two-columns' />

      <div className="admin__title">Название и описание</div>
      <input ref={nameRef} {...nameInput} className='input' type="text" placeholder='Название' />
      <textarea ref={descRef} {...descInput} className='input textarea' placeholder='Описание' ></textarea>

      <hr style={{backgroundColor: '#333'}} className='input--two-columns' />

      <div className="admin__title">Опыт и тип</div>
      <input ref={expRef} {...expInput} className='input' type="number" />
      <select value={type} onChange={selectHandler} className='input'>
        <option value={MarkerType.Galery}>Галерея</option>
        <option value={MarkerType.Memorial}>Мемориал</option>
        <option value={MarkerType.Museum}>Музей</option>
        <option value={MarkerType.Park}>Парк</option>
      </select>

      <hr style={{backgroundColor: '#333'}} className='input--two-columns' />
    
      <div className="admin__title">Главное изображение</div>
      <input ref={fileRef} className='input input--two-columns' type='file' onChange={onFileChange}></input>
      { file && preview && (file.type.includes('image')) && <div className='admin__preview' style={{backgroundImage: `url(${preview})`}}></div> }

      <hr style={{backgroundColor: '#333'}} className='input--two-columns' />

      <div className="admin__title">Факты</div>
      <input ref={factRef} {...factInput} className='input input--two-columns' type="text" placeholder='Факт' />
      <ButtonUI className='input--two-columns' callback={createFactElem}>Добавить факт</ButtonUI>
      {
        facts.map((fact, id) => {
          return <div key={`${fact} ${id}`} className="admin__fact input--two-columns">
            {fact}
            <ButtonUI className='danger' callback={deleteFact(fact)}>X</ButtonUI>
          </div>
        })
      }
      <hr style={{backgroundColor: '#333'}} className='input--two-columns' />

      <div className="admin__title">Изображения</div>
      <input ref={imgRef} className='input input--two-columns' type='file' onChange={onImgChange}></input>
      <ButtonUI className='input--two-columns' callback={createImg}>Добавить изображение</ButtonUI>
      {
        images.length > 0 &&
        <div className="admin__images">
          {
            images.map((img, id) => {
              return <div key={`${URL.createObjectURL(img)} ${id}`} className="admin__img" style={{backgroundImage: `url(${URL.createObjectURL(img)})`}}>
                <ButtonUI className='danger' callback={deleteImg(img)}>X</ButtonUI>
              </div>
            })
          }
        </div>
      }
      <div className="admin__controls">
        <ButtonUI callback={createBtnHandler}>Создать</ButtonUI>
        <ButtonUI callback={updateBtnHandler}>Обновить</ButtonUI>
        <ButtonUI callback={deleteBtnHandler} className='danger'>Удалить</ButtonUI>
      </div>
      <ButtonUI callback={takeInfoFromCurrentQuest}>Сбросить изменения</ButtonUI>
      <ButtonUI callback={clearForm} className='danger'>Очистить</ButtonUI>
    </div>
    
  )
}
