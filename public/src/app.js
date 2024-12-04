
let radiacionCorta = [];
let radiacionDirecta = [];
let radiacionDifusa = [];
let tiempo = [];

let eEolica = [];

let totalW = 0;
let totalWH = 0;
let DtotalWH = 0;
let NtotalWH = 0;

let totalShort = 0;
let totalDirect = 0;
let totalDiffuse = 0;

let potInstalada = 0;
let inverter = 0;
let inverterD = 0;
let inverterN = 0;

let horaGenerada = [];

let newDevD = [];
let newDevN = [];

//defaultDevices
  let defaultDevicesDay = [
    {dev:0, cant:0, watts:0, hours:0},
    {dev:1, cant:1, watts:25, hours:6},
    {dev:2, cant:1, watts:5, hours:6},
    {dev:3, cant:1, watts:5, hours:6},
    {dev:4, cant:1, watts:5, hours:6},
    {dev:5, cant:3, watts:10, hours:6},
    {dev:6, cant:0, watts:0, hours:0},
    {dev:7, cant:0, watts:0, hours:0},
    {dev:8, cant:1, watts:5, hours:6},
    {dev:9, cant:0, watts:0, hours:0},
  ]
  let defaultDevicesNight = [
    {dev:0, cant:0, watts:0, hours:0},
    {dev:1, cant:0, watts:0, hours:0},
    {dev:2, cant:0, watts:0, hours:0},
    {dev:3, cant:0, watts:0, hours:0},
    {dev:4, cant:2, watts:5, hours:6},
    {dev:5, cant:1, watts:10, hours:9},
    {dev:6, cant:0, watts:0, hours:0},
    {dev:7, cant:0, watts:0, hours:0},
    {dev:8, cant:1, watts:5, hours:9},
    {dev:9, cant:0, watts:0, hours:0},
  ]

if(!localStorage.getItem('DevicesDay')){
  localStorage.setItem('DevicesDay', JSON.stringify(defaultDevicesDay));
}
if(!localStorage.getItem('DevicesNight')){
  localStorage.setItem('DevicesNight', JSON.stringify(defaultDevicesNight));
}

let devicesDay = JSON.parse(localStorage.getItem('DevicesDay'));
//console.log(devicesDay);
let devicesNight = JSON.parse(localStorage.getItem('DevicesNight'));
//console.log(devicesNight);
//-------------------

//defaultCoordenates
let defaultCoord = [
{lat:3.559809, lon:-76.575405}
]
//------------------------

//defaultPowerPanels
let defaultPowerP = 0;

if(!localStorage.getItem('powerPanels')){
  localStorage.setItem('powerPanels', JSON.stringify(defaultPowerP));
}

let powerPanels = JSON.parse(localStorage.getItem('powerPanels'));
document.getElementById("pvWatts").value = powerPanels;


//------------------------
//defaultTypePanels
let defaultTypeP = "poly";

if(!localStorage.getItem('typePanels')){
  localStorage.setItem('typePanels', JSON.stringify(defaultTypeP));
}

let typePanels = JSON.parse(localStorage.getItem('typePanels'));
document.getElementById("tipoPanel").value = typePanels;

//------------------------



