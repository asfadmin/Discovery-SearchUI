import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BrowseOverlayService, WktService } from '@services';
import { Observable, first, map, of, tap } from 'rxjs';
// import WebGLTileLayer from 'ol/layer/WebGLTile';
import ImageLayer from 'ol/layer/Image';
// import Static from 'ol/source/ImageStatic';
// import { TimeSeriesResult } from '@models';
import ImageSource from 'ol/source/Image';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import WKT from 'ol/format/WKT';

@Injectable({
  providedIn: 'root'
})
export class NetcdfService {
  private url: string = 'https://ztcnv66fekaaijerj5hhytfrdu0xcuho.lambda-url.us-east-1.on.aws/'
  private itemsEndpoint: string = 'items/'
  private timeSeriesEndpoint: string = 'timeseries'
  private files: string[] = [""] //, "20221107_20230130.unw.nc", "20221107_20230106.unw.nc", "20221107_20230729.unw.nc", "20221107_20230319.unw.nc", "20221107_20221213.unw.nc", "20221107_20230530.unw.nc", "20221107_20230717.unw.nc", "20221107_20230412.unw.nc", "20221107_20230506.unw.nc", "20221107_20230223.unw.nc", "20221107_20230211.unw.nc", "20221107_20230331.unw.nc", "20221107_20230705.unw.nc"]
  public layers: { feature: Feature<Geometry>, browse: ImageLayer<ImageSource> }[] = []
  // private data = []

  private cache = {};
  private totalKeys = [];
  private maxCacheSize = 10;

  constructor(
    private http: HttpClient,
    private browseOverlayService: BrowseOverlayService,
    // private mapService: MapService
    private wktService: WktService

  ) {
  }

