// ============================================================
// ==== Objet pour définir les contours des départements ======
// ============================================================

class CarteFrance{
	
	#objectFit = "contain";
	#viewBox = "0 0 657 550";
	constructor(objRegionMetropolitaines, objRegionDromCom) {
		this.listeRegions = []; 
		let tmp;
		(objRegionMetropolitaines) ? tmp = objRegionMetropolitaines : tmp = jsonRegionsMetropolitaines();
		for (const region in tmp){
			this.listeRegions.push(new Region(region, tmp[region]));
		}
		(objRegionDromCom) ? tmp = objRegionDromCom : tmp = jsonDromCom();
		for (const region in tmp){
			this.listeRegions.push(new Region(region, tmp[region]));
		}
		
	}
	
	
	toSVG(){
		let balisesSVG = document.createElementNS("http://www.w3.org/2000/svg",'svg');
		balisesSVG.style.objectFit = this.#objectFit;
		balisesSVG.setAttribute("viewBox", this.#viewBox);
		
		this.listeRegions.forEach((region,i) => {
			balisesSVG.appendChild(region.creerBaliseG());
		});
		return balisesSVG;
	}
	
	activerInfoBulle(){
		var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
		var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
		  return new bootstrap.Tooltip(tooltipTriggerEl)
		})
	}

	recupererDept(nomRegion, numDept){
		const tmp = this.listeRegions.find(i => i.nom === nomRegion);
		return (tmp) ? tmp.recupererDept(numDept) : null;
	}
	
	modifierLegendeDept(nomRegion, numDept, nouvelleLegende){
		const tmp = this.recupererDept(nomRegion, numDept);
		(tmp) ? tmp.modifierLegende(nouvelleLegende) : console.log(`Erreur modifierLegendeDept : département ${numDept} dans la région ${nomRegion}`); 
	}
	
	modifierCouleurFondDept(nomRegion, numDept, nouvelleCouleur){
		const tmp = this.recupererDept(nomRegion, numDept);
		(tmp) ? tmp.modifierCouleurFond(nouvelleCouleur) : console.log(`Erreur modifierCouleurFondDept : département ${numDept} dans la région ${nomRegion}`); 
	}
	
	
}


class Region{
	constructor(nom, jsonDept) { 
		this.nom = nom;
		this.listeDepartements = [];
		for (const dept in jsonDept){
			this.listeDepartements.push(new Departement(jsonDept[dept], dept));
		}
		
	}
	
	creerBaliseG(){
		let balisesG = document.createElementNS("http://www.w3.org/2000/svg",'g');
		balisesG.setAttribute("id", this.nom);
		
		for (const dept in this.listeDepartements){
			this.listeDepartements[dept].toSVG().forEach((balise,i) => {
				balisesG.appendChild(balise);
			});
		}
		return balisesG;
	}
	
	recupererDept(numDept){
		return this.listeDepartements.find(i => i.numero == numDept)
	}
}


class Departement{
	#couleurFond = "#FFFFFF"; 
	#fillRule = "evenodd";
	#clipRule = "evenodd";
	#couleurBordure = "#000000";
	#tailleBordure = 1;
	constructor(jsonDepartement, numero, legende) {
		this.nom = jsonDepartement.nom;
		this.numero = numero;
		this.path = jsonDepartement.path;
		this.polygone = jsonDepartement.polygone;
		(legende) ? this.legende = legende : this.legende = `${this.numero} - ${this.nom}`;

	}
	
	modifierLegende(legendeHTML){
		this.legende = legendeHTML; 
	}
	
	modifierCouleurFond(couleur){
		this.#couleurFond = couleur; 
	}
	
	toSVG() {
		let balises = [];
		let baliseTmp; 
		this.path.forEach((d, i) => {
			baliseTmp= document.createElementNS("http://www.w3.org/2000/svg",'path');
			baliseTmp.setAttribute("id", this.numero);
			baliseTmp.setAttribute("fill-rule", this.#fillRule);
			baliseTmp.setAttribute("clip-rule", this.#clipRule);
			baliseTmp.setAttribute("fill", this.#couleurFond);
			baliseTmp.setAttribute("stroke", this.#couleurBordure);
			baliseTmp.setAttribute("stroke-opacity", this.#tailleBordure);
			baliseTmp.setAttribute("data-bs-toggle", "tooltip");
			baliseTmp.setAttribute("data-bs-placement", "right");
			baliseTmp.setAttribute("data-bs-html", "true");
			baliseTmp.setAttribute("title", this.legende);
			baliseTmp.setAttribute("d", d);
			balises.push(baliseTmp);
		});
		
		this.polygone.forEach((points, i) => {
			baliseTmp = document.createElementNS("http://www.w3.org/2000/svg",'polygon');
			baliseTmp.setAttribute("id", this.numero);
			baliseTmp.setAttribute("fill-rule", this.#fillRule);
			baliseTmp.setAttribute("clip-rule", this.#clipRule);
			baliseTmp.setAttribute("fill", this.#couleurFond);
			baliseTmp.setAttribute("stroke", this.#couleurBordure);
			baliseTmp.setAttribute("stroke-opacity", this.#tailleBordure);
			baliseTmp.setAttribute("data-bs-toggle", "tooltip");
			baliseTmp.setAttribute("data-bs-placement", "right");
			baliseTmp.setAttribute("data-bs-html", "true");
			baliseTmp.setAttribute("title", this.legende);
			baliseTmp.setAttribute("points", points);
			balises.push(baliseTmp);
		});
		
		return balises;
	}
}

function jsonRegionsMetropolitaines(){
	const urlJsonRegionsMetropolitaines = "https://sebastienpacqueteau.github.io/carteFrance/regions/regionsMetropolitaines.json";
	let xhttp = new XMLHttpRequest();
	let regionsMetropolitaines;
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
		   // Typical action to be performed when the document is ready:
		   regionsMetropolitaines = JSON.parse(xhttp.response);
		   //console.log(regionsMetropolitaines);
		}
	};
	xhttp.open("GET", urlJsonRegionsMetropolitaines, false);
	xhttp.send();
	return regionsMetropolitaines;
}

function jsonDromCom(){
	const urlJsonRegionsMetropolitaines = "https://sebastienpacqueteau.github.io/carteFrance/regions/dromCom.json";
	let xhttp = new XMLHttpRequest();
	let regionsMetropolitaines;
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
		   // Typical action to be performed when the document is ready:
		   regionsMetropolitaines = JSON.parse(xhttp.response);
		   //console.log(regionsMetropolitaines);
		}
	};
	xhttp.open("GET", urlJsonRegionsMetropolitaines, false);
	xhttp.send();
	return regionsMetropolitaines;
}

