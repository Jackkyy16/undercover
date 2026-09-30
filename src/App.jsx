
import './index.css'
import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Trash2, Eye, EyeOff, Play, Skull, Crown, AlertCircle, RefreshCw, Shield, VenetianMask, Ghost, Fingerprint, Sparkles, Trophy, Minus, Plus, HatGlasses, Vote } from 'lucide-react';

import logoImage from '/matteo.png';

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
  ['Gravità', 'Magnetismo'], ['Elettricità', 'Energia Solare'],

  // --- NUOVE PAROLE (SEMPLICI) ---

  // CIBO E BEVANDE
  ['Carbonara', 'Amatriciana'], ['Spaghetti', 'Bucatini'], ['Penne', 'Fusilli'], ['Minestrone', 'Vellutata'],
  ['Cotoletta', 'Bistecca'], ['Maritozzo', 'Bignè'], ['Pizzetta', 'Calzone'], ['Supplì', 'Arancino'],
  ['Olive', 'Capperi'], ['Pomodoro', 'Peperone'], ['Cetriolo', 'Ravanello'], ['Lecca-lecca', 'Caramella'],
  ['Chewing gum', 'Mentina'], ['Taralli', 'Grissini'], ['Crackers', 'Gallette'], ['Brodo', 'Zuppa'],
  ['Aranciata', 'Limonata'], ['Cappuccino', 'Latte macchiato'], ['Espresso', 'Americano'], ['Succo di frutta', 'Spremuta'],
  ['Merendina', 'Snack'], ['Uva', 'Uvetta'], ['Cocco', 'Banana'], ['Zucchero filato', 'Mela caramellata'],
  ['Barbecue', 'Grigliata'], ['Picnic', 'Pranzo al sacco'], ['Colazione', 'Merenda'], ['Pranzo', 'Cena'],
  ['Aperitivo', 'Apericena'],

  // CASA E OGGETTI
  ['Finestra', 'Porta'], ['Balcone', 'Terrazzo'], ['Cantina', 'Soffitta'], ['Garage', 'Posto auto'],
  ['Vasca', 'Doccia'], ['Lavandino', 'Bidet'], ['Cucina', 'Salotto'], ['Camera da letto', 'Cameretta'],
  ['Lenzuolo', 'Piumone'], ['Materasso', 'Brandina'], ['Busta', 'Sacchetto'], ['Scatola', 'Cassetta'],
  ['Barattolo', 'Vasetto'], ['Radio', 'Giradischi'], ['Libro', 'Rivista'], ['Giornale', 'Volantino'],
  ['Lettera', 'Cartolina'], ['Francobollo', 'Timbro'], ['Candeggina', 'Detersivo'], ['Termosifone', 'Camino'],

  // GIOCHI E GIOCATTOLI
  ['Palla', 'Pallone'], ['Bambola', 'Peluche'], ['Puzzle', 'Cruciverba'], ['Aquilone', 'Palloncino'],
  ['Trottola', 'Yo-yo'], ['Biglia', 'Pallina'], ['Nascondino', 'Acchiapparella'], ['Briscola', 'Scala quaranta'],
  ['Tombola', 'Lotteria'], ['Gratta e vinci', 'Lotto'], ['Cluedo', 'Risiko'], ['Jenga', 'Domino'],

  // ANIMALI E NATURA
  ['Cavallo', 'Asino'], ['Pony', 'Unicorno'], ['Pesce rosso', 'Pesce palla'], ['Gattino', 'Cucciolo'],
  ['Rinoceronte', 'Triceratopo'], ['Dinosauro', 'Drago'], ['Tirannosauro', 'Velociraptor'], ['Struzzo', 'Emù'],
  ['Neve', 'Ghiaccio'], ['Temporale', 'Uragano'], ['Terremoto', 'Tsunami'], ['Onda', 'Marea'],
  ['Conchiglia', 'Perla'], ['Fiore', 'Pianta'], ['Fuochi d\'artificio', 'Petardo'], ['Primavera', 'Autunno'],
  ['Mattina', 'Pomeriggio'], ['Notte', 'Sera'],

  // LUOGHI
  ['Montagne russe', 'Autoscontro'], ['Parco giochi', 'Oratorio'], ['Asilo', 'Scuola elementare'], ['Università', 'Accademia'],
  ['Mensa', 'Self-service'], ['Pizzeria', 'Paninoteca'], ['Gelateria', 'Yogurteria'], ['Autogrill', 'Benzinaio'],
  ['Autostrada', 'Superstrada'], ['Rotonda', 'Semaforo'], ['Marciapiede', 'Strisce pedonali'], ['Ascensore', 'Scala mobile'],
  ['Centro commerciale', 'Outlet'], ['Spa', 'Terme'], ['Sauna', 'Bagno turco'], ['Barbiere', 'Parrucchiere'],
  ['Canile', 'Gattile'],

  // PERSONAGGI E MESTIERI
  ['Veterinario', 'Pediatra'], ['Pompiere', 'Vigile'], ['Postino', 'Fattorino'], ['Contadino', 'Allevatore'],
  ['Pescatore', 'Marinaio'], ['Pirata', 'Corsaro'], ['Cavaliere', 'Guerriero'], ['Ninja', 'Samurai'],
  ['Re', 'Imperatore'], ['Regina', 'Principessa'], ['Principe', 'Conte'], ['Strega', 'Fata'],
  ['Mago', 'Stregone'], ['Fantasma', 'Spirito'], ['Zombie', 'Mummia'], ['Babbo Natale', 'Befana'],
  ['Elfo', 'Folletto'], ['Batman', 'Superman'], ['Spiderman', 'Iron Man'], ['Topolino', 'Paperino'],
  ['Cenerentola', 'Biancaneve'], ['Pinocchio', 'Peter Pan'], ['Shrek', 'Madagascar'],

  // TECNOLOGIA E POP
  ['Harry Potter', 'Il Signore degli Anelli'], ['Pokémon', 'Digimon'], ['Super Mario', 'Sonic'], ['Minecraft', 'Fortnite'],
  ['PlayStation', 'Xbox'], ['Netflix', 'Prime Video'], ['Instagram', 'TikTok'], ['WhatsApp', 'Telegram'],
  ['Google', 'Wikipedia'], ['Emoji', 'Sticker'], ['Selfie', 'Foto di gruppo'], ['Messaggio', 'Email'],
  ['Videochiamata', 'Telefonata'], ['Disney', 'Pixar'], ['Sanremo', 'Eurovision'],

  // EVENTI E MOMENTI
  ['Compleanno', 'Anniversario'], ['Matrimonio', 'Battesimo'], ['Festa a sorpresa', 'Addio al celibato'], ['Carnevale', 'Halloween'],
  ['Capodanno', 'Ferragosto'], ['Pasqua', 'Pasquetta'], ['Gita', 'Escursione'], ['Crociera', 'Villaggio turistico'],
  ['Esame', 'Interrogazione'], ['Compito', 'Verifica'], ['Colloquio', 'Riunione'], ['Sciopero', 'Manifestazione'],
  ['Karaoke', 'Talent show'],

  // SPORT
  ['Portiere', 'Difensore'], ['Arbitro', 'Allenatore'], ['Rigore', 'Punizione'], ['Gol', 'Canestro'],
  ['Inter', 'Milan'], ['Maratona', 'Staffetta'], ['Olimpiadi', 'Mondiali'], ['Tuffo', 'Capriola'],

  // CORPO E GESTI
  ['Mano', 'Piede'], ['Ginocchio', 'Gomito'], ['Capelli', 'Barba'], ['Baffi', 'Pizzetto'],
  ['Sorriso', 'Risata'], ['Lacrima', 'Sudore'], ['Starnuto', 'Tosse'], ['Singhiozzo', 'Sbadiglio'],
  ['Bacio', 'Abbraccio'], ['Tatuaggio', 'Piercing'], ['Lentiggini', 'Nei'],

  // MEZZI DI TRASPORTO
  ['Monopattino', 'Hoverboard'], ['Trattore', 'Ruspa'], ['Camion', 'Furgone'], ['Elicottero', 'Idrovolante'],
  ['Funivia', 'Seggiovia'], ['Motoscafo', 'Gommone'], ['Pedalò', 'Canotto'], ['Frecciarossa', 'Italo'],

  // MUSICA E ARTE
  ['Tromba', 'Trombone'], ['Ukulele', 'Mandolino'], ['Microfono', 'Altoparlante'], ['Rap', 'Trap'],
  ['Rock', 'Metal'], ['Opera', 'Musical'], ['Valzer', 'Tango'], ['Pastelli', 'Acquerelli']
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

