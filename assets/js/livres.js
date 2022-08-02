/*
L’évènement DOMContentLoaded est émis lorsque le document HTML initial a été complètement chargé et analysé,
sans attendre que les feuilles de style, images et sous-documents aient terminé de charger.
 */
document.addEventListener('DOMContentLoaded', () => {
    //Ici html et css deja charger avant javascript
    const livresDIV = document.getElementById('livresDIV');

    //1er fonction afficherLivres
    //La <div> html qui va contenir nos livres
    function afficherLivres() {
        //Le parcours du fichier  produits.json avec fetch et des promesses
        //Api fetch a besoin d'une URL en paramètre (ici notre server.js)
        //On utilise API fetch + promesse = AJAX
        fetch('http://localhost:3000/livres', {
            method: 'GET',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            }
        })
            //1er promesse
            //On retourne la reponse a la requète sous forme d'un objet : //Ici le json livre est un objet
            .then(response => {
                return response.json()
            })
            //Seconde promesse recup le json pour le  traiter comme un tableau
            .then((Livres) => {
                //on boucle sur le tableau d'objet json a .map() qui recreer un nouveau tableau
                let carteLivres = Livres.map((alias) =>
                    //Le bloc tailwind carte
                    `
           
                    <div class="container flex justify-center w-full mt-10" id="carte-produit-${alias.id}">
                      <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 col-span-1 flex flex-col bg-white border-2 p-4">
                            <div class="mb-8 items-stretch ">   
                                <div class="grid place-items-center p-3">                                            
                                    <h1 class="font-medium leading-tight text-5xl mt-0 mb-2 text-red-800">${alias.nomLivre}</h1>   
                                </div>                                                                            
                                <div class="flex items-center">
                                  <img class="rounded-full mr-4" src="${alias.imageLivre}" alt="${alias.nomLivre}" title="${alias.nomLivre}"/>                                                               
                                </div>
                               
                                <div class="grid place-items-center mt-10">
                                      <button  id="details-livre-${alias.id}" class="bg-red-800 hover:bg-green-700 text-white font-bold py-6 px-4 rounded">Détails du livre</button> 
                                </div>
                                
                                   <div class="grid place-items-center mt-10">
                                      <button  id="supprimer-livre-${alias.id}" class="bg-green-800 hover:bg-blue-700 text-white font-bold py-6 px-4 rounded">Supprimer livre</button> 
                                </div>
                                 
                            </div>
                       </div>
                    </div>     
                   
                                                                              
                    `
                )
                //On ajoute le bloc de carte au parent HTML
                livresDIV.innerHTML = carteLivres.join(' ')
                //la seconde boucle de parcours des id dynamique (les 3 boutons)
                Livres.map((livre) => {
                    //Reup de tous le boutons id="details-livre-1 2 3 4 etc..."
                    const btnDetails = document.querySelector(`#details-livre-${livre.id}`);
                    //Au clic sur le bouton
                    btnDetails.addEventListener("click", (event) => {
                        //Supprime le comportement par defaut (evite le rechargement de la page)
                        event.preventDefault();
                        //Appel de la fonction hors de afficherLivre()
                        afficherDetailsProduit(livre);
                    });

                    //Recuperer les boutton supprimer
                    const btnSupprimer = document.querySelector(`#supprimer-livre-${livre.id}`);
                    btnSupprimer.addEventListener("click", (event) => {
                        //Supprime le comportement par defaut (evite le rechargement de la page)
                        event.preventDefault();
                        supprimerProduit(livre)
                    });
                });

            })
            //Si la le fetch() retourne une erreur -> la promesse n'est pas tenue et retourne une erreur
            .catch(erreur => console.log("Erreur " + erreur))
    }

    //Afficher les details des produits
    function afficherDetailsProduit(livre) {
        //console.log('test de la fonction')
        //alert(`${livre.nomLivre}`)
        //Recup la div de html
        const detailsLivresDIV = document.getElementById("detailsLivresDIV");
        //Creer un element <div> html avec JS
        const detailsEnfant = document.createElement("div");
        //Ajout class animate.css
        detailsLivresDIV.className = "animate__animated animate__slideInLeft"
        //On cache le bloc principale
        livresDIV.style.display = "none";
        //Affiche les details du livres
        detailsEnfant.innerHTML =
            `
             <h2>${livre.nomLivre}</h2>
             <img src="${livre.imageLivre}" alt="${livre.nomLivre}" title="${livre.nomLivre}">
             <p>Description : ${alias.descriptionLivre}</p>
             <p>PRIX : ${livre.prixLivre}</p>
             <button id="btnBack" class="bg-red-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-6">retour</button>
                   
            `
        //Ajoute le bloc html au aprent
        detailsLivresDIV.appendChild(detailsEnfant);
        //le bouton de retour
        const btnBack = document.getElementById("btnBack")

        //Au clic
        btnBack.addEventListener("click", () => {
            //On ajoute a une classe
            detailsLivresDIV.className = "animate__animated animate__slideOutLeft";
            setTimeout(() => {
                //On refresh au bout 0.7 seconde
                window.location.reload()
            },700)
        })


    }

    function supprimerProduit(livre){
        //alert('test de suppr livre')
        const carteProduit = document.querySelector(`#carte-produit-${livre.id}`)
        //Feneètre de confirmation de supression
        if (window.confirm("Confirmer la supression ?")) {
            //Appel de URL du back tester avec POSTMAN qui splice un obket
            fetch(`http://localhost:3000/supprimer-livre/${livre.id}`,{
                //La methode de la requète http = delete
                method: "DELETE"
            })
                //On retourne une bobjet au format json (l'objet a supprimer)
                .then(response => console.log(response.json()))
                //On retire ne noeud carteLivre du DOM avec remove()
                .then(() => {
                    carteProduit.remove();
                })
                //Sinon on retourne des erreurs
                .catch(erreur => console.log(erreur))
        }

    }

    afficherLivres()

})



