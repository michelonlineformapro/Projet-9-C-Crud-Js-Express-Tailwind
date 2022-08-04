/*
L’évènement DOMContentLoaded est émis lorsque le document HTML initial a été complètement chargé et analysé,
sans attendre que les feuilles de style, images et sous-documents aient terminé de charger.
 */
document.addEventListener('DOMContentLoaded', () => {
    //Le formulaire ajouter
    const addForm = document.getElementById("ajouterFormulaireLivre");

    //Afficher - Cacher le formulaire d'ajout de livre
    const showHideAddFormBtn = document.getElementById("afficherCacherAjouterFormulaire");
    showHideAddFormBtn.addEventListener("click", (e) => {
        e.preventDefault();
        console.log("ok clic")
        addForm.classList.toggle("ajouterFormulaireLivre-show")
    });

        //Le bouton pour valider le formulaire d'ajout de livre
    const btnValidAddBook = document.getElementById("validerLivreBtn");
    //Un evenement clic + appel d'une fonction
    btnValidAddBook.addEventListener("click", (e) => {
        e.preventDefault();
        ajouterLivre();
    })




    //Ici html et css deja charger avant javascript
    const livresDIV = document.getElementById('livresDIV');

    //1er fonction afficherLivres
    //La <div> html qui va contenir nos livres
    function afficherLivres() {
        //Le parcours du fichier  produits.json avec fetch et des promesses
        //Api fetch a besoin d'une URL en paramètre (ici notre server.js)
        //On utilise API fetch + promesse = AJAX
        fetch('http://localhost:3000/livres/')
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
                    <div class="carte-livre" id="carte-produit-${alias.id}">
                      <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 bg-white border-2">
                            <div class="mb-8">   
                                <div class="grid place-items-center p-3">                                            
                                    <h1 class="font-medium leading-tight text-white text-5xl mt-0 mb-2 text-red-800 bg-red-800 p-6">${alias.nomLivre}</h1>   
                                </div>                                                                            
                                <div class="grid place-items-center mt-10">
                                  <img class="rounded-full mr-4" src="${alias.imageLivre}" alt="${alias.nomLivre}" title="${alias.nomLivre}" width="300" height="200"/>                                                               
                                </div>
                               
                                <div class="grid place-items-center mt-10">
                                      <button  id="details-livre-${alias.id}" class="bg-red-800 hover:bg-green-700 text-white font-bold py-6 px-4 rounded">Détails du livre</button> 
                                </div>
                                
                                <div class="grid place-items-center mt-10">
                                      <button  id="supprimer-livre-${alias.id}" class="bg-green-800 hover:bg-blue-700 text-white font-bold py-6 px-4 rounded">Supprimer livre</button> 
                                </div>
                                
                                <div class="grid place-items-center mt-10">
                                      <button  id="editer-livre-${alias.id}" class="bg-blue-800 hover:bg-red-700 text-white font-bold py-6 px-4 rounded">Editer livre</button> 
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


                    //Recuperer les boutton supprimer
                    const btnEditer = document.querySelector(`#editer-livre-${livre.id}`);
                    btnEditer.addEventListener("click", (event) => {
                        //Supprime le comportement par defaut (evite le rechargement de la page)
                        event.preventDefault();
                        editerProduit(livre)
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
            <div class="container flex justify-center w-50 mt-10" id="carte-produit-${livre.id}">
                 <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 col-span-1 flex flex-col bg-white border-2 p-4">
             <h2 class="font-medium leading-tight text-5xl mt-0 mb-2 text-red-800">${livre.nomLivre}</h2>
             
             <div class="grid place-items-center mt-10">
                    <img class="rounded-full mr-4" src="${livre.imageLivre}" alt="${livre.nomLivre}" title="${livre.nomLivre}"/>                                                               
             </div>
             <div class="font-medium text-2xl text-green-200 mt-6 p-4">Description : ${livre.descriptionLivre}</div>
             <div class="font-medium text-2xl text-red-500 mt-6 p-4">PRIX : ${livre.prixLivre} €</div>
             <button id="btnBack" class="bg-red-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-6">retour</button>
             </div>
             </div>
                   
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

    //Supprimer un et un seul produit
    function supprimerProduit(livre){
        //alert('test de suppr livre')
        //La carte entiere creer dans afficherLivre() recup avec son id
        const carteProduit = document.querySelector(`#carte-produit-${livre.id}`)
        //Fenètre de confirmation de supression
        if (window.confirm("Confirmer la supression ?")) {
            //Appel de URL du back tester avec POSTMAN qui splice un objet
            fetch(`http://localhost:3000/supprimer-livre/${livre.id}`,{
                //La methode de la requète http = delete
                method: "DELETE"
            })
                //On retourne un objet au format json (l'objet a supprimer)
                .then(response => console.log(response.json()))
                //On retire ne noeud carteLivre du DOM avec remove()
                .then(() => {
                    carteProduit.remove();
                })
                //Sinon on retourne des erreurs
                .catch(erreur => console.log(erreur))
        }

    }


    function ajouterLivre(){
        //alert("appel de la fonction ajouter")
        //recuperer les valeur de chaque input du formulaire de produits.html grace a id et .value
        const nomLivreInput = document.getElementById("nomLivre").value;
        const descriptionLivreInput = document.getElementById("descriptionLivre").value;
        const prixLivreInput = document.getElementById("prixLivre").value;
        const imageLivreInput = document.getElementById("imageLivre").value;
        //Debug dans le f12 console du navigateur
        //console.log(nomLivreInput)
        //console.log(descriptionLivreInput)
        //console.log(prixLivreInput)
        //console.log(imageLivreInput)

        //Cree nouvel objet livre : chaque cle = input.valeur du formulaire
        let nouveauLivre = {
            nomLivre: nomLivreInput,
            descriptionLivre: descriptionLivreInput,
            prixLivre: prixLivreInput,
            imageLivre: imageLivreInput
        }
        //Appel de url du back (server.js) testée avec POSTMAN
        fetch('http://localhost:3000/ajouter-livres',{
            //la methode POST
            method: 'POST',
            //les options de entete de la requète http
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            /*
         La méthode JSON.stringify() convertit une valeur JavaScript en chaîne JSON.
         Optionnellement, elle peut remplacer des valeurs ou spécifier les propriétés
          à inclure si un tableau de propriétés a été fourni.
         */
            body: JSON.stringify(nouveauLivre)
        })
            //retourne une reponse au format json
            .then(response => response.json())
            //Appel de la fonction afficherLivre pour les mettres a jour
            .then(afficherLivres)
            //Message dans le f12 du navigateur
            .then(() => console.log("La livre a bien a été ajouté !"))
            //On cache le formulaire d'ajout
            .then(() => {
                const displayAddForm = document.getElementById("ajouterFormulaireLivre");
                displayAddForm.style.display = 'none'
            })
            //On efresh la table
            .then(() => {
                window.location.reload()
                window.scrollTo(0, document.body.scrollHeight);
            })
            //Sinon on affiche une erreur
            .catch(erreur => console.log("Erreur " + erreur))
    }

    function editerProduit(livre){
        //alert('test de la fonction editer')
        //on recuperre le conteneur principale
        let conteneurPrincipale = document.getElementById("conteneur-principale");
        //On le cache avec du css
        conteneurPrincipale.style.display = "none";
    }


    //la fonction pour afficher les livres
    afficherLivres()

});