// --- STILE ---
const avatarGradients = [
  'from-violet-500 to-fuchsia-500',
  'from-sky-400 to-indigo-500',
  'from-emerald-400 to-teal-600',
  'from-amber-400 to-orange-600',
  'from-rose-400 to-pink-600',
  'from-cyan-400 to-blue-600',
  'from-lime-400 to-emerald-600',
  'from-fuchsia-400 to-purple-700',
];

// Colore avatar stabile in base al nome
const avatarGradient = (name) => {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
  return avatarGradients[Math.abs(hash) % avatarGradients.length];
};

const roleStyles = {
  'Civile': {
    text: 'text-emerald-300',
    badge: 'bg-emerald-400/15 text-emerald-300 border-emerald-400/30',
    glow: 'shadow-[0_0_60px_-10px_rgba(52,211,153,0.55)]',
  },
  'Undercover': {
    text: 'text-rose-400',
    badge: 'bg-rose-500/15 text-rose-300 border-rose-400/30',
    glow: 'shadow-[0_0_60px_-10px_rgba(244,63,94,0.6)]',
  },
  'Mr. White': {
    text: 'text-white',
    badge: 'bg-white/10 text-white border-white/30',
    glow: 'shadow-[0_0_60px_-10px_rgba(255,255,255,0.45)]',
  },
};

