fetch("../Donnees/donnees_menus.json")
  .then((response) => response.json()) // Convertir la réponse en JSON
  .then((data) => {
    const selectSemaine = document.getElementById("select-semaine");

    // Parcourir les données JSON pour créer les options du sélecteur
    data.forEach((semaine) => {
      const option = document.createElement("option");
      option.text = `${semaine.sem}`;
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
      const menuContainer = document.getElementById("rr");
      menuContainer.innerHTML = ""; // Effacer le contenu précédent

      semaine.jours.forEach((jour) => {
        if (jour.jour != "mercredi") {
          const divConteneurJour = document.createElement("div");
          divConteneurJour.classList.add("ll"); // Sur les petits écrans, l'élément prendra toute la largeur
          // divConteneurJour.classList.add("col-md-5"); // À partir des écrans md (medium) et plus grands, l'élément prendra 4 colonnes

          // Créer une image pour le jour et l'ajouter au conteneur jour
          const imgJour = document.createElement("img");
          imgJour.src = `./Images/${jour.jour.toLowerCase()}.png`;
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

            // Diagramme en barres DPA

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

            //Diagramme camembert

            // Initialiser les compteurs de poids pour chaque DPA
            const poidsParDPA = {
              1: 0,
              2: 0,
              3: 0,
              4: 0,
            };

            // Calculer la somme des poids pour chaque DPA
            jour.recettes.forEach((recette) => {
              recette.details.forEach((detail) => {
                poidsParDPA[detail.DPA] += detail.Poids;
              });
            });

            // Créer un tableau de données pour le graphique en camembert
            const dataCamembert = Object.values(poidsParDPA);
            const totalPoids = dataCamembert.reduce(
              (acc, poids) => acc + poids,
              0
            );
            const pourcentages = dataCamembert.map((poids) =>
              Math.round((poids / totalPoids) * 100)
            );

            // Créer un canvas pour le graphique en camembert
            const canvasCamembert = document.createElement("canvas");
            canvasCamembert.classList.add("graphique");
            divJour.appendChild(canvasCamembert);

            // Créer le graphique en camembert avec Chart.js
            new Chart(canvasCamembert, {
              type: "pie",
              data: {
                labels: ["DPA = 1", "DPA = 2", "DPA = 3", "DPA = 4"],
                datasets: [
                  {
                    data: dataCamembert,
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
                  text: `Graphique des poids pour le ${jour.jour}`,
                },
                tooltips: {
                  callbacks: {
                    label: function (tooltipItem, data) {
                      const dataset = data.datasets[tooltipItem.datasetIndex];
                      const currentValue = dataset.data[tooltipItem.index];
                      const pourcentage = pourcentages[tooltipItem.index];
                      return `${data.labels[tooltipItem.index]}: ${
                        currentValue + "g"
                      }  (${pourcentage}%)`;
                    },
                  },
                },
              },
            });

            // Afficher les recettes
            jour.recettes.forEach((recette) => {
              const divRecette = document.createElement("div");
              divRecette.classList.add("recette");
              divRecette.innerHTML = `<h3>${recette.RecetteGlobale}</h3>`;

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
        }
      });
    }

    // Afficher le menu de la première semaine par défaut
    if (data.length > 0) {
      afficherMenu(data[2]);
    }
  })
  .catch((error) =>
    console.error("Erreur de chargement du fichier JSON:", error)
  );
