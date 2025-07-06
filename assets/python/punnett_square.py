import numpy as np
from itertools import product
from math import gcd

def sanitize_alleles(alleles, alleles_per_trait=2):
    """Group alleles into traits of N alleles each (default 2)."""
    return [sorted(alleles[i:i + alleles_per_trait]) for i in range(0, len(alleles), alleles_per_trait)]

def cartesian_product(arrays):
    """Generate all combinations (like binary expansion for 2 alleles)."""
    return list(product(*arrays))

def genetic_info(genetics, alleles_per_trait=2):
    """Generate all possible gametes from a parent's genotype."""
    if not genetics:
        return []

    alleles = sanitize_alleles(list(genetics), alleles_per_trait)
    return cartesian_product(alleles)

def combine_genes(g1, g2):
    """Combine gametes from both parents into offspring genotypes."""
    punnett_collection = []

    for genes1 in g1:
        for genes2 in g2:
            combined = [
                ''.join(sorted([genes1[i], genes2[i]], key=lambda s: (s.upper(), s)))
                for i in range(len(genes1))
            ]
            punnett_collection.append(combined)

    return punnett_collection

def print_punnett_square(parent1, parent2, alleles_per_trait=2):
    """Print a formatted Punnett square in the console."""
    g1 = genetic_info(parent1, alleles_per_trait)
    g2 = genetic_info(parent2, alleles_per_trait)

    if len(g1[0]) != len(g2[0]):
        raise ValueError("Trait count mismatch between parents.")

    print(f"\nPunnett Square ({len(g2)} rows × {len(g1)} cols):\n")
    for row in combine_genes(g2, g1):
        print(' | '.join(row))

# 🧪 Example usage:
print_punnett_square("RrYyWw", "RrYyWw", alleles_per_trait=2)
# print_punnett_square("AABBOO", "AABBOO", alleles_per_trait=3)
