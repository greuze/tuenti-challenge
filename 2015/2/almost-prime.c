/*
 * To compile in command line with gcc can be used:
 *
 * gcc -o almost-prime almost-prime.c -lm
 *
 * In Eclipse:
 *
 * Properties -> C/C++ Build -> Setting -> GCC C++ Linker -> Libraries -> In top part add "m"
 */
#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <errno.h>

typedef unsigned long ulong;

void readInputFile(const char *filename, int *n, ulong **cases) {
    FILE * fp;
    char * line = NULL;
    size_t len = 0;
    ssize_t read;

    fp = fopen(filename, "r");
    if (fp == NULL) {
        perror("Error opening input file.\n");
        exit(EXIT_FAILURE);
    }

    read = getline(&line, &len, fp);
    sscanf(line, "%d", n);
    int m = *n * 2; // Each case has 2 numbers
    *cases = malloc(sizeof(ulong) * m); // same as ulong cases[m];

    int i;
    for(i = 0; i < m;) {
        read = getline(&line, &len, fp);
        ulong l1, l2;
        sscanf(line, "%lu %lu", &l1, &l2);
        (*cases)[i++] = l1;
        (*cases)[i++] = l2;
    }

    // Free pointers to file and line
    fclose(fp);
	free(line);
}

ulong getFirstDivisor(ulong number) {
	ulong i;
	double sqrtNumber = sqrt(number);
	for (i = 2; i <= sqrtNumber; i++) {
		if (number % i == 0) {
			return i;
		}
	}
	return 0;
}

// return is boolean: false = 0, true = 1
int isAlmostPrime(ulong number) {
	ulong firstDivisor = getFirstDivisor(number);
	if (firstDivisor == 0) {
		// Number is prime
		return 0;
	}

	ulong secondDivisor = getFirstDivisor(number / firstDivisor);

	if (secondDivisor == 0) {
		// Is almost prime
		return 1;
	} else {
		// Has move than 2 factors
		return 0;
	}
}

ulong getAlmostPrimeNumbers(ulong first, ulong last) {
	ulong almostPrimeNumbers = 0;
	int i;
    for (i = first; i <= last; i++) {
        if (isAlmostPrime(i)) {
            almostPrimeNumbers++;
        }
    }
	return almostPrimeNumbers;
}

void printOutput(int n, ulong *cases) {
	int m = n * 2; // Each case has 2 numbers
	int i;
	for(i = 0; i < m;) {
		ulong first = cases[i++];
		ulong last = cases[i++];
		ulong result = getAlmostPrimeNumbers(first, last);
		printf("%lu\n", result);
	}
}

int main(int argc, char **argv) {
    char* fileName;
    if (argc == 1) { // No parameters
        fileName = "testInput";
    } else {
        fileName = argv[1];
    }

    int numberOfCases;
    ulong *cases;
    readInputFile(fileName, &numberOfCases, &cases);

    printOutput(numberOfCases, cases);

    free(cases);

    return EXIT_SUCCESS;
}
