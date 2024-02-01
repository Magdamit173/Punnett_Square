import numpy as np


def sanitize_alleles(alleles):
    list_of_duplicates = []
    list_of_alleles = []

    number_of_call = 0
    overall_call = 0

    for allele_index, allele in enumerate(list(alleles)):
        for _allele_index, _allele in enumerate(list(alleles)):
            if (
                (allele_index == _allele_index)
                or (allele_index in list_of_duplicates)
                or (_allele_index in list_of_duplicates)
            ):
                continue

            if allele.lower() == _allele.lower():
                list_of_duplicates.append(_allele_index)

                list_of_alleles.append(sorted([allele, _allele]))

    return list_of_alleles


def genetic_info(genetics):
    allele_structure = []

    alleles = sanitize_alleles(genetics)

    if not genetics:
        return

    amount_of_traits = len(alleles) # 3
    amount_of_alleles = amount_of_traits * 2 #6
    amount_of_combinations = pow(2, amount_of_traits) #16

    inverted_alleles = [allele[::-1] for allele in alleles]

    for genetic_range in range(amount_of_combinations):
        cache_structure = []
        binary_allele = bin(genetic_range)[2:].zfill(amount_of_traits)

        for index, (first_item, second_item) in enumerate(zip(inverted_alleles, list(binary_allele))):
            cache_structure.append(first_item[int(second_item)])
        
        allele_structure.append(cache_structure)


    
    return allele_structure[::-1]

def binary_decoder(binary_allele):
    structure = []

    for binary in list(binary_allele):

        if (binary == 0) or (binary == str(0)):
            structure.append([0, 1])
        elif (binary == 1) or (binary == str(1)):
            structure.append([1,0])
    
    return structure

# print(f'{str(genetic_info("RrYyBb"))}')
print(f'{str(genetic_info("RrYy"))}')
