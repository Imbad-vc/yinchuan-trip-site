'use client';
import {useEffect,useRef,useState} from 'react';
import {UtensilsCrossed,ArrowUpRight,BusFront} from 'lucide-react';
import {days,type TripDay} from './trip-data';

type Place={name:string;lat:number;lng:number;note:string;source:string;travel?:string;area?:boolean;kind?:'restaurant'|'hotel';alternate?:boolean;city?:'成都'|'太原'|'银川'};
const places:Record<string,Place>={
  chengduEast:{name:'成都东站',lat:30.6283,lng:104.1411,note:'D1910出发站；国庆首日建议提前到站',source:'https://uri.amap.com/search?keyword=成都东站&city=成都&callnative=0',travel:'成都地铁2号线或7号线直达“成都东客站”；带行李预留进站安检时间。',city:'成都'},
  taiyuanBase:{name:'锦江之星风尚太原大南门地铁站酒店',lat:37.859588,lng:112.552636,note:'迎泽大街221号，迎泽大街与解放路交叉口西北角；高德坐标已换算为WGS84参考点',source:'https://www.amap.com/place/B0FFHH8065',travel:'酒店紧邻地铁“大南门站”H口，1号线与2号线换乘；去钟楼街、迎泽公园可步行，远途景点优先地铁接公交。',kind:'hotel',city:'太原'},
  taiyuanSouth:{name:'太原南站',lat:37.7896,lng:112.6105,note:'D1910抵达站；与太原站不是同一座车站',source:'https://uri.amap.com/search?keyword=太原南站&city=太原&callnative=0',travel:'乘地铁1号线从“太原南站”直达“大南门站”，H口出站即到酒店；携带大件行李时再考虑网约车。',city:'太原'},
  taiyuanStation:{name:'太原站',lat:37.8602,lng:112.5905,note:'D267 夜车由太原站出发；不要误去太原南站',source:'https://uri.amap.com/search?keyword=太原站&city=太原&callnative=0',travel:'从酒店旁“大南门站”乘地铁1号线到“太原站东广场”；夜车至少提前45分钟离开酒店。',city:'太原'},
  yinchuanStationCombined:{name:'银川站',lat:38.49168,lng:106.16862,note:'D267抵达、D1709返程车站；打车或乘公交时确认进出站口',source:'https://mapcarta.com/N9118892109',travel:'银川无地铁；前往金凤万达酒店优先查询公交换乘，夜车抵达后若班次等待较长或携带大件行李则直接网约车。',city:'银川'},
  yinchuanHotel:{name:'银川万达嘉利家公寓酒店（万达店）',lat:38.486023,lng:106.244835,note:'正源北街金凤万达广场B座923；10/4入住、10/7退房，三晚',source:'https://www.kkvip.hk/Aitravel/caringchat?hid_cn=1130350&lat=38.486022997917&lon=106.24483474794',travel:'银川无地铁。酒店位于金凤万达，去宁夏博物馆约2公里，优先公交或共享单车；携带行李、清晨抵达及郊区行程再使用网约车。',kind:'hotel',city:'银川'},
  jinci:{name:'晋祠博物馆',lat:37.7066,lng:112.4475,note:'景区参考点；入口与国庆开放时间出发前复核',source:'https://uri.amap.com/search?keyword=晋祠博物馆&city=太原&callnative=0',travel:'地铁1号线至“五一广场”附近换308路，或在青年路口乘804路，到“晋祠公园”后步行；约75–90分钟。',city:'太原'},
  shanxiMuseum:{name:'山西博物院',lat:37.8656,lng:112.5205,note:'滨河西路馆区参考点；提前预约',source:'https://uri.amap.com/search?keyword=山西博物院&city=太原&callnative=0',travel:'地铁1号线到“太原理工大学站”，再换旅游公交专线1一站到“山西博物院”；不顺班次时换69/865路。',city:'太原'},
  bellStreet:{name:'太原钟楼街',lat:37.8707,lng:112.5624,note:'老城步行街参考点，可与食品街一起散步',source:'https://uri.amap.com/search?keyword=太原钟楼街&city=太原&callnative=0',travel:'地铁1号线“柳南站”下车后步行约10–15分钟；老城内继续步行，不建议叫车。',area:true,city:'太原'},
  jinshangMuseum:{name:'晋商博物院',lat:37.8761,lng:112.5594,note:'督军府旧址片区参考点；闭馆时间出发前复核',source:'https://uri.amap.com/search?keyword=晋商博物院&city=太原&callnative=0',travel:'从老海子步行约15–20分钟；从其他区域先乘地铁1号线到“柳南站”，再步行或换短途公交。',city:'太原'},
  haoganggang:{name:'郝刚刚羊杂割（柳巷店）',lat:37.872207,lng:112.567805,note:'柳巷83号 · 连续3年必吃榜，国庆早餐排队按30–45分钟准备',source:'https://www.amap.com/place/B015F037D5',travel:'柳巷住宿区步行约5–15分钟；不需要乘车。餐后步行至五一广场附近换308路去晋祠。',kind:'restaurant',city:'太原'},
  jinweizhai:{name:'晋祠宾馆·晋味斋',lat:37.701,lng:112.441,note:'晋祠宾馆内 · 晋祠附近参考点，位置优先的晋菜午餐',source:'https://uri.amap.com/search?keyword=晋祠宾馆晋味斋&city=太原&callnative=0',travel:'从晋祠景区步行约10–15分钟；午餐后回“晋祠公园”站乘308/804路返城。',kind:'restaurant',city:'太原'},
  laomajia:{name:'老马家蒸饺（南海街店）',lat:37.8645,lng:112.552,note:'南海街57号 · 2026新上榜，坐标为地址参考点',source:'https://uri.amap.com/search?keyword=老马家蒸饺南海街店&city=太原&callnative=0',travel:'地铁1号线到“大南门站”后步行约10分钟；餐后步行约20分钟到钟楼街。',kind:'restaurant',city:'太原'},
  laohaizi:{name:'老海子面食店（海子边店）',lat:37.871,lng:112.575,note:'海子边街36号、文瀛公园北门旁 · 2026新上榜，地址参考点',source:'https://www.amap.com/place/B0FFHUTO1R',travel:'从省博乘旅游公交专线1回“太原理工大学站”，转地铁1号线到“柳南站”后步行；约35–45分钟。',kind:'restaurant',city:'太原'},
  xiangzhile:{name:'湘之乐（五一广场店）',lat:37.859,lng:112.58,note:'迎泽南街、鼎元时代东侧 · 2026新上榜，夜车前可预约晚餐',source:'https://uri.amap.com/search?keyword=湘之乐五一广场店&city=太原&callnative=0',travel:'从晋商博物院步行或短途公交到五一广场；餐后乘地铁1号线一站到“太原站东广场”。',kind:'restaurant',city:'太原'},
  station:{name:'银川站',lat:38.49168,lng:106.16862,note:'车站中心点；打车时确认进站口',source:'https://mapcarta.com/N9118892109',travel:'到人民广场优先乘11路或41路公交；有大件行李或清晨班次未运营时再用网约车。'},
  base:{name:'人民广场住宿区域',lat:38.485,lng:106.226,note:'建议住宿范围，非已预订酒店',source:'https://uri.amap.com/search?keyword=银川人民广场&city=银川&callnative=0',travel:'宁夏博物馆步行可达；去火车站乘11/41路，去览山优先13路。银川目前无运营地铁。',area:true},
  museum:{name:'宁夏博物馆',lat:38.48446,lng:106.23073,note:'建筑中心点 · 人民广场东街',source:'https://mapcarta.com/W334447456',travel:'从人民广场住宿区步行约5–12分钟；较远酒店可乘36/39/101路到“宁夏博物馆”站。'},
  lanshan:{name:'览山公园',lat:38.52976,lng:106.21024,note:'公园中心点，非停车场入口',source:'https://mapcarta.com/W702598597',travel:'从“人民广场西街”乘13路直达“览山公园”；10月常规末班约19:00，看完日落可能赶不上，返程预留网约车。'},
  tombs:{name:'西夏陵',lat:38.435,lng:105.98722,note:'遗址参考点，非游客中心或售票入口',source:'https://zh.wikipedia.org/wiki/西夏陵',travel:'先乘11/41路到银川站，国庆优先乘火车站—西夏陵定制专线；专线未公布或不匹配预约时才约往返网约车。'},
  rock:{name:'贺兰山岩画遗址公园',lat:38.74707,lng:106.01435,note:'遗址公园中心点，非接驳入口',source:'https://mapcarta.com/W687881233',travel:'优先乘火车站定制专线或北门公交车场“游二路”；班次少，前一天用“银川智行”核对，错过回程才改预约网约车。'},
  oldtown:{name:'兴庆老城活动范围',lat:38.465,lng:106.28,note:'仅示意老城片区；市场、小巷和店铺请用下方搜索核实',source:'https://uri.amap.com/search?keyword=银川鼓楼&city=银川&callnative=0',travel:'从人民广场优先乘市区公交到鼓楼/新华商圈，末段步行；老城内各点以步行或共享单车串联。',area:true},
  art:{name:'银川当代美术馆（待复核）',lat:38.3666875,lng:106.368078125,note:'由原文位置码解码，需以场馆地址复核',source:'https://uri.amap.com/search?keyword=银川当代美术馆&city=银川&callnative=0',area:true},
  guoqiang:{name:'国强手抓（贵宾楼店）',lat:38.48647,lng:106.23939,note:'上海西路与尹家渠北街交口 · 已换算为 WGS84 参考点',source:'https://www.amap.com/place/B0FFFFNE71',travel:'从人民广场住宿区步行约15–20分钟或共享单车约8分钟；下雨或携带行李再叫网约车。',kind:'restaurant'},
  yisheng:{name:'伊盛手抓（雪绒巷店）',lat:38.4705,lng:106.246,note:'金凤区雪绒巷10号 · 2026必吃榜备选，坐标为地址参考点',source:'https://uri.amap.com/search?keyword=银川伊盛手抓雪绒巷店&city=银川&callnative=0',kind:'restaurant',alternate:true},
  mawei:{name:'马伟手抓（光耀店）',lat:38.4485,lng:106.2785,note:'宝湖东路与永安巷交叉口光耀中心 · 地址参考点，临行前确认',source:'https://qa.trip.com/restaurant/china/yinchuan/detail/restaurant-77811854/',kind:'restaurant',alternate:true},
  xiaoye:{name:'小叶手抓（解放东街总店）',lat:38.46131,lng:106.296,note:'解放东街与丽景南街交叉口西约 120 米 · WGS84 参考点',source:'https://www.amap.com/place/B0FFF74ZZH',kind:'restaurant',alternate:true},
  laomao:{name:'老毛手抓（鼓楼店）',lat:38.4647,lng:106.2785,note:'解放东路 99-1 号，近鼓楼 · 地址参考点，临行前确认',source:'https://touch.go.qunar.com/poi/11512588',kind:'restaurant',alternate:true},
  osman:{name:'奥斯曼辣糊糊（银川总店）',lat:38.492,lng:106.247,note:'宜居巷13号 · 2026必吃榜门店，坐标为地址参考点',source:'https://you.ctrip.com/food/yinchuan239/19100628.html',travel:'从宁夏博物馆步行约20分钟或共享单车约8分钟；用餐后同样方式回人民广场酒店。',kind:'restaurant'},
  milk:{name:'山下有牛（阅彩城）',lat:38.5205,lng:106.25,note:'正源北街 277 号阅彩城内 · 商场参考点',source:'https://uri.amap.com/search?keyword=银川阅彩城山下有牛&city=银川&callnative=0',kind:'restaurant'},
  qingqing:{name:'清清特色炒烩肉',lat:38.4495,lng:106.2768,note:'玉皇阁南街 305 号 · 地址参考点，临行前确认',source:'https://uri.amap.com/search?keyword=银川清清特色炒烩肉&city=银川&callnative=0',travel:'老城活动结束后优先共享单车或市区公交，约10–20分钟；从人民广场直接前往再考虑网约车。',kind:'restaurant'},
  sanyixuan:{name:'三益轩（总店）',lat:38.4685,lng:106.29441,note:'清真美食文化城 8 号楼 · WGS84 参考点',source:'https://www.amap.com/place/B0FFFFNII6',travel:'从鼓楼片区优先公交或共享单车，约15–25分钟；晚饭后公交班次少时再叫网约车回酒店。',kind:'restaurant'},
  linjia:{name:'蔺家老字号羊杂碎馆',lat:38.466,lng:106.2825,note:'文化东街66号，距鼓楼约600米 · 2026必吃榜，坐标为地址参考点',source:'https://gs.ctrip.com/html5/you/foods/DongtaTown2091262/8592544.html',kind:'restaurant'},
  baicao:{name:'百草滩羊清水涮羊肉（长城路店）',lat:38.4507,lng:106.2495,note:'长城路与庆祥街交叉口附近（庆祥街127号）· 2026必吃榜，坐标为地址参考点',source:'https://uri.amap.com/search?keyword=银川百草滩羊清水涮羊肉长城路店&city=银川&callnative=0',kind:'restaurant'}
};

