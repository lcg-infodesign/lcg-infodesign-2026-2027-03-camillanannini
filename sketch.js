let myTable; //chiamo la variabile vuota che poi conterrà la tabella
let mioFont;
let maxAcqua = 0; //dico di vedere il valore massimo dell'acqua (perchè vuol dire che ci sarà un maggior numero di gocce)
let regioni = ["Abruzzo", "Basilicata", "Calabria", "Campania", "Emilia-Romagna", "Friuli-Venezia Giulia", "Lazio", "Liguria", "Lombardia", "Marche", "Molise", "Piemonte", "Puglia", "Sardegna", "Sicilia", "Toscana", "Trentino-Alto Adige / Südtirol", "Umbria", "Valle d'Aosta / Vallée d'Aoste", "Veneto"]
  // specifico quale regioni voglio che vengano prese in considerazione (perchè c'era ad esempio anche "Sud, "Nord, Centro)



//SETUP
async function setup(){ //con questa versione di p5, non metot più i dati nel preload ma nel setup, con async -- a quel punto la tabella va caricata con await
  //con async faccio sì che il programma svolga le azioni soltanto dopo che le ho scritte tutte e non appena inserisco i dati
  createCanvas(windowWidth, windowHeight);
  myTable = await loadTable("assets/distribuzione_acqua.csv", ",", "header") //ora invece di "csv", si mette solo il carattere da cui sono separati i dati, quindi la vrigola
  mioFont = await loadFont("din.ttf"); //importo il font
  console.log("dati: ", myTable); //controllo che i dati siano stati caircati per bene


  for(let numRiga = 0; numRiga<myTable.getRowCount();numRiga++){ 
  //con getrowcount posso capire il numero delle righe
  // creo la variabile contatore  (numriga9 che parte da 0, quindi dalla prima riga del dataset)
  //poi metto la condizione, quindi che il ciclo continua finche non ha analizzato le righe una per una
  //alla fine di ogni giro, con numriga++ dico che deve passare alla riga successiva


let regioneCorrente = myTable.getString(numRiga, "Territorio"); //get.string perchè è un valore di testo, "territorio" è come si chiama la colonna che voglio che vada a leggere nel dataset
let anno = myTable.getNum(numRiga, "TIME_PERIOD");
let descrizione = myTable.getString(numRiga, "Indicatore");
  //per ogni riga che mi interessa della tabella, lo specifico in modo da individuarlo



if (anno === 2022 && descrizione.includes ("erogata") && regioni.includes(regioneCorrente)){
  let valoreAcqua = myTable.getNum (numRiga, "Osservazione"); 
  console.log("regione: ", regioneCorrente); //controllo che i dati siano stati ben caricati
  console.log("acqua erogata: ", valoreAcqua);
  //dico di: tenere in consideraizone solo l'anno 2022, tenere in considerazione solo i valori in cui l'acqua è immessa (e non erogata)
  //dico che quando esplicito "regioni" allora viene inclusa la regione corrente
  //solo se queste condizioni sno soddisfatte allora bisogna che si consideri la parte "osservazioni" come valore dell'acqua


if (valoreAcqua>maxAcqua){
  maxAcqua=valoreAcqua; 
  //all'inizio avevo creato maxacqua=0, ora ogni volta che si analizza una regione il record del max acqua aumenta
       } //chiudo if
     } //chiudo if 
   } //chiudo for
 } //chiudo function setup