function readDay(){
    let lat = document.getElementById("lat").value;
    let lon = document.getElementById("lon").value;

    if (!lat || !lon){
            lat = 3.559809;
            lon = -76.575405;
        }
        else {
            
        }

    let newCoord = [];
    newCoord = [{lat:lat, lon:lon}];
    localStorage.setItem('Coordenates', JSON.stringify(newCoord));
    //let coordenates = JSON.parse(localStorage.getItem('Coordenates'));

    const urlINI = 'https://api.open-meteo.com/v1/forecast?';
    const urlA = 'latitude='+lat;
    const urlB = 'longitude='+lon;
    const urlC = 'current=temperature_2m,relative_humidity_2m';
    const urlD = 'hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,shortwave_radiation,direct_radiation,diffuse_radiation';
    const urlE = 'daily=temperature_2m_max,temperature_2m_min';
    const urlEND = 'wind_speed_unit=ms&timezone=auto&forecast_days=1&models=best_match';
    const urlAPI = urlINI +'&'+ urlA +'&'+ urlB +'&'+ urlC +'&'+ urlD +'&'+ urlE +'&'+ urlEND;
    console.log("API url: ");
    console.log(urlAPI);

    fetch(urlAPI)
    .then(response => response.json())
    .then(data => {

        let zonaHoraria = data.timezone;
        let elevacion = data.elevation;
        let latitud = data.latitude;
        let longitud = data.longitude;

        //Current
        let temperatura = data.current.temperature_2m;
        let humedad = data.current.relative_humidity_2m;
        
        //Hourly
        tiempo = data.hourly.time;
        radiacionCorta = data.hourly.shortwave_radiation;
        radiacionDirecta = data.hourly.direct_radiation;
        radiacionDifusa = data.hourly.diffuse_radiation;

        let viento = data.hourly.wind_speed_10m;

        eEolica = viento.map( number => 0.4 * (number*number*number));
        
        let totalEolica = 0;
        eEolica.forEach( num => {
            totalEolica += num;
        });

        const media = mean => {
            if (mean.length < 1){
                return;
            }
            return mean.reduce((prev, current) => prev + current) / mean.length;
        };

        let mediaViento = media(viento);
        let maxViento = Math.max.apply(null,viento);

        let mediaWind = 0;
        viento.forEach( num => {
            mediaWind += num;
        });

        let mViento = mediaWind/viento.length;

        //Radiation
        totalShort = 0;
        for (let i = 0; i < radiacionCorta.length; i++){
            totalShort += radiacionCorta[i];
        }
        totalDirect = 0;
        for (let i = 0; i < radiacionDirecta.length; i++){
            totalDirect += radiacionDirecta[i];
        }
        totalDiffuse = 0;
        for (let i = 0; i < radiacionDifusa.length; i++){
            totalDiffuse += radiacionDifusa[i];
        }
        
        //document.getElementById("boton").innerHTML=data.daily.time[0];
        //document.getElementById("zonaHoraria").innerHTML=zonaHoraria;
        //document.getElementById("latitud").innerHTML=latitud;
        //document.getElementById("longitud").innerHTML=longitud;
        //document.getElementById("elevacion").innerHTML=elevacion;
        //document.getElementById("temperatura").innerHTML=temperatura;
        //document.getElementById("humedad").innerHTML=humedad;
        //document.getElementById("totalShort").innerHTML=parseInt(totalShort);
        document.getElementById("diffuse").innerHTML=parseInt(totalDiffuse);
        document.getElementById("direct").innerHTML=parseInt(totalDirect);
        //document.getElementById("maxViento").innerHTML= maxViento;
        //document.getElementById("mediaViento").innerHTML= mediaViento.toFixed(2);
        //document.getElementById("energiaEolica").innerHTML= parseInt(totalEolica);
        
        const ctx = document.getElementById('solRadar');
        const ctx2 = document.getElementById('solGen');
        
    });

}
//readDay();

/*function clearDay(){
    //myChart.clear();
    //myChart.destroy();
    readDay();
}*/

function clima(){
    //document.getElementById("intro").style.display="none";
    //document.getElementById("carga").style.display="none";
    //document.getElementById("resume").style.display="none";
    //document.getElementById("clima").style.display="unset";
    //document.getElementById("nav").style.display="unset";

    //document.getElementById("cargas").style.display="unset";
    //document.getElementById("potencial").style.display="none";
    //document.getElementById("sumario").style.display="none";

    if(!localStorage.getItem('Coordenates')){
      document.getElementById("lat").value = "";
      document.getElementById("lon").value = "";
    }else{
      let coordenates = JSON.parse(localStorage.getItem('Coordenates'));
      document.getElementById("lat").value = coordenates[0].lat;
      document.getElementById("lon").value = coordenates[0].lon;
    }

    readDay();
}
clima();

function cargas(){
    //document.getElementById("intro").style.display="none";
    //document.getElementById("clima").style.display="none";
    //document.getElementById("resume").style.display="none";
    //document.getElementById("carga").style.display="unset";
    
    //document.getElementById("potencial").style.display="unset";
    //document.getElementById("cargas").style.display="none";
    //document.getElementById("sumario").style.display="unset";
    
    let i = 0;
    devicesDay.forEach((element) => {   
        document.getElementById("Dcant"+i).value = element.cant;
        document.getElementById("Dwatt"+i).value = element.watts;
        document.getElementById("Dhour"+i).value = element.hours;
        i++;
    });

    let j = 0;
    devicesNight.forEach((element) => {   
        document.getElementById("Ncant"+j).value = element.cant;
        document.getElementById("Nwatt"+j).value = element.watts;
        document.getElementById("Nhour"+j).value = element.hours;
        j++;
    });
    
    //calcular();
  }
cargas();

