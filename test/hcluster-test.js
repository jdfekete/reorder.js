const reorder = require('../dist/reorder.cjs.js');

const vows = require('vows');
const assert = require('assert');

const suite = vows.describe('reorder.hcluster');

const VECTORS_3x1 = [[1], [2], [5]];
// prettier-ignore
const VECTORS_100x1 = [[0.0547415606866275],[0.22337630440539424],[0.48850003356886473],[0.6232005188564191],[0.4140400343943704],[0.05424463543400604],[0.5569084782869227],[0.14273067190295974],[0.553897160956835],[0.5103435720675393],[0.2896442736090634],[0.18740557482382236],[0.3959476950167984],[0.7469582509322195],[0.27969212736566207],[0.6459925612415998],[0.4393058506248899],[0.881157541986777],[0.42038714628852203],[0.6426319100686786],[0.22685992208222583],[0.6226187953494029],[0.4876953184889654],[0.04566906767091172],[0.9496282955870103],[0.2981150993056889],[0.4875724034396165],[0.1545460331554025],[0.49612404603986904],[0.8564144986094049],[0.9972383209812379],[0.016323939131595022],[0.18049118915606432],[0.8095837707397857],[0.3394293447798695],[0.7976878087815662],[0.7666551315093963],[0.8379301870960889],[0.24243273437797108],[0.6110840388045153],[0.21699650116595515],[0.16243034713313298],[0.05236968651498475],[0.6752961009312735],[0.613384632653347],[0.4697664126951415],[0.3602087169175201],[0.6599726139245008],[0.016998879900993913],[0.31941604494312026],[0.514129380700804],[0.5842888689573571],[0.23557307303508646],[0.38806745899870276],[0.9574179249168466],[0.7662808086816246],[0.04481354090116807],[0.29623311968967725],[0.7377489788636122],[0.5606554115940245],[0.9095418283498247],[0.45564080213890845],[0.1870338560882403],[0.2063022179454932],[0.25706355040833695],[0.28725638826889033],[0.9752408200550711],[0.1553381196657042],[0.345604124516633],[0.9338854032950847],[0.8291684850967682],[0.7817161024029928],[0.7183374966226694],[0.40239692897238877],[0.618261373895646],[0.7142807616009654],[0.053606765876353935],[0.40401361699154026],[0.614742155906778],[0.41296083644080483],[0.16914676113305727],[0.8552184813111612],[0.6397745993064545],[0.3238555396962075],[0.7943010602455018],[0.5083156952747812],[0.9083431521405856],[0.2523874240970676],[0.029704414103849164],[0.3924786017734816],[0.819248997769503],[0.779585891551712],[0.7344007092344351],[0.11172525912369191],[0.5144415065470409],[0.07964069177146027],[0.9187363967705569],[0.7376898841618738],[0.7318220048690909],[0.9244998596506617]];
// prettier-ignore
const VECTORS_250x4 = [[0.11101498181274083,0.526013657199041,0.32845327949030567,0.09504494579212497],[0.7406413489294705,0.6204899824629904,0.15541482183391575,0.13226671181710814],[0.040644174650567244,0.8875708321799136,0.5966102415322465,0.02954834518620264],[0.7904386918261759,0.5365428051753869,0.7567816389432558,0.08296172220878928],[0.018307663586130785,0.9940328523149591,0.8058847433879581,0.9703875521041712],[0.2578445021775069,0.6117775621612513,0.7926880216447918,0.265282879396759],[0.9478352645548851,0.6195285543034579,0.5910933292818608,0.2856578736111033],[0.08534083313441743,0.2690106742774532,0.9596229366379025,0.1824669389793936],[0.3459411280055842,0.17967538338906408,0.4562269457307835,0.8682076369705756],[0.9019520638677312,0.8520355088301999,0.7912266209994454,0.20102311852204524],[0.40127105976418687,0.4875444364741939,0.5848903133543737,0.9044720004310973],[0.9967123927064507,0.3507923192491653,0.37365328951798227,0.8408739348701313],[0.12918611334712615,0.07969711824017667,0.946741435285614,0.6670337081748836],[0.07532099440696438,0.8774114069907488,0.6214740783009429,0.2464917006960763],[0.08341702322736366,0.578488319339383,0.8031714320276964,0.24950711723970076],[0.8901143156070315,0.561037221751508,0.5233106508552743,0.533598364706332],[0.20825567480358265,0.7433047310928458,0.7374857924053069,0.6714324547794512],[0.20887471843521688,0.22526248134213556,0.20972147275885145,0.9046971702496116],[0.9535304485772169,0.8354508608476572,0.5946682364569005,0.6282896907278535],[0.48354116228253785,0.39124700390382605,0.9887860877215915,0.982663677318234],[0.09308136323466187,0.8412411487662774,0.20439660030490203,0.8243601545727048],[0.4865105877717548,0.1821570997767561,0.407975939268179,0.4768430277518154],[0.45328800678880943,0.4964548875857506,0.21892265811290956,0.6160660840578065],[0.7122410628524962,0.12131943783095034,0.006459076417269838,0.6186861399542025],[0.8927357771015165,0.18543461969416386,0.042113394107930135,0.32275932613831837],[0.6850724178500558,0.782883669096603,0.6803985578687675,0.555272806617503],[0.25870494646857356,0.015846464817077743,0.6273681999590472,0.9923423950672581],[0.351415041556578,0.3472036119173272,0.15613986874230878,0.8103301154540739],[0.5230137619315478,0.841877175990873,0.5656563950170392,0.9687149155470844],[0.3853300835901712,0.8660737615682967,0.5613733756573058,0.4062383426321341],[0.7060087160018507,0.9423180979072974,0.9443598633052759,0.2354486271434486],[0.4907544479460648,0.7056870410516332,0.3169376366554748,0.8166516072038972],[0.2845391970568647,0.5148772122505052,0.9568696319701959,0.7689962032732363],[0.5945198126645181,0.9990012214115689,0.37984013869208777,0.9719212531565862],[0.6092116842189625,0.07457881429071422,0.7419485100886545,0.30683241804041517],[0.4841787258912764,0.6255038480133901,0.015196185649403171,0.6364107137367332],[0.3776411719835735,0.34830052937581635,0.1030731368304183,0.6076909121342835],[0.567322977263679,0.3592266223203513,0.89533235877519,0.21643645021499003],[0.6199236274403073,0.19900507999882988,0.5868562208550192,0.3028682534095659],[0.4424929222798899,0.3392056720799834,0.005641001685447566,0.2534128536792606],[0.5346986992739828,0.05683967782674437,0.2853069079111825,0.44320955451048616],[0.6689158171684322,0.9639570920511893,0.2900964132133592,0.7009719684513003],[0.5772840282765679,0.1124725623250582,0.1810513294090328,0.32954566497826],[0.9654715718595774,0.275182711437435,0.9865513210343333,0.09165199731458018],[0.08560824304413295,0.5468292876065204,0.001817776996211995,0.04137164406200289],[0.4735944810619064,0.8249746116845913,0.5786419204328077,0.7625738997744633],[0.2468215712405175,0.4911492474715462,0.9968410421363385,0.29017255118369123],[0.3261408684882918,0.9999251248342709,0.013873301001731342,0.5455208382647516],[0.24791153863241466,0.8666788828824195,0.17083165471994222,0.006337638933655132],[0.45804695757088476,0.6245338820091244,0.6040151640830442,0.06385911493429997],[0.6015367596550871,0.7814840384095338,0.0015252016362039544,0.07708309397174862],[0.15718319820986815,0.03209247612122401,0.7934796713151808,0.6899986805909528],[0.024170934081824136,0.9988540751645427,0.7267461137535212,0.6388680814781591],[0.5865054799467566,0.20348966202821916,0.5247197320687054,0.8595464743130745],[0.12631326636080664,0.2661753559828204,0.7447190695709021,0.20958570579228342],[0.7690763845475106,0.9727226534186761,0.14511300285872464,0.5312719736892046],[0.7909404520689014,0.7890326434358632,0.7594575592935915,0.48234920992215913],[0.05694385967843085,0.5918837648012578,0.1929519960893864,0.459521988064042],[0.20092266409845916,0.5301192707726701,0.718430043753167,0.9468116472649655],[0.8256699549202602,0.7959644696555288,0.2776722160902112,0.8968583835686683],[0.6966067631029147,0.6304317669410211,0.6459049835923811,0.3076891056212654],[0.7160790398742207,0.9871048951296668,0.9034555762389411,0.05440450743353664],[0.40804404151332907,0.5950715531622421,0.5468683819578943,0.2173061538640204],[0.07286687892663046,0.40879384317783996,0.5813584247699382,0.006483911474352233],[0.67207255655321,0.09857531850947576,0.009188975867167715,0.37808590925896546],[0.16156128598263098,0.9238580042001125,0.770945191618303,0.6611277465178813],[0.9909561359317693,0.3156801481975886,0.9286613765938299,0.6074139057083008],[0.8911430327615524,0.7163398006173154,0.6539851371931094,0.3607983944618438],[0.5831056155453505,0.8245794894407996,0.10259692187927727,0.6783675425639679],[0.6491695725218671,0.5472659504141435,0.500634034222438,0.1849612162505574],[0.5399422819208219,0.8360415042383555,0.3186571275367942,0.4741090069636331],[0.9110921332357387,0.5769418495772152,0.053592737399171364,0.7979704524872437],[0.29576677562856135,0.40091978075085133,0.4814252062556854,0.34251061556786877],[0.1656264099110587,0.9294909910451659,0.2847527933491687,0.703324206689647],[0.7302211849150375,0.07913960266286146,0.981000105645288,0.06399214221359917],[0.8016245544207175,0.4976268569927982,0.5502636723930454,0.16081319496351965],[0.3787125074414255,0.44000437552361915,0.09624958455371657,0.19823209695564126],[0.8561358382997089,0.477699229433558,0.45073340181781263,0.9094984391665248],[0.6286325731089017,0.5628711991639945,0.11255349784566526,0.2118588364469003],[0.3117797846152157,0.42442048587374925,0.3111906558556228,0.24537755449616827],[0.24841991760225413,0.2626594614498894,0.4760383393009726,0.7909752058863262],[0.13146252279535386,0.6196359943039467,0.7794498766555236,0.14595073296978178],[0.2099491168779135,0.09141207091487846,0.15629172830697402,0.508788554630178],[0.841826735873686,0.9451138546225062,0.3097662223732014,0.3553012480469355],[0.04317380427649131,0.7980794448934758,0.05246541378007663,0.24493443946418658],[0.9643187248290417,0.8900429213830148,0.8772600840608968,0.8112141848077792],[0.22628534902906905,0.8712396814071808,0.13845293376664092,0.8689166365386705],[0.9741185923910249,0.4657247439448262,0.947098551352848,0.2724328939563865],[0.8341123323245674,0.9246265275911694,0.6250007866112928,0.46616592811710533],[0.6036543016668248,0.8848898482244907,0.907334394880533,0.5596613313733159],[0.554211725891977,0.707093562758379,0.905900343812031,0.8012363463366983],[0.10468175272535274,0.9558515713495477,0.3064260036030957,0.6481896784039256],[0.567432579986604,0.41925089059915877,0.4138131830706049,0.21873667336432367],[0.010304374947572637,0.4286406454176641,0.04828541132965358,0.9883378282621587],[0.6117774759237711,0.5548442525699984,0.3736428381820427,0.4288197441092263],[0.4990398053217029,0.9858018077715878,0.6752138357951687,0.07795527738125974],[0.6427799591971668,0.02436658054172547,0.6216945934991744,0.18356355647445954],[0.20247858858169065,0.12369847414286239,0.8697335658832432,0.8816379461187087],[0.4941132373277708,0.8506247131444389,0.7062990755892553,0.7761100138261365],[0.642709236111044,0.7026550554559234,0.9648563714754084,0.7293415061865134],[0.12594573830404032,0.6811638124843853,0.6541090203369171,0.8104668587506372],[0.7623462281778381,0.22687366152192578,0.23420760165026988,0.34506575470613843],[0.34463396463776874,0.6996791006276872,0.5515509288991776,0.7632858630911865],[0.6180917995218804,0.31682670688008563,0.9607068574119373,0.442877988118749],[0.781322157280393,0.7880904006976786,0.8380149413366453,0.7818733264588889],[0.29314212020051245,0.5034995096623085,0.1569390165446316,0.8736724217321044],[0.02578126690829108,0.038970210023707264,0.455786524249568,0.7719334032350145],[0.8849937113658053,0.2642314903043872,0.9551760357215091,0.275972836426676],[0.8762529280248323,0.7178282817911859,0.45581032486793394,0.5269190396796777],[0.682684226223127,0.3089781288170652,0.20681009682565676,0.46123243029405003],[0.08054475043241238,0.20179597341683086,0.2470233552349843,0.16164388040023847],[0.1668643042976834,0.6744243723550378,0.9188285382271519,0.8841378268729387],[0.009433632259465918,0.8148961293656862,0.7728703129933696,0.5765102537443156],[0.8593205873344034,0.4045586809430566,0.2967580517675721,0.047813788210858466],[0.3867217473557645,0.5025411767911288,0.8494879281474828,0.09053377013259412],[0.7358716066069144,0.37007247933507936,0.6582852948233073,0.66223959610307],[0.17011334491217278,0.9391562279357615,0.6209075772561046,0.514722934624962],[0.12011635468083104,0.384559392480061,0.3230427720106508,0.3744828026366849],[0.6925081890745257,0.9431418329038832,0.4501214515717076,0.6573850985911076],[0.9878466313578169,0.3920769919475726,0.7309546636592483,0.3554698844683104],[0.9044165646635303,0.8019923501575164,0.05358876637079346,0.20645796700169128],[0.6550143504328654,0.22609659031938678,0.41893958553852895,0.34964299731102133],[0.05545130211928595,0.40224387556626917,0.3831424763755993,0.8875341302950361],[0.2743783924327585,0.29365228775053986,0.18740786747470772,0.13312164263571047],[0.014051920947808272,0.8674262759798215,0.20064675006636,0.6661603785382371],[0.6539708668097426,0.5758969330020354,0.6686516549298342,0.6643923010355703],[0.6476286225727241,0.10609866164702098,0.8858495187685282,0.04171800019727612],[0.6968646468826865,0.9471232047022335,0.27598810508079974,0.6466878733418664],[0.3246625290323304,0.4610334041470956,0.09084417780626497,0.20339230696559274],[0.25737171000782877,0.26972319977033177,0.7687725723404615,0.543883090361299],[0.17366127832903921,0.07816227679153154,0.297292167517607,0.4443998531737332],[0.32643871675466984,0.693605491785068,0.4001944681841241,0.15827274294838545],[0.46970107722491083,0.07369926683719052,0.21831242600597367,0.9235032542274071],[0.04545877136596799,0.31009085880205944,0.3905507508792623,0.8757148742296352],[0.6797467683615561,0.6715121147084004,0.35053021140174434,0.05474189056535339],[0.8487164447917146,0.4131080799415048,0.6112915486915709,0.5124120072323222],[0.2950581707265596,0.8854646878466235,0.5736449044180612,0.5114854511470657],[0.5197764137897745,0.9906933282012809,0.9740930208064897,0.2705529041173531],[0.04223069121351086,0.4576322113463245,0.30493345203446554,0.6504206199726257],[0.13469467075404862,0.12063045525303484,0.7453137051016221,0.5032237921811051],[0.9207780163990531,0.6045764618009848,0.4170405993910071,0.8527507978927928],[0.27221059292972405,0.16768547383133514,0.10268383708117135,0.988540029948114],[0.3135691541827692,0.23798699012335622,0.5032910017712153,0.573535464195605],[0.08678925232981283,0.8773637285889955,0.30542716040003515,0.7256630768238836],[0.20955655086518044,0.6921772050312847,0.42345904230106357,0.14935481334619927],[0.18119017976560614,0.9815462767601202,0.04338155605273797,0.7438532478131699],[0.23371834244342904,0.12432272472144046,0.24024630781730205,0.6808113512140836],[0.519000540989728,0.8229527437243693,0.6749927973074188,0.3539836578998412],[0.153708555291737,0.89828104907494,0.9231156329585817,0.4715920021384745],[0.10377008397320098,0.19631854464241116,0.9340901113788527,0.9587609954475904],[0.14548900697095268,0.24549304628329938,0.6623267020807888,0.9370578818562574],[0.3317803230649292,0.7646722164015161,0.5522370461569839,0.055660158689528005],[0.07444746067342667,0.41398292258149505,0.49891400584030965,0.7444059442849815],[0.11679719240007347,0.27291547072411926,0.5926822198117341,0.10742852553047166],[0.006464308879977176,0.016316785496326425,0.6636197177723113,0.41641745312823364],[0.4792593390601638,0.4491781456594466,0.2070142313369696,0.3633630401578465],[0.48457802364785985,0.8461803168016178,0.17436761045430194,0.08555553939836491],[0.19027150140040572,0.6748113080742,0.7639990299375345,0.28603460193830066],[0.3719931643396712,0.4629919978429924,0.5776427659950858,0.09232127050369421],[0.6919111262021491,0.923099552665636,0.6533257934227346,0.41748418004135956],[0.7104182804432322,0.25187571313156965,0.761025335388477,0.2840592610013575],[0.5536916292411207,0.3200574614630516,0.9770558059423089,0.5651082077050005],[0.5254009869134002,0.9107742304954014,0.5107659014927894,0.8981984323355825],[0.09146898256478764,0.6958031955773989,0.5269112753036371,0.45634606483601203],[0.5462689967398631,0.5761995820994275,0.27868418351554136,0.1437023804170392],[0.27905394366519554,0.10995560866925724,0.386179354759544,0.1828410998936738],[0.7725700781830636,0.08359396384838624,0.10086432622054775,0.557202662416342],[0.3694195495425556,0.5944390632718237,0.9602700711317176,0.5337985630000757],[0.7083742358581349,0.9217163128969412,0.6293894051088718,0.3129004365476591],[0.9712910697042452,0.9346226789049068,0.14539327605884855,0.9138728545674979],[0.1273128894901676,0.8120861083744242,0.4943477595199359,0.822809861875621],[0.009651026845081345,0.8660754027889788,0.11349448690263175,0.4300402024193388],[0.01141756119363646,0.3077671687110346,0.5717240415855336,0.5675775175222457],[0.011004448754551754,0.19275303314128722,0.8139273989161302,0.46647055001657445],[0.28985654423613516,0.1912717882837165,0.7652702001718967,0.4099057446881309],[0.5614568166144918,0.40825194858092506,0.5645729860975182,0.5053570835652943],[0.5167947512026101,0.4142699759070727,0.7830780922495855,0.7184518676193767],[0.6686602629321652,0.17866268078432523,0.3972066506950205,0.23414319189653066],[0.6761830985885942,0.3191188310067177,0.6235909923130329,0.15247665769629526],[0.8930814694826803,0.5409901485954554,0.671208234989215,0.7475409055857571],[0.7439299425907502,0.9216754338086517,0.7926158455232954,0.2508435701846321],[0.764836822206306,0.1382348093175867,0.4801480296401388,0.4674526667867478],[0.7626507051701614,0.4723108767046691,0.5027672428415502,0.39635291242055315],[0.04224573777690854,0.9492144125260846,0.27129337068650505,0.3686838047262331],[0.3041954444756356,0.8344185082855036,0.7532148773631171,0.814640971720153],[0.58232873925141,0.999174681650367,0.38852918598426256,0.4086897317918299],[0.46862596092727604,0.552865692823002,0.6878993857627926,0.19166970835781627],[0.8024134991607113,0.20886251750153728,0.3661130246092785,0.10417037569875931],[0.8062145158024605,0.8340795046109237,0.4731703264470899,0.41877279038347837],[0.939509497298286,0.6785966409657913,0.13062268323007142,0.23940893332723756],[0.5700753395392479,0.47219024055938275,0.5342866637919803,0.5748976930234562],[0.2247474353689367,0.2650030746337537,0.029634891907635907,0.5041551316707462],[0.32470677308778106,0.2308660638915745,0.7692584604589652,0.32147165283025525],[0.28000710208136237,0.606816715904877,0.44093759921085307,0.34797247623978134],[0.2578877713259118,0.8223584636986041,0.658050086799074,0.9976162340319072],[0.9932901455874201,0.15284635408071323,0.9849745208913838,0.26864917565017166],[0.0025496148849724065,0.5346135854441334,0.0012144484583975768,0.5090140154880118],[0.3381976879126649,0.9169395260510649,0.9751788701644233,0.3437226139501759],[0.4519656737960851,0.13036668537385054,0.5832765111596581,0.7911055948272216],[0.232788251851761,0.20095560067475104,0.2949711398304067,0.8257643783428976],[0.9028397201450205,0.22521293809836362,0.7229934220985781,0.44944548036265],[0.37602659052187026,0.3372851931886167,0.8514645024599552,0.8075715606619567],[0.3075533332290268,0.5972203132223233,0.7894923818621016,0.4271465836319608],[0.470680102348469,0.25490526314835815,0.5071695712008826,0.16298507581386712],[0.42496511556675687,0.5089590285076713,0.7421857507401182,0.5769730415202012],[0.5761290477644643,0.4184353853764029,0.2005660288188129,0.7907423461599896],[0.8684970323883072,0.5141021719464078,0.06838885521598015,0.13580866942686387],[0.7053201830903031,0.41234695900559326,0.3467392352245424,0.11982121312931393],[0.8942359250576937,0.2861114384120027,0.397929165535553,0.4864356892197479],[0.8011135851491542,0.449406833676679,0.5258773828503343,0.060460684314583846],[0.7552961449817834,0.5549831689318747,0.7928960945926959,0.9301461777475921],[0.16841460017911936,0.7594324384872364,0.6488324773645502,0.9005029811317478],[0.11627463873210298,0.37550897681347206,0.6025752907864235,0.9000058304622045],[0.2480030373436175,0.11641833411354474,0.008847848023805671,0.5678723524003364],[0.015458412858747161,0.8261825149347426,0.03551024773548139,0.06359664786868824],[0.603979887350846,0.4877825928972972,0.10861182098725064,0.6238262619036334],[0.8011123283851624,0.4849612929408831,0.11166223029138012,0.1626637322332114],[0.7751079738897226,0.6816770142381197,0.5662846528414944,0.46203521277774207],[0.6546182935900662,0.7992477553362456,0.36209931584778143,0.08201414572183796],[0.3664635520485817,0.22863107345230027,0.8889331243812135,0.7375296828547389],[0.18993227917400612,0.4029776954413782,0.287509455427418,0.3381023966908594],[0.6557925608755264,0.8943793874233363,0.2538385409565713,0.0722901479099769],[0.49712993820465123,0.5648473488901131,0.6307669052107125,0.44588509377668983],[0.5001604945111569,0.9816025539279636,0.32657398695787854,0.8543222483215007],[0.04376870491739071,0.2447843473254847,0.4356691064719673,0.6893359279971785],[0.5309992246905897,0.4812730907641196,0.9489302701372271,0.6796331573961687],[0.44799318059615456,0.9752444210356537,0.8849169507441237,0.664561830928053],[0.2926032553686737,0.42284364112082096,0.979009015702458,0.7818196260963177],[0.7347554632541986,0.4946440507728731,0.008937210284371,0.9289856633321616],[0.45043034703965934,0.17882200486643396,0.5485483197947381,0.7942132255906307],[0.45221450411248076,0.9040502756730597,0.5910943215615572,0.48651863174947474],[0.4785041295158683,0.8665908403557256,0.4286374794840446,0.7872156472392715],[0.04327806046386273,0.3350835551297833,0.8264496984453875,0.07651514829922235],[0.8610113991582298,0.11044905508473923,0.25389879980274466,0.6321983325441427],[0.09351193478535191,0.12291463153238391,0.7127932007400197,0.40285799567788483],[0.0158102313660462,0.8677525208489019,0.7038549697147058,0.46127725956580923],[0.08983216657144255,0.13511231658038536,0.5153152605092577,0.0854633695520739],[0.1681224987860792,0.11830188363803384,0.4905877452477585,0.47765327692000215],[0.8956781488877721,0.8040885118910304,0.20381976512370503,0.77901163631762],[0.8668925979510755,0.2787814577456509,0.24940021588265093,0.5559112983001335],[0.896440664753704,0.09983091924300447,0.736402303196916,0.6479724649899252],[0.09193659523678832,0.4494197077108073,0.3179706585992197,0.6996033868973222],[0.9902541786406003,0.716467616123208,0.7949877388006397,0.6563838519628085],[0.21489707592965535,0.3334905851303851,0.9513753139503445,0.30566941600952324],[0.37362848334907817,0.4174347497670112,0.6263123253248091,0.9287187044026763],[0.11920455986288792,0.09276472264109614,0.02883876038438804,0.6312338939280042],[0.7705544697713329,0.25020314978411085,0.32713203061642804,0.42950912147757814],[0.9446812642783962,0.229365307177543,0.47491213071541005,0.6707759986522919],[0.21324967066857603,0.017597270026170175,0.17829860732699232,0.8117180945872515],[0.889597178358478,0.03863646349855898,0.46614976090008287,0.4870103607482448]];