//DRAW
 function draw(){

  //testo e legenda 
  push();
  background(224,224,224);
  fill(190, 105, 20);
  

  textSize(22);
  textFont(mioFont);
  text("Acqua erogata \nnegli impianti idrici \nin ogni regione d'Italia \nnel 2022", 25, 260);

  textSize(14);
  textFont(mioFont);
  text("Passa con il mouse \nsopra le valvole rosse per scoprire \nla regione e i dati sull'acqua", 25, 370);
  text("1 goccia = 3 milioni di metri cubi di acqua erogata", 25, 440)
  pop();

  //disegno tubi
  let xMargine = 0;
  let yBase1 = 80; //DICO dove appoggia la prima fila di rubinetti  
  let yBase2 = 540;
  
     //primo tubo
     stroke(40);
     strokeWeight(1.5);
     fill(64, 64, 64); 
     rect(xMargine, yBase1, windowWidth, 25);

     //secondo tubo
     stroke(40);
     strokeWeight(1.5);
     fill(64, 64, 64); 
     rect(xMargine, yBase2, windowWidth, 25);



     //CICLO dei rubinetti
     let spaziaturaX = windowWidth/10 //così ho 10 rubinetti per ogni fila e si dispongono in modo uniforme sulla x
     let testoHover=""; //dico che dopo questa variabile conterrà il testo che appare con l'hover
     let posX=0 //aggiungo una variabile per la posizione
     let yBase= yBase1 //metto l'altezza del primo tubo come partenza

     for (let numRegione = 0; numRegione < regioni.length; numRegione++) {
      let nomeRegione = regioni[numRegione];
      // parto dalla prima posizione allo 0, poin gli dico di continuare a girare finchè non arriva all'ultima regione del blocco "regioni", poi a ogni giro analizzi la regione successiva
      // a questo punto a ogni giro c'è un'altra variabile che scrive il nome della regione, che è in base al numero di elemento che sta analizzanod in quel giro

        //IMPORTANTE: ora devo dire che una volta arrivata alla decima regione, le regioni passano sul tubo di sotto
        if (numRegione === 10) {
        posX = 0; //riparte da sinistra
        yBase = yBase2; //va all'altezza del secondo tubo
        } else if (numRegione > 0) {
        posX = posX + spaziaturaX; //neglio altri casi invece va avanti  della spaziatura giusta a ogni giro
        }

        
        let valoreAcqua=0; //vuol dire che parto da 0 come primo valore
        for (let riga=0; riga<myTable.getRowCount(); riga++){
        let regioneTrovata = myTable.getString(riga, "Territorio");
        let annoTrovato = myTable.getNum(riga, "TIME_PERIOD");
        let descrizioneTrovata = myTable.getString(riga, "Indicatore");
        //ora associo il valore dell'acqua a ogni regione
        //poi dico di partire da 0 nel dataset, andare avanti finchè non finiscono le righe e analizzare ogni volta la riga successiva
        //la regione trovata corrisponde alla riga territorio eccetera


        if(regioneTrovata === nomeRegione && annoTrovato === 2022 && descrizioneTrovata.includes("erogata")){
        valoreAcqua = myTable.getNum(riga, "Osservazione");
        //se la regione trovata corrisponde al nome della region e l'anno è solo il 2022 e la descrizoone include la parola "immessa", allora
        //il valore acqua corrisponde alla riga osservazione
        } //chiudo if
      } //chiudo for


    //HOVER  
    let valvolaX = posX + 55.5;
    let valvolaY = yBase - 23;
    //metto la posizione della cerchio rosso della valvola

  
    if (dist(mouseX, mouseY, valvolaX, valvolaY) < 10) {
      testoHover = nomeRegione + "\nAcqua erogata: " + valoreAcqua + " mila m³";
      //dico che: se la distanza tra le coordinte del mouse e la posizione del cerchio della valvola rossa è <di 10 px (un po' più del raggio della valvola), allora spunta un testo che dice il nome della regione e il valore dell'acqua immessa in m3
    }



    //DISEGNO dei rubinetti sul primo tubo
    push();
    fill(32, 32, 32);
    noStroke();
    rect(posX+47.5, yBase1 - 10.5, 16, 10);

    fill(32, 32, 32);
    noStroke();
    rect(posX+51, yBase1 - 20.5, 9, 10);

        //valvole
        fill(204,0,0);
        noStroke();
        rect(posX+42, yBase1 - 26.5, 8, 6);

        fill(204,0,0);
        noStroke();
        ellipse(posX+43, yBase1-23.5, 6)

        fill(204,0,0);
        noStroke();
        rect(posX+60, yBase1 - 26.5, 8, 6);

        fill(204,0,0);
        noStroke();
        ellipse(posX+68, yBase1-23.5, 6)

        fill(64, 64, 64);
        noStroke();
        rect(posX+46, yBase1+23, 20, 16, 2);

        fill(32, 32, 32);
        noStroke();
        rect(posX+44.5, yBase1+37, 23, 4, 2);


        fill(32, 32, 32);
        noStroke();
        rect(posX+42.3, yBase1+40, 28, 8, 2);

        stroke(102,0,0);
        strokeWeight(0.5);
        fill(204,0,0);
        ellipse(posX+55.5, yBase1-23, 13);

      //decorazioni tubi
      stroke(0,0,0);
      strokeWeight(1);
      fill(32, 32, 32); 
      rect(posX+33, yBase1-1, 8, 27);

      stroke(0,0,0);
      strokeWeight(1);
      fill(32, 32, 32); 
      rect(posX+70, yBase1-1, 8, 27);

      //disegno dei rubinetti sul secondo tubo

      fill(32, 32, 32);
      noStroke();
      rect(posX+47.5, yBase2 - 10.5, 16, 10);

      fill(32, 32, 32);
      noStroke();
      rect(posX+51, yBase2 - 20.5, 9, 10);

        //valvole
        fill(204,0,0);
        noStroke();
        rect(posX+42, yBase2 - 26.5, 8, 6);

        fill(204,0,0);
        noStroke();
        ellipse(posX+43, yBase2-23.5, 6)

        fill(204,0,0);
        noStroke();
        rect(posX+60, yBase2 - 26.5, 8, 6);

        fill(204,0,0);
        noStroke();
        ellipse(posX+68, yBase2-23.5, 6)

        fill(64, 64, 64);
        noStroke();
        rect(posX+46, yBase2+23, 20, 16, 2);

        fill(32, 32, 32);
        noStroke();
        rect(posX+44.5, yBase2+37, 23, 4, 2);


        fill(32, 32, 32);
        noStroke();
        rect(posX+42.3, yBase2+40, 28, 8, 2);

        stroke(102,0,0);
        strokeWeight(0.5);
        fill(204,0,0);
        ellipse(posX+55.5, yBase2-23, 13);

      //decorazioni tubi
       stroke(0,0,0);
       strokeWeight(1);
       fill(32, 32, 32); 
       rect(posX+33, yBase2-1, 8, 27);

       stroke(0,0,0);
       strokeWeight(1);
       fill(32, 32, 32); 
       rect(posX+70, yBase2-1, 8, 27);
       pop();

//NOMI DELLE REGIONI SOPRA I RUBINETTI
push();
fill(0, 76, 152);               
    noStroke();
    textSize(13.5);
    textFont(mioFont);
    textAlign(CENTER, BOTTOM);//al centro rispetto alla valvola
    text(nomeRegione, posX+55.5, yBase - 35);
pop();

//ASSOCIO I DATI ALLE GOCCINE 
    let valoreGocciolina = 3000; //ogni goccina corrisponde a 3 milioni di metri cubi 
    let numeroGocce = round(valoreAcqua / valoreGocciolina); //round serve per arrotondare, e divido il valore dell'acqua per valore goccia

    for (let g = 0; g < numeroGocce; g++) {
      let colonna = g % 6;                  
      let riga = Math.floor(g / 6);
    // g è il contatore delle gocce che aumenta a ogni giro
    //dato che ho detto che voglio 6 colonne, allora divido g/6 per far si che sappia a che altezza disegnare la gocciola
    //con il floor invece arrotondo       
    // ciclo for che parte da 0, continua finche non finiscono le gocce e aumenta sempre aggiungendo una goccia in più
    //dato che voglio dividere le cascata di gocce in più di una colonna allora faccio che ogni colonna sia formata da 6 colonnine di gocce


      let gocciaX = posX + 42 + (colonna * 6); //scrivo la posizione delle colonne di gocce, 
      let gocciaY = yBase + 55 + (riga * 6);    

      fill(52, 152, 219, 215);
      noStroke();
      ellipse(gocciaX, gocciaY, 3, 4);      
    } //chiudo for
} //chiduo for


//SCRITTA CHE APPARE CON L'HOVER
if (testoHover !== "") {
    push();
    translate(mouseX + 15, mouseY - 10);//sposto il riquadro in base a dove va il mouse
    fill(0, 76, 152, 200); //aggiungo la trasparenza, così si vede ancora cosa c'è sotto
    rect(0, 0, 190, 45, 10); 
  //se il testo hover non è vuoto, quindi c'è qualcosa di scritto dentro perchè soddisfa i requisiti dell'if, allora viene disegnato il riquadro
    
    fill(255);
    textSize(11);
    textFont(mioFont);
    textAlign(LEFT, TOP);
    text(testoHover, 10, 8);
    pop();
  } //chiudo if

} //chiudo draw
