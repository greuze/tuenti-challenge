/*
 * To compile in command line with gcc can be used:
 *
 * gcc -o uri-buffer uri-buffer.c -lm
 *
 * In Eclipse:
 *
 * Properties -> C/C++ Build -> Setting -> GCC C++ Linker -> Libraries -> In top part add "m"
 */
#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <errno.h>

void readInputFile(const char *filename, int *n, unsigned long **cases) {
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
    *cases = malloc(sizeof(unsigned long) * *n); // same as unsigned long cases[*n];

    int i;
    for(i = 0; i < *n; i++) {
        read = getline(&line, &len, fp);
        unsigned long l;
        sscanf(line, "%lu", &l);
        *(*cases + i) = l;
    }

    // Free pointers to file and line
    fclose(fp);
	free(line);
}

void printOutput(int n, unsigned long *cases) {
	int i;
	for(i = 0; i < n; i++) {
		unsigned long s = (unsigned long) ceil(0.5 * *(cases + i)); // same as cases[i]/2
		printf("%lu\n", s);
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
    unsigned long *cases;
    readInputFile(fileName, &numberOfCases, &cases);

    printOutput(numberOfCases, cases);

    free(cases);

    return EXIT_SUCCESS;
}
