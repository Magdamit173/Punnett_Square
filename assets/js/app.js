function sanitizeAlleles(alleles) {
  const listofDuplicates = [];
  const listofAlleles = [];

  for (let alleleIndex = 0; alleleIndex < alleles.length; alleleIndex++) {
    const allele = alleles[alleleIndex];

    for (let _alleleIndex = 0; _alleleIndex < alleles.length; _alleleIndex++) {
      const _allele = alleles[_alleleIndex];

      if (
        alleleIndex === _alleleIndex ||
        listofDuplicates.includes(alleleIndex) ||
        listofDuplicates.includes(_alleleIndex)
      ) {
        continue;
      }

      if (allele.toLowerCase() === _allele.toLowerCase()) {
        listofDuplicates.push(_alleleIndex);

        listofAlleles.push([allele, _allele].sort());
      }
    }
  }

  return listofAlleles;
}

function geneticInfo(genetics) {
  const alleleStructure = [];

  const alleles = sanitizeAlleles([...genetics]);

  if (!genetics) {
    return;
  }

  const amountOfTraits = alleles.length; // 3
  const amountOfAlleles = amountOfTraits * 2; // 6
  const amountOfCombinations = 2 ** amountOfTraits; // 16

  const invertedAlleles = alleles.map((allele) => allele.reverse());

  for (let geneticRange = 0; geneticRange < amountOfCombinations; geneticRange++) {
    const cacheStructure = [];
    const binaryAllele = geneticRange.toString(2).padStart(amountOfTraits, '0');

    for (let index = 0; index < amountOfTraits; index++) {
      const [firstItem, secondItem] = [invertedAlleles[index], binaryAllele[index]];
      cacheStructure.push(firstItem[parseInt(secondItem, 10)]);
    }

    alleleStructure.push(cacheStructure);
  }

  return alleleStructure.reverse();
}

function binaryDecoder(binaryAllele) {
  const structure = [];

  for (const binary of binaryAllele) {
    if (binary === 0 || binary === '0') {
      structure.push([0, 1]);
    } else if (binary === 1 || binary === '1') {
      structure.push([1, 0]);
    }
  }

  return structure;
}

function combineGenes(g1, g2) {
  const punnettCollection = [];

  for (const genes of g1) {
    for (const _genes of g2) {
      punnettCollection.push(
        [...genes, ..._genes].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
      );
    }
  }

  return punnettCollection;
}

// Uncomment the following lines to test the translated code:
// console.log(geneticInfo("RrYyBb"));
// console.log(geneticInfo("RrYy"), "\n", geneticInfo("RrYy"));
// console.log(combineGenes(geneticInfo("RrYy"), geneticInfo("RrYy")));


const punnett_square = document.querySelector("[data-punnett_square]")


const genetic_inputs = Array.from(document.querySelectorAll('[data-genetic-input]'))