import sys

def processCase(matchList):
    possibleBest = set()
    losers = set()
    for match in matchList:
        # Get winner and loser of the match
        if match[2] == 1:
            matchWinner = match[0]
            matchLoser = match[1]
        else:
            matchWinner = match[1]
            matchLoser = match[0]
        # If winner was not a possible best neither in losers, adds it
        if not matchWinner in possibleBest and not matchWinner in losers:
            possibleBest.add(matchWinner)
        # If loser was a possible best, remove it
        if matchLoser in possibleBest:
            possibleBest.remove(matchLoser)
        # Adds loser to list if not yet
        if not matchLoser in losers:
            losers.add(matchLoser)
    # Safety check if there are more than one solution (bug)
    if len(possibleBest) != 1:
        sys.exit("More than one solution")
    return possibleBest.pop()

# Get file name from command line first argument (if passed) or default name
fileName = len(sys.argv) == 2 and sys.argv[1] or 'testInput'

# Open file as read only
file1 = open(fileName, 'r')

# Get first line to know the number of cases
cases = int(file1.readline())

currentCase = 0
while currentCase < cases: 
    currentCase += 1

    matches = int(file1.readline())
    matchList = [];
    currentMatch = 0
    while currentMatch < matches:
        currentMatch += 1;
        matchElements = file1.readline().strip().split()
        matchList.append([matchElements[0], matchElements[1], int(matchElements[2])])

    print("Case #{}: {}".format(currentCase, processCase(matchList)))

file1.close()
