import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

public class VoynichManuscript {

    private String[] corpus;

    public VoynichManuscript() {
        List<String> corpusLine = readLines("corpus.txt");
        this.corpus = corpusLine.iterator().next().split(" ");
    }

    private List<String> readLines(String inputFile) {
        try {
            return Files.readAllLines(Paths.get(inputFile), Charset.forName("UTF-8"));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private String getMoreFrecuent(Map<String, Integer> frequency) {
        Entry<String, Integer> f1 = null, f2 = null, f3 = null;
        for (Iterator<Entry<String, Integer>> it = frequency.entrySet().iterator(); it.hasNext(); ) {
            Entry<String, Integer> currentEntry = it.next();
            if (f1 == null || f1.getValue() < currentEntry.getValue()) {
                f3 = f2;
                f2 = f1;
                f1 = currentEntry;
            } else if (f2 == null || f2.getValue() < currentEntry.getValue()) {
                f3 = f2;
                f2 = currentEntry;
            } else if (f3 == null || f3.getValue() < currentEntry.getValue()) {
                f3 = currentEntry;
            }
        }
        return f1.getKey() + " " + f1.getValue() + "," + f2.getKey() + " " + f2.getValue() + "," + f3.getKey() + " " + f3.getValue();
    }

    private void printVoynich(long caseNumber, int first, int last) {
        Map<String, Integer> frequency = new HashMap<>();
        for (int j = first - 1; j < last; j++) {
            String current = corpus[j];
            if (frequency.containsKey(current)) {
                Integer newF = frequency.get(current) + 1;
                frequency.put(current, newF);
            } else {
                frequency.put(current, 1);
            }
        }
        System.out.println("Case #" + caseNumber + ": " + getMoreFrecuent(frequency));
    }

    private void printSolution(String inputFile) {
        List<String> lines = readLines(inputFile);
        Iterator<String> it = lines.iterator();
        int numberOfCases = Integer.parseInt(it.next());
        for (int i = 1; i <= numberOfCases; i++) {
            String line = it.next();
            String[] splittedLine = line.split(" ");
            printVoynich(i, Integer.parseInt(splittedLine[0]), Integer.parseInt(splittedLine[1]));
        }
    }

    public static void main(String[] args) {
        VoynichManuscript buffer = new VoynichManuscript();
        String inputFile = args.length > 0 ? args[0] : "testInput";
        buffer.printSolution(inputFile);
    }
}
