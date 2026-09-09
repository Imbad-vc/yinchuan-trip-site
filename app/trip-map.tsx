'use client';
import {useEffect,useRef,useState} from 'react';
import {UtensilsCrossed,ArrowUpRight} from 'lucide-react';
import {days} from './trip-data';

type Place={name:string;lat:number;lng:number;note:string;source:string;area?:boolean;kind?:'restaurant';alternate?:boolean};
const places:Record<string,Place>={
  station:{name:'银川站',lat:38.49168,lng:106.16862,note:'车站中心点；打车时确认进站口',source:'https://mapcarta.com/N9118892109'},
  base:{name:'人民广场住宿区域',lat:38.485,lng:106.226,note:'建议住宿范围，非已预订酒店',source:'https://uri.amap.com/search?keyword=银川人民广场&city=银川&callnative=0',area:true},
  museum:{name:'宁夏博物馆',lat:38.48446,lng:106.23073,note:'建筑中心点 · 人民广场东街',source:'https://mapcarta.com/W334447456'},
  lanshan:{name:'览山公园',lat:38.52976,lng:106.21024,note:'公园中心点，非停车场入口',source:'https://mapcarta.com/W702598597'},
  tombs:{name:'西夏陵',lat:38.435,lng:105.98722,note:'遗址参考点，非游客中心或售票入口',source:'https://zh.wikipedia.org/wiki/西夏陵'},
  rock:{name:'贺兰山岩画遗址公园',lat:38.74707,lng:106.01435,note:'遗址公园中心点，非接驳入口',source:'https://mapcarta.com/W687881233'},
  oldtown:{name:'兴庆老城活动范围',lat:38.465,lng:106.28,note:'仅示意老城片区；市场、小巷和店铺请用下方搜索核实',source:'https://uri.amap.com/search?keyword=银川鼓楼&city=银川&callnative=0',area:true},
  art:{name:'银川当代美术馆（待复核）',lat:38.3666875,lng:106.368078125,note:'由原文位置码解码，需以场馆地址复核',source:'https://uri.amap.com/search?keyword=银川当代美术馆&city=银川&callnative=0',area:true},
  guoqiang:{name:'国强手抓（贵宾楼店）',lat:38.48647,lng:106.23939,note:'上海西路与尹家渠北街交口 · 已换算为 WGS84 参考点',source:'https://www.amap.com/place/B0FFFFNE71',kind:'restaurant'},
  yisheng:{name:'伊盛手抓（雪绒巷店）',lat:38.4705,lng:106.246,note:'金凤区雪绒巷10号 · 2026必吃榜备选，坐标为地址参考点',source:'https://uri.amap.com/search?keyword=银川伊盛手抓雪绒巷店&city=银川&callnative=0',kind:'restaurant',alternate:true},
  mawei:{name:'马伟手抓（光耀店）',lat:38.4485,lng:106.2785,note:'宝湖东路与永安巷交叉口光耀中心 · 地址参考点，临行前确认',source:'https://qa.trip.com/restaurant/china/yinchuan/detail/restaurant-77811854/',kind:'restaurant',alternate:true},
  xiaoye:{name:'小叶手抓（解放东街总店）',lat:38.46131,lng:106.296,note:'解放东街与丽景南街交叉口西约 120 米 · WGS84 参考点',source:'https://www.amap.com/place/B0FFF74ZZH',kind:'restaurant',alternate:true},
  laomao:{name:'老毛手抓（鼓楼店）',lat:38.4647,lng:106.2785,note:'解放东路 99-1 号，近鼓楼 · 地址参考点，临行前确认',source:'https://touch.go.qunar.com/poi/11512588',kind:'restaurant',alternate:true},
  osman:{name:'奥斯曼辣糊糊（银川总店）',lat:38.492,lng:106.247,note:'宜居巷13号 · 2026必吃榜门店，坐标为地址参考点',source:'https://you.ctrip.com/food/yinchuan239/19100628.html',kind:'restaurant'},
  milk:{name:'山下有牛（阅彩城）',lat:38.5205,lng:106.25,note:'正源北街 277 号阅彩城内 · 商场参考点',source:'https://uri.amap.com/search?keyword=银川阅彩城山下有牛&city=银川&callnative=0',kind:'restaurant'},
  qingqing:{name:'清清特色炒烩肉',lat:38.4495,lng:106.2768,note:'玉皇阁南街 305 号 · 地址参考点，临行前确认',source:'https://uri.amap.com/search?keyword=银川清清特色炒烩肉&city=银川&callnative=0',kind:'restaurant'},
  sanyixuan:{name:'三益轩（总店）',lat:38.4685,lng:106.29441,note:'清真美食文化城 8 号楼 · WGS84 参考点',source:'https://www.amap.com/place/B0FFFFNII6',kind:'restaurant'},
  linjia:{name:'蔺家老字号羊杂碎馆',lat:38.466,lng:106.2825,note:'文化东街66号，距鼓楼约600米 · 2026必吃榜，坐标为地址参考点',source:'https://gs.ctrip.com/html5/you/foods/DongtaTown2091262/8592544.html',kind:'restaurant'},
  baicao:{name:'百草滩羊清水涮羊肉（长城路店）',lat:38.4507,lng:106.2495,note:'长城路与庆祥街交叉口附近（庆祥街127号）· 2026必吃榜，坐标为地址参考点',source:'https://uri.amap.com/search?keyword=银川百草滩羊清水涮羊肉长城路店&city=银川&callnative=0',kind:'restaurant'}
};

