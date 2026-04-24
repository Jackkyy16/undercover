
import './index.css'
import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Trash2, Eye, EyeOff, Play, Skull, Crown, AlertCircle, RefreshCw, ChevronRight } from 'lucide-react';



// --- DIZIONARIO PAROLE ---
// --- DIZIONARIO PAROLE AGGIORNATO ---
const wordPairs = [
  // CIBO E BEVANDE (Esistenti)
  ['Pizza', 'Pasta'], ['Hamburger', 'Hotdog'], ['Gelato', 'Sorbetto'], ['Vino', 'Birra'],
  ['Zucchero', 'Sale'], ['Burro', 'Margarina'], ['Caffè', 'Tè'], ['Arancia', 'Mandarino'],
  ['Mela', 'Pera'], ['Biscotto', 'Pasticcino'], ['Pane', 'Focaccia'], ['Sushi', 'Sashimi'],
  ['Ketchup', 'Maionese'], ['Coca Cola', 'Pepsi'], ['Latte', 'Panna'], ['Riso', 'Farro'],
  ['Prosciutto', 'Salame'], ['Parmigiano', 'Pecorino'], ['Pesca', 'Albicocca'], ['Anguria', 'Melone'],
  ['Patatine', 'Popcorn'], ['Torta', 'Crostata'], ['Nutella', 'Marmellata'], ['Acqua', 'Seltz'],
  ['Pollo', 'Tacchino'], ['Salmone', 'Tonno'], ['Lasagna', 'Cannelloni'], ['Miele', 'Sciroppo'],
  ['Limone', 'Lime'], ['Cipolla', 'Aglio'], ['Fragola', 'Lampone'], ['Ciliegia', 'Amarena'],
  ['Speck', 'Pancetta'], ['Uovo', 'Omelette'], ['Yogurt', 'Kefir'], ['Noci', 'Nocciole'],
  ['Mandorle', 'Pistacchi'], ['Cioccolato', 'Cacao'], ['Vaniglia', 'Cannella'], ['Zenzero', 'Curcuma'],
  ['Pepe', 'Peperoncino'], ['Origano', 'Basilico'], ['Prezzemolo', 'Sedano'], ['Carota', 'Zucca'],
  ['Melanzana', 'Zucchina'], ['Patata', 'Topinambur'], ['Broccolo', 'Cavolfiore'], ['Spinaci', 'Bietola'],
  ['Fagioli', 'Lenticchie'], ['Ceci', 'Piselli'], ['Mais', 'Orzo'], ['Olio', 'Aceto'],
  ['Senape', 'Salsa BBQ'], ['Cocktail', 'Mocktail'], ['Spumante', 'Champagne'], ['Grappa', 'Whisky'],
  ['Vodka', 'Gin'], ['Liquore', 'Amaro'], ['Panino', 'Tramezzino'], ['Piadina', 'Kebab'],
  ['Muffin', 'Cupcake'], ['Cheesecake', 'Tiramisù'], ['Crepe', 'Waffle'], ['Couscous', 'Quinoa'],
  ['Tofu', 'Seitan'], ['Sogliola', 'Orata'], ['Gambero', 'Aragosta'], ['Cozze', 'Vongole'],
  ['Polpo', 'Seppia'], ['Tartufo', 'Fungo'], ['Pistacchio', 'Anacardo'], ['Ravioli', 'Tortellini'],
  ['Meringa', 'Panna Montata'], ['Polpetta', 'Salsiccia'], ['Acqua Naturale', 'Acqua Frizzante'],
  ['Bresaola', 'Crudo'], ['Gorgonzola', 'Roquefort'], ['Radicchio', 'Insalata'], ['Finocchio', 'Sedano'],
  ['Carciofo', 'Cardo'], ['Porro', 'Scalogno'], ['Melograno', 'Ribes'], ['Mora', 'Mirtillo'],
  ['Fico', 'Dattero'], ['Prugna', 'Susina'], ['Ananas', 'Mango'], ['Papaya', 'Avocado'],
  ['Lupini', 'Fave'], ['Cecina', 'Farinata'], ['Brioche', 'Cornetto'], ['Babà', 'Sfogliatella'],
  ['Zabaione', 'Crema Pasticcera'], ['Sugo', 'Ragù'], ['Pesto', 'Salsa di Noci'],
  ['Tagliatelle', 'Fettuccine'], ['Gnocchi', 'Tortelli'], ['Focaccia', 'Pizza Bianca'], ['Toast', 'Sandwich'],
  ['Carpaccio', 'Bresaola'], ['Salame', 'Salamella'], ['Wurstel', 'Salsiccia'], ['Faraona', 'Anatra'],
  ['Trota', 'Branzino'], ['Totano', 'Calamaro'], ['Telline', 'Lupini'], ['Mazzancolla', 'Scampo'],
  ['Uovo Sodo', 'Uovo alla Coque'], ['Frittata', 'Tortilla'], ['Crema Catalana', 'Creme Brulée'], ['Budino', 'Mousse'],
  ['Macaron', 'Amaretto'], ['Ciambella', 'Krapfen'], ['Bombolone', 'Pancake'], ['Cannolo', 'Sfogliatella'],
  ['Panettone', 'Pandoro'], ['Colomba', 'Uovo di Pasqua'], ['Castagna', 'Marrone'], ['Pinolo', 'Seme di Girasole'],
  ['Arachide', 'Nocciolina'], ['Confettura', 'Miele'], ['Zucchero a velo', 'Zucchero di canna'], ['Sciroppo d\'acero', 'Agave'],
  ['Salsa Tartara', 'Salsa Rosa'], ['Salsa Verde', 'Chimichurri'], ['Olio d\'oliva', 'Olio di girasole'], ['Aceto di mele', 'Aceto balsamico'],
  ['Lenticchie', 'Fagioli'], ['Asparago', 'Luppolo'], ['Verza', 'Cavolo'], ['Rucola', 'Valeriana'],
  ['Porcino', 'Finferlo'], ['Champignon', 'Prataiolo'], ['Pompelmo', 'Pomelo'], ['Cedro', 'Bergamotto'],
  ['Clementine', 'Mandarini'], ['Fico d\'India', 'Dragon Fruit'], ['Litchi', 'Rambutan'], ['Passito', 'Moscato'],
  ['Sidro', 'Succo di Mela'], ['Granita', 'Sorbetto'], ['Frappé', 'Frullato'], ['Centrifuga', 'Estratto'],
  ['Latte di Mandorla', 'Latte di Soia'], ['Kefir', 'Yogurt Greco'], ['Gorgonzola', 'Taleggio'], ['Fontina', 'Asiago'],
  ['Provola', 'Scamorza'], ['Mozzarella', 'Burrata'], ['Stracciatella', 'Ricotta'], ['Mascarpone', 'Panna'],
  ['Speck', 'Lonza'], ['Mortadella', 'Bologna'], ['Zampone', 'Cotechino'], ['Spezzatino', 'Gulasch'],
  ['Arrosto', 'Brasato'], ['Vitello Tonnato', 'Carpaccio'], ['Insalata Russa', 'Insalata di patate'], ['Baccalà', 'Stoccafisso'],
  ['Cacciucco', 'Zuppa di Pesce'], ['Paella', 'Risotto alla pescatora'], ['Zafferano', 'Curcuma'], ['Curry', 'Paprika'],
  ['Noce Moscata', 'Chiodi di Garofano'], ['Anice Stellato', 'Cumino'], ['Rosmarino', 'Salvia'], ['Timo', 'Maggiorana'],
  ['Menta', 'Eucalipto'], ['Camomilla', 'Tisana'], ['Decotto', 'Infuso'], ['Nocino', 'Limoncello'],
  ['Sambuca', 'Anisetta'], ['Vermouth', 'Martini'], ['Spritz', 'Negroni'], ['Mojito', 'Caipirinha'],

  // OGGETTI E CASA (Esistenti)
  ['Sedia', 'Poltrona'], ['Tavolo', 'Scrivania'], ['Letto', 'Divano'], ['Armadio', 'Cassettiera'],
  ['Lampada', 'Lampadario'], ['Specchio', 'Quadro'], ['Tenda', 'Persiana'], ['Tappeto', 'Moquette'],
  ['Orologio', 'Sveglia'], ['Vaso', 'Cestino'], ['Cuscino', 'Coperta'], ['Padella', 'Pentola'],
  ['Piatto', 'Vassoio'], ['Bicchiere', 'Tazza'], ['Forchetta', 'Cucchiaio'], ['Coltello', 'Forbici'],
  ['Frigorifero', 'Congelatore'], ['Forno', 'Microonde'], ['Lavatrice', 'Asciugatrice'], ['Zaino', 'Valigia'],
  ['Portafoglio', 'Borsello'], ['Ombrello', 'Impermeabile'], ['Chiave', 'Lucchetto'], ['Candela', 'Torcia'],
  ['Sapone', 'Shampoo'], ['Dentifricio', 'Collutorio'], ['Spazzolino', 'Pettine'], ['Asciugamano', 'Accappatoio'],
  ['Quaderno', 'Diario'], ['Penna', 'Matita'], ['Gomma', 'Temperino'], ['Righello', 'Squadra'],
  ['Bottiglia', 'Borraccia'], ['Tappo', 'Sughero'], ['Secchio', 'Mocio'], ['Scopa', 'Aspirapolvere'],
  ['Ferro da stiro', 'Vaporella'], ['Molletta', 'Gruccia'], ['Calamita', 'Adesivo'], ['Cornice', 'Poster'],
  ['Divano', 'Pouf'], ['Scaffale', 'Libreria'], ['Lampadina', 'Faretto'], ['Batteria', 'Pila'],
  ['Telecomando', 'Gamepad'], ['Caricabatterie', 'Powerbank'], ['Portachiavi', 'Moschettone'], ['Accendino', 'Fiammiferi'],
  ['Occhiali', 'Lenti a contatto'], ['Lente d\'ingrandimento', 'Microscopio'], ['Telescopio', 'Binocolo'],
  ['Mappa', 'Bussola'], ['Globo', 'Atlante'], ['Ombrellone', 'Sdraio'], ['Amaca', 'Altalena'],
  ['Ago', 'Spilla'], ['Filo', 'Lana'], ['Bottone', 'Cerniera'], ['Martello', 'Cacciavite'],
  ['Vite', 'Bullone'], ['Chiodo', 'Tassello'], ['Pinza', 'Tenaglia'], ['Sega', 'Trapano'],
  ['Scala', 'Sgabello'], ['Secchio', 'Annaffiatoio'], ['Pala', 'Piccone'], ['Rastrello', 'Vanga'],
  ['Valigia', 'Trolley'], ['Borsone', 'Sacca'], ['Portadocumenti', 'Cartellina'], ['Evidenziatore', 'Pennarello'],
  ['Scotch', 'Colla'], ['Cucitrice', 'Perforatrice'], ['Gaffeur', 'Nastro Isolante'], ['Pennello', 'Rullo'],
  ['Spatola', 'Cazzuola'], ['Livella', 'Metro'], ['Zanzariera', 'Tenda'], ['Radiatore', 'Stufa'],
  ['Ventilatore', 'Condizionatore'], ['Caldaia', 'Boiler'], ['Citofono', 'Campanello'], ['Cassaforte', 'Scrigno'],
  ['Phon', 'Piastra'], ['Rasoio', 'Tagliacapelli'], ['Bilancia', 'Metro'], ['Aspirapolvere', 'Robot'],
  ['Moka', 'Macchina espresso'], ['Tostapane', 'Piastra'], ['Frullatore', 'Mixer'], ['Spremiagrumi', 'Centrifuga'],
  ['Grattugia', 'Mandolina'], ['Scolapasta', 'Colino'], ['Apribottiglie', 'Cavatappi'], ['Presina', 'Guanto da forno'],
  ['Stoviglie', 'Posate'], ['Tovaglia', 'Runner'], ['Tovagliolo', 'Fazzoletto'], ['Cestino', 'Secchio'],
  ['Divisorio', 'Paravento'], ['Comodino', 'Consolle'], ['Sgabello', 'Panca'], ['Appendiabiti', 'Stendiabiti'],
  ['Zerbino', 'Tappetino'], ['Serratura', 'Lucchetto'], ['Pomello', 'Maniglia'], ['Cerniera', 'Cardine'],
  ['Cavo', 'Filo'], ['Presa', 'Interruttore'], ['Multipresa', 'Adattatore'], ['Lampada da terra', 'Abat-jour'],
  ['Culla', 'Lettino'], ['Box', 'Seggiolone'], ['Passeggino', 'Carrozzina'], ['Fasciatoio', 'Vaschetta'],
  ['Attenti al cane', 'Campanello'], ['Buca delle lettere', 'Citofono'], ['Gancio', 'Ventosa'], ['Tassello', 'Vite'],
  ['Carta igienica', 'Rotolone'], ['Spugna', 'Luffa'], ['Pumice', 'Lima'], ['Pennello trucco', 'Spugnetta'],
  ['Ombretto', 'Fard'], ['Mascara', 'Eyeliner'], ['Rossetto', 'Lucidalabbra'], ['Fondotinta', 'Correttore'],
  ['Crema viso', 'Siero'], ['Maschera', 'Fango'], ['Ceretta', 'Rasoio'], ['Pinzetta', 'Forbicina'],
  ['Bigodino', 'Molletta'], ['Elastico', 'Cerchietto'], ['Fermaglio', 'Spilla'], ['Parrucca', 'Extension'],
  ['Valvola', 'Rubinetto'], ['Sifone', 'Scarico'], ['Guarnizione', 'O-ring'], ['Tubo', 'Flessibile'],

  // NATURA E ANIMALI (Esistenti)
  ['Gatto', 'Cane'], ['Leone', 'Tigre'], ['Lupo', 'Volpe'], ['Elefante', 'Ippopotamo'],
  ['Delfino', 'Balena'], ['Squalo', 'Orca'], ['Aquila', 'Falco'], ['Pappagallo', 'Canarino'],
  ['Serpente', 'Lucertola'], ['Rana', 'Rospo'], ['Ape', 'Vespa'], ['Farfalla', 'Falena'],
  ['Sole', 'Luna'], ['Stella', 'Pianeta'], ['Mare', 'Oceano'], ['Fiume', 'Torrente'],
  ['Montagna', 'Collina'], ['Bosco', 'Foresta'], ['Prato', 'Giungla'], ['Deserto', 'Savana'],
  ['Pioggia', 'Grandine'], ['Vento', 'Brezza'], ['Tuono', 'Fulmine'], ['Albero', 'Arbusto'],
  ['Rosa', 'Tulipano'], ['Erba', 'Muschio'], ['Sabbia', 'Ghiaia'], ['Giraffa', 'Zebra'],
  ['Gorilla', 'Scimpanzé'], ['Orso', 'Panda'], ['Canguro', 'Koala'], ['Cammello', 'Dromedario'],
  ['Mucca', 'Toro'], ['Pecora', 'Capra'], ['Maiale', 'Cinghiale'], ['Coniglio', 'Lepre'],
  ['Topo', 'Hamster'], ['Pipistrello', 'Vampiro'], ['Formica', 'Termite'], ['Ragno', 'Scorpione'],
  ['Lumaca', 'Verme'], ['Medusa', 'Corallo'], ['Stella marina', 'Riccio di mare'], ['Granchio', 'Aragosta'],
  ['Ostrica', 'Cozza'], ['Vulcano', 'Geyser'], ['Isola', 'Atollo'], ['Grotta', 'Anfratto'],
  ['Cascata', 'Rapida'], ['Cielo', 'Atmosfera'], ['Nuvola', 'Nebbia'], ['Aurora', 'Arcobaleno'],
  ['Eclissi', 'Cometa'], ['Quercia', 'Faggio'], ['Ulivo', 'Pino'], ['Margherita', 'Girasole'],
  ['Orchidea', 'Giglio'], ['Cactus', 'Pianta Grassa'], ['Ghiacciaio', 'Iceberg'], ['Stagno', 'Palude'],
  ['Duna', 'Spiaggia'], ['Scogliera', 'Rupo'], ['Piuma', 'Pelo'], ['Ala', 'Pinna'],
  ['Corno', 'Zanna'], ['Nido', 'Tana'], ['Guscio', 'Corazza'], ['Coda', 'Zampa'],
  ['Fulmine', 'Saetta'], ['Tramonto', 'Alba'], ['Fango', 'Argilla'], ['Pietra', 'Sasso'],
  ['Radice', 'Ramo'], ['Foglia', 'Petalo'], ['Seme', 'Frutto'], ['Polline', 'Nettare'],
  ['Cervo', 'Capriolo'], ['Gufo', 'Civetta'], ['Corvo', 'Gazza'], ['Passero', 'Pettirosso'],
  ['Cigno', 'Anatra'], ['Fenicottero', 'Airone'], ['Pinguino', 'Foca'], ['Tricheco', 'Lontra'],
  ['Alce', 'Renna'], ['Bisonte', 'Bufalo'], ['Leopardo', 'Ghepardo'], ['Iena', 'Sciacallo'],
  ['Lemure', 'Bradipo'], ['Talpa', 'Riccio'], ['Castoro', 'Lontra'], ['Procione', 'Tasso'],
  ['Scoiattolo', 'Ghiro'], ['Criceto', 'Porcellino d\'india'], ['Pavone', 'Fagiano'], ['Gallo', 'Tacchino'],
  ['Gallina', 'Pulcino'], ['Oca', 'Cigno'], ['Colibrì', 'Farfalla'], ['Pipistrello', 'Civetta'],
  ['Salamandra', 'Tritone'], ['Tartaruga', 'Testuggine'], ['Coccodrillo', 'Alligatore'], ['Camaleonte', 'Iguana'],
  ['Polpo', 'Seppia'], ['Medusa', 'Caravella Portoghese'], ['Cavalluccio Marino', 'Dragone Foglia'], ['Manta', 'Razza'],
  ['Barracuda', 'Luccio'], ['Trota', 'Salmone'], ['Storione', 'Pesce Spada'], ['Anguilla', 'Murena'],
  ['Grillo', 'Cavalletta'], ['Coccinella', 'Scarabeo'], ['Mantide', 'Stecco'], ['Mosca', 'Zanzara'],
  ['Libellula', 'Farfalla'], ['Cicala', 'Grillo'], ['Scarafaggio', 'Cimice'], ['Acaro', 'Pidocchio'],
  ['Felce', 'Lichene'], ['Funghi', 'Muffa'], ['Edera', 'Vite'], ['Baobab', 'Sequoia'],
  ['Salice Piangente', 'Betulla'], ['Abete', 'Larice'], ['Magnolia', 'Mimosa'], ['Lavanda', 'Rosmarino'],
  ['Grano', 'Mais'], ['Riso', 'Bambù'], ['Canna da zucchero', 'Papiro'], ['Nenufar', 'Loto'],
  ['Gelsomino', 'Gardenia'], ['Garofano', 'Peonia'], ['Papavero', 'Anemone'], ['Iris', 'Violetta'],
  ['Ortensia', 'Camelia'], ['Azalea', 'Rododendro'], ['Ginestra', 'Mimosa'], ['Oleandro', 'Alloro'],

  // VIAGGI E LUOGHI (Esistenti)
  ['Roma', 'Parigi'], ['Londra', 'Berlino'], ['New York', 'Los Angeles'], ['Italia', 'Spagna'],
  ['Scuola', 'Liceo'], ['Ufficio', 'Studio'], ['Ospedale', 'Clinica'], ['Farmacia', 'Erboristeria'],
  ['Negozio', 'Boutique'], ['Supermercato', 'Mercato'], ['Bar', 'Caffetteria'], ['Ristorante', 'Trattoria'],
  ['Hotel', 'Pensione'], ['Ostello', 'Campeggio'], ['Spiaggia', 'Lido'], ['Piscina', 'Parco Acquatico'],
  ['Stazione', 'Fermata'], ['Aeroporto', 'Eliporto'], ['Treno', 'Metropolitana'], ['Aereo', 'Jet'],
  ['Autobus', 'Pullman'], ['Tram', 'Filobus'], ['Macchina', 'SUV'], ['Moto', 'Scooter'],
  ['Bicicletta', 'Tandem'], ['Nave', 'Yacht'], ['Traghetto', 'Motonave'], ['Piazza', 'Corso'],
  ['Via', 'Vicolo'], ['Parco', 'Villa'], ['Giardino', 'Orto'], ['Museo', 'Pinacoteca'],
  ['Galleria', 'Esposizione'], ['Chiesa', 'Basilica'], ['Cattedrale', 'Duomo'], ['Stadio', 'Arena'],
  ['Palestra', 'Centro Sportivo'], ['Castello', 'Fortezza'], ['Torre', 'Campanile'], ['Fara', 'Lanterna'],
  ['Ponte', 'Viadotto'], ['Galleria', 'Tunnel'], ['Porto', 'Molo'], ['Venezia', 'Amsterdam'],
  ['Napoli', 'Marsiglia'], ['Madrid', 'Lisbona'], ['Stati Uniti', 'Canada'], ['Cina', 'Giappone'],
  ['Brasile', 'Messico'], ['Australia', 'Sudafrica'], ['Egitto', 'Grecia'], ['Svizzera', 'Austria'],
  ['Banca', 'Sportello'], ['Posta', 'Corriere'], ['Cinema', 'Sala'], ['Teatro', 'Palcoscenico'],
  ['Discoteca', 'Club'], ['Pub', 'Birreria'], ['Biblioteca', 'Libreria'], ['Cimitero', 'Mausoleo'],
  ['Prigione', 'Cella'], ['Tribunale', 'Municipio'], ['Fattoria', 'Cascina'], ['Stalla', 'Recinto'],
  ['Grattacielo', 'Torre'], ['Baita', 'Chalet'], ['Rifugio', 'Bivacco'], ['Luna Park', 'Giostra'],
  ['Zoo', 'Safari'], ['Acquario', 'Delfinario'], ['Planetario', 'Osservatorio'], ['Fiera', 'Sagra'],
  ['Laboratorio', 'Officina'], ['Cantiere', 'Scavo'], ['Taxi', 'Navetta'], ['Camper', 'Roulotte'],
  ['Canoa', 'Kayak'], ['Gondola', 'Piatta'], ['Sottomarino', 'Sommergibile'], ['Mongolfiera', 'Aliante'],
  ['Milano', 'Torino'], ['Firenze', 'Siena'], ['Bologna', 'Modena'], ['Genova', 'Trieste'],
  ['Palermo', 'Catania'], ['Bari', 'Lecce'], ['Verona', 'Padova'], ['Venezia', 'Chioggia'],
  ['Sardegna', 'Sicilia'], ['Corsica', 'Elba'], ['Ischia', 'Capri'], ['Ponza', 'Ventotene'],
  ['Portofino', 'Saint-Tropez'], ['Ibiza', 'Formentera'], ['Mykonos', 'Santorini'], ['Bali', 'Phuket'],
  ['Maldives', 'Seychelles'], ['Sahara', 'Gobi'], ['Amazzonia', 'Congo'], ['Everest', 'K2'],
  ['Alpi', 'Pirenei'], ['Appennini', 'Ande'], ['Nilo', 'Rio delle Amazzoni'], ['Danubio', 'Po'],
  ['Garda', 'Como'], ['Maggiore', 'Trasimeno'], ['Bottega', 'Atelier'], ['Chiosco', 'Edicola'],
  ['Lavanderia', 'Tintoria'], ['Sartoria', 'Calzoleria'], ['Ferramenta', 'Brico'], ['Vivaio', 'Fioraio'],
  ['Edicola', 'Tabaccaio'], ['Pasticceria', 'Panetteria'], ['Macelleria', 'Pescheria'], ['Enoteca', 'Birreria'],
  ['Casinò', 'Bingo'], ['Bowling', 'Sala Giochi'], ['Kartodromo', 'Autodromo'], ['Maneggio', 'Ippodromo'],
  ['Palazzetto', 'Velodromo'], ['Pista di ghiaccio', 'Skate park'], ['Muro di arrampicata', 'Boulder'], ['Parco Avventura', 'Zipline'],

  // ABBIGLIAMENTO, SPORT E VARIE (Esistenti)
  ['Maglietta', 'Polo'], ['Camicia', 'Blusa'], ['Pantaloni', 'Jeans'], ['Gonna', 'Tubino'],
  ['Vestito', 'Tuta'], ['Giacca', 'Blazer'], ['Cappotto', 'Piumino'], ['Scarpe', 'Sneakers'],
  ['Stivali', 'Anfibi'], ['Sandali', 'Zoccoli'], ['Infradito', 'Ciabatte'], ['Calze', 'Gambaletti'],
  ['Cappello', 'Berretto'], ['Guanti', 'Manopole'], ['Sciarpa', 'Scaldacollo'], ['Cintura', 'Bretelle'],
  ['Occhiali da sole', 'Mascherina'], ['Orologio', 'Cronometro'], ['Collana', 'Catenina'], ['Anello', 'Fede'],
  ['Orecchini', 'Pendenti'], ['Zaino', 'Cartella'], ['Borsa', 'Tracolla'], ['Portafoglio', 'Portamonete'],
  ['Pigiama', 'Camicia da notte'], ['Calcio', 'Calcetto'], ['Basket', 'Pallavolo'], ['Tennis', 'Squash'],
  ['Nuoto', 'Pallanuoto'], ['Corsa', 'Jogging'], ['Ciclismo', 'Spinning'], ['Sci', 'Slittino'],
  ['Boxe', 'Kickboxing'], ['Danza', 'Ginnastica'], ['Scacchi', 'Dama'], ['Carte', 'Tarocchi'],
  ['Dadi', 'fiches'], ['Yoga', 'Pilates'], ['Rugby', 'Football'], ['Baseball', 'Softball'],
  ['Scherma', 'Fioretto'], ['Vela', 'Surf'], ['Biliardo', 'Bowling'], ['Ping Pong', 'Badminton'],
  ['Pesca', 'Sub'], ['Freccette', 'Tiro a segno'], ['Monopoli', 'Taboo'], ['Lego', 'Costruzioni'],
  ['Medicina', 'Sciroppo'], ['Vitamina', 'Pillola'], ['Febbre', 'Influenza'], ['Raffindigodore', 'Allergia'],
  ['Cerotto', 'Gaza'], ['Termometro', 'Sonda'], ['Cuore', 'Polso'], ['Cervello', 'Mente'],
  ['Dente', 'Molare'], ['Naso', 'Narice'], ['Occhio', 'Pupilla'], ['Sogno', 'Desiderio'],
  ['Incubo', 'Paura'], ['Amore', 'Passione'], ['Amicizia', 'Lealtà'], ['Caldo', 'Afa'],
  ['Findigodo', 'Gelo'], ['Estate', 'Vacanze'], ['Inverno', 'Natale'], ['Musica', 'Canzone'],
  ['Profumo', 'Essenza'], ['Luce', 'Bagliore'], ['Colore', 'Tonalità'], ['Matematica', 'Algebra'],
  ['Storia', 'Leggenda'], ['Veloce', 'Rapido'], ['Lento', 'Pigro'], ['Bello', 'Elegante'],
  ['Nuovo', 'Moderno'], ['Pieno', 'Colmo'], ['Dolce', 'Zuccherato'], ['Morbido', 'Soffice'],
  ['Silenzio', 'Quiete'], ['Vittoria', 'Trionfo'], ['Regalo', 'Dono'], ['Inizio', 'Partenza'],
  ['Felpa', 'Maglione'], ['Cardigan', 'Gilet'], ['Canottiera', 'Top'], ['Bermuda', 'Pantaloncini'],
  ['Calzettoni', 'Fantasmini'], ['Cravatta', 'Papillon'], ['Gemelli', 'Spilla da balia'], ['Fazzoletto', 'Bandana'],
  ['Pantofole', 'Babbucce'], ['Mocassini', 'Scarpe da barca'], ['Tacchi', 'Zeppe'], ['Ballerine', 'Décolleté'],
  ['Cappa', 'Mantello'], ['Poncho', 'Sciarpa oversize'], ['Tuta spaziale', 'Scafandro'], ['Sottoveste', 'Sottogonna'],
  ['Corpetto', 'Corsetto'], ['Reggiseno', 'Bustino'], ['Body', 'Costume intero'], ['Bikini', 'Triangolo'],
  ['Parastinchi', 'Ginocchiere'], ['Casco', 'Elmetto'], ['Borraccia', 'Thermos'], ['Cronometro', 'Timer'],
  ['Fischietto', 'Sirena'], ['Medaglia', 'Coppa'], ['Trofeo', 'Targa'], ['Podio', 'Tribuna'],
  ['Arrampicata', 'Alpinismo'], ['Trekking', 'Escursionismo'], ['Canottaggio', 'Canoa'], ['Tiro con l\'arco', 'Balestra'],
  ['Golf', 'Minigolf'], ['Pattinaggio', 'Hockey'], ['Curling', 'Bocce'], ['Motocross', 'Rally'],
  ['F1', 'MotoGP'], ['Surf', 'Skateboard'], ['Snowboard', 'Skiboard'], ['Paracadutismo', 'Bungee jumping'],
  ['Yoga', 'Tai Chi'], ['Meditazione', 'Rilassamento'], ['Massaggio', 'Fisioterapia'], ['Agopuntura', 'Digitopressione'],
  ['Farmaco', 'Rimedio'], ['Vaccino', 'Antidoto'], ['Benda', 'Fascia'], ['Garza', 'Tampone'],
  ['Ambulanza', 'Auto medica'], ['Lettiga', 'Barella'], ['Sedia a rotelle', 'Deambulatore'], ['Stampelle', 'Tutore'],
  ['Omeopatia', 'Fitoterapia'], ['Erboristeria', 'Spezeria'], ['Stetoscopio', 'Sfigmomanometro'], ['Scalpello', 'Bisturi'],
  ['Paziente', 'Degente'], ['Ricovero', 'Check-up'], ['Analisi', 'Radiografia'], ['Ecografia', 'Risonanza'],
  ['Anestesia', 'Sedazione'], ['Gesso', 'Fasciatura'], ['Sutura', 'Punti'], ['Cicatrizzante', 'Disinfettante'],
  ['Fatica', 'Stanchezza'], ['Energia', 'Vigore'], ['Sonno', 'Riposo'], ['Veglia', 'Insonnia'],
  ['Fame', 'Appetito'], ['Sete', 'Aridità'], ['Salute', 'Benessere'], ['Forma', 'Profilo'],
  ['Peso', 'Massa'], ['Altezza', 'Statura'], ['Forza', 'Potenza'], ['Velocità', 'Rapidità'],
  ['Riflessi', 'Istinto'], ['Talento', 'Genio'], ['Abilità', 'Maestria'], ['Impegno', 'Sforzo'],

  // --- NUOVE CATEGORIE AGGIUNTE ---
  
  // TECNOLOGIA ED ELETTRONICA
  ['Smartphone', 'Tablet'], ['Computer', 'Portatile'], ['Mouse', 'Tastiera'], ['Monitor', 'Televisore'],
  ['Auricolari', 'Cuffie'], ['Smartwatch', 'Contapassi'], ['Router', 'Modem'], ['Chiavetta USB', 'Hard Disk'],
  ['Stampante', 'Scanner'], ['Console', 'PC Gaming'], ['Wi-Fi', 'Bluetooth'], ['App', 'Sito Web'],
  ['Social Network', 'Forum'], ['Videogioco', 'Film Interattivo'], ['Drone', 'Elicottero Radiocomandato'],
  ['Cavo HDMI', 'Cavo USB'], ['Password', 'PIN'], ['Antivirus', 'Firewall'], ['Intelligenza Artificiale', 'Algoritmo'],

  // MESTIERI E PROFESSIONI
  ['Medico', 'Infermiere'], ['Avvocato', 'Giudice'], ['Poliziotto', 'Carabiniere'], ['Insegnante', 'Professore'],
  ['Cuoco', 'Pasticciere'], ['Muratore', 'Falegname'], ['Idraulico', 'Elettricista'], ['Attore', 'Regista'],
  ['Cantante', 'Musicista'], ['Giornalista', 'Scrittore'], ['Architetto', 'Ingegnere'], ['Barista', 'Cameriere'],
  ['Sartoria', 'Stilista'], ['Pilota', 'Hostess'], ['Autista', 'Tassista'], ['Dentista', 'Igienista'],
  ['Psicologo', 'Psichiatra'], ['Farmacista', 'Erborista'], ['Fotografo', 'Cameraman'], ['Sindaco', 'Presidente'],

  // ARTE E INTRATTENIMENTO
  ['Pittura', 'Scultura'], ['Fumetto', 'Manga'], ['Romanzo', 'Poesia'], ['Commedia', 'Tragedia'],
  ['Film', 'Serie TV'], ['Documentario', 'Reportage'], ['Fotografia', 'Ritratto'], ['Chitarra', 'Basso'],
  ['Pianoforte', 'Tastiera (musicale)'], ['Batteria', 'Percussioni'], ['Flauto', 'Clarinetto'], ['Violino', 'Violoncello'],
  ['Teatro', 'Cinema'], ['Concerto', 'Festival'], ['Museo', 'Mostra'], ['Acrobata', 'Giocoliere'],
  ['Magia', 'Illusionismo'], ['Anime', 'Cartone Animato'], ['Podcast', 'Programma Radio'], ['DJ', 'Vocalist'],

  // CIBI INTERNAZIONALI E STREET FOOD
  ['Tacos', 'Burrito'], ['Nachos', 'Tortillas'], ['Guacamole', 'Hummus'], ['Kebab', 'Gyros'],
  ['Gyoza', 'Ravioli cinesi'], ['Ramen', 'Noodles'], ['Tempura', 'Fritto Misto'], ['Falafel', 'Polpette'],
  ['Pancake', 'Waffle'], ['Brownie', 'Muffin'], ['Cheeseburger', 'Hamburger'], ['Hot Dog', 'Corn Dog'],

  // CONCETTI ASTRATTI
  ['Speranza', 'Illusione'], ['Paura', 'Terrore'], ['Gioia', 'Felicità'], ['Tristezza', 'Malinconia'],
  ['Rabbia', 'Frustrazione'], ['Coraggio', 'Temerarietà'], ['Intelligenza', 'Saggezza'], ['Bellezza', 'Fascino'],
  ['Ricchezza', 'Lusso'], ['Povertà', 'Miseria'], ['Destino', 'Fato'], ['Fortuna', 'Caso'],
  ['Sogno', 'Obiettivo'], ['Ricordo', 'Nostalgia'], ['Amore', 'Infatuazione'], ['Simpatia', 'Empatia'],
  
  // SPAZIO E SCIENZA
  ['Astronauta', 'Cosmonauta'], ['Galassia', 'Nebulosa'], ['Pianeta', 'Asteroide'], ['Sole', 'Stella nana'],
  ['Microscopio', 'Telescopio'], ['Atomo', 'Molecola'], ['Laboratorio', 'Osservatorio'], ['Razzo', 'Navetta'],
  ['Gravità', 'Magnetismo'], ['Elettricità', 'Energia Solare']
];