function calcular(){
    totalWH = 0;
    DtotalWH = 0;
    NtotalWH = 0;
    inverter = 0;
    inverterD = 0;
    inverterN = 0;
    let meArrayD = [];
    let meArrayN = [];
    let inversorD = [];
    let inversorN = [];
    let prendido = 0;
    let Nprendido = 0;
    newDevD = [];
    newDevN = [];
    
    for (let i = 0; i < 10; i++){
        var cantidad = document.getElementById("Dcant"+i).value;
        if(!cantidad || cantidad == 0){
            cantidad = 0;
        }
        
        var vatios = document.getElementById("Dwatt"+i).value;
        if(!vatios || vatios == 0){
            vatios = 0;
        }
        
        var horas = document.getElementById("Dhour"+i).value;
        if(!horas || horas == 0){
            horas = 0;
            prendido = 0;
        }else{
            prendido = 1;
        }

        let tempDev = {dev:i, cant:parseInt(cantidad), watts:parseInt(vatios), hours:parseInt(horas)};
        newDevD.push(tempDev);

        let DwattHora = parseFloat(cantidad)*parseFloat(vatios)*parseFloat(horas);
        document.getElementById("Dwh"+i).innerHTML = DwattHora; 
        
        


        
        DtotalWH = DtotalWH + DwattHora;
        meArrayD.push(DwattHora);

        let sumInvertD = parseFloat(cantidad)*parseFloat(vatios)*prendido;
        inversorD.push(sumInvertD);
    }
    for (let j = 0; j < 10; j++){
        var Ncantidad = document.getElementById("Ncant"+j).value;
        if(!Ncantidad || Ncantidad == 0){
            Ncantidad = 0;
        }
        
        var Nvatios = document.getElementById("Nwatt"+j).value;
        if(!Nvatios || Nvatios == 0){
            Nvatios = 0;
        }
        
        var Nhoras = document.getElementById("Nhour"+j).value;
        if(!Nhoras || Nhoras == 0){
            Nhoras = 0;
            Nprendido = 0;
        }else{
            Nprendido = 1;
        }

        let NtempDev = {dev:j, cant:parseInt(Ncantidad), watts:parseInt(Nvatios), hours:parseInt(Nhoras)};
        newDevN.push(NtempDev);

        let NwattHora = parseFloat(Ncantidad)*parseFloat(Nvatios)*parseFloat(Nhoras);
        document.getElementById("Nwh"+j).innerHTML = NwattHora; 
        
        


        
        NtotalWH = NtotalWH + NwattHora;
        meArrayN.push(NwattHora);

        let sumInvertN = parseFloat(Ncantidad)*parseFloat(Nvatios)*Nprendido;
        inversorN.push(sumInvertN);
    }

    
    //statusDevice = newDevD;
    localStorage.setItem('DevicesDay', JSON.stringify(newDevD));
    devicesDay = JSON.parse(localStorage.getItem('DevicesDay'));
    //console.log(devicesDay);
    //statusDevice = newDevN;
    localStorage.setItem('DevicesNight', JSON.stringify(newDevN));
    devicesNight = JSON.parse(localStorage.getItem('DevicesNight'));
    //console.log(devicesNight);


    document.getElementById('totalDay').innerHTML = DtotalWH;
    document.getElementById('totalNight').innerHTML = NtotalWH;

    totalWH = DtotalWH;

    inversorD.forEach( num => {
        inverterD += num;
    });
    inversorN.forEach( num => {
        inverterN += num;
    });

    document.getElementById('simulDay').innerHTML = inverterD;
    document.getElementById('simulNight').innerHTML = inverterN;

    if(inverterD > inverterN){
       inverter = inverterD; 
    }else if(inverterD < inverterN){
       inverter = inverterN;
    }else{
        inverter = (inverterD + inverterN)/2;
    }

    resumen();
}
calcular();

