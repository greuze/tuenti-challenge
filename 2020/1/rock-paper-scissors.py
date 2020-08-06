import sys

def processCase(line):
    # Default separator when splitting is whitespace
    tokens = line.split()

    if tokens[0] == tokens[1]:
        solution = "-"
    elif tokens[0] == 'R':
        solution = tokens[0] if tokens[1] == 'S' else tokens[1]
    elif tokens[0] == 'P':
        solution = tokens[0] if tokens[1] == 'R' else tokens[1]
    else: # tokens[0] == 'S'
        solution = tokens[0] if tokens[1] == 'P' else tokens[1]

    return solution

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