declare global{interface Window{AMap:any;_AMapSecurityConfig?:{securityJsCode:string};__amapReady?:Promise<any>}}
const amapKey=process.env.NEXT_PUBLIC_AMAP_KEY??'';
const amapSecurityCode=process.env.NEXT_PUBLIC_AMAP_SECURITY_CODE??'';

type RouteMode='transit'|'walk'|'ride'|'drive';
type RouteSummary={distance:string;duration:string;detail:string};
type WeatherInfo={weather:string;temperature:string;wind:string;forecast:string};
type PoiInfo={address?:string;tel?:string;type?:string};

function getAmap(){
  if(window.AMap)return Promise.resolve(window.AMap);
  if(!amapKey||!amapSecurityCode)return Promise.reject(Error('missing-key'));
  window._AMapSecurityConfig={securityJsCode:amapSecurityCode};
  if(!window.__amapReady)window.__amapReady=new Promise((resolve,reject)=>{
    const s=document.createElement('script');
    s.src=`https://webapi.amap.com/maps?v=2.0&key=${encodeURIComponent(amapKey)}&plugin=AMap.Scale`;
    const timeout=setTimeout(()=>reject(Error('timeout')),15000);
    s.onload=()=>{clearTimeout(timeout);window.AMap?resolve(window.AMap):reject(Error('load'))};
    s.onerror=()=>{clearTimeout(timeout);reject(Error('load'))};
    document.head.appendChild(s);
  });
  return window.__amapReady;
}

