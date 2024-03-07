fetch("../Donnees/donnees_menus.json")
  .then((response) => response.json()) // Convertir la réponse en JSON
  .then((data) => {
    const selectSemaine = document.getElementById("select-semaine");

    // Parcourir les données JSON pour créer les options du sélecteur
    data.forEach((semaine) => {
      const option = document.createElement("option");
      option.text = `${semaine.debut_semaine} - ${semaine.fin_semaine}`;
      option.value = JSON.stringify(semaine);
      selectSemaine.appendChild(option);
    });

    // Afficher le menu de la semaine sélectionnée lorsque le sélecteur change
    selectSemaine.addEventListener("change", (event) => {
      const semaineSelectionnee = JSON.parse(event.target.value);
      afficherMenu(semaineSelectionnee);
    });

    // Fonction pour afficher le menu de la semaine sélectionnée
    function afficherMenu(semaine) {
      const menuContainer = document.getElementById("menu-container");
      menuContainer.innerHTML = ""; // Effacer le contenu précédent

      semaine.jours.forEach((jour) => {
        const divConteneurJour = document.createElement("div");
        divConteneurJour.classList.add("conteneur-jour");

        // Créer une image pour le jour et l'ajouter au conteneur jour
        const imgJour = document.createElement("img");
        imgJour.src = `./Images/${jour.jour.toLowerCase()}.jpg`;
        imgJour.classList.add("jour-image");
        divConteneurJour.appendChild(imgJour);

        // Créer le cadre de menu pour le jour
        const divJour = document.createElement("div");
        divJour.classList.add("menu");
        divJour.classList.add(jour.classe_css);

        if (jour.recettes.length === 0) {
          const divAucunMenu = document.createElement("div");
          divAucunMenu.textContent = "Pas de cantine";
          divJour.appendChild(divAucunMenu);
        } else {
          // Créer un div pour les recettes
          const divRecettes = document.createElement("div");
          divRecettes.classList.add("recettes");

          // Initialiser les compteurs de DPA
          const dpaCounts = {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
          };

          // Compter le nombre de recettes pour chaque DPA
          jour.recettes.forEach((recette) => {
            recette.details.forEach((detail) => {
              dpaCounts[detail.DPA]++;
            });
          });

          // Créer un canvas pour le graphique
          const canvas = document.createElement("canvas");
          canvas.classList.add("graphique");
          divJour.appendChild(divRecettes);
          divJour.appendChild(canvas);

          // Créer le graphique avec Chart.js
          new Chart(canvas, {
            type: "bar",
            data: {
              labels: ["DPA = 1", "DPA = 2", "DPA = 3", "DPA = 4"],
              datasets: [
                {
                  data: [
                    dpaCounts[1],
                    dpaCounts[2],
                    dpaCounts[3],
                    dpaCounts[4],
                  ],
                  backgroundColor: [
                    "rgba(255, 200, 200, 0.6)", // DPA = 1 (Blanc)
                    "rgba(255, 150, 150, 0.6)", // DPA = 2 (Rouge moins moins vif)
                    "rgba(255, 100, 100, 0.6)", // DPA = 3 (Rouge moins vif)
                    "rgba(255, 0, 0, 0.6)", // DPA = 4 (Rouge vif)
                  ],
                  borderColor: "rgba(255, 255, 255, 1)", // Couleur de bordure
                  borderWidth: 1,
                },
              ],
            },
            options: {
              plugins: {
                legend: {
                  display: false, // Désactiver l'affichage de la légende
                },
              },
              title: {
                display: true,
                text: `Graphique des recettes pour le ${jour.jour}`,
              },
              elements: {
                arc: {
                  borderWidth: 0,
                },
              },
            },
          });

          // Afficher les recettes
          jour.recettes.forEach((recette) => {
            const divRecette = document.createElement("div");
            divRecette.classList.add("recette");
            divRecette.innerHTML = `> ${recette.RecetteGlobale} :`;

            recette.details.forEach((detail) => {
              const divDetail = document.createElement("div");
              divDetail.textContent = `${detail.Recette}: ${detail.Poids}g`;
              divRecette.appendChild(divDetail);
            });

            divRecettes.appendChild(divRecette);
          });
        }

        divConteneurJour.appendChild(divJour);
        menuContainer.appendChild(divConteneurJour);
      });
    }

    // Afficher le menu de la première semaine par défaut
    if (data.length > 0) {
      afficherMenu(data[0]);
    }
  })
  .catch((error) =>
    console.error("Erreur de chargement du fichier JSON:", error)
  );
