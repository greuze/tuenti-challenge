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
#include <stdint.h>
#include <math.h>
#include <errno.h>

typedef int32_t n_type;

n_type *firstDivisors;

void readInputFile(const char *filename, int *n, n_type **cases) {
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
    *cases = malloc(sizeof(n_type) * m); // same as n_type cases[m];

    int i;
    for(i = 0; i < m;) {
        read = getline(&line, &len, fp);
        n_type l1, l2;
        sscanf(line, "%u %u", &l1, &l2);
        (*cases)[i++] = l1;
        (*cases)[i++] = l2;
    }

    // Free pointers to file and line
    fclose(fp);
	free(line);
}

n_type calculateFirstDivisor(n_type number) {
	n_type i;
	double limit = sqrt(number);
	for (i = 2; i <= limit; i++) {
		if (number % i == 0) {
			return i;
		}
	}
	return 0;
}

n_type getFirstDivisor(n_type number) {
	n_type firstDivisor = firstDivisors[number - 1];
	if (firstDivisor == -1) {
		firstDivisor = calculateFirstDivisor(number);
		firstDivisors[number - 1] = firstDivisor;
		return firstDivisor;
	} else {
		return firstDivisor;
	}
}

// return is boolean: false = 0, true = 1
int isAlmostPrime(n_type number) {
	n_type firstDivisor = getFirstDivisor(number);
	if (firstDivisor == 0) {
		// Number is prime
		return 0;
	}

	n_type secondDivisor = getFirstDivisor(number / firstDivisor);

	if (secondDivisor == 0) {
		// Is almost prime
		return 1;
	} else {
		// Has move than 2 factors
		return 0;
	}
}

n_type getAlmostPrimeNumbers(n_type first, n_type last) {
	n_type almostPrimeNumbers = 0;
	int i;
    for (i = first; i <= last; i++) {
        if (isAlmostPrime(i)) {
            almostPrimeNumbers++;
        }
    }
	return almostPrimeNumbers;
}

void printOutput(int n, n_type *cases) {
	int m = n * 2; // Each case has 2 numbers
	int i;
	for(i = 0; i < m;) {
		n_type first = cases[i++];
		n_type last = cases[i++];
		n_type result = getAlmostPrimeNumbers(first, last);
		printf("%u\n", result);
	}
}

n_type getMaxNumber(int n, n_type *cases) {
	n_type max = 0;
	int m = n * 2; // Each case has 2 numbers
	int i;
	for(i = 1; i < m; i = i + 2) {
		n_type last = cases[i];
		if (last > max) {
			max = last;
		}
	}
	return max;
}

int main(int argc, char **argv) {
    char* fileName;
    if (argc == 1) { // No parameters
        fileName = "testInput";
    } else {
        fileName = argv[1];
    }

    // Numbers must be smaller than 10^8 (requires 4 bytes)
    if (sizeof(n_type) < 4) {
        printf("Numbers will not fit in %lu bytes integer (change architecture or type)\n", sizeof(n_type));
        return EXIT_FAILURE;
    }

    int numberOfCases;
    n_type *cases;
    readInputFile(fileName, &numberOfCases, &cases);

    // To save computing, store first divisors of numbers. -1 means not yet processed. 0 Means prime number
    n_type max = getMaxNumber(numberOfCases, cases);
    firstDivisors = malloc(sizeof(n_type) * max);
    int i;
    for (i = 0; i < max; i++) {
        firstDivisors[i] = -1;
    }

    printOutput(numberOfCases, cases);

    free(firstDivisors);
    free(cases);

    return EXIT_SUCCESS;
}