  public get_layers(): Observable<{ feature: Feature<Geometry>, browse: ImageLayer<ImageSource> }>[] {
    let output: Observable<{ feature: Feature<Geometry>, browse: ImageLayer<ImageSource> }>[] = []
    for (let file of this.files) {
      output.push(
        // this.http.get(`${this.url}${this.itemsEndpoint}${file}/wkt`, {
        //   withCredentials: false,
        // })
        of({
          "wkt": "POLYGON ((-120.6615251969388 38.10092445232182, -120.718418876677 38.10897042852191, -120.7687981867154 38.11607699567575, -120.8223842116076 38.12360668069909, -120.8733089224232 38.13074101176107, -120.9255974694615 38.13804006716389, -120.9782363367441 38.14536236026648, -121.0303471231114 38.15258680544186, -121.0823814204628 38.15977601859417, -121.1336652680372 38.16683812087351, -121.1849693782792 38.17387895092786, -121.2361602677623 38.18088039984787, -121.2869646120337 38.18780577716645, -121.3375229031567 38.19467458653498, -121.3879319144246 38.20150001584902, -121.4380928806928 38.2082691440719, -121.48505251800194 38.21458511223616, -121.4979189941239 38.15679508985913, -121.5451257107823 38.16313218201496, -121.592953840566 38.16953126137506, -121.6404964543046 38.17587181120622, -121.6879444908994 38.1821794169493, -121.7350806171162 38.18842560862485, -121.7821901201844 38.19464818602976, -121.8289374351079 38.2008033803675, -121.875497410779 38.20691448140832, -121.9218859632967 38.21298372468529, -121.9680833288035 38.21900871960997, -122.0140702787725 38.22498738060301, -122.0599206670441 38.23092929858424, -122.1059585738455 38.2368761405194, -122.1514735133781 38.24273717717463, -122.1979014546924 38.2486952346684, -122.244615989063 38.2546698823656, -122.286885062221 38.26006503505684, -122.3317752679495 38.26577302739613, -122.3775723820507 38.27157630911835, -122.42123453427 38.27709387365238, -122.3875484561343 38.44335751378058, -122.3549566790437 38.6091213367138, -122.3229758544996 38.77533736367074, -122.29313500149443 38.91965939725944, -122.2931986677531 38.91966733273354, -122.2925627865127 38.9224268526602, -122.2887701098792 38.94076971988311, -122.28834812101118 38.940717144457984, -122.2502498419884 39.10605141358776, -122.2157782644292 39.27170293253297, -122.1815283061143 39.43725346107452, -122.1472572267041 39.60305289383881, -122.1130639748912 39.76873358401883, -122.0675701389326 39.76315681176509, -122.0218481032378 39.75753305709504, -121.9760196548119 39.75187713956733, -121.929864512371 39.74616200405372, -121.8837690847976 39.74043466811828, -121.8374203210423 39.73465661582819, -121.791211744151 39.72887631552463, -121.7456899474469 39.72316180449544, -121.6988471023898 39.71726355714952, -121.6533751032039 39.71151676131318, -121.6061895206761 39.70553583833315, -121.5603292645533 39.69970149217903, -121.5127856827611 39.69363502046918, -121.4664710460075 39.68770372009153, -121.4210645773518 39.68186845835792, -121.3729669321757 39.67567034603585, -121.3268498223454 39.66970500286652, -121.275596174204 39.66305914356388, -121.23604272872647 39.6579045935206, -121.2244640164199 39.71534629800334, -121.1784594023133 39.70934267871426, -121.1276064970944 39.70268952197334, -121.0780739102677 39.69618461629537, -121.0267410574926 39.68942175169576, -120.975085191874 39.68259220041627, -120.9257537225777 39.67604419625462, -120.8710135065594 39.66875876119759, -120.8167165953291 39.66150454807043, -120.7705437611066 39.655305079238, -120.7176097793887 39.64818263591323, -120.6649687279217 39.64107360222791, -120.6114321199584 39.63381832569695, -120.5594923473139 39.62675237603518, -120.5017828883486 39.6188789551781, -120.4472491145715 39.6114071370957, -120.3883242038642 39.60330747049631, -120.3370092612197 39.59621997052633, -120.2813999384972 39.58851678688196, -120.2296104188867 39.58131287068803, -120.22944381151437 39.581289630071666, -120.2154569393103 39.63790533909514, -120.1742797139164 39.63216231050976, -120.1264443170872 39.62547816133655, -120.072273265767 39.61788967347653, -120.024290579522 39.6111395653885, -119.9754892816819 39.60425317248164, -119.9226048246936 39.5967696967055, -119.8731093519402 39.58973912438189, -119.8197276782546 39.58213470378855, -119.7699163707657 39.57501170734424, -119.7193222676103 39.56775386481531, -119.6698443969075 39.56063207891211, -119.6184971557052 39.5532188145865, -119.5676596282832 39.54585444187427, -119.5143635424045 39.53811032041745, -119.461759438467 39.53044018027278, -119.4139297776831 39.52343940206701, -119.356057273174 39.51494998815573, -119.3020700177219 39.50699916810786, -119.2442911438907 39.49846293635978, -119.1888385758543 39.49023910183713, -119.2300434137396 39.32442476692368, -119.2716392184819 39.15867317919636, -119.3174163145565 38.99367643664652, -119.3574470593102 38.82744683629423, -119.409616202118 38.66354573964197, -119.46623702603758 38.48339749975689, -119.501495001161 38.33326947583445, -119.5494293311593 38.16837794988868, -119.5779561966781 38.0008324836028, -119.6348456449869 38.00942356847073, -119.6879196360585 38.01741453952543, -119.7374828222481 38.0248563990352, -119.7896505275019 38.03266239553314, -119.8369373080383 38.0397205504928, -119.8846690370325 38.04682381711567, -119.9356320210271 38.05438160775212, -119.9856804211096 38.06178126103737, -120.0311350097279 38.06848591194525, -120.0809769358709 38.07581137535976, -120.1288388771053 38.08282613650103, -120.1786866033086 38.09010748671172, -120.2231158906922 38.09658324791623, -120.2668607950306 38.1029422520851, -120.3150668664364 38.10992452733352, -120.3589122145552 38.11626087708805, -120.4065289496206 38.12311818553922, -120.4536899639952 38.12988977175748, -120.48657862159999 38.134597931356474, -120.4983048166556 38.07766913680384, -120.5540463445464 38.0856371455415, -120.6068805405367 38.09316629131492, -120.6615251969388 38.10092445232182))",
          "epsg": "32610"
        })
          .pipe(
            map(wkt_response => {
              const wkt = wkt_response['wkt']
              const feature = this.wktService.wktToFeature(wkt, 'EPSG:3857');
              // const polygon = this.browseOverlayService.getPolygonFromFeature(feature, wkt);
              return { feature, browse: this.browseOverlayService.createNormalImageLayer(`http://127.0.0.1:8080/${this.itemsEndpoint}layers?file_name=${file}&layer=unwrapped_phase`, wkt, 'ol-layer', 'current-overlay') }
            }
              // this.browseOverlayService.createGeotiffLayer(response, wkt_response['wkt'], 'ol-layer', 'current-overlay')
            ),
            first(),
            tap(output => {
              output.browse.set('file', this.files[0]);

              // browseImageLayer.on('select', (_) => console.log(browseImageLayer.get('file')))
            })),
      )
    }

    return output
  }

  public getTimeSeries(geometry): Observable<any> {

    var format = new WKT();
    var wktRepresenation  = format.writeGeometry(geometry);
    let index_id = wktRepresenation;
    console.log(`getting ${index_id}`)
    if(this.cache.hasOwnProperty(index_id)) {
      return of(this.cache[index_id])
    } else {
      return this.http.post(`${this.url}${this.timeSeriesEndpoint}`, {
        "wkt": wktRepresenation,
        "file_store": "s3://kfbx-opera-disp-test-bucket/11114.json"
      }, { responseType: 'json' }).pipe(
        first(),
        map( response => {
          this.cache[index_id] = response;
          this.totalKeys.push(index_id)
          if(this.totalKeys.length > this.maxCacheSize) {
            let deleted = this.totalKeys.splice(0);
            delete this.cache[deleted[0]];
          }
          return response
      }
    ))
    }

  }
}