const roleOptions = [
  { id: 'civili', label: 'Civili', desc: 'Hanno la parola segreta', icon: Shield, accent: 'text-emerald-300', chip: 'bg-emerald-400/15 border-emerald-400/30' },
  { id: 'undercover', label: 'Undercover', desc: 'Hanno una parola simile', icon: VenetianMask, accent: 'text-rose-300', chip: 'bg-rose-500/15 border-rose-400/30' },
  { id: 'mrWhite', label: 'Mr. White', desc: 'Non ha nessuna parola', icon: Ghost, accent: 'text-white', chip: 'bg-white/10 border-white/25' },
];

const winThemes = {
  civili: {
    title: 'I CIVILI VINCONO!',
    desc: 'Hanno trovato tutti gli impostori.',
    gradient: 'from-emerald-300 via-teal-200 to-cyan-300',
    glow: 'rgba(52,211,153,0.45)',
    ring: 'border-emerald-400/30',
  },
  undercover: {
    title: 'GLI UNDERCOVER VINCONO!',
    desc: 'Sono riusciti a mimetizzarsi perfettamente.',
    gradient: 'from-rose-400 via-fuchsia-400 to-orange-300',
    glow: 'rgba(244,63,94,0.45)',
    ring: 'border-rose-400/30',
  },
  mrWhite: {
    title: 'MR. WHITE VINCE!',
    desc: 'Ha indovinato la parola o è sopravvissuto fino alla fine!',
    gradient: 'from-white via-slate-200 to-violet-300',
    glow: 'rgba(255,255,255,0.35)',
    ring: 'border-white/30',
  },
};

const medalStyles = [
  'bg-linear-to-br from-amber-200 to-yellow-500 text-amber-950 shadow-[0_0_25px_-5px_rgba(252,211,77,0.8)]',
  'bg-linear-to-br from-slate-100 to-slate-400 text-slate-900',
  'bg-linear-to-br from-orange-300 to-amber-700 text-orange-950',
];

// Parole lunghe = font più piccolo, così stanno nella carta anche su mobile
const wordSize = (word) => {
  if (word.length <= 6) return 'text-5xl sm:text-7xl';
  if (word.length <= 10) return 'text-4xl sm:text-6xl';
  return 'text-3xl sm:text-5xl';
};

const confettiColors = ['#a78bfa', '#f0abfc', '#fb7185', '#fcd34d', '#34d399', '#22d3ee'];
const confettiPieces = Array.from({ length: 56 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  color: confettiColors[i % confettiColors.length],
  delay: `${(i % 14) * 0.09}s`,
  dx: `${((i * 53) % 200) - 100}px`,
  rot: `${((i * 97) % 900) - 450}deg`,
  round: i % 3 === 0,
}));

function Confetti() {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden="true">
      {confettiPieces.map((p, i) => (
        <span
          key={i}
          className="confetti"
          style={{
            left: p.left,
            background: p.color,
            animationDelay: p.delay,
            '--dx': p.dx,
            '--rot': p.rot,
            ...(p.round && { width: 10, height: 10, borderRadius: 9999 }),
          }}
        />
      ))}
    </div>
  );
}

