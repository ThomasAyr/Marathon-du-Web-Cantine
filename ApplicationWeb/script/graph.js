fetch("../Donnees/ingredients.json")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    const filteredData = data.filter((item) => item["DPA (NOVA/Siga)"] >= 4);
    const categoryDpaMap = {};
    filteredData.forEach((item) => {
      const category = item["Catégorie"];
      if (!(category in categoryDpaMap)) {
        categoryDpaMap[category] = 0;
      }
      categoryDpaMap[category]++;
    });
    const categories = Object.keys(categoryDpaMap);
    const frequencies = categories.map((category) => categoryDpaMap[category]);
    const colors = categories.map(() => {
      return `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
        Math.random() * 255
      }, 0.6)`;
    });
    const ctx = document.getElementById("fromageChart").getContext("2d");
    const fromageChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: categories,
        datasets: [
          {
            label: "Fréquence de DPA >= 4",
            data: frequencies,
            backgroundColor: colors,
            borderColor: colors.map((color) => color.replace("0.6", "1")),
            borderWidth: 1,
          },
        ],
      },
      options: {
        indexAxis: "y",
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Fréquence",
            },
          },
          y: {
            title: {
              display: true,
              text: "Catégorie de Produit",
            },
          },
        },
      },
    });
  })
  .catch((error) =>
    console.error("Erreur de chargement du fichier JSON:", error)
  );