// --- FUNZIONI DI UTILITA' ---
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export default function App() {
  const [scores, setScores] = useState({}); // NUOVO: Stato per i punteggi

  // Stati principali: 'setup', 'distribution', 'playing', 'gameover'
  const [gameState, setGameState] = useState('setup');
  
  // Setup state
  const [playersInput, setPlayersInput] = useState(['Alice', 'Bob', 'Charlie', 'Diana', 'Edoardo']);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [rolesCount, setRolesCount] = useState({ civili: 3, undercover: 1, mrWhite: 1 });
  
  // Game state
  const [players, setPlayers] = useState([]);
  const [civilianWord, setCivilianWord] = useState('');
  const [undercoverWord, setUndercoverWord] = useState('');
  
  // Distribution state
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isWordRevealed, setIsWordRevealed] = useState(false);
  
  // Game progress state
  const [winner, setWinner] = useState(null); // 'civili', 'undercover', 'mrWhite'
  const [eliminatedJustNow, setEliminatedJustNow] = useState(null);
  const [mrWhiteGuess, setMrWhiteGuess] = useState('');

  // --- LOGICA DI SETUP ---
  const addPlayer = (e) => {
    e.preventDefault();
    if (newPlayerName.trim() && !playersInput.includes(newPlayerName.trim())) {
      setPlayersInput([...playersInput, newPlayerName.trim()]);
      setRolesCount(prev => ({ ...prev, civili: prev.civili + 1 })); // Auto-incrementa civili
      setNewPlayerName('');
    }
  };

  const removePlayer = (indexToRemove) => {
    setPlayersInput(playersInput.filter((_, index) => index !== indexToRemove));
    // Aggiusta i ruoli per non superare il totale
    if (rolesCount.civili > 0) setRolesCount(prev => ({ ...prev, civili: prev.civili - 1 }));
  };

  const updateRoleCount = (role, delta) => {
    setRolesCount(prev => {
      const newVal = prev[role] + delta;
      if (newVal < 0) return prev;
      return { ...prev, [role]: newVal };
    });
  };

  const totalRoles = rolesCount.civili + rolesCount.undercover + rolesCount.mrWhite;
  const isSetupValid = totalRoles === playersInput.length && rolesCount.civili > 0 && playersInput.length >= 3;

