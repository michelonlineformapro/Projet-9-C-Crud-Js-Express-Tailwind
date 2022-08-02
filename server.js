//Appel du framework express
const express = require('express');
//Instance d'express = new Express()
const app = express();
//Le port d'ecoute
const port = 3000;

//appel du fichier json
const livres = require('./livres.json');

//Appel du middleware cors
//Configure CORS (accepte les requète multidomaine interdit par defaut)
//Cross Origin Resources Sharing
//npm install cors
const cors = require('cors')
const {request, response} = require("express");

//Appel de fileSystem de nodejs = gerer l'interaction avec des fichiers
const fs = require('fs');

//Autoriser CORS
//Configure CORS (accepte les requète multidomaine interdit par defaut)
//Cross Origin Resources Sharing
app.use(cors())

//Creer une 1er route
//Route de base GET localhost:3000/livres
app.get('/livres', function (request, response){
    //Appel du fichier json
    response.sendFile(__dirname + '/livres.json')
    //Des fichier css statique a la racine du projet
    app.use(express.static(__dirname + '/'));
});

//Afficher un seul produit json
app.get('/livres/:id', (request, response) => {
    //on recup id de l'url grace a expressjs et request.params
    const idBind = Number(request.params.id);
    console.log(idBind);
    //on bind id de url avec id du json
    const detailsLivre = livres.find(detailsLivre => detailsLivre.id === idBind);
    //Si index n'existe pas
    if(!detailsLivre){
        //on retourne un erreur
        return response.status(404).send('Aucun produit trouvé !');
    }
    //Sinon on retourne un seul objet grace a son id
    response.json(detailsLivre)
})

//Supprimer un objet dans le fichier json
//Express + methode DELETE + URL + Request + Response
//Supprimer DELETE un produit localhost:3000/:id
app.delete('/supprimer-livre/:id', (request, response) => {
    //On recupère l'id grace a request.params depuis le fichier json
    const idBind = Number(request.params.id);
    //On bind id de url a l'id des objets json
    const index = livres.findIndex(livres => livres.id = idBind);
    //Comme les index commence a 0 on soustrait id de l'objet json a 1
    if(index === -1){
        return response.status(404).send('Le livre est inconnu !' + index)
    }
    //La méthode splice() modifie le contenu d'un tableau en retirant des éléments et/ou
    // en ajoutant de nouveaux éléments à même le tableau.On peut ainsi vider ou remplacer une partie d'un tableau.
    //param 1 = index du tableau et 2nd le nombre element du tableau asupprimer
    livres.splice(index, 1);
    //La reponse + status + format json + message ca marche
    response.status(200).json('Le livre a bien ete supprimer');
    //On appel de la  fonction qui sauvegarde l'etat des objets dans le fichier  livres.json
    saveLivresChange(livres);
    console.log(livres)
})

//Sauvegarde des changement d'etat du fichier livres.json
const saveLivresChange = (livres) => {
    //La méthode JSON.stringify() convertit une valeur JavaScript en chaîne JSON. Optionnellement,
    // elle peut remplacer des valeurs ou spécifier les propriétés à inclure si un tableau de propriétés a été fourni.
    const livreObjectToString = JSON.stringify(livres);
    //file system appel la fonction ecriture write avec 2 paramètres (la source + le nouvel objet)
    fs.writeFileSync('./livres.json', livreObjectToString);
}

//Port d'ecoute du serveur = http://localhost:3000
app.listen(port, () => {
    console.log(`Le serveur est demarrer su l'adresse http://localhost:${port}/livres`)
});