function wgs84ToGcj02(lng:number,lat:number):[number,number]{
  if(lng<72.004||lng>137.8347||lat<0.8293||lat>55.8271)return[lng,lat];
  const pi=Math.PI,a=6378245,ee=0.006693421622965943;
  const transformLat=(x:number,y:number)=>-100+2*x+3*y+.2*y*y+.1*x*y+.2*Math.sqrt(Math.abs(x))+(20*Math.sin(6*x*pi)+20*Math.sin(2*x*pi))*2/3+(20*Math.sin(y*pi)+40*Math.sin(y*pi/3))*2/3+(160*Math.sin(y*pi/12)+320*Math.sin(y*pi/30))*2/3;
  const transformLng=(x:number,y:number)=>300+x+2*y+.1*x*x+.1*x*y+.1*Math.sqrt(Math.abs(x))+(20*Math.sin(6*x*pi)+20*Math.sin(2*x*pi))*2/3+(20*Math.sin(x*pi)+40*Math.sin(x*pi/3))*2/3+(150*Math.sin(x*pi/12)+300*Math.sin(x*pi/30))*2/3;
  let dLat=transformLat(lng-105,lat-35),dLng=transformLng(lng-105,lat-35);
  const radLat=lat/180*pi,magic=1-ee*Math.sin(radLat)**2,sqrtMagic=Math.sqrt(magic);
  dLat=dLat*180/((a*(1-ee))/(magic*sqrtMagic)*pi);
  dLng=dLng*180/(a/sqrtMagic*Math.cos(radLat)*pi);
  return[lng+dLng,lat+dLat];
}