suite.addBatch({
  single_3_values: {
    simple() {
      const hcluster = reorder
        .hcluster()
        .distance(reorder.distance.manhattan)
        .linkage('single');
      checkDistanceValues(hcluster(VECTORS_3x1), [1, 3]);
    },
  },
  complete_3_values: {
    simple() {
      const hcluster = reorder
        .hcluster()
        .distance(reorder.distance.manhattan)
        .linkage('complete');
      checkDistanceValues(hcluster(VECTORS_3x1), [1, 4]);
    },
  },
  average_3_values: {
    simple() {
      const hcluster = reorder
        .hcluster()
        .distance(reorder.distance.manhattan)
        .linkage('average');
      checkDistanceValues(hcluster(VECTORS_3x1), [1, 3.5]);
    },
  },
  single_3: {
    simple() {
      const hcluster = reorder.hcluster().linkage('single');
      checkParentChildDistanceRelationship(hcluster(VECTORS_3x1));
    },
  },
  complete_3: {
    simple() {
      const hcluster = reorder.hcluster().linkage('complete');
      checkParentChildDistanceRelationship(hcluster(VECTORS_3x1));
    },
  },
  average_3: {
    simple() {
      const hcluster = reorder.hcluster().linkage('average');
      checkParentChildDistanceRelationship(hcluster(VECTORS_3x1));
    },
  },
  single_100: {
    simple() {
      const hcluster = reorder.hcluster().linkage('single');
      checkParentChildDistanceRelationship(hcluster(VECTORS_100x1));
    },
  },
  complete_100: {
    simple() {
      const hcluster = reorder.hcluster().linkage('complete');
      checkParentChildDistanceRelationship(hcluster(VECTORS_100x1));
    },
  },
  average_100: {
    simple() {
      const hcluster = reorder.hcluster().linkage('average');
      checkParentChildDistanceRelationship(hcluster(VECTORS_100x1));
    },
  },
  single_250: {
    simple() {
      const hcluster = reorder.hcluster().linkage('single');
      checkParentChildDistanceRelationship(hcluster(VECTORS_250x4));
    },
  },
  complete_250: {
    simple() {
      const hcluster = reorder.hcluster().linkage('complete');
      checkParentChildDistanceRelationship(hcluster(VECTORS_250x4));
    },
  },
  average_250: {
    simple() {
      const hcluster = reorder.hcluster();
      hcluster.linkage('average');
      checkParentChildDistanceRelationship(hcluster(VECTORS_250x4));
    },
  },
});

function checkDistanceValues(root, expected) {
  const distances = [];
  traverse(root, (c) => {
    if (!isLeaf(c)) {
      distances.push(c.dist);
    }
  });
  distances.sort((a, b) => a - b); // ascending order
  assert.deepEqual(distances, expected);
}

function checkParentChildDistanceRelationship(root) {
  traverse(root, (c) => {
    if (c.left && c.dist < c.left.dist) {
      assert.fail('parent.dist < child.dist');
    }
    if (c.right && c.dist < c.right.dist) {
      assert.fail('parent.dist < child.dist');
    }
  });
}

function traverse(cluster, fn) {
  fn(cluster);
  if (cluster.left) {
    traverse(cluster.left, fn);
  }
  if (cluster.right) {
    traverse(cluster.right, fn);
  }
}

function isLeaf(cluster) {
  return cluster.left === null && cluster.right === null;
}

suite.export(module);