function resumen(){
    //document.getElementById("clima").style.display="none";
    //document.getElementById("carga").style.display="none";
    //document.getElementById("intro").style.display="none";
    //document.getElementById("resume").style.display="unset";

    //document.getElementById("potencial").style.display="none";
    //document.getElementById("cargas").style.display="unset";
    //document.getElementById("sumario").style.display="none";

        

        potInstalada = document.getElementById("pvWatts").value;
        if(!potInstalada){
            potInstalada = powerPanels;
        }
        localStorage.setItem('powerPanels', JSON.stringify(potInstalada));

        let areaInstalada = 0.28 * potInstalada/50;

        typePanel = document.getElementById("tipoPanel").value;
        localStorage.setItem('typePanels', JSON.stringify(typePanel));

        let tPanel = "";
        if(typePanel==="poly"){
            var effiPanel = 0.20;
            tPanel = "Polycrystalline";
        }
        else if(typePanel==="mono"){
            var effiPanel = 0.25;
            tPanel = "Monocrystalline";
        }
        else{
            var effiPanel = 0.15;
            tPanel = "Installed";
        }
        
        horaGenerada = radiacionCorta.map( number => parseInt(number * areaInstalada * effiPanel));
        
        totalW = totalShort;
        let ePotencial = parseInt(totalW)*effiPanel;
        let eGenerada = parseInt(areaInstalada * ePotencial);
        
        let residual = eGenerada - totalWH;
        if (residual < 0){
          residual = 0;
        }
        let storage = residual;

        document.getElementById("dGenerated").innerHTML = parseInt(eGenerada);
        document.getElementById("dUsed").innerHTML = parseInt(totalWH);
        document.getElementById("storage").innerHTML = parseInt(storage);
        document.getElementById("mGenerated").innerHTML = (eGenerada*30/1000).toFixed(1);

        /*document.getElementById("balance").innerHTML = `
          
          <div id="generado">
              <h3>Generated</h3>
              <h1>${parseInt(eGenerada)}</h1>
              <h3>Wh</h3>    
          </div>
          <div id="usado">
              <h3>Used</h3>
              <h1>${parseInt(totalWH)}</h1>
              <h3>Wh</h3>    
          </div>
          <div id="generado">
              <h3>Storage</h3>
              <h1>${parseInt(storage)}</h1>
              <h3>Wh</h3>    
          </div>
        `;
        document.getElementById("kilosMes").innerHTML = `
        <h3>Monthly Energy Generated</h3>
        <h2>${(eGenerada*30/1000).toFixed(1)}</h2>
        <h3>kWh</h3>
        `;*/

        let nominalPanel = potInstalada;
        let searchPanel = "solar+panel+12+v+" + nominalPanel + "+watt";
        let searchUrlPanel1 = "https://www.amazon.com/s?k="+searchPanel;
        let searchUrlPanel2 = "https://www.ebay.com/sch/"+searchPanel;

        /*document.getElementById("panelesInstalados").innerHTML = `
        <h3>${tPanel} Photovoltaic System</h3>
        <a href="${searchUrlPanel1}" target="_blank"><h2>${nominalPanel}</h2></a>
        <a href="${searchUrlPanel2}" target="_blank"><h3>Watts</h3></a>
        `;*/

        /*document.getElementById("cargaSimultanea").innerHTML = `
        <h3>Simultaneous Load</h3>
        <h2>${inverter}</h2>
        <h3>Watts</h3>
        `;*/
        
        let nominalInverter = parseInt(inverter*2);
        document.getElementById("inverter").innerHTML = nominalInverter;

        let searchInverter = "inverter+12+v+" + nominalInverter + "+watt";
        let searchUrlInverter1 = "https://www.amazon.com/s?k="+searchInverter;
        let searchUrlInverter2 = "https://www.ebay.com/sch/"+searchInverter;

        let nominalBattery = parseInt((storage/13)*2);
        document.getElementById("battery").innerHTML = nominalBattery;

        let searchBattery = "battery+12+v+" + nominalBattery + "+ah";
        let searchUrlBattery1 = "https://www.amazon.com/s?k="+searchBattery;
        let searchUrlBattery2 = "https://www.ebay.com/sch/"+searchBattery;
        

        /*document.getElementById("inversor").innerHTML = `
        <div id="inverter">
        <h3>DC/AC Inverter Up</h3>
        <a href="${searchUrlInverter1}" target="_blank"><h2>${nominalInverter}</h2></a>
        <a href="${searchUrlInverter2}" target="_blank"><h3>Watts</h3></a>
        </div>
        <div id="inverter">
        <h3>12VDC Battery Up</h3>
        <a href="${searchUrlBattery1}" target="_blank"><h2>${nominalBattery}</h2></a>
        <a href="${searchUrlBattery2}" target="_blank"><h3>AH</h3></a>
        </div>
        `;*/

 
        let loadSimultanea = [];
        for (let i = 0; i < tiempo.length; i++){
          loadSimultanea.push(inverter);
        }

        let mediaGenerada = [];
        for (let i = 0; i < tiempo.length; i++){
          mediaGenerada.push(parseInt(eGenerada/tiempo.length));
        }

        let mediaUsada = [];
        for (let i = 0; i < tiempo.length; i++){
          mediaUsada.push(parseInt(totalWH/tiempo.length));
        }

       
}
resumen();
