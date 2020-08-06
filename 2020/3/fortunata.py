import sys
import re
import bisect

bookDict = dict()

def processBook():
    bookName = 'pg17013.txt'
    bookFile = open(bookName, 'r')

    lines = 0
    while True: 
        lines += 1

        bookLine = bookFile.readline()

        if not bookLine:
            break
        
        bookLine = re.sub(r"[^a-zñáéíóúü]", " ", bookLine.lower())
        words = bookLine.split()
        for word in words:
            # Only process words with 3 or more characters
            if len(word) > 2:
                if word in bookDict:
                    bookDict[word] += 1
                else:
                    bookDict[word] = 1

    bookFile.close()

    # As sort must mix reverse and not reverse, two sorts are required
    #bookSorted = {k: v for k, v in sorted(bookDict.items(), key=lambda item: item[0])}
    #bookSorted = {k: v for k, v in sorted(bookSorted.items(), key=lambda item: item[1], reverse=True)}

    # Sort in one line, as the numeric value can be negative to reverse order
    bookSorted = sorted(bookDict.items(), key=lambda item: (-item[1], item[0]))

    return bookSorted

def processCase(line):
    if line.isnumeric():
        # Get the required element from the list of tuples
        e = bookSorted[int(line) - 1]
        solution = "{} {}".format(e[0], e[1])
    else:
        # linear search, should be binary but i don't know how to do easily (bisect ?)
        position = 0
        for t in bookSorted:
            position += 1
            if t[0] == line:
                break
        solution = "{} #{}".format(bookDict[line], position)
    return solution

# Process the book and get a dictionary and a sorted dictionary for processing each case
bookSorted = processBook()

# Get file name from command line first argument (if passed) or default name
fileName = len(sys.argv) == 2 and sys.argv[1] or 'testInput'

# Open file as read only
file1 = open(fileName, 'r')

# Get first line to know the number of cases
cases = int(file1.readline())

currentCase = 0
while currentCase < cases: 
    currentCase += 1

    # Get next line from file
    line = file1.readline()

    # Safety check if file has finished, but there should be more cases (it should never happen)
    if not line:
        break

    print("Case #{}: {}".format(currentCase, processCase(line.strip())))

file1.close()
