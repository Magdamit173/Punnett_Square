function sanitizeAlleles(alleles) {
  const listofDuplicates = []
  const listofAlleles = []

  for (let alleleIndex = 0; alleleIndex < alleles.length; alleleIndex++) {
    const allele = alleles[alleleIndex]

    for (let _alleleIndex = 0; _alleleIndex < alleles.length; _alleleIndex++) {
      const _allele = alleles[_alleleIndex]

      if (
        alleleIndex === _alleleIndex ||
        listofDuplicates.includes(alleleIndex) ||
        listofDuplicates.includes(_alleleIndex)
      ) {
        continue;
      }

      if (allele.toLowerCase() === _allele.toLowerCase()) {
        listofDuplicates.push(_alleleIndex)

        listofAlleles.push([allele, _allele].sort())
      }
    }
  }

  return listofAlleles;
}

function geneticInfo(genetics) {
  const alleleStructure = []

  const alleles = sanitizeAlleles([...genetics])

  if (!genetics) return

  const amountOfTraits = alleles.length // 3
  const amountOfAlleles = amountOfTraits * 2 // 6
  const amountOfCombinations = 2 ** amountOfTraits // 16

  const invertedAlleles = alleles.map((allele) => allele.reverse())

  for (let geneticRange = 0; geneticRange < amountOfCombinations; geneticRange++) {
    const cacheStructure = []
    const binaryAllele = geneticRange.toString(2).padStart(amountOfTraits, '0')

    for (let index = 0; index < amountOfTraits; index++) {
      const [firstItem, secondItem] = [invertedAlleles[index], binaryAllele[index]]
      cacheStructure.push(firstItem[parseInt(secondItem, 10)])
    }

    alleleStructure.push(cacheStructure)
  }

  return alleleStructure.reverse()
}

function binaryDecoder(binaryAllele) {
  const structure = []

  for (const binary of binaryAllele) {
    if (binary === 0 || binary === '0') {
      structure.push([0, 1])
    } else if (binary === 1 || binary === '1') {
      structure.push([1, 0])
    }
  }

  return structure;
}

function combineGenes(g1, g2) {
  if (!(Array.isArray(g1) || Array.isArray(g2))) return

  const punnettCollection = []

  for (const genes of g1) {
    for (const _genes of g2) {
      punnettCollection.push(
        [...genes, ..._genes].reverse()
        // sanitizeAlleles([...genes, ..._genes]).flat()
        // [...genes, ..._genes].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())
        // [...sanitizeAlleles([...genes, ..._genes])[0], ...sanitizeAlleles([...genes, ..._genes])[1]]
      )
    }
  }

  return punnettCollection;
}

function insertGenes(text) {
  const square = document.createElement("div")
  square.setAttribute("class", "square")

  square.textContent = text
  
  punnett_square.appendChild(square)
}

const punnett_square = document.querySelector("[data-punnett_square]")
const genetic_inputs = Array.from(document.querySelectorAll('[data-genetic-input]'))

genetic_inputs.forEach(p => {
  p.addEventListener("keyup", () => {
    punnett_square.replaceChildren()
    
    if (!(genetic_inputs[0].value && genetic_inputs[1].value)) punnett_square.style.display = "none"
    else punnett_square.style.display = "grid"
    
    const column_amount = Math.pow(2, parseInt((genetic_inputs[0].value.length / 2)))
    punnett_square.style.gridTemplateColumns = `repeat(${column_amount}, 1fr)`
    punnett_square.style.gridTemplateRowss = `repeat(${Math.pow(2, parseInt((genetic_inputs[1].value.length / 2)))}, 1fr)`

    //I've switch the genetic info parameter position so the arrangement was vertical/column to horizon/row direction
    for (const genes of combineGenes(geneticInfo(genetic_inputs[1].value), geneticInfo(genetic_inputs[0].value))) {
      insertGenes(genes.join(""))
    }
  })
})

// Uncomment the following lines to test the translated code:
// console.log(geneticInfo("RrYyBb"));
// console.log(geneticInfo("RrYy"), "\n", geneticInfo("RrYy"));
// console.log(combineGenes(geneticInfo("RrYy"), geneticInfo("RrYy")));