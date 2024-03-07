fetch("../Donnees/ingredients.json")
  .then((response) => response.json())
  .then((data) => {
    const filteredData = data.filter((item) => item["DPA (NOVA/Siga)"] >= 4);
    const categoryDpaMap = {};

    // Compter la fréquence par catégorie
    filteredData.forEach((item) => {
      const category = item["Catégorie"];
      if (!(category in categoryDpaMap)) {
        categoryDpaMap[category] = 0;
      }
      categoryDpaMap[category]++;
    });

    // Filtrer les catégories avec une fréquence inférieure à 5 et trier par fréquence décroissante
    const sortedCategories = Object.entries(categoryDpaMap)
      .filter(([category, frequency]) => frequency >= 5)
      .sort((a, b) => b[1] - a[1])
      .map(([category, frequency]) => ({ category, frequency }));

    const categories = sortedCategories.map((entry) => entry.category);
    const frequencies = sortedCategories.map((entry) => entry.frequency);

    // Générer des couleurs aléatoires pour chaque catégorie
    const colors = categories.map(
      () =>
        `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
          Math.random() * 255
        }, 0.6)`
    );

    const ctx = document.getElementById("fromageChart").getContext("2d");
    const fromageChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: categories,
        datasets: [
          {
            label: "DPA >= 4 (Nb aliments ultra-transformés)",
            data: frequencies,
            backgroundColor: colors,
            borderColor: colors.map((color) => color.replace("0.6", "1")),
            borderWidth: 1,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false, // Cela désactive la légende
            labels: {
              color: "black", // Change la couleur de texte de la légende en noir
            },
          },
        },
        responsive: true,
        indexAxis: "y",
        maintainAspectRatio: false,
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Nombre d'aliments ultra-transformés (DPA=4)",
              color: "black", // Change la couleur de titre de l'axe X en noir
            },
          },
          y: {
            title: {
              display: true,
              text: "Catégorie de Produit",
              color: "black", // Change la couleur de titre de l'axe X en noir
            },
            ticks: {
              color: "black", // Change la couleur des étiquettes (ticks) de l'axe Y en noir
            },
          },
        },
      },
    });
  })
  .catch((error) =>
    console.error("Erreur de chargement du fichier JSON:", error)
  );
