// ========================================================
// ====== Objet pour définir les contours des cartes ======
// ========================================================

export default class Carte{

	#objectFit = "contain";
	#viewBox = "0 0 675 570";
	constructor(fonctionSurClique = null) {
		this.listeRegions = [];
		CarteFrance.jsonRegions().forEach((region, i)=>{
			this.listeRegions.push(region);
		});
	}


	toSVG(){
		let balisesSVG = document.createElementNS("http://www.w3.org/2000/svg",'svg');
		balisesSVG.style.objectFit = this.#objectFit;
		balisesSVG.setAttribute("viewBox", this.#viewBox);

		this.listeRegions.forEach((region,i) => {
			region.modifierLegende(region.nom);
			region.toSVG().forEach((balise, j)=>{
				balisesSVG.appendChild(balise);
			});
		});
		return balisesSVG;
	}

	activerInfoBulle(){
		var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
		var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
		  return new bootstrap.Tooltip(tooltipTriggerEl)
		})
	}

	recupererRegion(nomRegion){
		return this.listeRegions.find(i => i.nom === nomRegion);
	}

	modifierLegendeRegion(nomRegion, nouvelleLegende){
		this.recupererRegion(nomRegion).modifierLegende(nouvelleLegende);
		//console.log(this);
	}

	modifierCouleurFondRegion(nomRegion, nouvelleCouleur){
		this.recupererRegion(nomRegion).modifierCouleurFond(nouvelleCouleur);
	}

	ajouterFonctionClique(nomRegion, nomFonction){
		this.recupererRegion(nomRegion).ajouterFonctionClique(nomFonction);
	}

	static jsonRegions(){
		const urlJsonRegions = "https://sebastienpacqueteau.github.io/carteFrance/regions/regions.json";
		let xhttp = new XMLHttpRequest();
		let regions;
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
			   // Typical action to be performed when the document is ready:
			   regions = JSON.parse(xhttp.response);
			   //console.log(regions);
			}
		};
		xhttp.open("GET", urlJsonRegions, false);
		xhttp.send();
		return regions;
	}
}