const formatDistance=(metres:number)=>metres>=1000?`${(metres/1000).toFixed(1)} km`:`${Math.round(metres)} m`;
const formatDuration=(seconds:number)=>{const minutes=Math.max(1,Math.round(seconds/60));return minutes>=60?`${Math.floor(minutes/60)}小时${minutes%60?minutes%60+'分钟':''}`:`${minutes}分钟`};
const loadPlugins=(AMap:any,names:string[])=>new Promise<void>(resolve=>AMap.plugin(names,resolve));

export default function TripMap({day,itinerary=days,showTransit=itinerary!==days}:{day:number;itinerary?:TripDay[];showTransit?:boolean}){
  const ref=useRef<HTMLDivElement>(null);const map=useRef<any>(null);const routeService=useRef<any>(null);const trafficLayer=useRef<any>(null);
  const [all,setAll]=useState(false);const [status,setStatus]=useState('正在载入地图…');
  const [selected,setSelected]=useState<Place|null>(null);const [retry,setRetry]=useState(0);
  const [routeMode,setRouteMode]=useState<RouteMode>('transit');const [routeIndex,setRouteIndex]=useState(0);
  const [routeSummary,setRouteSummary]=useState<RouteSummary|null>(null);const [routeStatus,setRouteStatus]=useState('正在准备当天路线…');
  const [weather,setWeather]=useState<WeatherInfo|null>(null);const [traffic,setTraffic]=useState(false);
  const [poiInfo,setPoiInfo]=useState<PoiInfo|null>(null);const [locating,setLocating]=useState(false);
  const current=itinerary[day-1];
  const dayKeys=[...new Set([...current.places,...current.food.map(f=>f.place)])];
  const dayShown=dayKeys.map(k=>places[k]).filter(Boolean);
  const itineraryKeys=[...new Set(itinerary.flatMap(d=>[...d.places,...d.food.map(f=>f.place)]))];
  const keys=all?itineraryKeys:dayKeys;
  const shown=keys.map(k=>places[k]).filter(Boolean);
  const routeStops=current.places.map(k=>places[k]).filter(Boolean);
  const routeFrom=routeStops[routeIndex];const routeTo=routeStops[routeIndex+1];

  const planRoute=async(mode:RouteMode=routeMode,originOverride?:[number,number])=>{
    const AMap=window.AMap,instance=map.current;if(!AMap||!instance||!routeTo)return;
    const from=originOverride??wgs84ToGcj02(routeFrom.lng,routeFrom.lat);const to=wgs84ToGcj02(routeTo.lng,routeTo.lat);
    setRouteStatus('正在计算真实路线…');setRouteSummary(null);routeService.current?.clear?.();
    try{
      const plugin=mode==='transit'?'AMap.Transfer':mode==='walk'?'AMap.Walking':mode==='ride'?'AMap.Riding':'AMap.Driving';
      await loadPlugins(AMap,[plugin]);
      const city=current.city==='太原'?'太原':current.city==='成都'?'成都':'银川';
      const options:any={map:instance,hideMarkers:true,autoFitView:true};
      if(mode==='transit'){options.city=city;options.cityd=city;options.policy=AMap.TransferPolicy?.LEAST_TIME??0}
      if(mode==='drive'){options.policy=AMap.DrivingPolicy?.LEAST_TIME??0;options.showTraffic=true}
      const Service=AMap[plugin.split('.')[1]];const service=new Service(options);routeService.current=service;
      service.search(new AMap.LngLat(...from),new AMap.LngLat(...to),(resultStatus:string,result:any)=>{
        if(resultStatus!=='complete'){setRouteStatus('当前方式未找到路线，请切换其他方式');return}
        const item=result.routes?.[0]??result.plans?.[0];
        if(!item){setRouteStatus('当前方式暂无可用路线');return}
        const segments=item.segments??[];const transitNames=segments.flatMap((segment:any)=>segment.transit?.lines?.map((line:any)=>line.name)||[]).filter(Boolean);
        const detail=mode==='transit'?(transitNames.slice(0,3).join(' → ')||'公交换乘方案'):`沿实际道路规划`;
        setRouteSummary({distance:formatDistance(Number(item.distance||0)),duration:formatDuration(Number(item.time||item.duration||0)),detail});
        setRouteStatus('已绘制真实路线');
      });
    }catch{setRouteStatus('路线服务暂时不可用，请稍后重试')}
  };

  const loadWeather=async(AMap:any)=>{
    try{await loadPlugins(AMap,['AMap.Weather']);const service=new AMap.Weather();const city=current.city==='太原'?'太原市':current.city==='成都'?'成都市':'银川市';
      service.getLive(city,(error:any,live:any)=>{if(error)return;service.getForecast(city,(_forecastError:any,data:any)=>{const tomorrow=data?.forecasts?.[1];setWeather({weather:live.weather,temperature:String(live.temperature),wind:`${live.windDirection||''}风 ${live.windPower||''}级`.trim(),forecast:tomorrow?`明日 ${tomorrow.dayWeather} ${tomorrow.nightTemp}–${tomorrow.dayTemp}℃`:'暂无明日预报'})})});
    }catch{setWeather(null)}
  };

  const toggleTraffic=()=>{const AMap=window.AMap;if(!AMap||!map.current)return;if(!trafficLayer.current){trafficLayer.current=new AMap.TileLayer.Traffic({zIndex:10,autoRefresh:true,interval:180});map.current.add(trafficLayer.current)}else traffic?trafficLayer.current.hide():trafficLayer.current.show();setTraffic(!traffic)};

  const locateAndRoute=async()=>{const AMap=window.AMap;if(!AMap||!map.current||!routeTo)return;setLocating(true);
    try{await loadPlugins(AMap,['AMap.Geolocation']);const geolocation=new AMap.Geolocation({enableHighAccuracy:true,timeout:10000});geolocation.getCurrentPosition((resultStatus:string,result:any)=>{setLocating(false);if(resultStatus!=='complete'){setRouteStatus('无法取得当前位置，请检查浏览器定位权限');return}const p:[number,number]=[result.position.lng,result.position.lat];map.current.add(new AMap.Marker({position:p,title:'我的位置'}));planRoute(routeMode,p)})}catch{setLocating(false);setRouteStatus('定位服务暂时不可用')}};

  const loadPoiInfo=async(place:Place)=>{setSelected(place);setPoiInfo(null);const AMap=window.AMap;if(!AMap)return;
    try{await loadPlugins(AMap,['AMap.PlaceSearch']);const search=new AMap.PlaceSearch({city:place.city??(current.city==='太原'?'太原':'银川'),citylimit:true,extensions:'all',pageSize:5});search.search(place.name.replace(/（.*?）/g,''),(resultStatus:string,result:any)=>{if(resultStatus!=='complete')return;const poi=result.poiList?.pois?.[0];if(poi)setPoiInfo({address:poi.address,tel:Array.isArray(poi.tel)?poi.tel.join('、'):poi.tel,type:poi.type})})}catch{setPoiInfo(null)}};

  useEffect(()=>{
    let alive=true;let instance:any;setStatus('正在载入地图…');setSelected(null);setWeather(null);setRouteSummary(null);setRouteIndex(0);setRouteStatus('正在准备当天路线…');
    getAmap().then(async AMap=>{
      if(!alive||!ref.current)return;
      instance=new AMap.Map(ref.current,{zoom:11,center:[106.25,38.48],viewMode:'2D',scrollWheel:false,mapStyle:'amap://styles/normal'});map.current=instance;
      instance.on('complete',()=>alive&&setStatus('高德地图 · 可拖动缩放'));
      const pts=shown.map(p=>wgs84ToGcj02(p.lng,p.lat));
      let attractionNumber=0;
      shown.forEach(p=>{
        const position=wgs84ToGcj02(p.lng,p.lat);
        if(p.area)instance.add(new AMap.Circle({center:position,radius:p.name.includes('美术馆')?250:850,strokeColor:p.kind?'#b76b42':'#8b9779',strokeWeight:1,strokeStyle:'dashed',fillColor:'#8b9779',fillOpacity:.12}));
        if(!p.kind)attractionNumber++;
        const markerText=p.kind==='restaurant'?'🍴':p.kind==='hotel'?'🛏':String(attractionNumber);
        const markerClass=p.kind==='restaurant'?(' restaurant-pin'+(p.alternate?' alternate-pin':'')):p.kind==='hotel'?' hotel-pin':'';
        const content=document.createElement('button');content.className='trip-pin';content.type='button';content.title=p.name;content.setAttribute('aria-label',p.name);content.innerHTML='<span class="'+markerClass.trim()+'">'+markerText+'</span>';
        const marker=new AMap.Marker({position,content,offset:new AMap.Pixel(-15,-15),title:p.name,zIndex:p.kind?120:100});
        marker.on('click',()=>setSelected(p));instance.add(marker);
      });
      const routePts=current.places.map(k=>places[k]).filter(Boolean).map(p=>wgs84ToGcj02(p.lng,p.lat));
      if(routePts.length>1&&all)instance.add(new AMap.Polyline({path:routePts,strokeColor:'#657951',strokeWeight:2,strokeStyle:'dashed',strokeOpacity:.7,zIndex:60}));
      if(pts.length)instance.setFitView(null,false,[45,45,45,45],13);
      await loadPlugins(AMap,['AMap.Scale','AMap.ToolBar']);if(!alive)return;instance.addControl(new AMap.Scale());instance.addControl(new AMap.ToolBar({position:{right:'10px',top:'10px'}}));loadWeather(AMap);
    }).catch(()=>{if(alive)setStatus('地图加载失败，请重试或打开地点搜索')});
    return()=>{alive=false;routeService.current?.clear?.();routeService.current=null;trafficLayer.current=null;instance?.destroy();map.current=null};
  },[day,all,retry,itinerary]);

  useEffect(()=>{if(map.current&&routeTo&&!all)planRoute(routeMode)},[routeMode,routeIndex,status,all]);

  return <>
    {current.food.length>0&&<section className="food-plan" aria-label="当天餐饮计划">
      <div className="food-plan-title"><span><UtensilsCrossed/> 餐饮穿插</span><small>主活动点约 10 km 内优先</small></div>
      {current.food.map(f=><a className={'food-stop '+(f.role.includes('备选')?'food-alt':'')} href={'https://uri.amap.com/search?keyword='+encodeURIComponent((current.city==='太原'?'太原 ':'银川 ')+f.name)+'&city='+(current.city==='太原'?'太原':'银川')+'&callnative=0'} target="_blank" rel="noreferrer" key={f.name}>
        <time>{f.time}</time><div><strong>{f.name}</strong><span className="food-role">{f.role}</span><p>{f.note}</p><small>{f.wait}</small></div><ArrowUpRight/>
      </a>)}
    </section>}
    {showTransit&&<section className="transit-plan" aria-label="当天各地点出行方式">
      <div className="transit-plan-title"><span><BusFront/> 公共交通优先</span><small>步行 / 地铁 → 公交 / 专线 → 网约车</small></div>
      <div className="transit-list">{dayShown.map(p=><article key={p.name}><strong>{p.name}</strong><p>{p.travel??'优先步行或使用实时公交导航；没有合适班次时再考虑网约车。'}</p></article>)}</div>
      <p className="fine">线路按当前公开信息整理。国庆专线、末班时间和临时调度请前一天用高德、太原公交或银川智行复核。</p>
    </section>}
    <section className="travel-tools" aria-label="实时旅途工具">
      <div className="weather-card"><strong>{current.city==='返程'?'银川':current.city}天气</strong>{weather?<><span>{weather.weather} · {weather.temperature}℃</span><small>{weather.wind}　{weather.forecast}</small></>:<small>正在获取实时天气…</small>}</div>
      <div className="live-tools"><button className={traffic?'active':''} onClick={toggleTraffic}>{traffic?'关闭':'显示'}实时路况</button><button onClick={locateAndRoute} disabled={locating}>{locating?'正在定位…':'从我当前位置出发'}</button></div>
    </section>
    {!all&&routeFrom&&routeTo&&<section className="route-planner" aria-label="真实路线规划">
      <div className="route-select"><label>路线段<select value={routeIndex} onChange={e=>setRouteIndex(Number(e.target.value))}>{routeStops.slice(0,-1).map((p,i)=><option value={i} key={p.name}>{p.name} → {routeStops[i+1].name}</option>)}</select></label></div>
      <div className="route-modes">{([['transit','公交 / 地铁'],['walk','步行'],['ride','骑行'],['drive','驾车 / 网约车']] as [RouteMode,string][]).map(([mode,label])=><button className={routeMode===mode?'active':''} onClick={()=>setRouteMode(mode)} key={mode}>{label}</button>)}</div>
      <div className="route-result"><strong>{routeStatus}</strong>{routeSummary&&<p>{routeSummary.duration} · {routeSummary.distance}<span>{routeSummary.detail}</span></p>}</div>
    </section>}
    <div className="map-actions"><span role="status">{status}</span><button onClick={()=>setAll(!all)}>{all?'只看当天':'查看全程'} ↗</button></div>
    <div className="map" ref={ref} aria-label={'第'+day+'天地点与餐馆交互地图'}/>
    {status.includes('失败')&&<button className="map-retry" onClick={()=>{window.__amapReady=undefined;setRetry(retry+1)}}>重新加载地图</button>}
    <p className="map-caption"><span className="legend-attraction">1</span> 景点 / 活动点　<span className="legend-hotel">🛏</span> 酒店　<span className="legend-food">🍴</span> 餐馆　<span className="legend-alt">🍴</span> 同类备选</p>
    <div className="map-places">{shown.map((p,i)=><button key={p.name} className={(selected?.name===p.name?'selected ':'')+(p.kind==='restaurant'?'restaurant-place ':'')+(p.kind==='hotel'?'hotel-place ':'')+(p.alternate?'alternate-place':'')} onClick={()=>{loadPoiInfo(p);map.current?.setZoomAndCenter(14,wgs84ToGcj02(p.lng,p.lat),true)}}><b>{p.kind==='restaurant'?'餐':p.kind==='hotel'?'住':shown.slice(0,i+1).filter(item=>!item.kind).length}</b>{p.name}</button>)}</div>
    {selected&&<div className="place-detail"><strong>{selected.name}</strong><p>{selected.note}</p>{poiInfo?.address&&<p>高德地址：{poiInfo.address}</p>}{poiInfo?.tel&&<p>电话：{poiInfo.tel}</p>}{showTransit&&selected.travel&&<p className="place-transit"><BusFront/> {selected.travel}</p>}<p>{selected.lat.toFixed(5)}° N, {selected.lng.toFixed(5)}° E · WGS84</p><a href={selected.source} target="_blank" rel="noreferrer">查看位置来源 ↗</a><a href={'https://uri.amap.com/navigation?to='+wgs84ToGcj02(selected.lng,selected.lat).join(',')+','+encodeURIComponent(selected.name)+'&mode=car&policy=1&callnative=1&src=yinchuan-trip'} target="_blank" rel="noreferrer">从当前位置导航 ↗</a></div>}
    <p className="fine">餐馆按当天动线穿插；同类型备选不会重复占用餐次。地址参考点及分店信息请在出发前通过高德确认。</p>
  </>;
}