export default function App() {
  const [scores, setScores] = useState({}); // NUOVO: Stato per i punteggi

  // Stati principali: 'setup', 'distribution', 'playing', 'gameover'
  const [gameState, setGameState] = useState('setup');
  
  // Setup state
  const [playersInput, setPlayersInput] = useState([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [rolesCount, setRolesCount] = useState({ civili: 0, undercover: 0, mrWhite: 0 });
  
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
    <div className="flex flex-col gap-6 sm:gap-8 w-full flex-1">
      <header className="text-center pt-2 animate-fadeIn">
        <div className="glass inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-mono text-[11px] sm:text-xs tracking-[0.25em] text-violet-200/80 uppercase mb-6">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          Missione classificata
        </div>
        <h1 className="font-display font-black tracking-tight leading-none text-[clamp(1.9rem,9.5vw,5.5rem)]">
          <span className="glitch" data-text="UNDERCOVER">
            <span className="text-gradient">UNDERCOVER</span>
          </span>
        </h1>
        <p className="mt-4 text-white/60 font-medium text-base sm:text-xl">Trova l'impostore tra di voi!</p>
      </header>

      <div className="flex justify-center py-4 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
        <div className="relative polaroid w-64 sm:w-80">
          <div className="tape" />
          <img
            src={logoImage}
            alt="Logo Undercover"
            className="w-full aspect-[4/3] object-cover rounded-sm"
          />
          <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between font-mono text-[11px] sm:text-xs font-bold text-stone-600 tracking-widest">
            <span>SOGGETTO: MATTEO</span>
            <span>#007</span>
          </div>
          <div className="stamp absolute top-6 right-5 text-rose-600 bg-rose-50/85 text-xs sm:text-sm animate-stamp">
            Sospettato
          </div>
        </div>
      </div>

      <section className="glass rounded-[2rem] p-4 sm:p-8 space-y-5 animate-fadeIn" style={{ animationDelay: '0.15s' }}>
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display font-bold text-lg sm:text-2xl flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-400/30 flex items-center justify-center">
              <Users size={20} className="text-violet-300" />
            </span>
            Giocatori
          </h2>
          <span className="font-mono text-sm px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70">
            {playersInput.length}
          </span>
        </div>

        <form onSubmit={addPlayer} className="flex gap-3">
          <input
            type="text"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            placeholder="Nome giocatore..."
            className="field flex-1 min-w-0 px-5 py-4 rounded-2xl text-lg"
          />
          <button type="submit" aria-label="Aggiungi giocatore" className="btn-primary px-5 sm:px-6 rounded-2xl">
            <UserPlus size={26} />
          </button>
        </form>

        {playersInput.length === 0 ? (
          <p className="text-center text-white/35 text-sm sm:text-base py-3 font-mono">
            Nessun agente reclutato… ancora.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2.5 max-h-64 overflow-y-auto pt-1">
            {playersInput.map((p, i) => (
              <div
                key={p}
                className="flex items-center gap-2.5 bg-white/5 border border-white/10 pl-1.5 pr-3 py-1.5 rounded-full text-base sm:text-lg font-semibold animate-bounce-in"
              >
                <span className={`w-8 h-8 rounded-full bg-linear-to-br ${avatarGradient(p)} flex items-center justify-center text-sm font-black`}>
                  {p.charAt(0).toUpperCase()}
                </span>
                {p}
                <button
                  onClick={() => removePlayer(i)}
                  aria-label={`Rimuovi ${p}`}
                  className="text-white/30 hover:text-rose-400 transition-colors ml-1"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="glass rounded-[2rem] p-4 sm:p-8 space-y-5 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display font-bold text-lg sm:text-2xl flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-fuchsia-500/20 border border-fuchsia-400/30 flex items-center justify-center">
              <HatGlasses size={20} className="text-fuchsia-300" />
            </span>
            Ruoli
          </h2>
          <span className={`font-mono text-sm px-3 py-1 rounded-full border ${
            isSetupValid
              ? 'bg-emerald-400/10 border-emerald-400/30 text-emerald-300'
              : 'bg-amber-400/10 border-amber-400/30 text-amber-300'
          }`}>
            {totalRoles}/{playersInput.length}
          </span>
        </div>

        <div className="space-y-3">
          {roleOptions.map(role => {
            const Icon = role.icon;
            return (
              <div key={role.id} className="flex items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <span className={`shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl border flex items-center justify-center ${role.chip}`}>
                    <Icon size={22} className={role.accent} />
                  </span>
                  <div className="min-w-0">
                    <div className="font-bold text-base sm:text-xl">{role.label}</div>
                    <div className="text-xs sm:text-base text-white/45">{role.desc}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
                  <button
                    onClick={() => updateRoleCount(role.id, -1)}
                    aria-label={`Meno ${role.label}`}
                    className="btn-ghost w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center"
                  >
                    <Minus size={20} />
                  </button>
                  <span
                    key={rolesCount[role.id]}
                    className={`w-8 text-center font-display font-black text-2xl ${role.accent} animate-bounce-in`}
                  >
                    {rolesCount[role.id]}
                  </span>
                  <button
                    onClick={() => updateRoleCount(role.id, 1)}
                    aria-label={`Più ${role.label}`}
                    className="btn-ghost w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {!isSetupValid && (
          <div className="p-4 sm:p-5 bg-amber-400/[0.07] rounded-2xl flex items-start gap-3 text-sm sm:text-base text-amber-200/90 border border-amber-400/25">
            <AlertCircle size={22} className="mt-0.5 shrink-0 text-amber-300" />
            <p>I ruoli totali ({totalRoles}) devono essere uguali ai giocatori ({playersInput.length}). Servono almeno 3 giocatori e 1 Civile.</p>
          </div>
        )}
      </section>

      <div className="sticky bottom-4 z-20 mt-auto pt-2">
        <button
          onClick={startGame}
          disabled={!isSetupValid}
          className="btn-primary w-full py-5 sm:py-6 rounded-2xl font-display font-bold text-lg sm:text-2xl tracking-wide flex items-center justify-center gap-3"
        >
          <Play size={28} fill="currentColor" /> INIZIA PARTITA
        </button>
      </div>
    </div>
  );

  const renderDistribution = () => {
    const player = players[currentPlayerIndex];
    const isMrWhite = player.role === 'Mr. White';
    return (
      <div className="flex flex-col items-center justify-center flex-1 w-full text-center">
        <div className="flex flex-col items-center gap-3 mb-8 animate-fadeIn">
          <div className="font-mono text-xs sm:text-sm tracking-[0.3em] uppercase text-white/50">
            Giocatore {currentPlayerIndex + 1} di {players.length}
          </div>
          <div className="flex gap-1.5 flex-wrap justify-center max-w-xs">
            {players.map((p, i) => (
              <span
                key={p.id}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i < currentPlayerIndex ? 'w-4 bg-violet-400'
                  : i === currentPlayerIndex ? 'w-10 bg-linear-to-r from-violet-400 to-fuchsia-400'
                  : 'w-4 bg-white/15'
                }`}
              />
            ))}
          </div>
        </div>

        {/* key: ogni giocatore riparte con la carta coperta, senza animazione di ritorno */}
        <div key={currentPlayerIndex} className="w-full flex flex-col items-center animate-fadeIn">
          <p className="text-white/50 text-lg sm:text-xl font-medium">Passa il telefono a</p>
          <h2 className="font-display font-black text-4xl sm:text-6xl mt-2 mb-10 break-words max-w-full">
            <span className="text-gradient">{player.name}</span>
          </h2>

          <div className="flip w-full max-w-sm sm:max-w-md h-[440px] sm:h-[480px]">
            <div className={`flip-inner w-full h-full ${isWordRevealed ? 'is-flipped' : ''}`}>
              <button
                type="button"
                onClick={handleReveal}
                disabled={isWordRevealed}
                className="flip-face card-pattern group rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col items-center justify-center gap-8 p-8 cursor-pointer overflow-hidden"
              >
                <div className="absolute top-6 left-7 right-7 flex justify-between font-mono text-[10px] sm:text-xs tracking-[0.25em] text-white/40 uppercase">
                  <span>Top Secret</span>
                  <span>#{String(currentPlayerIndex + 1).padStart(3, '0')}</span>
                </div>
                <div className="relative w-32 h-32 sm:w-36 sm:h-36">
                  <span className="pulse-ring" />
                  <span className="pulse-ring" style={{ animationDelay: '1.2s' }} />
                  <div className="relative w-full h-full rounded-full bg-violet-500/15 border border-violet-400/40 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:bg-violet-500/25">
                    <Fingerprint size={72} strokeWidth={1.4} className="text-violet-200" />
                  </div>
                </div>
                <div>
                  <div className="font-display font-bold text-xl sm:text-2xl">Tocca per rivelare</div>
                  <div className="text-white/45 text-sm sm:text-base mt-2">Assicurati che nessuno stia guardando</div>
                </div>
                <div className="absolute bottom-6 font-mono text-[10px] sm:text-xs tracking-[0.3em] text-white/25 uppercase">
                  Solo per i tuoi occhi
                </div>
              </button>

              <div className={`flip-face flip-back rounded-[2.5rem] border flex flex-col items-center justify-center p-7 sm:p-10 overflow-hidden ${
                isMrWhite
                  ? 'bg-linear-to-br from-white to-slate-300 text-slate-900 border-white shadow-[0_0_80px_-20px_rgba(255,255,255,0.6)]'
                  : 'card-pattern border-violet-400/30 shadow-[0_0_80px_-20px_rgba(167,139,250,0.7)]'
              }`}>
                {isWordRevealed && (
                  <div className="flex flex-col items-center w-full gap-8 animate-fadeIn">
                    <div className={`font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.3em] ${isMrWhite ? 'text-slate-500' : 'text-violet-300/70'}`}>
                      {isMrWhite ? 'La tua identità' : 'La tua parola'}
                    </div>
                    {isMrWhite ? (
                      <div className="space-y-4">
                        <Ghost size={60} className="mx-auto animate-floaty" />
                        <div className="font-display font-black text-3xl sm:text-4xl leading-tight">TU SEI<br />MR. WHITE</div>
                        <p className="text-slate-600 text-base sm:text-lg max-w-[280px] mx-auto">Non hai nessuna parola. Ascolta gli altri e fingi!</p>
                      </div>
                    ) : (
                      <div className={`font-display font-black ${wordSize(player.word)} leading-tight break-words hyphens-auto w-full text-white drop-shadow-[0_0_30px_rgba(167,139,250,0.65)]`}>
                        {player.word}
                      </div>
                    )}
                    <button
                      onClick={handleNextPlayer}
                      className={`mt-2 w-full px-6 py-4 sm:py-5 rounded-full font-bold text-lg sm:text-xl flex items-center justify-center gap-3 transition-all active:scale-95 ${
                        isMrWhite ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-white text-slate-900 hover:bg-violet-100'
                      }`}
                    >
                      <EyeOff size={24} /> Nascondi e Prosegui
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPlaying = () => {
    const stats = [
      { label: 'Civili', icon: Shield, accent: 'text-emerald-300', count: players.filter(p => p.role === 'Civile' && p.isAlive).length },
      { label: 'Undercover', icon: VenetianMask, accent: 'text-rose-300', count: players.filter(p => p.role === 'Undercover' && p.isAlive).length },
      { label: 'Mr. White', icon: Ghost, accent: 'text-white', count: players.filter(p => p.role === 'Mr. White' && p.isAlive).length },
    ];

    return (
      // Niente animazioni su questo contenitore: un transform romperebbe il "fixed" della modale
      <div className="flex flex-col w-full flex-1">
        {/* Modale Eliminazione */}
        {eliminatedJustNow && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md animate-fadeIn">
            <div className="min-h-full flex items-center justify-center p-4 sm:p-6">
              <div className="relative glass bg-[#120e24]/90 rounded-[2.5rem] p-7 sm:p-12 max-w-lg w-full text-center space-y-7 overflow-hidden animate-bounce-in">
                <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-rose-600/30 blur-3xl pointer-events-none" />

                <div className="relative mx-auto w-24 h-24 rounded-full bg-rose-500/15 border border-rose-400/40 flex items-center justify-center shadow-[0_0_60px_-5px_rgba(244,63,94,0.7)]">
                  <Skull size={52} className="text-rose-300" />
                </div>

                <div className="relative">
                  <h3 className="font-display font-black text-4xl sm:text-5xl break-words">{eliminatedJustNow.name}</h3>
                  <p className="text-xl sm:text-2xl text-white/55 mt-3">è stato eliminato!</p>
                </div>

                <div className={`relative p-6 sm:p-8 rounded-[1.75rem] bg-black/30 border border-white/10 ${roleStyles[eliminatedJustNow.role].glow}`}>
                  <div className="font-mono text-xs sm:text-sm font-bold text-white/40 uppercase tracking-[0.3em] mb-4">Il suo ruolo era</div>
                  <div className={`font-display font-black text-3xl sm:text-4xl ${roleStyles[eliminatedJustNow.role].text} animate-stamp`}>
                    {eliminatedJustNow.role}
                  </div>
                </div>

                {eliminatedJustNow.role === 'Mr. White' ? (
                  <form onSubmit={handleMrWhiteGuessSubmit} className="relative space-y-5 pt-2">
                    <p className="text-base sm:text-lg font-bold text-amber-300">
                      Mr. White, hai un'ultima possibilità! Scrivi la parola dei Civili per vincere.
                    </p>
                    <input
                      type="text"
                      value={mrWhiteGuess}
                      onChange={(e) => setMrWhiteGuess(e.target.value)}
                      placeholder="Inserisci la parola segreta..."
                      className="field w-full px-5 py-4 rounded-2xl text-xl text-center font-bold focus:!border-amber-400/70 focus:!shadow-[0_0_0_4px_rgba(251,191,36,0.2)]"
                      autoFocus
                    />
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={!mrWhiteGuess.trim()}
                        className="flex-1 bg-linear-to-r from-amber-400 to-orange-500 text-amber-950 disabled:opacity-40 disabled:cursor-not-allowed py-4 sm:py-5 rounded-2xl font-bold text-lg sm:text-xl transition-all hover:brightness-110 active:scale-95 shadow-[0_10px_30px_-10px_rgba(251,191,36,0.7)]"
                      >
                        Conferma
                      </button>
                      <button
                        type="button"
                        onClick={() => { setMrWhiteGuess(''); dismissEliminationMessage(); }}
                        className="btn-ghost flex-1 py-4 sm:py-5 rounded-2xl font-bold text-lg sm:text-xl"
                      >
                        Non lo so
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    onClick={dismissEliminationMessage}
                    className="btn-primary relative w-full py-5 rounded-2xl font-bold text-xl"
                  >
                    Continua
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <header className="text-center mb-6 sm:mb-8 animate-fadeIn">
          <div className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.3em] uppercase text-rose-300/80 mb-3">
            <Vote size={14} /> Votazione in corso
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl">Fase di Gioco</h2>
          <p className="text-white/55 text-base sm:text-lg mt-3">Discutete tra di voi e votate chi eliminare.</p>
        </header>

        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          {stats.map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="glass rounded-2xl p-3 sm:p-5 text-center">
                <Icon size={20} className={`mx-auto mb-1.5 ${stat.accent}`} />
                <div key={stat.count} className={`font-display font-black text-2xl sm:text-4xl ${stat.accent} animate-bounce-in`}>{stat.count}</div>
                <div className="text-[10px] sm:text-sm font-semibold text-white/50 uppercase tracking-wider mt-0.5">{stat.label}</div>
              </div>
            );
          })}
        </div>

        <div className="space-y-3 flex-1">
          {players.map((player, i) => (
            <div
              key={player.id}
              style={{ animationDelay: `${0.15 + i * 0.05}s` }}
              className={`animate-fadeIn flex items-center justify-between gap-3 p-3 sm:p-5 rounded-2xl border transition-all duration-500 ${
                player.isAlive ? 'glass hover:border-white/20' : 'bg-white/[0.02] border-white/5'
              }`}
            >
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div className={`shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-display font-black text-xl ${
                  player.isAlive ? `bg-linear-to-br ${avatarGradient(player.name)} shadow-lg` : 'bg-white/5 text-white/40'
                }`}>
                  {player.isAlive ? player.name.charAt(0).toUpperCase() : <Skull size={22} />}
                </div>
                <div className="min-w-0">
                  <div className={`font-bold text-lg sm:text-2xl truncate ${player.isAlive ? '' : 'line-through text-white/40'}`}>
                    {player.name}
                  </div>
                  {!player.isAlive && (
                    <span className={`inline-block mt-1 text-xs sm:text-sm font-bold px-2.5 py-0.5 rounded-full border ${roleStyles[player.role].badge}`}>
                      {player.role}
                    </span>
                  )}
                </div>
              </div>

              {player.isAlive && (
                <button
                  onClick={() => eliminatePlayer(player.id)}
                  className="shrink-0 flex items-center gap-2 bg-rose-500/15 text-rose-300 border border-rose-500/30 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-bold transition-all hover:bg-rose-500 hover:text-white hover:shadow-[0_0_30px_-5px_rgba(244,63,94,0.8)] active:scale-95"
                >
                  <Skull size={18} /> Elimina
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderGameOver = () => {
    const theme = winThemes[winner] ?? winThemes.civili;
    const ranking = playersInput
      .map(name => ({ name, score: scores[name] || 0 }))
      .sort((a, b) => b.score - a.score);
    const maxScore = Math.max(1, ...ranking.map(r => r.score));

    return (
      <div className="relative flex flex-col w-full flex-1 justify-center text-center space-y-6 sm:space-y-8">
        <Confetti />

        <section
          className={`relative overflow-hidden glass rounded-[2.5rem] px-6 py-12 sm:p-14 border ${theme.ring} animate-bounce-in`}
          style={{ boxShadow: `0 0 120px -30px ${theme.glow}` }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(circle at 50% 0%, ${theme.glow}, transparent 65%)` }}
          />
          <div className="relative">
            <div className="relative inline-block mb-6 animate-floaty">
              <Crown size={88} strokeWidth={1.5} className="text-amber-300 drop-shadow-[0_0_25px_rgba(252,211,77,0.7)]" />
              <Sparkles size={28} className="absolute -top-2 -right-6 text-amber-200 animate-pulse" />
            </div>
            <div className="font-mono text-xs sm:text-sm tracking-[0.35em] uppercase text-white/50 mb-4">Partita conclusa</div>
            <h2 className={`font-display font-black text-[clamp(1.75rem,8vw,3.75rem)] leading-[1.05] bg-linear-to-r ${theme.gradient} bg-clip-text text-transparent`}>
              {theme.title}
            </h2>
            <p className="font-medium text-lg sm:text-2xl text-white/65 mt-5">{theme.desc}</p>
          </div>
        </section>

        <section className="glass rounded-[2rem] p-4 sm:p-10 space-y-5 text-left animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <h3 className="font-display font-bold text-xl sm:text-3xl flex items-center gap-3">
            <Trophy size={28} className="text-amber-300" /> Classifica Punti
          </h3>
          <div className="space-y-3">
            {ranking.map(({ name, score }, i) => (
              <div
                key={name}
                className={`relative overflow-hidden flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl border ${
                  i === 0 && score > 0 ? 'border-amber-300/40 bg-amber-300/[0.06]' : 'border-white/5 bg-white/[0.03]'
                }`}
              >
                <div
                  className="absolute inset-y-0 left-0 bg-linear-to-r from-violet-500/25 to-fuchsia-500/5 animate-grow"
                  style={{ width: `${(score / maxScore) * 100}%`, animationDelay: `${0.4 + i * 0.08}s` }}
                />
                <span className={`relative shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-display font-black ${
                  medalStyles[i] ?? 'bg-white/5 text-white/50'
                }`}>
                  {i + 1}
                </span>
                <span className="relative flex-1 min-w-0 font-bold text-lg sm:text-xl truncate">{name}</span>
                <span className="relative font-display font-black text-xl sm:text-2xl text-violet-200">
                  {score}<span className="text-sm text-white/40 ml-1">pt</span>
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="glass rounded-[2rem] p-4 sm:p-10 space-y-5 text-left animate-fadeIn" style={{ animationDelay: '0.3s' }}>
          <h3 className="font-display font-bold text-xl sm:text-3xl flex items-center gap-3">
            <Eye size={28} className="text-violet-300" /> Riepilogo Parole
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative overflow-hidden p-6 sm:p-8 rounded-[1.5rem] bg-emerald-400/[0.07] border border-emerald-400/25">
              <Shield size={120} className="absolute -right-5 -bottom-5 text-emerald-400/10" />
              <div className="font-mono text-xs sm:text-sm font-bold text-emerald-300/80 uppercase tracking-[0.25em] mb-2">Civili</div>
              <div className="relative font-display font-black text-2xl sm:text-4xl text-emerald-200 break-words">{civilianWord}</div>
            </div>
            <div className="relative overflow-hidden p-6 sm:p-8 rounded-[1.5rem] bg-rose-500/[0.07] border border-rose-400/25">
              <VenetianMask size={120} className="absolute -right-5 -bottom-5 text-rose-400/10" />
              <div className="font-mono text-xs sm:text-sm font-bold text-rose-300/80 uppercase tracking-[0.25em] mb-2">Undercover</div>
              <div className="relative font-display font-black text-2xl sm:text-4xl text-rose-200 break-words">{undercoverWord}</div>
            </div>
          </div>
        </section>

        <button
          onClick={resetGame}
          className="btn-primary group w-full py-6 sm:py-7 rounded-[2rem] font-display font-bold text-xl sm:text-2xl flex items-center justify-center gap-4 animate-fadeIn"
          style={{ animationDelay: '0.4s' }}
        >
          <RefreshCw size={28} className="transition-transform duration-500 group-hover:rotate-180" />
          Nuova Partita
        </button>
      </div>
    );
  };


  return (
    // Sfondo principale che copre tutto e permette lo scroll
    <div className="fixed inset-0 w-full h-full overflow-y-auto overflow-x-hidden font-sans text-white selection:bg-fuchsia-500/40">
      <div className="scene" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="grid-overlay" />
        <div className="scanline" />
        <div className="grain" />
      </div>

      <div className="relative z-10 min-h-full w-full flex flex-col items-center py-8 sm:py-12 px-4 sm:px-8">
        {/* CONTENITORE GIOCO */}
        <main className="w-full max-w-2xl flex flex-col flex-1">
          {gameState === 'setup' && renderSetup()}
          {gameState === 'distribution' && renderDistribution()}
          {gameState === 'playing' && renderPlaying()}
          {gameState === 'gameover' && renderGameOver()}
        </main>

        <footer className="mt-12 mb-2 text-white/40 font-semibold text-base sm:text-lg text-center">
          Made by{' '}
          <span className="font-bold bg-linear-to-r from-rose-400 to-fuchsia-400 bg-clip-text text-transparent">Pisellino</span>
          {' '}with Love <span className="animate-heartbeat">❤️</span>
        </footer>
      </div>
    </div>
  );
}
