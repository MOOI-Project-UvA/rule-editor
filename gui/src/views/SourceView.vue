<template>
  <q-card flat class="my-card q-ma-sm">
    <q-card-section>
      <search-form @showText="showText = true"></search-form>
    </q-card-section>
    <!-- controllers for the annotation part -->
    <q-card-section class="q-ml-md" v-if="showText">
      <annotation-tools></annotation-tools>
    </q-card-section>
    <!-- the retrieved legal text will be shown here -->
    <q-card-section v-if="showText">
      <q-list bordered class="rounded-borders q-pa-md">
        <q-expansion-item
          v-model="expanded"
          expand-icon-toggle
          switch-toggle-side
          expand-separator
          icon="mdi-book-search-outline"
          :label="legalText.title"
          :caption="legalText.docID"
          default-opened
        >
          <!-- <q-separator /> -->
          <q-card flat square class="q-ma-sm q-pa-sm" style="max-height: 80vh">
            <q-card-section class="q-pt-none">
              <annotation-component :document="legalText">
              </annotation-component>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script>
import AnnotationComponent from "../components/AnnotationComponent.vue";
import AnnotationTools from "../components/AnnotationTools.vue";
import searchForm from "../components/searchForm.vue";
export default {
  components: { searchForm, AnnotationComponent, AnnotationTools },
  data: () => ({
    showText: false,
    expanded: true,
    legalText: {
      docID: "BWBR0005730",
      title: "Circulaire van de Minister-President van 18 november 1992",
      text: ` <p>Hoofdstuk 1. Toepassingsbereik</p>
          <p>Aanwijzing 1.1. Reikwijdte</p>
          <p>Deze aanwijzingen hebben betrekking op regelingen die onder ministeriële verantwoordelijkheid tot stand komen, en, voor zover uitdrukkelijk aangegeven, op verdragen, bindende besluiten van instellingen van de Europese Unie en andere besluiten van volkenrechtelijke organisaties.</p>
          <p>Toelichting</p>
          <p>In deze aanwijzingen staan met name de wetgevingstechniek en de wetgevingskwaliteit centraal. Zie voor de meer procedurele en organisatorische aspecten van het wetgevingsproces het Draaiboek voor de regelgeving, te raadplegen op de website van het Kenniscentrum voor beleid en regelgeving (www.kcbr.nl). Het Draaiboek bevat ook de modelbrieven die behoren bij de verschillende fasen van het wetgevingsproces.</p>
          <p>Zie voor de toepasselijkheid van de aanwijzingen op internationale regelingen en bindende EU-rechtshandelingen de hoofdstukken 8 en 9. Zie met betrekking tot de voorbereiding, totstandkoming en nationale implementatie van Europese regelgeving ook de Handleiding Wetgeving en Europa, eveneens te raadplegen op de website van het Kenniscentrum.</p>
          <p>Aanwijzing 1.2. Aanwijzingen voor de rijksdienst</p>
          <ol>
            <li>Deze aanwijzingen worden in acht genomen door de ministers en staatssecretarissen en de onder hen ressorterende personen die bij de voorbereiding en vaststelling van regelingen zijn betrokken.</li>
            <li>Afwijking van deze aanwijzingen is slechts toegestaan, indien onverkorte toepassing daarvan uit een oogpunt van goede regelgeving niet tot aanvaardbare resultaten zou leiden.</li>
          </ol>
          <p>Toelichting</p>
          <p>Eerste lid. De aanwijzingen kunnen zich naar hun aard niet richten tot niet onder het gezag van ministers en staatssecretarissen werkzame participanten in het proces van regelgeving, zoals de Staten-Generaal, adviescolleges op het terrein van de wetgeving, zelfstandige bestuursorganen en decentrale overheden. De aanwijzingen kunnen deze organen dus niet binden. Niettemin verdient het aanbeveling dat de Staten-Generaal met de aanwijzingen rekening houden. Wat de Tweede Kamer betreft, verdient het aanbeveling dat op de aanwijzingen acht wordt geslagen bij het opstellen van amendementen en initiatiefvoorstellen van wet. Voor zover adviescolleges en zelfstandige bestuursorganen betrokken zijn bij de opstelling van regelingen of de advisering daarover, is het van belang dat rekening wordt gehouden met de aanwijzingen.</p>
          <p>Tweede lid. De aanwijzingen hebben voor de in het eerste lid genoemden bindende kracht. Er kunnen zich gevallen voordoen waarin toepassing van een aanwijzing uit het oogpunt van goede regelgeving niet tot aanvaardbare resultaten leidt. In dergelijke gevallen kan worden afgeweken van de aanwijzingen. Voor zover aanwijzingen elementen bevatten die reeds uit algemeen verbindende voorschriften voortvloeien, zal uiteraard van afwijking geen sprake kunnen zijn. Het is in het bijzonder de taak van de departementale wetgevingsafdelingen erop toe te zien dat van de mogelijkheid tot afwijking een terughoudend en gemotiveerd gebruik wordt gemaakt.</p>
          <p>Aanwijzing 1.3. Definities</p>
          <p>
            1.	Onder regelingen wordt in deze aanwijzingen verstaan:
                a.	algemeen verbindende voorschriften;
                b.	interne regels;
                c.	beleidsregels.
          </p>
          <p>
            2.	Onder EU-regelgeving wordt in deze aanwijzingen verstaan: door de instellingen van de Europese Unie of de Europese Gemeenschap voor Atoomenergie vastgestelde:
            	a.	verordeningen;
              b.	richtlijnen.
          </p>
          <p>3.	Onder bindende EU-rechtshandelingen wordt in deze aanwijzingen verstaan: door de instellingen van de Europese Unie of de Europese Gemeenschap voor Atoomenergie vastgestelde:</p>

<p>a.	verordeningen;
              b.	richtlijnen;
              c.	besluiten zonder vermelding van adressaten;
              d.	besluiten met vermelding van adressaten, voor zover mede tot Nederland gericht.</p>
          <p>Toelichting</p>
          <p>Eerste lid. Zie voor een nadere omlijning van deze begrippen aanwijzing 2.17 en titel 4.3 Awb. Aan interne regels en beleidsregels hoeft niet altijd de eis te worden gesteld dat zij ook wat betreft vormgeving het karakter van regelgeving hebben. Indien mogelijk dienen beleidsregels echter te worden ingedeeld in artikelen. Op beleidsregels in artikelvorm kunnen de op de vormgeving van regelingen betrekking hebbende aanwijzingen onverkort worden toegepast. Aanwijzingen van inhoudelijke aard, met name die betreffende het gebruik van regelgeving als instrument (paragraaf 2.1), kunnen op alle vormen van beleidsregels toepassing vinden. Bij interne regels zal de vormgeving in belangrijke mate afhangen van de doelgroep. Voor het reglement van orde voor de ministerraad ligt vormgeving als regelgeving meer voor de hand dan voor bijvoorbeeld gedragscodes voor alle geledingen van de rijksoverheid. In dat geval zal een minder formele vormgeving mogelijk meer aangewezen zijn.</p>
          <p>Tweede lid. Zie voor een nadere omlijning van deze begrippen artikel 288 VWEU. Onder deze benaming worden tevens verordeningen, richtlijnen en kaderbesluiten verstaan die tot stand zijn gekomen voorafgaand aan de inwerkingtreding van het Verdrag van Lissabon, alsmede verordeningen en richtlijnen vastgesteld op grond van artikel 106bis van het Euratomverdrag.</p>
          <p>Derde lid. Dit lid doelt op de juridisch bindende handelingen, genoemd in artikel 288 VWEU. Ook in dit geval kan het tevens gaan om juridisch bindende handelingen die zijn vastgesteld op grond van artikel 106bis van het Euratomverdrag. Door de toevoeging van ‘bindende’ aan ‘EU-rechtshandelingen’ worden de overige rechtsinstrumenten van artikel 288 VWEU uitgesloten.</p>
          <p>Het oude begrip ‘beschikking’ uit artikel 249 EG-Verdrag is met het Verdrag van Lissabon vervangen door ‘besluit’. Het vereiste van een concrete adressaat is daarbij vervallen. Het nieuwe besluitbegrip uit artikel 288 VWEU omvat twee typen rechtshandelingen: besluiten met adressaat die vooral gebruikt worden voor gevallen waarin onder het EG-verdrag beschikkingen golden, en besluiten zonder adressaat. Zie ook de Handleiding Wetgeving en Europa.</p>

          <p>Hoofdstuk 2. Algemene onderwerpen van regelgeving</p>
          <p>§ 2.1. Uitgangspunten voor het gebruik van regelgeving als instrument</p>
          <p>Aanwijzing 2.1. Keuze voor regelgeving</p>
          <p>Voor het normeren van gedragingen, handelingen of bevoegdheden worden algemeen verbindende voorschriften, interne regels of beleidsregels gebruikt.</p>
          <p>Toelichting</p>
          <p>De status van instrumenten als richtlijnen en circulaires is niet eenduidig en helder. Van gebruik van deze instrumenten voor normering dient dan ook zoveel mogelijk te worden afgezien. Circulaires worden alleen gebruikt voor het verstrekken van informatie, die overigens wel betrekking kan hebben op regelgeving.</p>
          <p>Aanwijzing 2.2. Noodzaak van regelgeving</p>
          <p>Tot het tot stand brengen van een regeling wordt alleen besloten indien de noodzaak daarvan is komen vast te staan.</p>
          <p>Toelichting</p>
          <p>Regelgeving is noodzakelijk indien aannemelijk is dat het concrete voorstel een effectieve, efficiënte en evenredige reactie vormt op het maatschappelijke probleem dat aanleiding geeft voor die regelgeving. Daarvoor is dus vereist dat voldoende zekerheid bestaat dat de voorgestelde regeling werkelijk zal leiden tot het oplossen of verminderen van dat probleem, dat er geen minder bezwarende alternatieven zijn, en dat de kosten en lasten daarvan gerechtvaardigd worden door de ernst van het probleem. Indien niet aan elke van deze voorwaarden is voldaan, bestaat onvoldoende grond om tot regelgeving (in de voorgenomen vorm) over te gaan. Eventueel kan in zo'n geval een alternatief, minder bezwarend sturingsinstrument worden ingezet, of dient simpelweg van overheidsingrijpen te worden afgezien.</p>
          <p>Zie met betrekking tot de toelichting bij de regeling ook aanwijzing 4.43, onderdeel b.</p>
          <p>Aanwijzing 2.3. Voorafgaand onderzoek</p>
          <p>Alvorens tot het tot stand brengen van een regeling wordt besloten, worden de volgende stappen gezet:
	a.	kennis wordt vergaard over de relevante feiten en omstandigheden met betrekking tot het bewuste onderwerp;
	b.	de doelen die moeten worden bereikt, worden zo concreet en nauwkeurig mogelijk vastgesteld;
	c.	onderzocht wordt of de doelen kunnen worden bereikt door middel van het zelfregulerend vermogen in de betrokken sector of sectoren, of dat daarvoor overheidsinterventie noodzakelijk is;
	d.	indien overheidsinterventie noodzakelijk is, wordt onderzocht of de gekozen doelen kunnen worden bereikt door aanpassing of beter gebruik van bestaande instrumenten dan wel, indien dit niet mogelijk blijkt, welke nieuwe instrumenten kunnen worden ingezet om de doelen te bereiken;
	e.	de diverse mogelijkheden worden zorgvuldig tegen elkaar afgewogen.
</p><p>
Toelichting</p>
<p>
Deze aanwijzing brengt tot uitdrukking dat keuzes voor regelgeving als sturingsinstrument, maar ook de keuzes die vervolgens met betrekking tot de inhoud en vormgeving van die regelgeving worden gemaakt, gebaseerd dienen te zijn op kennis van alle relevante factoren en op een gedegen analyse daarvan. Over deze keuzes wordt verantwoording afgelegd in de toelichting bij de regeling, zodat andere actoren in het proces (bijvoorbeeld adviesinstanties, het parlement en het publiek) in staat zijn zich een oordeel te vormen over het (voorgestelde) product. Verder heeft de toelichting op de gemaakte keuzes ook voor de rechtspraktijk een functie doordat deze toelichting behulpzaam kan zijn bij de interpretatie van de regeling (zie voor de eisen aan de toelichting ook paragraaf 4.9).</p>
<p>
Het Integraal afwegingskader voor beleid en regelgeving (IAK; te raadplegen op www.naarhetIAK.nl) heeft tot doel het afwegings- en verantwoordingsproces bij het formuleren van beleid en regelgeving te ondersteunen. Het kabinet heeft in 2011 beslist dat dit afwegingskader toegepast dient te worden bij de voorbereiding en verantwoording van beleid en regelgeving (Kamerstukken II 2010/11, 29515, nr. 330).</p>
<p>
Zie met betrekking tot de toelichting bij de regeling ook aanwijzing 4.43.</p>
<p>
Onderdeel a: kennis feiten en omstandigheden. Kennis van de relevante feiten en omstandigheden is noodzakelijk om tot een verantwoorde besluitvorming te kunnen komen. Allereerst moet de betrokken kennis worden gebruikt voor het formuleren van de doelen. Vervolgens is zij nodig voor de beantwoording van de vraag in hoeverre overheidsinterventie nodig is en voor de afweging van de verschillende mogelijkheden tot overheidsinterventie. Gewoonlijk vindt het verzamelen van de gegevens overigens gefaseerd plaats. Voor elke nieuwe stap in het besluitvormingsproces zijn veelal weer nieuwe (meer gedetailleerde) gegevens nodig.</p>
<p>
Onderdeel b: nauwkeurige doelstelling. Een zo concreet en nauwkeurig mogelijke vaststelling van doelen houdt in dat verschillende doelen duidelijk worden onderscheiden. Waar dat mogelijk en relevant is, dient ook te worden vastgesteld binnen welke termijn een doel bereikt moet zijn. Indien kwantificering, financieel of anderszins, van een doel mogelijk is, dient deze ook te geschieden.</p>
<p>
Onderdeel c: noodzaak overheidsinterventie. Slechts voor zover het zelfregulerend vermogen van de maatschappij tekortschiet, moet worden gedacht aan overheidsmaatregelen. Zie aanwijzing 2.5.</p>
<p>
Onderdeel d: alternatieven overheidsinterventie. Bij het onderzoek naar de mogelijkheden die de overheid ten dienste staan om een doel te bereiken, dienen de verschillende denkbare alternatieven de revue te passeren. Het gaat daarbij evenzeer om instrumenten die door middel van wetgeving worden gecreëerd (zoals geboden en verboden, een vergunningenstelsel en een heffingenstelsel) als om andere middelen (zoals feitelijk optreden van de overheid en subsidies). Overigens brengt het uitgangspunt van de rechtsstaat mee dat ten aanzien van deze andere middelen veelal ook wettelijke voorzieningen moeten worden getroffen, bijvoorbeeld in verband met het bieden van rechtswaarborgen.</p>
<p>
Het onderzoek naar de mogelijkheden tot overheidsinterventie kan ook tot de slotsom leiden dat de overheid de betrokken doelen niet kan realiseren. Dan behoort van overheidsinterventie te worden afgezien.</p>
<p>
Wat wettelijke regelingen betreft kunnen te onderzoeken varianten zowel betrekking hebben op de opzet van een wettelijke regeling als zodanig als op onderdelen van een regeling (bijvoorbeeld het systeem van rechtsbescherming waarvoor wordt gekozen).</p>
<p>
Het zal van de aard van het betrokken geval afhangen of de in deze aanwijzing bedoelde onderzoeken omvangrijk dienen te zijn of beperkt van aard kunnen blijven. Het is echter wel noodzakelijk dat de in deze aanwijzing bedoelde stappen worden gezet, indien het tot stand brengen van een regeling een van de mogelijkheden tot overheidsinterventie is.</p>
<p>
Aanwijzing 2.4. Terughoudendheid met toezeggingen</p>
<p>
Met het doen van uitspraken en toezeggingen over nieuwe regelingen wordt grote terughoudendheid betracht.</p>
<p>
Toelichting</p>
<p>
Om recht te doen aan het in de aanwijzingen 2.3 en 4.42 beschreven afwegings- en verantwoordingsproces moeten niet vooraf al bepaalde voorstellen worden gepresenteerd. Bovendien is het vaak niet of nauwelijks mogelijk daarvan terug te komen, ook niet wanneer daarvoor bij nader inzien goede redenen bestaan.</p>
<p>
Aanwijzing 2.5. Zelfregulering</p>
<p>
Bij het bepalen van de keuze voor een mogelijkheid tot overheidsinterventie om een doel te bereiken wordt zoveel mogelijk aangesloten bij het zelfregulerend vermogen in de maatschappij.</p>
<p>
Toelichting</p>
<p>
Uit de eisen van met name efficiëntie en evenredigheid vloeit voort dat voor direct overheidsingrijpen slechts plaats is indien van het zelfregulerend vermogen van de maatschappij – ook versterkt met ondersteunende overheidsmaatregelen – niet voldoende resultaten te verwachten zijn.</p>
<p>
Ook indien overheidsinterventie in enigerlei vorm noodzakelijk is, wordt zoveel mogelijk aangesloten bij bestaande vormen van zelfregulering. Daartoe wordt voor elk van de aspecten van regulering (te weten: normstelling, toezicht/informatieverzameling, oordeelsvorming en interventies/sanctionering) bezien of kan worden aangesloten bij bestaande zelfreguleringsmechanismen in de maatschappij.</p>
<p>
Een voorbeeld van aansluiten bij dergelijke mechanismen is het gebruik van normalisatie en certificatie. Bij of krachtens de wet kan bijvoorbeeld worden bepaald dat door het naleven van normalisatienormen of het bezit van een certificaat aan wettelijke eisen wordt voldaan of dat het wettelijk vermoeden ontstaat dat daaraan is voldaan (zie aanwijzing 3.48). Zie in dit verband ook de index beleidsinstrumenten in het IAK.</p>
<p>
Zie met betrekking tot de toelichting bij de regeling ook aanwijzing 4.43, onderdeel b.</p>
<p>
Aanwijzing 2.6. Duidelijkheid, eenvoud en bestendigheid</p>
<p>
Gestreefd wordt naar duidelijkheid en eenvoud van regelingen en naar een bestendig karakter daarvan.</p>
<p>
Toelichting</p>
<p>
Voor de beoordeling of regelgeving duidelijk en eenvoudig is, wordt mede acht geslagen op de eigenschappen van de doelgroep. Bij technische voorschriften die primair gericht zijn tot professionele normadressaten, is een ander woordgebruik aanvaardbaar dan bij gedragsvoorschriften die tot burgers in het algemeen zijn gericht.</p>
<p>
Een regeling is bestendig indien zij niet frequent hoeft te worden gewijzigd. Vanuit het oogpunt van rechtszekerheid verdient het aanbeveling naar zo groot mogelijke bestendigheid van regelingen te streven. Dit vereist ook dat op weloverwogen wijze de essentiële beleidsmatige keuzes gemaakt zijn alvorens tot het tot stand brengen van een regeling wordt overgegaan.</p>
</p>
<p>Aanwijzing 2.7. Handhaafbaarheid</p>
<p>
1.	Tot het tot stand brengen van een regeling wordt niet besloten dan nadat is nagegaan of in voldoende mate handhaving te realiseren valt.

2.	Hierbij wordt onderzocht of handhaving het beste langs bestuursrechtelijke, civielrechtelijke of strafrechtelijke weg dan wel op andere wijze kan plaatsvinden.
</p>
<p>
Toelichting</p>
<p>
Zie met betrekking tot de toelichting bij de regeling ook aanwijzing 4.43, onderdeel c.</p>
<p>
Eerste lid: handhavingsmogelijkheden. Voor het realiseren van een met een regeling beoogd doel moet indien nodig handhavend kunnen worden opgetreden. Of handhaving in voldoende mate mogelijk is, dient in dat geval te worden onderzocht voordat tot het tot stand brengen van de regeling wordt besloten. In het bijzonder geldt dit indien de regeling geboden of verboden bevat, maar ook in andere gevallen – bijvoorbeeld met betrekking tot voorschriften die aan een vergunning worden verbonden – is het handhavingsaspect van betekenis.</p>
<p>
Uit het onderzoek moet blijken welke inspanningen nodig zullen zijn voor de preventieve en repressieve handhaving van een regeling. Bij wetsvoorstellen die uit een oogpunt van uitvoering en handhaving ingrijpende veranderingen tot gevolg hebben, worden die bevindingen neergelegd in handhaafbaarheids- en uitvoerbaarheidstoetsen. Over de handhavingsmogelijkheden moet reeds voordat tot het tot stand brengen van de regeling wordt besloten worden overlegd met de instanties die met de uitvoering en handhaving van de regeling zullen worden belast.</p>
<p>
De volgende uitgangspunten zijn bij de beoordeling van de handhaafbaarheid in ieder geval van belang:
	–	een regel dient zo weinig mogelijk ruimte te laten voor interpretatiegeschillen;
	–	uitzonderingsbepalingen moeten tot een minimum worden beperkt;
	–	regels behoren zoveel mogelijk te zijn gericht op zichtbare dan wel objectief constateerbare feiten;
	–	regels dienen werkbaar te zijn voor degenen tot wie de regels zijn gericht en voor de personen die met handhaving zijn belast.
</p>
<p>
Zie in dit verband ook de instrumenten met betrekking tot de beoordeling van de handhaafbaarheid in onderdeel 7 (Wat zijn de gevolgen?) van het IAK.</p>
<p>
Bij het in deze aanwijzing bedoelde onderzoek dient niet alleen de theoretische handhaafbaarheid beoordeeld te worden, maar ook de feitelijke beschikbaarheid van de voor handhaving noodzakelijke middelen. Gelijktijdig met het besluit om tot regeling over te gaan moet besloten worden die middelen beschikbaar te stellen.</p>
<p>
Tweede lid: handhavingsmethoden. In dit verband moeten ook de verschillende handhavingsmethoden tegen elkaar worden afgewogen. Daarbij valt in de eerste plaats te denken aan bestuursrechtelijke, civielrechtelijke en strafrechtelijke middelen. Ook kan gedacht worden aan de mogelijkheden die het tuchtrecht biedt, en aan preventieve middelen zoals voorlichting. Voor elk van de repressieve handhavingsmethoden dient verder aandacht te worden besteed aan de mogelijke sancties. Bij de afweging van de verschillende mogelijkheden dienen de lasten die die keuze ten gevolge heeft voor samenleving en overheid in de overweging betrokken te worden. In bepaalde gevallen is het aangewezen niet voor één handhavingsmethode te kiezen maar voor een combinatie van verschillende methoden. Overigens dient ervoor te worden gezorgd dat niet zonder noodzaak wordt voorzien in een cumulatie van sanctiemogelijkheden voor de handhaving van één verplichting.</p>
<p>
Zie voor de keuze tussen strafrecht en bestuursrecht het nader rapport bestuurlijke boetestelsels van 26 april 2018 (Kamerstukken II 2017/18, 34 775-VI, nr. 102, en Stcrt. 2018, 31269), waarin wordt gereageerd op het ongevraagd advies van de Afdeling advisering van de Raad van State van 13 juli 2015 over de verhouding tussen de sanctiestelsels in het bestuursrecht en het strafrecht. Het nader rapport bevat in de eerste plaats algemene criteria die steeds een rol moeten spelen bij de vraag of gekozen moet worden voor bestuursrechtelijke of strafrechtelijke handhaving. Het betreft de context van de normovertreding, de feitelijke pakkans, de aard en zwaarte van de voorgenomen sanctie, het beoogde generaal en speciaal preventieve effect, financiële en organisatorische aspecten van sanctieoplegging en de vraag of internationaalrechtelijke of Unierechtelijke verplichtingen dwingend zijn voor een bepaalde keuze.</p>
<p>
Bij een voorgenomen keuze voor bestuursrechtelijke handhaving moet bijzondere aandacht uitgaan naar de toerusting en professionaliteit van het beoogde bestuursorgaan, de aard van de overtreding en de aanwezigheid van bijzondere expertise, als die voor de handhaving is vereist. Met name bij punitieve bestuursrechtelijke handhaving zijn ook artikel 47 van het Handvest van de grondrechten van de Europese Unie, artikel 6 EVRM en de artikelen 14 en 15 IVBPR van belang.</p>
<p>
Bij de keuze voor strafrechtelijke handhaving moet bijzondere aandacht uitgaan naar de ernst van de normovertreding, de vraag of vrijheidsbenemende sancties op hun plaats zijn en de eventuele wenselijkheid van bijzondere opsporingsbevoegdheden of strafvorderlijke dwangmiddelen. Bij handhaving van ordeningswetgeving door middel van het strafrecht moet worden afgewogen of toepassing van de Wet op de economische delicten moet plaatsvinden. Bij het voornemen tot strafrechtelijke sanctionering wordt ook nagegaan of de Wet justitiële en strafvorderlijke gegevens consequenties verbindt aan de strafbaarstelling. Een veroordeling kan leiden tot de verwerking van gegevens in de justitiële documentatie. Die gegevens worden in de regel betrokken bij besluitvorming over de aanvraag van een verklaring omtrent het gedrag. Zie verder ook paragraaf 5.10. Indien wordt gekozen voor strafrechtelijk te sanctioneren bepalingen, vereist de formulering van de elementen van de delictsomschrijvingen bijzonder veel zorg (zie ook aanwijzing 5.44). Hierover moet worden overlegd met het Ministerie van Justitie en Veiligheid of rechtstreeks met het openbaar ministerie.</p>
<p>
Aanwijzing 2.8. Conflictbeperking</p>
<p>
Een regeling wordt op zodanige wijze ingericht dat zij zo weinig mogelijk conflicten oproept. Daartoe wordt onder meer aan het volgende voldaan:
	a.	het aantal beslismomenten waartoe toepassing van de regeling aanleiding geeft, wordt tot een minimum beperkt;
	b.	ingeval bestuurlijke boetes mogelijk worden gemaakt, worden daarvoor bindende boetemaxima vastgesteld;
	c.	de aard en omvang van uitkeringen, voorzieningen en andere voordelen worden zo duidelijk mogelijk omschreven.
</p><p>
Toelichting</p>
<p>
Noodzaak conflictbeperking. Tot op zekere hoogte is het onvermijdelijk dat regelingen waarbij aan de burger lasten worden opgelegd of die hem aanspraak geven op bepaalde voordelen, aanleiding geven tot conflicten. Het is echter gewenst dat de kans op conflicten tot een minimum wordt beperkt. Allereerst vanuit een sociaal-maatschappelijk oogpunt, maar ook om de lasten die verbonden zijn aan de rechtsbescherming ter zake van de toepassing van de regeling, zo laag mogelijk te houden. Gelet hierop dient bij de keuze uit varianten van een regeling ook de mate waarin over de toepassing daarvan conflicten zijn te verwachten, in beschouwing te worden genomen.</p>
<p>
Conflictopwekkende factoren. Regelingen zijn in bijzondere mate conflictopwekkend indien zij een van de volgende kenmerken vertonen:
	−.	het verkrijgen van een uitkering, een voorziening, een restitutie of een ander voordeel wordt afhankelijk gesteld van individueel bepaalde omstandigheden zoals het hebben van een ziekte of gebrek dan wel het zijn van ondernemer;
	−.	belanghebbenden worden met een reeks van beschikkingen geconfronteerd;
	−.	aan een uitvoeringsorgaan wordt een ruime mate van discretionaire bevoegdheid gelaten;
	−.	voor het bepalen van de hoogte van een uitkering of van de aard van een voordeel worden slechts vage normen gesteld;
	−.	het verkrijgen van een uitkering of van een voordeel dan wel de verplichting om belasting of een heffing te betalen wordt bepaald door een groot aantal persoonlijke omstandigheden waarvan moet blijken uit door het uitvoeringsorgaan te verifiëren gegevens die de betrokkene verstrekt;
	−.	er worden voordelen of andere gevolgen verbonden aan bijzondere, niet strikt omschreven omstandigheden;
	−.	de besluitvorming omtrent het toekennen van uitkeringen of andere voordelen vindt plaats nadat andere organen dan de met de besluitvorming belaste instantie een extern advies hebben uitgebracht dat aan betrokkene bekend wordt gemaakt, maar waarvan de met de besluitvorming belaste instantie nog mag afwijken;
	−.	er worden gunstige besluiten met een voorlopig karakter genomen, die worden gevolgd door minder gunstige;
	−.	aan een orgaan dat bevoegd wordt verklaard tot het opleggen van bestuurlijke sancties, worden ruime grenzen gelaten om de aard en de omvang van de sancties te bepalen;
	−.	ontwikkelingen in vele uiteenlopende en betrekkelijk smalle sectoren van het maatschappelijk leven worden door middel van een financieel instrument overmatig gestuurd;
	−.	doelgroepen worden onduidelijk afgebakend.
</p>
Zie met betrekking tot de toelichting bij de regeling ook aanwijzing 4.43, onderdeel c.</p>
<p>
Aanwijzing 2.9. Neveneffecten</p>
<p>
Bij het opstellen van een regeling wordt tevens bezien welke neveneffecten op bestaande of voorgenomen regelgeving of beleidsvelden kunnen optreden en welke consequenties dit dient te hebben voor het voorstel.</p>
<p>
Toelichting</p>
<p>
De opsteller van een regeling draagt de verantwoordelijkheid om, waar nodig in overleg met andere betrokken actoren, zich een zo volledig mogelijk beeld te vormen over de feitelijke en juridische neveneffecten van die regeling en om te bezien tot welke consequenties die bevindingen aanleiding geven.</p>
<p>
Ter beantwoording van de vraag welke regelingen geraakt worden door het voorstel wordt in ieder geval, door raadpleging van de wetstechnische informatie in het Basiswettenbestand op www.wetten.nl, bezien welke regelingen gebaseerd zijn op, of verwijzen naar de door het voorstel geraakte bepalingen. Ook moet gedacht worden aan Europese regelgeving, indien de geraakte regelingen ooit zijn gemaakt of aangewezen als implementatiemiddel daarvan. Verder wordt rekening gehouden met gelijktijdig in ontwikkeling zijnde voorstellen voor regelgeving.</p>
<p>
Is er sprake van een beoogd neveneffect, dan is een (secundair) doel van het voorstel in het geding. Deze dient dan ook als zodanig te worden aangewezen. Bij onbedoelde neveneffecten moet worden bezien in hoeverre deze de aanvaardbaarheid van een regeling negatief beïnvloeden. Negatieve beïnvloeding kan aanleiding zijn van een regeling af te zien. Anderzijds dient slechts tot het tot stand brengen van een regeling te worden besloten indien zij geschikt lijkt de gekozen doelen te realiseren. Er is sprake van een onzuivere afweging indien positieve maar onbedoelde neveneffecten de doorslag zouden geven om een regeling in te voeren die niet adequaat lijkt voor het verwezenlijken van de gekozen doelen.</p>
<p>
Welke de negatieve neveneffecten van een regeling zullen zijn, moet steeds in breed verband worden onderzocht. Aandacht verdient daarbij onder meer in hoeverre een maatregel van verstorende invloed zal zijn op het effect dat bestaande regelingen hebben. De werking van een regeling kan worden verstoord doordat een nieuwe regeling het voor de justitiabele minder aantrekkelijk of eenvoudig maakt aan eerstbedoelde regeling te voldoen. Voorts kan een nieuwe regeling naast reeds bestaande regelingen tot gevolg hebben dat een zodanige cumulatie van verplichtingen ontstaat dat de bereidheid tot naleving afneemt.</p>
<p>
Zie met betrekking tot de toelichting bij de regeling ook aanwijzing 4.43, onderdeel b.</p>
<p>
Aanwijzing 2.10. Lasten voor de maatschappij en de overheid

1.	Bij de keuzes met betrekking tot vorm en inhoud van een regeling wordt gestreefd naar zo beperkt mogelijke lasten voor burgers, bedrijven en instellingen, alsmede voor de overheid zelf.

2.	Tevens wordt rekening gehouden met het doenvermogen van degenen die geraakt worden door de regeling.

3.	Bij het ontwerpen van een regeling wordt mede rekening gehouden met de uitvoerbaarheid daarvan, in het bijzonder wat betreft de aanpassing of ontwikkeling van de voor de uitvoering vereiste ICT-systemen.
</p><p>
Toelichting</p>
<p>
Eerste lid.</p>
<p>
Deze aanwijzing staat niet in de weg aan het opleggen van lasten daar waar dat een bewust geaccepteerde, noodzakelijke consequentie is van het gekozen sturingsinstrument. Wel moet zoveel mogelijk voorkomen worden dat lasten worden opgelegd die niet bijdragen aan het bereiken van het doel van de regeling, of indien alternatieven bestaan waarmee hetzelfde resultaat op lastenluwere wijze bereikt kan worden. Bij het maken van een keuze tussen verschillende varianten voor een regeling kan het noodzakelijk zijn de lasten voor de overheid af te wegen tegen de lasten voor de maatschappij. De lasten voor de maatschappij bestaan uit financiële lasten die het gevolg zijn van een verplichting om bijvoorbeeld een geldbedrag over te maken aan de overheid of het bevoegd gezag (zoals belastingen, retributies, premies, leges, boetes en heffingen) en uit regeldrukkosten.</p>

<p>Regeldrukkosten zijn alle investeringen en inspanningen die burgers, bedrijven of professionals moeten doen of verrichten om te voldoen aan verplichtingen uit regelgeving afkomstig van de rijksoverheid, uitgedrukt in euro’s. Het gaat hierbij om kosten die voortvloeien uit informatieverplichtingen en inhoudelijke verplichtingen, waaronder toezichtgerelateerde verplichtingen op basis van regelgeving. De kosten kunnen worden verdeeld in eenmalige en structurele kosten; de verdeling tussen administratieve lasten en nalevingskosten is vervallen. Zie voor de wijze waarop deze lasten vastgesteld en gekwantificeerd dienen te worden onderdeel 7 (Wat zijn de gevolgen?) van het IAK. Zie ook aanwijzing 9.5 over lastenluwe implementatie.</p>

<p>Bij lasten voor de maatschappij moet worden gedacht aan:
	a.	inhoudelijke nalevingskosten;
	b.	administratieve lasten.
</p>
<p>Zie voor de wijze waarop deze lasten vastgesteld en gekwantificeerd dienen te worden onderdeel 7 (Wat zijn de gevolgen?) van het IAK. Zie ook aanwijzing 9.5 over lastenluwe implementatie.
</p>
<p>Bij lasten voor de overheid kan worden gedacht aan:
	a.	lasten die rechtstreeks zijn gemoeid met de uitvoering van de regeling, zoals voorlichting, het behandelen van aanvragen voor vergunningen en ontheffingen, de inning van belastingen en heffingen en de uitvoering van in de regeling voorgeschreven feitelijke handelingen;
	b.	lasten die voortvloeien uit in de regeling vervatte procedurele voorschriften, zoals voorschriften inzake verplichte advisering, inspraak, vormen van preventief toezicht, planning, verslagleggingsverplichtingen en evaluatieverplichtingen;
	c.	lasten die verband houden met het toezicht op de naleving en met de handhaving van de regeling (wat de handhaving betreft gaat het om lasten in verband met onder meer de van overheidswege gefinancierde rechtshulp, het openbaar ministerie, de politie, het gevangeniswezen, andere justitiële diensten en de rechtspraak);
	d.	lasten die voortvloeien uit de rechtsbescherming, zoals lasten in verband met de van overheidswege gefinancierde rechtshulp, met de behandeling van bezwaarschriften en met de rechtspraak en lasten voor uitvoerende instanties als gevolg van procedures.
</p>
<p>Om zicht te krijgen op deze lasten en de consequenties daarvan voor de organisatie is het noodzakelijk om in ieder geval bij ingrijpende voorstellen tijdig een uitvoeringstoets te laten plaatsvinden.
</p>
<p>De onder b bedoelde lasten voor de overheid kunnen onder meer worden beperkt door te streven naar soberheid in procedurele voorschriften en naar een duidelijke toedeling en afbakening van bestuurlijke bevoegdheden zowel op centraal als op decentraal niveau. Bij toedeling van bevoegdheden aan decentraal niveau worden met name bemoeienis van hoger niveau met de uitoefening van deze bevoegdheden (bijvoorbeeld preventief toezicht) en verplichtingen van het decentrale niveau jegens hoger niveau ter zake (bijvoorbeeld verplichte verslaglegging) zoveel mogelijk vermeden. Zie voor nadere informatie over lasten voor de overheid onderdeel 7 (Gevolgen voor de overheid) van het IAK.
</p>
<p>Het brengen van meer doelen binnen één regeling kan de uitvoering van die regeling ingewikkelder maken en daarmee de voor de overheid met die regeling gemoeide lasten doen toenemen. Aan de andere kant zal het voor de burger vaak belastender zijn om met diverse, naast elkaar werkende regelingen te worden geconfronteerd dan met één geïntegreerde regeling. Zie ook aanwijzing 2.34.
</p>
<p>Zie met betrekking tot de toelichting bij een regeling aanwijzing 4.43, onderdeel e, en aanwijzing 4.45. Zie voor de toetsing op regeldruk aanwijzing 7.5a.
</p>
<p>Tweede lid.</p><p>Bij de keuzes met betrekking tot vorm en inhoud van een regeling wordt ook rekening gehouden met het doenvermogen van degenen die erdoor worden geraakt. Hiertoe is besloten in de kabinetsreactie op het rapport ‘Weten is nog geen doen: Een realistisch perspectief op redzaamheid’ van de Wetenschappelijke raad voor het regeringsbeleid (WRR) (Kamerstukken II 2017/18, 34 775-VI, nr. 88). Doenvermogen wordt daar aangeduid als het in staat zijn om een plan te maken, in actie te komen, vol te houden en het (herhaaldelijk) om te kunnen gaan met verleidingen en tegenslagen. Veel mensen zijn daar slechts beperkt toe in staat. Het gaat daarbij niet alleen om ‘kwetsbare’ groepen, zoals laaggeletterden en mensen met een laag IQ, maar ook om mensen met een goede opleiding en een goede maatschappelijke positie. De overheid moet bij de ontwikkeling van beleid en regelgeving uitgaan van realistische aannames over de mentale belastbaarheid van burgers en daarbij (meer) gebruik maken van gedragswetenschappelijke inzichten. Onderdeel daarvan is het vooraf toetsen of een regeling ‘doenlijk’ is (de doenvermogentoets) en zo nodig maatregelen nemen om ervoor te zorgen dat aangesloten wordt bij het doenvermogen. Bij het bepalen van het doenvermogen gaat het onder andere om de mentale belasting van mensen, de cumulatie van lasten, de gevolgen van inertie of fouten en de mate waarin wordt voorzien in vroegsignalering en een toegankelijke frontoffice. Het begrip doenvermogen uit het WRR-rapport is weliswaar gericht op burgers, maar het kabinet past het ook toe op zzp’ers en het (kleine) mkb (Kamerstukken II 2017/18, 32 637, nr. 314). Zie voor meer informatie over doenvermogen, de doenvermogentoets en het toepassen van gedragsinzichten de verplichte kwaliteitseis Doenvermogen in het IAK.
</p>
<p>Zie met betrekking tot de toelichting bij de regeling ook aanwijzing 4.43, onderdelen e en f.
</p>
<p>Derde lid. Bij het ontwerpen van een regeling is het noodzakelijk de consequenties van de ontwerpkeuzes die daarbij worden gemaakt te bezien vanuit het perspectief van de uitvoerbaarheid. Dat geldt in het bijzonder bij regelingen waarvan de uitvoering in belangrijke mate leunt op ICT-systemen. In zo’n geval is een vroegtijdige afstemming tussen de ontwerpers van de regeling en die van de systemen wenselijk om de uitvoerbaarheid in de praktijk te kunnen garanderen. Zie ook aanwijzing 7.5b.
</p>
<p>Aanwijzing 2.11. Evenredigheid
</p>
<p>De voor een of meer belanghebbenden nadelige gevolgen van een voorgenomen regeling mogen niet onevenredig zijn in verhouding tot de daarmee te dienen doelen.
</p>
<p>Toelichting
</p>
<p>Ook wanneer geen minder bezwarende, even effectieve alternatieven worden gezien voor de voorgenomen regeling dient de vraag gesteld te worden of de ernst en omvang van het probleem de lasten en negatieve consequenties kunnen rechtvaardigen die de voorgenomen regeling in het leven zou roepen. Dit is met name een punt van aandacht bij regelgeving die als directe reactie op een incident wordt voorgesteld, omdat op dat moment nog niet altijd voldoende kennis bestaat over de objectieve noodzaak en redelijkheid van de voorgestelde maatregel.
</p>
<p>Deze aanwijzing correspondeert met artikel 3:4, tweede lid, Awb.
</p>
<p>Aanwijzing 2.12. Overige kwaliteitseisen
</p>
<p>Bij het opstellen van een regeling wordt rekening gehouden met de overige relevante eisen en voorwaarden die deel uitmaken van het kabinetsbeleid inzake regelgeving.
</p>
<p>Toelichting
</p>
<p>De in de aanwijzingen 2.5 tot en met 2.11 neerlegde inhoudelijke kwaliteitseisen hebben een algemeen karakter en zijn daarom in beginsel bij iedere vorm van regelgeving relevant. Naast de in die aanwijzingen neergelegde eisen gelden ook nog eisen met een meer specifiek karakter, die slechts in bepaalde gevallen relevant zijn of enkel toepasselijk zijn binnen bepaalde maatschappelijke sectoren of beleidsvelden. Deze eisen zijn elders in de aanwijzingen neergelegd of zijn te vinden in het onderdeel verplichte kwaliteitseisen binnen het IAK, en maken daarmee deel uit van het geheel aan eisen waarop acht geslagen moet worden bij het opstellen van regelgeving.
</p>
<p>Zie met betrekking tot de toelichting bij de regeling ook aanwijzing 4.43, onderdeel m.
</p>
<p>Aanwijzing 2.13. Keuze voor decentralisatie
</p>
<p>Taken en bevoegdheden worden op decentraal niveau gelegd, tenzij het onderwerp van zorg niet op doelmatige en doeltreffende wijze door decentrale organen kan worden behartigd.
</p>
<p>Toelichting
</p>
<p>Territoriale decentralisatie. Als uitgangspunt geldt dat, indien taken op doelmatige en doeltreffende wijze kunnen worden verricht door besturen van provincies, gemeenten, waterschappen of de openbare lichamen Bonaire, Sint Eustatius en Saba, zij niet behoren te worden opgedragen aan het Rijk. Evenmin behoren taken die op doelmatige en doeltreffende wijze door besturen van gemeenten of waterschappen kunnen worden verricht, te worden opgedragen aan de besturen van provincies. Zie ook de aanwijzingen 5.23 en 5.24.
</p>
<p>Algemeen of functioneel bestuur. Steeds zal een keuze gemaakt moeten worden tussen territoriale of functionele decentralisatie. Uitgangspunt is dat het zwaartepunt van de politieke en bestuurlijke activiteit berust bij organen van algemeen bestuur (Rijk, provincies, gemeenten en de openbare lichamen Bonaire, Sint Eustatius en Saba). Functioneel bestuur kan onder omstandigheden een goede aanvulling bieden op het algemeen bestuur, bijvoorbeeld gezien de aard van de betrokken taak of de schaal waarop deze behartigd dient te worden. Zie inzake organen van functioneel bestuur (zelfstandige bestuursorganen) paragraaf 5.4 van deze aanwijzingen.
</p>
<p>Beleidsvrijheid voor provincies en gemeenten. Nederland is een gedecentraliseerde eenheidsstaat. Provincies en gemeenten vormen als decentrale bestuurslagen van algemeen bestuur met een rechtstreekse democratische legitimatie, een open huishouding, regelgevende bevoegdheid en een eigen belastinggebied, samen met het Rijk de bestuurlijke hoofdstructuur van ons land. Binnen de bestuurlijke hoofdstructuur dient het zwaartepunt van de publieke taakuitoefening te liggen. Provincies en gemeenten zijn niet hiërarchisch ondergeschikt aan het Rijk, maar voeren hun taken zelfstandig uit binnen de kaders van de wet en de Grondwet. Zij hebben autonome bevoegdheden, maar kunnen ook bij wet worden verplicht bepaalde taken uit te voeren (medebewind). De Gemeentewet (artikel 116, eerste lid) en de Provinciewet (artikel 114, eerste lid) dragen de Minister van Binnenlandse Zaken en Koninkrijksrelaties op om beleidsvrijheid te bevorderen. Dankzij beleidsvrijheid kunnen deze decentrale overheden democratisch gelegitimeerd en rekening houdend met de plaatselijke omstandigheden komen tot een goede afweging om beleid doelmatig en doeltreffend in te vullen.
</p>
<p>Zie met betrekking tot de toelichting bij de regeling ook aanwijzing 4.43, onderdeel h.
</p>
<p>Aanwijzing 2.14. Normering bestuursbevoegdheden

1.	Bij de toekenning van bestuursbevoegdheden wordt de uitoefening daarvan zoveel mogelijk genormeerd.

2.	Met het oog hierop worden discretionaire bevoegdheden en bevoegdheden met vage toepassingscriteria niet toegekend, tenzij daarvoor goede gronden zijn.
</p>
<p>Toelichting
</p>
<p>Teneinde de burger voldoende rechtswaarborgen te bieden, behoren bestuursbevoegdheden zo nauwkeurig mogelijk wettelijk te worden ingekaderd. Dit geldt evenzeer voor bestuursinstrumenten die de overheid op zich ook zonder wettelijke grondslag zou kunnen hanteren (bijvoorbeeld het verlenen van incidentele subsidies). Zie ook aanwijzing 2.8.
</p>
<p>Met het oog op de wenselijkheid rechtswaarborgen te bieden, dient ook ten aanzien van elke bevoegdheid te worden bezien in welke mate rechtsbescherming noodzakelijk is. Daarbij geldt als uitgangspunt het in de Algemene wet bestuursrecht neergelegde stelsel van rechtsbescherming. Zie verder paragraaf 5.11.
</p>
<p>Aanwijzing 2.15. Verenigbaarheid met hoger recht
</p>
Bij het opstellen van een regeling wordt onderzocht welke hogere regels de vrijheid van regeling ten aanzien van het betrokken onderwerp hebben ingeperkt.
</p>
<p><p>Toelichting
</p>
<p>Bij hogere regels kan het gaan om internationale regelingen of bindende EU-rechtshandelingen, het Statuut, grondwettelijke voorschriften, rechtsbeginselen en – bij regelingen die worden vastgesteld bij algemene maatregel van bestuur of ministeriële regeling – regels die zijn neergelegd in een wet in formele zin. Wat de internationale regels betreft valt in het bijzonder te denken aan het EVRM, het Handvest van de grondrechten van de Europese Unie en het IVBPR. Wat EU-regelgeving en andere regelgeving betreft valt, behalve aan richtlijnen, verordeningen en besluiten, te denken aan algemene leerstukken als het burgerschap van de Europese Unie, het vrije verkeer van goederen, personen, diensten en kapitaal, gegevensbescherming en de Europese mededingingsregels. Op het terrein van diensten kan in het bijzonder gedacht worden aan de Dienstenrichtlijn: Richtlijn 2006/123/EG van het Europees Parlement en de Raad van 12 december 2006 betreffende diensten op de interne markt (PbEU 2006, L 376). Zie ook de aanwijzingen 5.29 en 5.30. Voor wat betreft de gegevensbescherming wordt gewezen op Verordening (EU) 2016/679 van het Europees Parlement en de Raad van 27 april 2016 betreffende de bescherming van natuurlijke personen in verband met de verwerking van persoonsgegevens en betreffende het vrije verkeer van die gegevens en tot intrekking van Richtlijn 95/46/EG (algemene verordening gegevensbescherming) (PbEU 2016, 119). Zie ook de aanwijzingen 5.33 en 5.34.
</p>
<p>Wat betreft artikel 1 van de Grondwet wordt erop gewezen dat de in dat artikel opgenomen zinsnede ‘op welke grond dan ook’ uitdrukt dat ook ongerechtvaardigd onderscheid op andere gronden dan de in het artikel expliciet genoemde – bijvoorbeeld leeftijd of handicap – verboden is. Voor de onderscheidingsgrond ‘leeftijd’ geldt bovendien dat ook de hoogte van de leeftijdsgrens geen ongerechtvaardigd onderscheid tot gevolg mag hebben.
</p>
<p>Van de rechtsbeginselen kunnen met name worden genoemd het rechtszekerheidsbeginsel, het gelijkheidsbeginsel en het evenredigheidsbeginsel.
</p>
<p>Wat de regels aangaat die zijn neergelegd in een wet, dient niet alleen te worden gelet op de wet waarop de betrokken algemene maatregel van bestuur of ministeriële regeling berust, maar ook op andere wetten.
</p>
<p>Zie ook onderdeel 6.2.1 (Aansluiting op Grondwet en hoger recht) van het IAK. Zie met betrekking tot de toelichting bij de regeling aanwijzing 4.43, onderdeel g.
 </p>`,
    },
  }),
  methods: {},
};
</script>

<style lang="css" scoped></style>