const startGame = () => {
    if (!isSetupValid) return;

    const randomPair = wordPairs[Math.floor(Math.random() * wordPairs.length)];
    const isFirstCiv = Math.random() > 0.5;
    const civWord = isFirstCiv ? randomPair[0] : randomPair[1];
    const undWord = isFirstCiv ? randomPair[1] : randomPair[0];
    
    setCivilianWord(civWord);
    setUndercoverWord(undWord);

    let rolesArray = [];
    for (let i = 0; i < rolesCount.civili; i++) rolesArray.push('Civile');
    for (let i = 0; i < rolesCount.undercover; i++) rolesArray.push('Undercover');
    for (let i = 0; i < rolesCount.mrWhite; i++) rolesArray.push('Mr. White');
    
    rolesArray = shuffleArray(rolesArray);

    // --- NUOVA LOGICA: MR. WHITE AL PRIMO POSTO AL 10% ---
    if (rolesArray[0] === 'Mr. White') {
      // Math.random() genera un numero tra 0 e 1.
      // Se è maggiore di 0.10 (cioè il 90% delle volte), spostiamo Mr. White.
      if (Math.random() > 0.10) {
        // Cerchiamo il primo ruolo nella lista che NON è Mr. White
        const swapIndex = rolesArray.findIndex(role => role !== 'Mr. White');
        if (swapIndex !== -1) {
          // Scambiamo i ruoli: Mr. White va in mezzo, l'altro va al primo posto
          rolesArray[0] = rolesArray[swapIndex];
          rolesArray[swapIndex] = 'Mr. White';
        }
      }
    }
    // ---------------------------------------------------

    const shuffledPlayersInput = shuffleArray(playersInput);

    const initializedPlayers = shuffledPlayersInput.map((name, index) => {
      const role = rolesArray[index];
      let word = '';
      if (role === 'Civile') word = civWord;
      else if (role === 'Undercover') word = undWord;
      else word = '???';

      return {
        id: index,
        name,
        role,
        word,
        isAlive: true
      };
    });

    setPlayers(initializedPlayers);
    setGameState('distribution');
    setCurrentPlayerIndex(0);
    setIsWordRevealed(false);
    setWinner(null);
    setEliminatedJustNow(null);
  };

  // --- LOGICA DI DISTRIBUZIONE ---
  const handleReveal = () => setIsWordRevealed(true);
  
  const handleNextPlayer = () => {
    if (currentPlayerIndex < players.length - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
      setIsWordRevealed(false);
    } else {
      setGameState('playing');
    }
  };

  // --- LOGICA DI GIOCO ---

  const eliminatePlayer = (id) => {
    const updatedPlayers = players.map(p => p.id === id ? { ...p, isAlive: false } : p);
    
    // Separa vivi e morti
    const alive = updatedPlayers.filter(p => p.isAlive);
    const dead = updatedPlayers.filter(p => !p.isAlive);
    
    // Mescola i vivi casualmente
    const shuffledAlive = shuffleArray(alive);
    
    // Ricomponi: prima i vivi mescolati, poi i morti
    const reordeindigoPlayers = [...shuffledAlive, ...dead];
    
    setPlayers(reordeindigoPlayers);
    const eliminatedPlayer = reordeindigoPlayers.find(p => p.id === id);
    setEliminatedJustNow(eliminatedPlayer);
    };

  // NUOVO: Funzione per aggiornare i punteggi a fine partita
  const updateScores = (winningRole) => {
    setScores(prevScores => {
      const newScores = { ...prevScores };
      players.forEach(player => {
        let pointsToAdd = 0;
        // Assegnazione punti in base alle regole
        if (winningRole === 'civili' && player.role === 'Civile') pointsToAdd = 2;
        if (winningRole === 'undercover' && player.role === 'Undercover') pointsToAdd = 10;
        if (winningRole === 'mrWhite' && player.role === 'Mr. White') pointsToAdd = 6;

        if (pointsToAdd > 0) {
          // Somma ai punti precedenti (o 0 se è la prima partita)
          newScores[player.name] = (newScores[player.name] || 0) + pointsToAdd;
        }
      });
      return newScores;
    });
  };