declare global{interface Window{L:any;__leafletReady?:Promise<any>}}
function getLeaflet(){
  if(window.L)return Promise.resolve(window.L);
  if(!window.__leafletReady)window.__leafletReady=new Promise((resolve,reject)=>{
    const s=document.createElement('script');s.src='/vendor/leaflet.js';
    const timeout=setTimeout(()=>reject(Error('timeout')),12000);
    s.onload=()=>{clearTimeout(timeout);resolve(window.L)};
    s.onerror=()=>{clearTimeout(timeout);reject(Error('load'))};
    document.head.appendChild(s);
  });
  return window.__leafletReady;
}

export default function TripMap({day}:{day:number}){
  const ref=useRef<HTMLDivElement>(null);const map=useRef<any>(null);
  const [all,setAll]=useState(false);const [status,setStatus]=useState('正在载入地图…');
  const [selected,setSelected]=useState<Place|null>(null);const [retry,setRetry]=useState(0);
  const current=days[day-1];
  const dayKeys=[...new Set([...current.places,...current.food.map(f=>f.place)])];
  const keys=all?Object.keys(places):dayKeys;
  const shown=keys.map(k=>places[k]).filter(Boolean);

  useEffect(()=>{
    let alive=true;let instance:any;setStatus('正在载入地图…');setSelected(null);
    getLeaflet().then(L=>{
      if(!alive||!ref.current)return;
      instance=L.map(ref.current,{scrollWheelZoom:false,attributionControl:true});map.current=instance;
      const tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'}).addTo(instance);
      let errors=0;tiles.on('tileerror',()=>{errors++;if(alive&&errors>2)setStatus('底图暂时不可用，可通过地点搜索查看')});tiles.on('load',()=>{if(alive&&!errors)setStatus('在线底图 · 可拖动缩放')});
      const pts=shown.map(p=>[p.lat,p.lng]);
      let attractionNumber=0;
      shown.forEach(p=>{
        if(p.area)L.circle([p.lat,p.lng],{radius:p.name.includes('美术馆')?250:850,color:p.kind?'#b76b42':'#8b9779',weight:1,dashArray:'4 4',fillOpacity:.12}).addTo(instance);
        if(!p.kind)attractionNumber++;
        const markerText=p.kind?'🍴':String(attractionNumber);
        const markerClass=p.kind?(' restaurant-pin'+(p.alternate?' alternate-pin':'')):'';
        const icon=L.divIcon({className:'trip-pin',html:'<span class="'+markerClass.trim()+'">'+markerText+'</span>',iconSize:[31,31],iconAnchor:[15,15]});
        const marker=L.marker([p.lat,p.lng],{icon,title:p.name,keyboard:true}).addTo(instance);
        const label=document.createElement('div');label.textContent=p.name;
        marker.bindTooltip(label,{direction:'top',offset:[0,-15]}).on('click',()=>setSelected(p));
      });
      const routePts=current.places.map(k=>places[k]).filter(Boolean).map(p=>[p.lat,p.lng]);
      if(routePts.length>1&&!all)L.polyline(routePts,{color:'#657951',weight:2,dashArray:'6 8',opacity:.7,interactive:false}).addTo(instance);
      if(pts.length)instance.fitBounds(L.latLngBounds(pts),{padding:[45,45],maxZoom:13});else instance.setView([38.48,106.25],11);
      L.control.scale({imperial:false}).addTo(instance);
    }).catch(()=>{if(alive)setStatus('地图加载失败，请重试或打开地点搜索')});
    return()=>{alive=false;instance?.remove();map.current=null};
  },[day,all,retry]);

  return <>
    {current.food.length>0&&<section className="food-plan" aria-label="当天餐饮计划">
      <div className="food-plan-title"><span><UtensilsCrossed/> 餐饮穿插</span><small>主活动点约 10 km 内优先</small></div>
      {current.food.map(f=><a className={'food-stop '+(f.role.includes('备选')?'food-alt':'')} href={'https://uri.amap.com/search?keyword='+encodeURIComponent('银川 '+f.name)+'&city=银川&callnative=0'} target="_blank" rel="noreferrer" key={f.name}>
        <time>{f.time}</time><div><strong>{f.name}</strong><span className="food-role">{f.role}</span><p>{f.note}</p><small>{f.wait}</small></div><ArrowUpRight/>
      </a>)}
    </section>}
    <div className="map-actions"><span role="status">{status}</span><button onClick={()=>setAll(!all)}>{all?'只看当天':'查看全程'} ↗</button></div>
    <div className="map" ref={ref} aria-label={'第'+day+'天地点与餐馆交互地图'}/>
    {status.includes('失败')&&<button className="map-retry" onClick={()=>{window.__leafletReady=undefined;setRetry(retry+1)}}>重新加载地图</button>}
    <p className="map-caption"><span className="legend-attraction">1</span> 景点 / 活动点　<span className="legend-food">🍴</span> 餐馆　<span className="legend-alt">🍴</span> 同类备选</p>
    <div className="map-places">{shown.map((p,i)=><button key={p.name} className={(selected?.name===p.name?'selected ':'')+(p.kind?'restaurant-place ':'')+(p.alternate?'alternate-place':'')} onClick={()=>{setSelected(p);map.current?.flyTo([p.lat,p.lng],14,{duration:.6})}}><b>{p.kind?'餐':i+1}</b>{p.name}</button>)}</div>
    {selected&&<div className="place-detail"><strong>{selected.name}</strong><p>{selected.note}</p><p>{selected.lat.toFixed(5)}° N, {selected.lng.toFixed(5)}° E · WGS84</p><a href={selected.source} target="_blank" rel="noreferrer">查看位置来源 ↗</a><a href={'https://uri.amap.com/search?keyword='+encodeURIComponent('银川 '+selected.name.replace('（待复核）',''))+'&city=银川&callnative=0'} target="_blank" rel="noreferrer">高德搜索 / 导航 ↗</a></div>}
    <p className="fine">餐馆按当天动线穿插；手抓备选不会重复占用餐次。地址参考点及分店信息请在出发前通过高德确认。</p>
  </>;
}
