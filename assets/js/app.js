function sanitizeAlleles(alleles, allelesPerTrait = 2) {
  const result = []
  for (let i = 0; i < alleles.length; i += allelesPerTrait) {
    result.push(alleles.slice(i, i + allelesPerTrait).sort())
  }
  return result
}

function cartesianProduct(arrays) {
  return arrays.reduce((acc, curr) =>
    acc.flatMap(a => curr.map(b => [...a, b])), [[]]
  )
}

function geneticInfo(genetics, allelesPerTrait = 2) {
  if (!genetics || genetics.length % allelesPerTrait !== 0) return []

  const alleles = sanitizeAlleles([...genetics], allelesPerTrait)
  return cartesianProduct(alleles)
}

function combineGenes(g1, g2) {
  if (!Array.isArray(g1) || !Array.isArray(g2)) return []

  const punnettCollection = []

  for (const genes1 of g1) {
    for (const genes2 of g2) {
      const combined = []
      for (let i = 0; i < genes1.length; i++) {
        combined.push([genes1[i], genes2[i]].sort().join(''))
      }
      punnettCollection.push(combined)
    }
  }

  return punnettCollection
}

function insertGenes(text) {
  const square = document.createElement("div")
  square.setAttribute("class", "square")
  square.textContent = text
  punnett_square.appendChild(square)
}

const punnett_square = document.querySelector("[data-punnett_square]")
const frequency_table = document.querySelector("[data-frequency_table]")
const genetic_inputs = Array.from(document.querySelectorAll('[data-genetic-input]'))

genetic_inputs.forEach(p => {
  p.addEventListener("keyup", () => {
    punnett_square.replaceChildren()
    frequency_table.innerHTML = ""

    const g1 = genetic_inputs[0].value.trim()
    const g2 = genetic_inputs[1].value.trim()

    if (!(g1 && g2)) {
      punnett_square.style.display = "none"
      return
    }

    const allelesPerTrait = 2 // Change to 3 for ABO, etc.

    if (g1.length % allelesPerTrait !== 0 || g2.length % allelesPerTrait !== 0) {
      punnett_square.style.display = "none"
      alert("Allele count must be divisible by alleles per trait.")
      return
    }

    const traits1 = g1.length / allelesPerTrait
    const traits2 = g2.length / allelesPerTrait

    if (traits1 !== traits2) {
      punnett_square.style.display = "none"
      alert("Both parents must have the same number of traits.")
      return
    }

    const gametes1 = geneticInfo(g1, allelesPerTrait)
    const gametes2 = geneticInfo(g2, allelesPerTrait)

    const colCount = gametes1.length
    const rowCount = gametes2.length

    punnett_square.style.display = "grid"
    punnett_square.style.gridTemplateColumns = `repeat(${colCount}, 1fr)`
    punnett_square.style.gridTemplateRows = `repeat(${rowCount}, 1fr)`

    const combinations = combineGenes(gametes2, gametes1)

    for (const genes of combinations) {
      insertGenes(genes.join(""))
    }

    updateFrequencyTable(combinations)
  })
})

function updateFrequencyTable(combinations) {
  const frequencyMap = new Map()

  for (const combo of combinations) {
    const key = combo.join("")
    frequencyMap.set(key, (frequencyMap.get(key) || 0) + 1)
  }

  const table = document.createElement("table")
  table.classList.add("freq-table")

  const header = document.createElement("tr")
  header.innerHTML = "<th>Genotype</th><th>Frequency</th>"
  table.appendChild(header)

  for (const [genotype, count] of frequencyMap.entries()) {
    const row = document.createElement("tr")
    row.innerHTML = `<td>${genotype}</td><td>${count}</td>`
    table.appendChild(row)
  }

  frequency_table.appendChild(table)
}