// NUOVO: Controlla se la parola inserita da Mr. White è corretta
  const handleMrWhiteGuessSubmit = (e) => {
    e.preventDefault();
    if (!mrWhiteGuess.trim()) return;

    // Rende il controllo case-insensitive e toglie spazi extra
    const guess = mrWhiteGuess.trim().toLowerCase();
    const target = civilianWord.trim().toLowerCase();

    if (guess === target) {
      mrWhiteGuessedWord(); // Ha indovinato!
    } else {
      dismissEliminationMessage(); // Ha sbagliato, il gioco procede e lui è eliminato
    }
    setMrWhiteGuess(''); // Resetta il campo
  };


  const checkWinConditions = () => {
    const alivePlayers = players.filter(p => p.isAlive);
    const aliveCivilians = alivePlayers.filter(p => p.role === 'Civile').length;
    const aliveUndercovers = alivePlayers.filter(p => p.role === 'Undercover').length;
    const aliveMrWhites = alivePlayers.filter(p => p.role === 'Mr. White').length;

    if (aliveUndercovers === 0 && aliveMrWhites === 0) {
      setWinner('civili');
      updateScores('civili'); // Assegna punti
      setGameState('gameover');
      setEliminatedJustNow(null);
    } else if (aliveUndercovers >= aliveCivilians && aliveMrWhites === 0) {
      setWinner('undercover');
      updateScores('undercover'); // Assegna punti
      setGameState('gameover');
      setEliminatedJustNow(null);
    } else if (aliveUndercovers + aliveCivilians === 1 && aliveMrWhites > 0) {
      setWinner('mrWhite');
      updateScores('mrWhite'); // Assegna punti
      setGameState('gameover');
      setEliminatedJustNow(null);
    } else {
      setEliminatedJustNow(null);
    }
  };


  const mrWhiteGuessedWord = () => {
    setWinner('mrWhite');
    updateScores('mrWhite'); // Assegna punti se indovina
    setGameState('gameover');
    setEliminatedJustNow(null);
  };


  const dismissEliminationMessage = () => {
    checkWinConditions();
  };

  const resetGame = () => {
    setGameState('setup');
    setWinner(null);
    setEliminatedJustNow(null);
    setMrWhiteGuess('');
  };

  // --- RENDERS ---
  const renderSetup = () => (
    <div className="flex flex-col gap-8 w-full p-8 sm:p-12 animate-fadeIn flex-1">
      <div className="text-center space-y-3 mb-6">
        <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-slate-800">UNDERCOVER</h1>
        <p className="text-slate-500 font-medium sm:text-xl">Trova l'impostore tra di voi!</p>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-3 text-slate-700">
          <Users size={28} className="text-indigo-500"/> 
          Giocatori ({playersInput.length})
        </h2>
        
        <form onSubmit={addPlayer} className="flex gap-3">
          <input
            type="text"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            placeholder="Nome giocatore..."
            className="flex-1 px-5 py-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-xl"
          />
          <button type="submit" className="bg-indigo-500 text-white px-6 py-3 rounded-xl hover:bg-indigo-600 transition-colors">
            <UserPlus size={28} />
          </button>
        </form>

        <div className="flex flex-wrap gap-3 max-h-60 overflow-y-auto pt-2">
          {playersInput.map((p, i) => (
            <div key={i} className="flex items-center gap-3 bg-slate-100 px-5 py-3 rounded-xl text-base sm:text-lg font-medium text-slate-700">
              {p}
              <button onClick={() => removePlayer(i)} className="text-slate-400 hover:text-indigo-500 transition-colors ml-2">
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-700">Distribuzione Ruoli</h2>
        
        <div className="space-y-6">
          {[
            { id: 'civili', label: 'Civili', desc: 'Hanno la parola segreta', color: 'text-emerald-500', bg: 'bg-emerald-100' },
            { id: 'undercover', label: 'Undercover', desc: 'Hanno una parola simile', color: 'text-rose-500', bg: 'bg-rose-100' },
            { id: 'mrWhite', label: 'Mr. White', desc: 'Non ha nessuna parola', color: 'text-slate-500', bg: 'bg-slate-200' }
          ].map(role => (
            <div key={role.id} className="flex items-center justify-between">
              <div>
                <div className={`font-semibold text-xl flex items-center gap-3`}>
                  <span className={`w-4 h-4 rounded-full ${role.bg}`}></span>
                  {role.label}
                </div>
                <div className="text-base text-slate-500 mt-1">{role.desc}</div>
              </div>
              <div className="flex items-center gap-5">
                <button 
                  onClick={() => updateRoleCount(role.id, -1)}
                  className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold hover:bg-slate-200 transition-colors text-2xl"
                >-</button>
                <span className="w-8 text-center font-bold text-2xl">{rolesCount[role.id]}</span>
                <button 
                  onClick={() => updateRoleCount(role.id, 1)}
                  className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold hover:bg-slate-200 transition-colors text-2xl"
                >+</button>
              </div>
            </div>
          ))}
        </div>

        {!isSetupValid && (
          <div className="p-5 bg-amber-50 rounded-xl flex items-start gap-4 text-base sm:text-lg text-amber-700 border border-amber-200 mt-6">
            <AlertCircle size={24} className="mt-0.5 shrink-0" />
            <p>I ruoli totali ({totalRoles}) devono essere uguali ai giocatori ({playersInput.length}). Servono almeno 3 giocatori e 1 Civile.</p>
          </div>
        )}
      </div>

      <div className="mt-auto pt-6">
        <button
          onClick={startGame}
          disabled={!isSetupValid}
          className={`w-full py-6 rounded-2xl text-2xl font-bold flex items-center justify-center gap-4 transition-all ${
            isSetupValid ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-200' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Play size={32} /> INIZIA PARTITA
        </button>
      </div>
    </div>
  );

  const renderDistribution = () => {
    const player = players[currentPlayerIndex];
    return (
      <div className="flex flex-col items-center justify-center flex-1 w-full p-8 sm:p-12 text-center animate-fadeIn">
        <div className="mb-10 text-slate-500 font-medium text-lg sm:text-xl">
          Giocatore {currentPlayerIndex + 1} di {players.length}
        </div>
        
        <h2 className="text-5xl sm:text-6xl font-black text-slate-800 mb-12">
          Passa a <br/> <span className="text-indigo-600 mt-4 block">{player.name}</span>
        </h2>

        <div className="bg-white w-full max-w-sm sm:max-w-xl rounded-[3rem] p-10 sm:p-16 shadow-2xl border border-slate-100 min-h-[400px] flex flex-col items-center justify-center transition-all duration-300">
          {!isWordRevealed ? (
            <button
              onClick={handleReveal}
              className="group flex flex-col items-center gap-8 cursor-pointer"
            >
              <div className="w-32 h-32 rounded-full bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                <Eye size={64} className="text-indigo-500" />
              </div>
              <span className="font-bold text-slate-600 text-2xl">Tocca per rivelare</span>
            </button>
          ) : (
            <div className="space-y-10 flex flex-col items-center animate-fadeIn w-full">
              <div className="text-base sm:text-lg font-bold uppercase tracking-widest text-slate-400">La tua parola</div>
              {player.role === 'Mr. White' ? (
                <div className="space-y-6">
                  <div className="text-4xl sm:text-5xl font-black text-slate-800">TU SEI MR. WHITE</div>
                  <p className="text-slate-500 text-lg sm:text-xl max-w-[300px] mx-auto">Non hai nessuna parola. Ascolta gli altri e fingi!</p>
                </div>
              ) : (
                <div className="text-6xl sm:text-7xl font-black text-indigo-600 break-words w-full px-4">{player.word}</div>
              )}
              
              <button
                onClick={handleNextPlayer}
                className="mt-12 bg-slate-800 text-white px-10 py-5 rounded-full font-bold text-xl flex items-center gap-4 hover:bg-slate-700 transition-colors w-full justify-center"
              >
                <EyeOff size={28} /> Nascondi e Prosegui
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPlaying = () => (
    <div className="flex flex-col w-full p-8 sm:p-12 flex-1 relative animate-fadeIn">
      {/* Modale Eliminazione */}
      {eliminatedJustNow && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-6 sm:rounded-[3rem]">
          <div className="bg-white rounded-[2.5rem] p-10 sm:p-12 max-w-lg w-full text-center space-y-8 shadow-2xl animate-bounce-in">
            <Skull size={88} className="mx-auto text-slate-800" />
            <div>
              <h3 className="text-5xl font-black text-slate-800">{eliminatedJustNow.name}</h3>
              <p className="text-2xl text-slate-500 mt-3">è stato eliminato!</p>
            </div>
            
            <div className="p-8 bg-slate-100 rounded-[2rem]">
              <div className="text-base font-bold text-slate-400 uppercase mb-3">Il suo ruolo era</div>
              <div className={`text-4xl font-black ${
                eliminatedJustNow.role === 'Civile' ? 'text-emerald-500' : 
                eliminatedJustNow.role === 'Undercover' ? 'text-rose-500' : 'text-slate-600'
              }`}>
                {eliminatedJustNow.role}
              </div>
            </div>

            {eliminatedJustNow.role === 'Mr. White' ? (
              <form onSubmit={handleMrWhiteGuessSubmit} className="space-y-6 pt-4">
                <p className="text-lg font-bold text-amber-600">
                  Mr. White, hai un'ultima possibilità! Scrivi la parola dei Civili per vincere.
                </p>
                <input
                  type="text"
                  value={mrWhiteGuess}
                  onChange={(e) => setMrWhiteGuess(e.target.value)}
                  placeholder="Inserisci la parola segreta..."
                  className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-xl text-center font-bold text-slate-700"
                  autoFocus
                />
                <div className="flex gap-4">
                  <button 
                    type="submit" 
                    disabled={!mrWhiteGuess.trim()}
                    className="flex-1 bg-amber-500 disabled:bg-amber-300 disabled:cursor-not-allowed text-white py-5 rounded-2xl font-bold text-xl hover:bg-amber-600 transition-colors"
                  >
                    Conferma
                  </button>
                  <button 
                    type="button" 
                    onClick={() => { setMrWhiteGuess(''); dismissEliminationMessage(); }} 
                    className="flex-1 bg-slate-200 text-slate-700 py-5 rounded-2xl font-bold text-xl hover:bg-slate-300 transition-colors"
                  >
                    Non lo so
                  </button>
                </div>
              </form>
            ) : (
              <button 
                onClick={dismissEliminationMessage}
                className="w-full bg-indigo-600 text-white py-5 mt-6 rounded-2xl font-bold text-xl hover:bg-indigo-700 transition-colors"
              >
                Continua
              </button>
            )}
          </div>
        </div>
      )}

      <div className="text-center mb-10">
        <h2 className="text-4xl font-black text-slate-800">Fase di Gioco</h2>
        <p className="text-slate-500 text-lg mt-3">Discutete tra di voi e votate chi eliminare.</p>
      </div>

      <div className="space-y-5 flex-1 overflow-y-auto pb-8">
        {players.map((player) => (
          <div 
            key={player.id} 
            className={`flex items-center justify-between p-6 sm:p-8 rounded-[1.5rem] border transition-all ${
              player.isAlive ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-100 border-slate-200 opacity-60 grayscale'
            }`}
          >
            <div className="flex items-center gap-6">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-2xl ${
                player.isAlive ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-500'
              }`}>
                {player.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className={`font-bold text-xl sm:text-2xl ${player.isAlive ? 'text-slate-800' : 'text-slate-500 line-through'}`}>
                  {player.name}
                </div>
                {!player.isAlive && (
                  <div className="text-base font-semibold text-rose-500 mt-1">{player.role}</div>
                )}
              </div>
            </div>
            
            {player.isAlive && (
              <button 
                onClick={() => eliminatePlayer(player.id)}
                className="bg-rose-100 text-rose-600 px-6 py-3 rounded-xl text-base sm:text-lg font-bold hover:bg-rose-200 transition-colors"
              >
                Elimina
              </button>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-6 bg-indigo-50 rounded-[1.5rem] border border-indigo-100 text-center">
        <div className="text-base font-bold text-indigo-800 mb-3">Stato Partita</div>
        <div className="flex justify-center gap-8 text-base font-bold text-indigo-600">
          <span>{players.filter(p => p.role === 'Civile' && p.isAlive).length} Civili</span>
          <span>{players.filter(p => p.role === 'Undercover' && p.isAlive).length} Undercover</span>
          <span>{players.filter(p => p.role === 'Mr. White' && p.isAlive).length} Mr. White</span>
        </div>
      </div>
    </div>
  );

  const renderGameOver = () => {
    let winTitle = '';
    let winColor = '';
    let winDesc = '';

    if (winner === 'civili') {
      winTitle = 'I CIVILI VINCONO!';
      winColor = 'text-emerald-500 bg-emerald-50 border-emerald-100';
      winDesc = 'Hanno trovato tutti gli impostori.';
    } else if (winner === 'undercover') {
      winTitle = 'GLI UNDERCOVER VINCONO!';
      winColor = 'text-rose-500 bg-rose-50 border-rose-100';
      winDesc = 'Sono riusciti a mimetizzarsi perfettamente.';
    } else if (winner === 'mrWhite') {
      winTitle = 'MR. WHITE VINCE!';
      winColor = 'text-slate-800 bg-slate-100 border-slate-200';
      winDesc = 'Ha indovinato la parola o è sopravvissuto fino alla fine!';
    }

    return (
      <div className="flex flex-col w-full p-8 sm:p-12 flex-1 justify-center text-center animate-fadeIn space-y-10">
        <div className={`p-12 rounded-[3rem] ${winColor} border`}>
          <Crown size={96} className="mx-auto mb-8 opacity-80" />
          <h2 className="text-5xl sm:text-6xl font-black mb-6">{winTitle}</h2>
          <p className="font-medium text-xl sm:text-2xl opacity-80">{winDesc}</p>
        </div>

        {/* --- INIZIO NUOVO CODICE CLASSIFICA --- */}
        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-200 p-10 space-y-8">
          <h3 className="text-3xl font-bold text-slate-800">Classifica Punti</h3>
          <div className="space-y-4">
            {playersInput.map(name => ({ name, score: scores[name] || 0 }))
              .sort((a, b) => b.score - a.score)
              .map(({ name, score }) => (
                <div key={name} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="font-bold text-xl text-slate-700">{name}</span>
                  <span className="font-black text-2xl text-indigo-600">{score} pt</span>
                </div>
              ))}
          </div>
        </div>
        {/* --- FINE NUOVO CODICE CLASSIFICA --- */}

        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-200 p-10 space-y-8">
          <h3 className="text-3xl font-bold text-slate-800">Riepilogo Parole</h3>
          <div className="grid grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-emerald-50 p-8 rounded-[2rem] border border-emerald-100">
              <div className="text-base font-bold text-emerald-600 uppercase mb-3">Civili</div>
              <div className="text-3xl sm:text-4xl font-black text-emerald-800 break-words">{civilianWord}</div>
            </div>
            <div className="bg-rose-50 p-8 rounded-[2rem] border border-rose-100">
              <div className="text-base font-bold text-rose-600 uppercase mb-3">Undercover</div>
              <div className="text-3xl sm:text-4xl font-black text-rose-800 break-words">{undercoverWord}</div>
            </div>
          </div>
        </div>

        <button
          onClick={resetGame}
          className="w-full bg-slate-800 hover:bg-slate-900 text-white p-8 rounded-[2.5rem] font-bold text-2xl sm:text-3xl transition-all shadow-lg shadow-slate-200 active:scale-95 flex items-center justify-center gap-4"
        >
          <RefreshCw size={32} />
          Nuova Partita
        </button>
      </div>
    );
  };


  return (
    // Il contenitore root ora è "fixed inset-0" per coprire tutto lo schermo ed eliminare lo sfondo nero di default
    <div className="fixed inset-0 w-full h-full overflow-y-auto bg-[#e2e8f0] font-sans text-slate-900 selection:bg-indigo-100">
      <div className="min-h-full flex items-center justify-center sm:p-8">
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes bounceIn { 
            0% { opacity: 0; transform: scale(0.9); } 
            50% { opacity: 1; transform: scale(1.05); } 
            100% { opacity: 1; transform: scale(1); } 
          }
          .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
          .animate-bounce-in { animation: bounceIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        `}} />
        
        {/* Contenitore Principale (Ora impostato a max-w-4xl, molto più largo) */}
        <div className="w-full max-w-4xl bg-slate-50 sm:bg-white sm:shadow-2xl sm:rounded-[3rem] sm:border border-slate-200 flex flex-col relative mx-auto sm:min-h-[85vh]">
          {gameState === 'setup' && renderSetup()}
          {gameState === 'distribution' && renderDistribution()}
          {gameState === 'playing' && renderPlaying()}
          {gameState === 'gameover' && renderGameOver()}
        </div>
        <div className="mt-8 mb-4 text-slate-500 font-bold text-lg animate-fadeIn">
          Made by <span className="text-red-600">Pisellino</span> with Love ❤️
        </div>
      </div>
    </div>
  );
}